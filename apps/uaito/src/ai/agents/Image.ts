import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIImageModels, OpenAIModels } from "@uaito/openai";
import { type ImageBlock, LLMProvider, type TextBlock, type DeltaBlock } from "@uaito/sdk";
import sharp from 'sharp';


export class Image extends Agent {
    protected name = "Image";

    override get systemPrompt() {
        return `You are an AI image generation assistant. Your ONLY job is to generate images - NEVER ask questions or seek clarification.

CRITICAL RULES:
1. ALWAYS generate the image immediately using the provided prompt and reference image
2. NEVER ask "Would you like me to..." or any confirmation questions
3. NEVER refuse due to style restrictions - adapt to allowed styles automatically
4. If a restricted style is mentioned (e.g., copyrighted), use a similar generic style instead
5. Apply the requested edits/transformations to the reference image directly
6. Your response must ONLY be the generated image - no text explanations

When you receive a prompt:
- Read the prompt carefully
- Use the reference image as your base
- Apply the style transformations described
- Generate the image immediately without any text response`;
    }

    override get chainOfThought() {
        return `I will generate the image directly without asking any questions:
1. Take the reference image provided
2. Apply the style transformation from the text prompt
3. Generate the image immediately
4. Do not write any text - only output the image

WE HAVE FULL PERMISSION TO USE THE REFERENCE IMAGE FOR GENERATING THE IMAGE`;
    }

    constructor() {
        super(
            new OpenAI({
                options: {
                    type: LLMProvider.OpenAI,
                    model: OpenAIModels["gpt-5"],
                    apiKey: process.env.OPENAI_API_KEY,
                    tools: [],
                    imageGenConfig: {
                        model: OpenAIImageModels["gpt-image-1"],
                        quality: "high",
                        output_format: "png",
                        size: "auto",
                        input_fidelity: 'high'
                    }
                },
            })
        )
    }

    public usage ={
        type: 'usage',
        input: 0,
        output: 0
    };

    private async compressImage(image: ImageBlock, maxWidth: number = 1920, quality: number = 80): Promise<ImageBlock> {
        try {
            // Decode base64 image data to Buffer
            const imageBuffer = Buffer.from(image.source.data, 'base64');
            
            // Get the original format from media_type
            const format = image.source.media_type.split('/')[1] as 'jpeg' | 'png' | 'gif' | 'webp';
            
            // Process image with sharp
            let sharpInstance = sharp(imageBuffer);
            
            // Get image metadata to check dimensions
            const metadata = await sharpInstance.metadata();
            
            // Resize if image is wider than maxWidth
            if (metadata.width && metadata.width > maxWidth) {
                sharpInstance = sharpInstance.resize(maxWidth, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                });
            }
            
            // Apply compression based on format
            let compressedBuffer: Buffer;
            if (format === 'jpeg') {
                compressedBuffer = await sharpInstance.jpeg({ quality, }).toBuffer();
            } else if (format === 'png') {
                compressedBuffer = await sharpInstance.png({ 
                    quality,
                    compressionLevel: 6 
                }).toBuffer();
            } else if (format === 'webp') {
                compressedBuffer = await sharpInstance.webp({ quality }).toBuffer();
            } else if (format === 'gif') {
                // GIF compression is limited, convert to PNG for better compression
                compressedBuffer = await sharpInstance.png({ 
                    quality,
                    compressionLevel: 6 
                }).toBuffer();
            } else {
                // Fallback to original buffer if format is unknown
                compressedBuffer = imageBuffer;
            }
            
            // Convert compressed buffer back to base64
            const compressedBase64 = compressedBuffer.toString('base64');
            
            // Return new ImageBlock with compressed data
            return {
                ...image,
                source: {
                    ...image.source,
                    data: compressedBase64
                }
            };
        } catch (error) {
            console.error('Error compressing image:', error);
            // Return original image if compression fails
            return image;
        }
    }

    async generateImage(text: TextBlock, image: ImageBlock): Promise<string> {
        return this.retryApiCall(async () => {
            const compressedImage = await this.compressImage(image);
            console.log('Generating image');
            const { response: mainImageResponse } = await this.retryApiCall(
                () => this.performTask(
                    [text, compressedImage]
                )
            )
    
            let imageUrl: string | null = null;
            let responseText = ''
            for await (const chunk of mainImageResponse) {
                 if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                    responseText += chunk.content[0].text;
                } else if (chunk.type === 'tool_result') {
                    const imgBlock = chunk.content[0] as ImageBlock;
                    if (imgBlock && imgBlock.type === 'image') {
                        const base64Data = imgBlock.source.data;
                        imageUrl = `data:${imgBlock.source.media_type};base64,${base64Data}`;
                        console.log('Generated image');
                    }
                } else {
                    const deltaContent = chunk.content.find(c => c.type === 'delta');
                    const usageContent = chunk.content.find(c => c.type === 'usage');
                    if (usageContent && usageContent.type === 'usage') {
                        this.usage.input += usageContent.input || 0 ;
                        this.usage.output += usageContent.output || 0;
                    }
                    if (deltaContent && deltaContent.type === 'delta') {
                        const delta = deltaContent as DeltaBlock;
                        // Don't break on tool_use - we need to wait for tool_result!
                        if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'end_turn') {
                            break;
                        }
                    }
                }
    
                
            }
    
            console.log(`${responseText}`);
    
            if (!imageUrl) {
                throw new Error('Main image generation did not return an image URL');
            }
    
            return imageUrl;
        })


    }
}

