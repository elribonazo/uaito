import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { getSessionUser } from '@/utils/getSessionUser';
import db from '@/db';
import { Story, type Chapter } from '@/ai/agents/Story';
import formidable from 'formidable';
import fs from 'fs';
import jsPDF from 'jspdf';
import sharp from 'sharp';
import { sendEmailWithAttachment, sendErrorEmail } from '@/utils/email';
import type { IUser } from '@/db/models/User';
import path from 'path';

export const config = {
	api: {
		bodyParser: false,
		responseLimit: false,
	},
	maxDuration: 300, // 5 minutes max
};

/**
 * Retry wrapper for async operations with exponential backoff
 */
async function retryAsync<T>(
	operation: () => Promise<T>,
	operationName: string,
	maxRetries: number = 3,
	baseDelay: number = 2000
): Promise<T> {
	let lastError: Error | null = null;
	
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			console.log(`[${operationName}] Attempt ${attempt}/${maxRetries}`);
			const result = await operation();
			console.log(`[${operationName}] Success on attempt ${attempt}`);
			return result;
		} catch (error) {
			lastError = error as Error;
			console.error(`[${operationName}] Failed on attempt ${attempt}:`, lastError.message);
			
			if (attempt < maxRetries) {
				const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
				console.log(`[${operationName}] Retrying in ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}
	
	throw new Error(`${operationName} failed after ${maxRetries} attempts: ${lastError?.message}`);
}

const parseFormData = (
	req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
	const form = formidable({});
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				reject(err);
			} else {
				resolve({ fields: fields as formidable.Fields, files: files as formidable.Files });
			}
		});
	});
};

/**
 * Compresses and resizes a base64 image using Sharp
 * @param base64Image - Base64 data URL (e.g., "data:image/png;base64,...")
 * @param targetWidth - Target width in pixels (default: 768)
 * @param quality - JPEG/WebP quality 1-100 (default: 85)
 * @returns Compressed base64 data URL
 */
async function compressImage(
	base64Image: string,
	targetWidth: number = 768,
	quality: number = 85
): Promise<string> {
	try {
		// Extract the base64 data from the data URL
		const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
		if (!matches || matches.length !== 3) {
			console.warn('Invalid base64 image format, returning original');
			return base64Image;
		}

		const base64Data = matches[2];
		const imageBuffer = Buffer.from(base64Data, 'base64');

		// Use Sharp to resize and compress
		const compressedBuffer = await sharp(imageBuffer)
			.resize(targetWidth, targetWidth, {
				fit: 'cover',
				position: 'center'
			})
			.jpeg({ quality, progressive: true }) // Convert to JPEG for better compression
			.toBuffer();

		// Convert back to base64 data URL
		const compressedBase64 = compressedBuffer.toString('base64');
		const compressedDataUrl = `data:image/jpeg;base64,${compressedBase64}`;

		console.log(
			`Image compressed: ${imageBuffer.length} bytes -> ${compressedBuffer.length} bytes ` +
			`(${Math.round((1 - compressedBuffer.length / imageBuffer.length) * 100)}% reduction)`
		);

		return compressedDataUrl;
	} catch (error) {
		console.error('Error compressing image with Sharp:', error);
		return base64Image; // Return original if compression fails
	}
}

const processStoryGeneration = async (
	fields: formidable.Fields,
	files: formidable.Files,
	currentUser: IUser
) => {
	const cumulativeUsage = {
		input: 0,
		output: 0,
	};
	const accumulateUsage = (agent: { usage: { input: number; output: number } }) => {
		cumulativeUsage.input += agent.usage.input;
		cumulativeUsage.output += agent.usage.output;
	};

	// Extract fields
	const kidName = Array.isArray(fields.kidName) ? fields.kidName[0] : fields.kidName || 'Alex';
	const kidGender = Array.isArray(fields.kidGender) ? fields.kidGender[0] : fields.kidGender || 'boy';
	const kidLikes = Array.isArray(fields.kidLikes) ? fields.kidLikes[0] : fields.kidLikes || 'space';
	const mood = Array.isArray(fields.mood) ? fields.mood[0] : fields.mood || 'adventurous';
	const colorScheme = Array.isArray(fields.colorScheme) ? fields.colorScheme[0] : fields.colorScheme || 'vibrant';
	const style = Array.isArray(fields.style) ? fields.style[0] : fields.style || 'cartoon';
	const printSize = Array.isArray(fields.printSize) ? fields.printSize[0] : fields.printSize || 'book';
	const numChapters = parseInt(Array.isArray(fields.numChapters) ? fields.numChapters[0] : fields.numChapters || '3', 10);
	const age = parseInt(Array.isArray(fields.age) ? fields.age[0] : fields.age || '6', 10);
	
	const file = Array.isArray(files.file) ? files.file[0] : files.file;

	if (!file) {
		throw new Error('Character image is required');
	}
	
	const fileContent = fs.readFileSync(file.filepath);

	const storyAgent = new Story(process.env.OPENAI_API_KEY as string);
	const storyJsonString = await storyAgent.generate({
		name: kidName,
		gender: kidGender,
		likes: kidLikes,
		mood,
		numChapters,
		age,
		colorScheme,
		printSize,
		style
	}, { buffer: fileContent, mimetype: file.mimetype || 'image/png' });

	accumulateUsage(storyAgent);

	let storyData: { chapters: Chapter[], cover: string , title: string};
	try {
		const cleanedJson = storyJsonString.replace(/```json\n?|```/g, '').trim();
		storyData = JSON.parse(cleanedJson);
	} catch(e) {
		console.error("Failed to parse story JSON", e, storyJsonString);
		throw new Error("Failed to parse story JSON from agent.");
	}
	
	const chapters = storyData.chapters;
	const cover =storyData.cover;
	const title = storyData.title;

	const storyChapters = chapters.filter(c => c.title.toLowerCase() !== 'cover');

	// Compress images before PDF generation
	console.log('=== Compressing images ===');
	let compressedCover = cover;
	if (cover) {
		compressedCover = await compressImage(cover, 768, 85);
	}

	const compressedChapters = await Promise.all(
		storyChapters.map(async (chapter) => {
			if (chapter.image) {
				const compressedImage = await compressImage(chapter.image, 768, 85);
				return {
					...chapter,
					image:compressedImage
				};
			}
			return chapter;
		})
	);

	// Step 4: Generate PDF
	console.log('=== Generating PDF ===');
	
	const pdfBuffer = await retryAsync(
		async () => {
			const pdf = new jsPDF('l', 'mm', 'a4');

			const addFormattedText = (
				text: string, 
				x: number, 
				startY: number, 
				maxWidth: number, 
				fontSize: number = 12,
				options: { 
					lineSpacing?: number, 
					paragraphSpacing?: number,
					bottomMargin?: number,
					allowPageBreaks?: boolean 
				} = {}
			): number => {
				const lineSpacing = options.lineSpacing ?? fontSize * 0.35;
				const paragraphSpacing = options.paragraphSpacing ?? fontSize * 0.6;
				const bottomMargin = options.bottomMargin ?? 20;
				const allowPageBreaks = options.allowPageBreaks ?? false;
				
				pdf.setFontSize(fontSize);
				pdf.setFont('helvetica', 'normal');
				pdf.setTextColor(255, 255, 255);
				
				const paragraphs = text.split(/\n\n+|\r\n\r\n+/);
				let currentY = startY;
				
				for (let p = 0; p < paragraphs.length; p++) {
					const paragraph = paragraphs[p].trim();
					if (!paragraph) continue;
					
					const lines = paragraph.split(/\n|\r\n/);
					
					for (let l = 0; l < lines.length; l++) {
						const line = lines[l].trim();
						if (!line) continue;
						
						const wrappedLines = pdf.splitTextToSize(line, maxWidth);
						
						for (let w = 0; w < wrappedLines.length; w++) {
							if (currentY + fontSize > pdf.internal.pageSize.getHeight() - bottomMargin) {
								if (allowPageBreaks) {
									addPageWithBackground();
									currentY = 30; // Start at top of new page
								} else {
									return currentY;
								}
							}
							
							pdf.text(wrappedLines[w], x, currentY, { align: 'left' });
							currentY += fontSize + lineSpacing;
						}
						
						if (l < lines.length - 1) {
							currentY += lineSpacing * 0.5;
						}
					}
					
					if (p < paragraphs.length - 1) {
						currentY += paragraphSpacing;
					}
				}
					
				return currentY;
			};

			const addPageWithBackground = () => {
				pdf.addPage();
				pdf.setFillColor(10, 14, 26); // Dark background color
				pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
			};

			// Page 1: Title page with main image
			pdf.setFillColor(10, 14, 26); // Dark background color
			pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
			pdf.setFontSize(48);
			pdf.setFont('helvetica', 'bold');
			pdf.setTextColor(255, 255, 255); // White text
			const titleY = 40;
			pdf.text(title ?? 'My Story', pdf.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });

			if (compressedCover) {
				try {
					const imgWidth = 160;
					const imgHeight = 160;
					const imgX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
					const imgY = 60;
					pdf.addImage(compressedCover, 'JPEG', imgX, imgY, imgWidth, imgHeight);
					console.log('Main image added to PDF title page');
				} catch (error) {
					console.error('Error adding main image to PDF:', error);
				}
			}

			// Add pages for each chapter
			for (let i = 0; i < compressedChapters.length; i++) {
				const chapter = compressedChapters[i];
				addPageWithBackground();

				const margin = 20;
				pdf.setFontSize(28);
				pdf.setFont('helvetica', 'bold');
				pdf.setTextColor(255, 255, 255);
				pdf.text(chapter.title, margin, 30, { align: 'left' });

				pdf.setDrawColor(51, 65, 85);
				pdf.setLineWidth(0.5);
				pdf.line(margin, 35, pdf.internal.pageSize.getWidth() - margin, 35);

				const contentY = 50;

				if (chapter.image) {
					try {
						const imageWidth = (pdf.internal.pageSize.getWidth() - 3 * margin) * 0.45;
						const imageHeight = imageWidth;
						const imageX = pdf.internal.pageSize.getWidth() - margin - imageWidth;
						pdf.addImage(chapter.image, 'JPEG', imageX, contentY, imageWidth, imageHeight);

						const textX = margin;
						const textMaxWidth = pdf.internal.pageSize.getWidth() - imageWidth - 3 * margin;
						
						addFormattedText(
							chapter.content, 
							textX, 
							contentY, 
							textMaxWidth, 
							14, // Increased font size
							{ 
								lineSpacing: 4, 
								paragraphSpacing: 8,
								bottomMargin: 20,
								allowPageBreaks: true
							}
						);
						console.log(`Chapter ${i + 1} added to PDF with image`);
					} catch (error) {
						console.error(`Error adding chapter ${i + 1} image to PDF:`, error);
						const textMaxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
						addFormattedText(
							chapter.content, 
							margin, 
							contentY, 
							textMaxWidth, 
							16, // Increased font size
							{ 
								lineSpacing: 5, 
								paragraphSpacing: 10,
								bottomMargin: 20,
								allowPageBreaks: true
							}
						);
						console.log(`Chapter ${i + 1} added to PDF without image (fallback)`);
					}
				} else {
					const textMaxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
					addFormattedText(
						chapter.content, 
						margin, 
						contentY, 
						textMaxWidth, 
						16, // Increased font size
						{ 
							lineSpacing: 5, 
							paragraphSpacing: 10,
							bottomMargin: 20,
							allowPageBreaks: true
						}
					);
					console.log(`Chapter ${i + 1} added to PDF (no image available)`);
				}
			}

			// Generate PDF buffer
			const buffer = Buffer.from(pdf.output('arraybuffer'));
			console.log(`PDF generated successfully. Size: ${buffer.length} bytes`);
			return buffer;
		},
		'PDF Generation',
		2,
		1000
	);

	const filename = `storybook-${kidName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;


	if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
		await sendEmailWithAttachment(
			currentUser.email,
			'Your Storybook is Ready!',
			`Hi ${currentUser.name},\n\nYour personalized storybook "${title}" is ready. Please find it attached to this email.\n\nEnjoy the story!\n\nThe UAITO Team`,
			pdfBuffer,
			filename
		);
	}

	if (process.env.BOOKS_PATH) {
		fs.writeFileSync(path.resolve(process.env.BOOKS_PATH), Uint8Array.from(pdfBuffer));
	}

	console.log('--- CUMULATIVE USAGE ---');
	console.log(`Input tokens: ${cumulativeUsage.input}`);
	console.log(`Output tokens: ${cumulativeUsage.output}`);
	console.log(`Total tokens: ${cumulativeUsage.input + cumulativeUsage.output}`);
	console.log('------------------------');
	console.log('=== Storybook generation and emailing complete ===');
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await NextCors(req, res, {
		methods: ['POST', 'OPTIONS'],
		origin: '*',
		optionsSuccessStatus: 200,
	});

	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	await db.connect();
	const currentUser = await getSessionUser(req, res);
	
	if (!currentUser) {
		return res.status(403).json({ error: 'Invalid session or auth token' });
	}

	if (!process.env.OPENAI_API_KEY) {
		return res.status(500).json({ error: 'OpenAI API key not configured' });
	}

	// Check Gmail SMTP credentials
	if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
		console.error('Missing Gmail SMTP credentials');
		return res.status(500).json({ 
			error: 'Gmail credentials not configured for sending email.',
			hint: 'Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables'
		});
	}
	
	try {
		const { fields, files } = await parseFormData(req);

		res.status(202).json({
			message:
				'Storybook generation has started. You will receive it in your email shortly.',
		});

		processStoryGeneration(fields, files, currentUser).catch(async (error) => {
			console.error('=== ERROR: Storybook generation failed ===');
			console.error('Error details:', error);
			console.error('Stack trace:', (error as Error).stack);
			
			const errorMessage = (error as Error).message;
			let failureStep = 'Unknown step';
			if (errorMessage.includes('Story Generation')) {
				failureStep = 'Story Generation (Step 1)';
			} else if (errorMessage.includes('Main Image')) {
				failureStep = 'Main Image Generation (Step 2)';
			} else if (errorMessage.includes('Chapter') && errorMessage.includes('Image')) {
				failureStep = 'Chapter Image Generation (Step 3)';
			} else if (errorMessage.includes('PDF')) {
				failureStep = 'PDF Generation (Step 4)';
			} else if (errorMessage.includes('email')) {
				failureStep = 'Emailing PDF';
			}

			await sendErrorEmail(
				currentUser.email,
				'Failed to generate your storybook',
				`Hi ${currentUser.name},\n\nWe're sorry, but we encountered an error while generating your storybook. The process failed at: ${failureStep}.\n\nDetails: ${errorMessage}\n\nPlease try again later.\n\nThe UAITO Team`
			);
		});
	} catch (error) {
		console.error('=== ERROR: Could not start storybook generation ===');
		console.error('Error details:', error);
		return res.status(500).json({
			error: 'Failed to start storybook generation process',
			details: (error as Error).message,
		});
	}
}

