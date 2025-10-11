import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";

export interface StoryImageChapterProperties {
    chapterTitle: string;
    chapterContent: string;
    characterDescription: string;
    mood: string;
    colorScheme: string;
    style: string;
}

const moods = {
    happy: "joyful, cheerful, bright and uplifting atmosphere",
    adventurous: "exciting, dynamic, full of action and energy",
    magical: "enchanting, mystical, dreamlike with magical elements",
    peaceful: "calm, serene, tranquil and soothing",
    heroic: "brave, strong, epic and inspiring",
    mysterious: "intriguing, enigmatic, with secrets to discover",
    playful: "fun, lighthearted, whimsical and entertaining"
};

const colorSchemes = {
    vibrant: "bright, saturated colors with high contrast",
    pastel: "soft, muted pastel colors with gentle tones",
    warm: "warm color palette with reds, oranges, and yellows",
    cool: "cool color palette with blues, greens, and purples",
    monochrome: "black and white with shades of gray",
    neon: "vibrant neon colors with glowing effects",
    natural: "natural, earthy tones with organic colors"
};

const promptTemplates = {
    cartoon: "colorful cartoon drawing with bold outlines and vibrant colors",
    sketch: "detailed pencil sketch drawing with realistic shading and artistic line work",
    watercolor: "beautiful watercolor painting with soft blended colors and artistic brush strokes",
    comic: "comic book style illustration with dramatic shading, bold colors, and dynamic poses",
    anime: "anime-style drawing with large expressive eyes, stylized features, and vibrant colors",
    line_art: "clean line art with minimal details, black lines on white background",
    pop_art: "pop art style illustration with bold colors, high contrast, and graphic design elements",
    disney: "Disney Pixar animation style with expressive characters and magical atmosphere",
    chibi: "cute chibi style with oversized head, tiny body, and adorable features",
    vintage: "vintage illustration style with retro colors and classic artistic elements"
};

export class StoryImageChapter extends Agent {
    protected name = "StoryImageChapter";
    private properties!: StoryImageChapterProperties;

    override get systemPrompt() {
        return `You are an expert AI image prompt engineer specialized in creating precise, detailed prompts for chapter illustrations in children's storybooks.

Your task is to analyze the chapter content and create an optimized prompt that will generate a scene illustration showing the key moment or action described in the chapter.

**Chapter Information:**
- Chapter Title: ${this.properties.chapterTitle}
- Chapter Content: ${this.properties.chapterContent}
- Character Description: ${this.properties.characterDescription}
- Mood: ${moods[this.properties.mood as keyof typeof moods] || this.properties.mood}
- Color Scheme: ${colorSchemes[this.properties.colorScheme as keyof typeof colorSchemes] || this.properties.colorScheme}
- Artistic Style: ${promptTemplates[this.properties.style as keyof typeof promptTemplates] || this.properties.style}

**Your Goal:**
Generate a single, optimized image generation prompt that will:
1. Identify the most visually compelling moment or scene in the chapter
2. Transform the main character image to show them in this specific scene
3. Capture the action, emotions, and key visual elements described in the chapter
4. Maintain character consistency with the main illustration
5. Create an engaging, age-appropriate illustration that complements the text
6. Apply the specified artistic style, mood, and color scheme

**Analysis Requirements:**
Before creating the prompt, identify:
- The main action or event in this chapter
- The character's emotional state and activity
- The setting and environmental details
- Key visual elements or objects mentioned
- The time of day and lighting conditions (if mentioned)
- Other characters or creatures present

**Quality Requirements:**
- High resolution and print-ready quality
- Age-appropriate visual content for children
- Consistent with the main character's appearance
- Dynamic composition that tells the story
- Proper perspective and spatial relationships
- Suitable for book illustration layout (text can be placed alongside or below)

**Response Format:**
You MUST respond with ONLY the optimized image generation prompt. Do not include any explanations, analysis, or additional text. Just the prompt itself that will be sent to the image generation model.

The prompt should be detailed but focused, emphasizing:
1. The specific scene and moment from the chapter
2. Character positioning, expression, and action
3. Environmental details and setting
4. Mood, lighting, and atmosphere
5. Artistic style application
6. Technical quality specifications`;
    }

    override get chainOfThought() {
        return `To create an optimal chapter illustration prompt, I need to:

1. **Read and Analyze the Chapter**:
   - Chapter: "${this.properties.chapterTitle}"
   - Content preview: ${this.properties.chapterContent.slice(0, 300)}...
   - Identify the key visual moment that best represents this chapter

2. **Extract Visual Elements**:
   - What is the character doing?
   - What emotions are they expressing?
   - What objects or elements are present?
   - Where does this take place?
   - What time of day or lighting conditions?

3. **Maintain Character Consistency**:
   - Reference: ${this.properties.characterDescription}
   - The character must be recognizable from the main image
   - Adapt their appearance to fit the scene context

4. **Apply Style Guidelines**:
   - Style: ${promptTemplates[this.properties.style as keyof typeof promptTemplates] || this.properties.style}
   - Mood: ${moods[this.properties.mood as keyof typeof moods] || this.properties.mood}
   - Colors: ${colorSchemes[this.properties.colorScheme as keyof typeof colorSchemes] || this.properties.colorScheme}

5. **Optimize for Illustration**:
   - Dynamic composition suitable for book layout
   - Clear focal point on the character and action
   - Appropriate perspective and depth
   - Print-ready quality

6. **Synthesize the Prompt**: Create a focused, detailed prompt that captures the essence of this chapter's visual moment.`;
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

    async generatePrompt(properties: StoryImageChapterProperties): Promise<string> {
        this.properties = properties;
        const { response } = await this.performTask(
            "Generate the optimized image generation prompt for this chapter based on the chapter content and story elements provided."
        );

        // Collect the full response
        let fullPrompt = "";
        for await (const chunk of response) {
            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                fullPrompt += chunk.content[0].text;
            } else if (chunk.type === 'delta') {
                const deltaContent = chunk.content.find(c => c.type === 'delta');
                if (deltaContent && deltaContent.type === 'delta') {
                    const delta = deltaContent as DeltaBlock;
                    if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'tool_use' || delta.stop_reason === 'end_turn') {
                        break;
                    }
                }
            }
        }

        return fullPrompt.trim();
    }
}

