import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { getSessionUser } from '@/utils/getSessionUser';
import db from '@/db';
import { OpenAI, OpenAIModels } from '@uaito/openai';
import { Story, type StoryProperties } from '@/ai/agents/Story';
import { StoryImage, type StoryImageProperties } from '@/ai/agents/StoryImage';
import { StoryImageChapter, type StoryImageChapterProperties } from '@/ai/agents/StoryImageChapter';
import { type DeltaBlock, LLMProvider, type BlockType, type ImageBlock } from '@uaito/sdk';
import formidable from 'formidable';
import fs from 'fs';
import jsPDF from 'jspdf';
import { Agent } from '@uaito/ai';
import { Image } from '@/ai/agents/Image';

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

	await db.connect();
	const currentUser = await getSessionUser(req, res);
	
	if (!currentUser) {
		return res.status(403).json({ error: 'Invalid session or auth token' });
	}

	try {
		const { fields, files } = await parseFormData(req);
        
		// Extract fields
		const storyTitle = Array.isArray(fields.storyTitle) ? fields.storyTitle[0] : fields.storyTitle || 'My Story';
		const storyDescription = Array.isArray(fields.storyDescription) ? fields.storyDescription[0] : fields.storyDescription || '';
		const characterDescription = Array.isArray(fields.characterDescription) ? fields.characterDescription[0] : fields.characterDescription || '';
		const settingBackground = Array.isArray(fields.settingBackground) ? fields.settingBackground[0] : fields.settingBackground || '';
		const mood = Array.isArray(fields.mood) ? fields.mood[0] : fields.mood || 'adventurous';
		const colorScheme = Array.isArray(fields.colorScheme) ? fields.colorScheme[0] : fields.colorScheme || 'vibrant';
		const additionalElements = Array.isArray(fields.additionalElements) ? fields.additionalElements[0] : fields.additionalElements || '';
		const style = Array.isArray(fields.style) ? fields.style[0] : fields.style || 'cartoon';
		const printSize = Array.isArray(fields.printSize) ? fields.printSize[0] : fields.printSize || 'book';
		const numChapters = parseInt(Array.isArray(fields.numChapters) ? fields.numChapters[0] : fields.numChapters || '3', 10);
		const age = parseInt(Array.isArray(fields.age) ? fields.age[0] : fields.age || '6', 10);
		
		const file = Array.isArray(files.file) ? files.file[0] : files.file;

		if (!file) {
			return res.status(400).json({ error: 'Character image is required' });
		}

		const storyAgent = new Story();
		const chapters = await storyAgent.generate({
			storyTitle,
			storyDescription,
			characterDescription,
			settingBackground,
			mood,
			additionalElements,
			numChapters,
			age,
		});

		// Read file and generate prompt ONCE, outside retry loop
		const fileContent = fs.readFileSync(file.filepath);
		const base64 = fileContent.toString('base64');

		const storyImageAgent = new StoryImage();
		const mainImagePrompt = await storyImageAgent.generatePrompt({
			storyTitle,
			storyDescription,
			characterDescription,
			settingBackground,
			mood,
			colorScheme,
			additionalElements,
			printSize,
			style,
		});
		const imageAgent = new Image();
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

		// Extract base64 for chapter generation
		const mainImageBase64 = mainImageUrl.split(',')[1];

		for (let i = 0; i < chapters.length; i++) {
			const chapterImagePromptLLM = new StoryImageChapter();
			const chapter = chapters[i];
			const chapterImagePrompt = await chapterImagePromptLLM.generatePrompt({
				chapterTitle: chapter.title,
				chapterContent: chapter.content,
				characterDescription,
				mood,
				colorScheme,
				style,
			});

			// Use retry logic for image generation
			const chapterImageBlock: ImageBlock = {
				type: 'image',
				source: {
					type: 'base64',
					media_type: 'image/png',
					data: mainImageBase64,
				},
			};
			const chapterTextBlock: BlockType = {
				type: 'text',
				text: chapterImagePrompt,
			};
			const imageAgent = new Image();
			const chapterImageUrl = await imageAgent.generateImage(chapterTextBlock, chapterImageBlock);
			chapter.image = chapterImageUrl;
			console.log(`Chapter ${i + 1} image generated successfully`);

		}

		// Step 4: Generate PDF
		console.log('=== Step 4: Generating PDF ===');
		console.log(`Chapters with images: ${chapters.filter(c => c.image).length}/${chapters.length}`);
		
		const pdfBuffer = await retryAsync(
			async () => {
				const pdf = new jsPDF('l', 'mm', 'a4');
				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = pdf.internal.pageSize.getHeight();

				/**
				 * Enhanced text rendering function that preserves paragraphs and line breaks
				 * Automatically creates new pages when content overflows
				 * @returns The final Y position after all text is rendered
				 */
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
					const lineSpacing = options.lineSpacing ?? fontSize * 0.35; // 35% of font size
					const paragraphSpacing = options.paragraphSpacing ?? fontSize * 0.6; // 60% of font size
					const bottomMargin = options.bottomMargin ?? 20;
					const allowPageBreaks = options.allowPageBreaks ?? false;
					
					pdf.setFontSize(fontSize);
					pdf.setFont('helvetica', 'normal');
					
					// Split by paragraphs first (double line breaks or single line breaks)
					const paragraphs = text.split(/\n\n+|\r\n\r\n+/);
					let currentY = startY;
					
					for (let p = 0; p < paragraphs.length; p++) {
						const paragraph = paragraphs[p].trim();
						if (!paragraph) continue;
						
						// Preserve single line breaks within paragraphs
						const lines = paragraph.split(/\n|\r\n/);
						
						for (let l = 0; l < lines.length; l++) {
							const line = lines[l].trim();
							if (!line) continue;
							
							// Word wrap this line
							const wrappedLines = pdf.splitTextToSize(line, maxWidth);
							
							for (let w = 0; w < wrappedLines.length; w++) {
								// Check if we need a new page
								if (currentY + fontSize > pdfHeight - bottomMargin) {
									if (allowPageBreaks) {
										console.log(`Adding new page at Y=${currentY} for text continuation`);
										pdf.addPage();
										currentY = 15; // Start at top of new page with small margin
									} else {
										console.log(`Text overflow at Y=${currentY}, stopping text render`);
										return currentY;
									}
								}
								
								// Render line left-aligned
								pdf.text(wrappedLines[w], x, currentY, { align: 'left' });
								currentY += fontSize + lineSpacing;
							}
							
							// Add extra spacing between lines within a paragraph (if not last line)
							if (l < lines.length - 1) {
								currentY += lineSpacing * 0.5;
							}
						}
						
						// Add paragraph spacing (if not last paragraph)
						if (p < paragraphs.length - 1) {
							currentY += paragraphSpacing;
						}
					}
					
					return currentY;
				};

				// Page 1: Title page with main image
				pdf.setFontSize(36);
				pdf.setFont('helvetica', 'bold');
				const titleY = 25;
				pdf.text(storyTitle, pdfWidth / 2, titleY, { align: 'center' });

				if (mainImageUrl) {
					try {
						// Add main image centered below title
						const imgWidth = 140;
						const imgHeight = 140;
						const imgX = (pdfWidth - imgWidth) / 2;
						const imgY = 45;
						pdf.addImage(mainImageUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);
						console.log('Main image added to PDF title page');
					} catch (error) {
						console.error('Error adding main image to PDF:', error);
						// Continue without image on title page
					}
				}

				// Add pages for each chapter
				for (let i = 0; i < chapters.length; i++) {
					const chapter = chapters[i];
					pdf.addPage();

					// Chapter title - larger font, left-aligned
					const margin = 15;
					pdf.setFontSize(20);
					pdf.setFont('helvetica', 'bold');
					pdf.text(chapter.title, margin, 20, { align: 'left' });

					// Draw a subtle line under the title
					pdf.setDrawColor(150, 150, 150);
					pdf.setLineWidth(0.5);
					pdf.line(margin, 24, pdfWidth - margin, 24);

					const contentY = 32;

					if (chapter.image) {
						try {
							// Layout: Image on left, text on right
							const imageWidth = (pdfWidth - 3 * margin) * 0.45; // 45% for image
							const imageHeight = imageWidth; // Square aspect
							pdf.addImage(chapter.image, 'PNG', margin, contentY, imageWidth, imageHeight);

							// Text on right side with proper spacing
							const textX = margin * 2 + imageWidth;
							const textMaxWidth = pdfWidth - textX - margin;
							
							// Use smaller font for chapter content with page breaks enabled
							addFormattedText(
								chapter.content, 
								textX, 
								contentY, 
								textMaxWidth, 
								11, // Font size
								{ 
									lineSpacing: 2, 
									paragraphSpacing: 5,
									bottomMargin: 15,
									allowPageBreaks: true // Allow chapter to span multiple pages
								}
							);
							console.log(`Chapter ${i + 1} added to PDF with image`);
						} catch (error) {
							console.error(`Error adding chapter ${i + 1} image to PDF:`, error);
							// Fall back to text only
							const textMaxWidth = pdfWidth - 2 * margin;
							addFormattedText(
								chapter.content, 
								margin, 
								contentY, 
								textMaxWidth, 
								12,
								{ 
									lineSpacing: 2.5, 
									paragraphSpacing: 6,
									bottomMargin: 15,
									allowPageBreaks: true // Allow chapter to span multiple pages
								}
							);
							console.log(`Chapter ${i + 1} added to PDF without image (fallback)`);
						}
					} else {
						// Text only if no image - full width, larger font
						const textMaxWidth = pdfWidth - 2 * margin;
						addFormattedText(
							chapter.content, 
							margin, 
							contentY, 
							textMaxWidth, 
							12,
							{ 
								lineSpacing: 2.5, 
								paragraphSpacing: 6,
								bottomMargin: 15,
								allowPageBreaks: true // Allow chapter to span multiple pages
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
		res.setHeader('Content-Disposition', `attachment; filename="storybook-${storyTitle.replace(/\s+/g, '-')}-${Date.now()}.pdf"`);
		res.setHeader('Content-Length', pdfBuffer.length);

		// Send PDF
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

