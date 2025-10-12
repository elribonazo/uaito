import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { getSessionUser } from '@/utils/getSessionUser';
import db from '@/db';
import { StoryDetails } from '@/ai/agents/StoryDetails';
import { StoryPrompt } from '@/ai/agents/StoryPrompt';
import { StoryChapter, type Chapter } from '@/ai/agents/StoryChapter';
import { StoryImage } from '@/ai/agents/StoryImage';
import { StoryImageChapter } from '@/ai/agents/StoryImageChapter';
import type { BlockType, ImageBlock } from '@uaito/sdk';
import formidable from 'formidable';
import fs from 'fs';
import jsPDF from 'jspdf';
import { Image } from '@/ai/agents/Image';
import sharp from 'sharp';

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

	const cumulativeUsage = {
		input: 0,
		output: 0,
	};
	const accumulateUsage = (agent: { usage: { input: number; output: number } }) => {
		cumulativeUsage.input += agent.usage.input;
		cumulativeUsage.output += agent.usage.output;
	};

	await db.connect();
	const currentUser = await getSessionUser(req, res);
	
	if (!currentUser) {
		return res.status(403).json({ error: 'Invalid session or auth token' });
	}

	try {
		const { fields, files } = await parseFormData(req);
        
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
			return res.status(400).json({ error: 'Character image is required' });
		}

		const aiProcessLog: {
			userInput: { kidName: string; kidGender: string; kidLikes: string; mood: string; colorScheme: string; style: string; printSize: string; numChapters: number; age: number };
			storyDetails: Record<string, unknown>;
			detailedStoryPrompt: string;
			generatedChapters: { title: string; content: string }[];
			mainImagePrompt: string;
			chapterImagePrompts: { title: string; prompt: string }[];
		  } = {
			userInput: { kidName, kidGender, kidLikes, mood, colorScheme, style, printSize, numChapters, age },
			storyDetails: {},
			detailedStoryPrompt: '',
			generatedChapters: [],
			mainImagePrompt: '',
			chapterImagePrompts: [],
		  };

		// Phase 0: Generate story details
		const storyDetailsAgent = StoryDetails.create();
		const storyDetails = await storyDetailsAgent.generate({
			name: kidName,
			gender: kidGender,
			likes: kidLikes,
			mood,
			numChapters,
			age,
		});
		accumulateUsage(storyDetailsAgent);

		aiProcessLog.storyDetails = { ...storyDetails, name: kidName, gender: kidGender, likes: kidLikes, mood, numChapters, age };

		// Phase 1: Generate detailed story prompt
		const storyPromptAgent = StoryPrompt.create();
		const detailedPrompt = await storyPromptAgent.generate({
			name: kidName,
			gender: kidGender,
			likes: kidLikes,
			mood,
			numChapters,
			age,
			...storyDetails,
		});
		accumulateUsage(storyPromptAgent);

		aiProcessLog.detailedStoryPrompt = detailedPrompt;

		// Phase 2: Generate chapters
		const chapters: Chapter[] = [];
		for (let i = 1; i <= numChapters; i++) {
			const storyChapterAgent = StoryChapter.create();
			const chapter = await storyChapterAgent.generate({
				age,
				detailedPrompt,
				chapterNumber: i,
				previousChapters: chapters,
			});
			accumulateUsage(storyChapterAgent);

			if (chapter) {
				chapters.push(chapter);
			} else {
				throw new Error(`Failed to generate chapter ${i}`);
			}
		}

		aiProcessLog.generatedChapters = chapters.map(({ title, content }) => ({ title, content }));

		// Read file and generate prompt ONCE, outside retry loop
		const fileContent = fs.readFileSync(file.filepath);
		const optimizedImageBuffer = await sharp(fileContent)
			.resize({ width: 512, height: 512, fit: 'cover' })
			.png({ quality: 80 })
			.toBuffer();
		const base64 = optimizedImageBuffer.toString('base64');

		const storyImageAgent = StoryImage.create();
		const mainImagePrompt = await storyImageAgent.generatePrompt({
			...storyDetails,
			mood,
			colorScheme,
			printSize,
			style,
		});
		accumulateUsage(storyImageAgent);
		const imageAgent = new Image();
		aiProcessLog.mainImagePrompt = mainImagePrompt;
		const imageBlock: ImageBlock = {
			type: 'image',
			source: {
				type: 'base64',
				media_type: file.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
				data: base64,
			},
		};
		const textBlock: BlockType = {
			type: 'text',
			text: mainImagePrompt,
		};
		const mainImageUrl = await imageAgent.generateImage(textBlock, imageBlock)
		accumulateUsage(imageAgent);

		for (let i = 0; i < chapters.length; i++) {
			const chapterImagePromptLLM = StoryImageChapter.create();
			const chapter = chapters[i];
			const chapterImagePrompt = await chapterImagePromptLLM.generatePrompt({
				chapterTitle: chapter.title,
				chapterContent: chapter.content,
				characterDescription: storyDetails.characterDescription,
				mood,
				colorScheme,
				style,
			});
			accumulateUsage(chapterImagePromptLLM);

			aiProcessLog.chapterImagePrompts.push({ title: chapter.title, prompt: chapterImagePrompt });
			// Use retry logic for image generation
			const chapterImageBlock: ImageBlock = {
				type: 'image',
				source: {
					type: 'base64',
					media_type: 'image/png',
					data: base64,
				},
			};
			const chapterTextBlock: BlockType = {
				type: 'text',
				text: chapterImagePrompt,
			};
			const chapterImageAgent = new Image();
			const chapterImageUrl = await chapterImageAgent.generateImage(chapterTextBlock, chapterImageBlock);
			chapter.image = chapterImageUrl;
			accumulateUsage(chapterImageAgent);
			console.log(`Chapter ${i + 1} image generated successfully`);

		}

		fs.writeFileSync(`ai-process-log-${Date.now()}.json`, JSON.stringify(aiProcessLog, null, 2));
		// Step 4: Generate PDF
		console.log('=== Step 4: Generating PDF ===');
		console.log(`Chapters with images: ${chapters.filter(c => c.image).length}/${chapters.length}`);
		
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
				pdf.text(storyDetails.storyTitle, pdf.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });

				if (mainImageUrl) {
					try {
						const imgWidth = 160;
						const imgHeight = 160;
						const imgX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
						const imgY = 60;
						pdf.addImage(mainImageUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);
						console.log('Main image added to PDF title page');
					} catch (error) {
						console.error('Error adding main image to PDF:', error);
					}
				}

				// Add pages for each chapter
				for (let i = 0; i < chapters.length; i++) {
					const chapter = chapters[i];
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
							pdf.addImage(chapter.image, 'PNG', imageX, contentY, imageWidth, imageHeight);

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

		// Set response headers for PDF download
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename="storybook-${kidName.replace(/\s+/g, '-')}-${Date.now()}.pdf"`);
		res.setHeader('Content-Length', pdfBuffer.length);

		// Send PDF
		console.log('--- CUMULATIVE USAGE ---');
		console.log(`Input tokens: ${cumulativeUsage.input}`);
		console.log(`Output tokens: ${cumulativeUsage.output}`);
		console.log(`Total tokens: ${cumulativeUsage.input + cumulativeUsage.output}`);
		console.log('------------------------');
		console.log('Sending PDF to client...');
		res.send(pdfBuffer);
		console.log('=== Storybook generation complete ===');

	} catch (error) {
		console.error('=== ERROR: Storybook generation failed ===');
		console.error('Error details:', error);
		console.error('Stack trace:', (error as Error).stack);
		
		// Determine which step failed based on error message
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
		}
		
		return res.status(500).json({
			error: 'Failed to generate storybook',
			failureStep,
			details: errorMessage,
			timestamp: new Date().toISOString(),
		});
	}
}

