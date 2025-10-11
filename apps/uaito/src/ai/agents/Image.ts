import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { ImageBlock, LLMProvider, TextBlock, type DeltaBlock } from "@uaito/sdk";


export class Image extends Agent {
    protected name = "Image";

    override get systemPrompt() {
        return ``;
    }

    constructor() {
        super(
            new OpenAI({
                options: {
                    type: LLMProvider.OpenAI,
                    model: OpenAIModels['gpt-5'],
                    apiKey: process.env.OPENAI_API_KEY,
                    tools: [],
                },
            })
        )

    }

    async generateImage(text: TextBlock, image: ImageBlock): Promise<string> {
        return this.retryApiCall(async () => {
            const { response: mainImageResponse } = await this.performTask(
                [text, image]
            );
    
            let imageUrl: string | null = null;
            let chunkCount = 0;
            let sawToolUse = false;
            let responseText = ''
            for await (const chunk of mainImageResponse) {
                chunkCount++;
                if (chunk.type === 'tool_use') {
                    sawToolUse = true;
                }
    
                if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                    responseText += chunk.content[0].text;
                }
    
                if (chunk.type === 'tool_result') {
                    console.log('Received tool_result');
                    const imgBlock = chunk.content[0] as ImageBlock;
                    if (imgBlock && imgBlock.type === 'image') {
                        const base64Data = imgBlock.source.data;
                        imageUrl = `data:${imgBlock.source.media_type};base64,${base64Data}`;
                        console.log(`Image URL created, length: ${imageUrl.length}`);
                        // Once we have the image, we can break
                        break;
                    }
                }
    
                if (chunk.type === 'delta') {
                    const deltaContent = chunk.content.find(c => c.type === 'delta');
                    if (deltaContent && deltaContent.type === 'delta') {
                        const delta = deltaContent as DeltaBlock;
                        console.log(`Delta stop_reason: ${delta.stop_reason}`);
                        // Don't break on tool_use - we need to wait for tool_result!
                        if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'end_turn') {
                            console.log(`Breaking at chunk ${chunkCount} (stop_reason: ${delta.stop_reason})`);
                            break;
                        }
                        // If we see tool_use stop_reason, continue to get the tool_result
                        if (delta.stop_reason === 'tool_use') {
                            console.log(`Saw tool_use stop_reason, continuing to wait for tool_result...`);
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

