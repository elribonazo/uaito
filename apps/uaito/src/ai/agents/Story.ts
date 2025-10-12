import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIImageModels, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type UsageBlock, type TextBlock, type ImageBlock, type DeltaBlock } from "@uaito/sdk";
import { moods, colorSchemes, promptTemplates, getRandomElement } from "./storybook/constants";

// From StoryDetails.ts
export interface StoryInputProperties {
    name: string;
    gender: string;
    likes: string; // comma-separated keywords
    age: number;
    numChapters: number;
    mood: string;
    // from StoryImage.ts
    colorScheme: string;
    style: string;
    printSize: string;
}

// From StoryChapter.ts
export interface Chapter {
    title: string;
    content: string;
    image?: string; // URL of the generated image
}

export class Story extends Agent {
    protected name = "Story";
    public usage = {
        input: 0,
        output: 0,
    };
    constructor(apiKey: string) {
        const client = new OpenAI({
            options: {
                type: LLMProvider.OpenAI,
                model: OpenAIModels["gpt-5"],
                apiKey: apiKey,
                tools: [],
                // log: () =>{},
                imageGenConfig: {
                    model: OpenAIImageModels["gpt-image-1"],
                    quality: "high",
                    output_format: "png",
                    size: "1024x1024",
                    input_fidelity: 'high'
                }
            },
        });
        super(client);
    }

    private createComprehensivePrompt(properties: StoryInputProperties): string {
        const { name, gender, likes, age, mood, numChapters, colorScheme, style, printSize } = properties;
        const moodKey = mood as keyof typeof moods;
        const colorSchemeKey = colorScheme as keyof typeof colorSchemes;
        const styleKey = style as keyof typeof promptTemplates;

        return `You are an expert storyteller and illustrator for children's books. Your task is to generate a complete story with a cover and ${numChapters} chapters, including generating images for each part using your available tools. You MUST use the user-provided image as an input for all image generations.

**User Preferences:**
- Child's Name: ${name}
- Child's Gender: ${gender}
- Child Likes: ${likes}
- Target Age: ${age} years old
- Mood: ${mood}
- Art Style: ${style}
- Color Scheme: ${colorScheme}
- Number of Chapters: ${numChapters}

**Your Task:**
Generate a response in the specified JSON format. Follow these steps:

1.  **Story Concept:** First, internally brainstorm a story concept including title, description, character, setting, and plot points for each chapter based on the user preferences.

2.  **Generate Cover Image:**
    a.  Use your \`image_generation\` tool to create the cover image based on the input_image and the user generated story content.

3.  **Generate Chapters:** For each of the ${numChapters} chapters:
    a.  Write a title and content for the chapter, keeping it age-appropriate.
    b.  Use your \`image_generation\` tool to create an image that illustrates the key moment of that chapter. The prompt for this tool must also use the original user-provided input_image to maintain character consistency.

**Age-Specific Guidelines for ${age}-year-olds:**
${age <= 7
? `- **Words**: Use simple, common words. At least 90% simple words.
- **Sentences**: Keep them short, mostly under 10-15 words.
- **Length**: Under 70 words per chapter.`
: `- Use richer vocabulary with 10-15 word sentences.
- Include simple problem-solving scenarios.
- Story length: 100-300 words per chapter.`
}

**Artistic Style Guidance:**
-   **Style:** ${promptTemplates[styleKey] ? getRandomElement(promptTemplates[styleKey]) : style}
-   **Color Scheme:** ${colorSchemes[colorSchemeKey] ? getRandomElement(colorSchemes[colorSchemeKey]) : colorScheme}
-   **Mood:** ${moods[moodKey] ? getRandomElement(moods[moodKey]) : mood}
-   **Format:** Suitable for ${printSize}.

**CRITICAL: Response Format**
You MUST respond with ONLY a valid JSON object. Do not include any explanations, markdown, or other text.

Important: Leave all \`image\` fields as empty strings "". Images will be inserted by the system after your response using the results of your image_generation tool calls.

Example JSON structure
{
  "title": "The Magical Forest",
  "cover": "",
  "chapters": [
    {
      "title": "Chapter 1: Sample Chapter",
      "content": "The Magical Forest",
      "image": ""
    },
    {
      "title": "Chapter 2: The First Clue",
      "content": "Alex found a mysterious map...",
      "image": ""
    }
  ]
}

**CRITICAL: Image Generation**
When using the image_generation tool always use 2 inputs, the user provided image and the prompt
`;
    }
    
    public async generate(properties: StoryInputProperties, mainImageFile: { buffer: Buffer, mimetype: string }): Promise<string> {
        const promptText = this.createComprehensivePrompt(properties);
        const imageBlock: ImageBlock = {
            type: 'image',
            source: {
                type: 'base64',
                media_type: mainImageFile.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: mainImageFile.buffer.toString('base64'),
            },
        };

        const textBlock: TextBlock = {
            type: 'text',
            text: promptText,
        };
        
        const { response } = await this.retryApiCall(
            () => this.performTask([textBlock, imageBlock])
        );

        const imagesDataUrls: string[] = [];
        let activeImageCallId: string | null = null;
        let activeImageBase64: string | null = null;
        let storyJSON = "";
        for await (const chunk of response) {
            // opportunistically capture image generation progress/state
            const cache:any = this.cache ?? {};
            const callId = cache.imageGenerationCallId ?? null;
            const base64 = cache.imageBase64 ?? null;

            if (callId && callId !== activeImageCallId) {
                if (activeImageCallId && activeImageBase64) {
                    imagesDataUrls.push(`data:image/png;base64,${activeImageBase64}`);
                }
                activeImageCallId = callId;
                activeImageBase64 = base64 ?? null;
            } else if (callId && base64 && base64 !== activeImageBase64) {
                activeImageBase64 = base64;
            }

            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                storyJSON += (chunk.content[0] as TextBlock).text;
            } else {
                const usageContent = chunk.content.find(c => c.type === 'usage');
                if (usageContent && usageContent.type === 'usage') {
                    this.usage.input += (usageContent as UsageBlock).input || 0;
                    this.usage.output += (usageContent as UsageBlock).output || 0;
                }

                const deltaContent = chunk.content.find(c => c.type === 'delta');
                if (deltaContent && deltaContent.type === 'delta') {
                    const delta = deltaContent as DeltaBlock;
                    if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'end_turn') {
                        // push the last active image (if any)
                        if (activeImageCallId && activeImageBase64) {
                            imagesDataUrls.push(`data:image/png;base64,${activeImageBase64}`);
                        }
                        break;
                    }
                }
            }
        }

        // Attempt to inject captured images sequentially into the JSON output
        
            const cleaned = storyJSON.replace(/```json\n?|```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            const [coverImage, ...chapterImages] = imagesDataUrls;
            parsed.cover = coverImage;

            for (let i = 0; i < parsed.chapters.length; i++) {
                parsed.chapters[i].image = chapterImages[i] ?? '';
            }


            return JSON.stringify(parsed);
       

       
    }
}
