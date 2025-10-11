import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";

export interface StoryImageProperties {
    storyTitle: string;
    storyDescription: string;
    characterDescription: string;
    settingBackground: string;
    mood: string;
    colorScheme: string;
    additionalElements?: string;
    printSize: string;
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

export class StoryImage extends Agent {
    protected name = "StoryImage";
    private properties!: StoryImageProperties;

    override get systemPrompt() {
        return `You are an expert AI image prompt engineer specialized in creating precise, detailed prompts for image generation models that will be used in children's storybooks.

Your task is to analyze the provided story elements and character image, then create an optimized prompt that will generate a high-quality main illustration for the storybook.

**Story Elements:**
- Title: ${this.properties.storyTitle}
- Description: ${this.properties.storyDescription}
- Character: ${this.properties.characterDescription}
- Setting: ${this.properties.settingBackground}
- Mood: ${moods[this.properties.mood as keyof typeof moods] || this.properties.mood}
- Color Scheme: ${colorSchemes[this.properties.colorScheme as keyof typeof colorSchemes] || this.properties.colorScheme}
- Style: ${promptTemplates[this.properties.style as keyof typeof promptTemplates] || this.properties.style}
- Print Size: ${this.properties.printSize}
${this.properties.additionalElements ? `- Additional Elements: ${this.properties.additionalElements}` : ''}

**Your Goal:**
Generate a single, optimized image generation prompt that will:
1. Transform the provided character image to match the desired artistic style
2. Capture the essence of the story and character
3. Create a visually compelling main illustration suitable for a children's storybook cover
4. Be optimized for professional printing at ${this.properties.printSize} size
5. Maintain the character's recognizable features while applying the artistic style
6. Include all relevant visual elements that represent the story's themes

**Quality Requirements:**
- High resolution and print-ready quality
- Age-appropriate visual language for children
- Consistent character representation that can be replicated in chapter illustrations
- Professional composition with proper focal points
- Suitable for the specified mood and color scheme

**Response Format:**
You MUST respond with ONLY the optimized image generation prompt. Do not include any explanations, prefixes, or additional text. Just the prompt itself that will be sent to the image generation model.

The prompt should be detailed but concise, focusing on:
1. The artistic style transformation
2. Character description and pose
3. Setting and background elements
4. Mood and atmosphere
5. Color palette and lighting
6. Technical specifications (quality, composition, print-ready)`;
    }

    override get chainOfThought() {
        return `To create an optimal image generation prompt, I need to:

1. **Analyze the Character & Story**: Understand the main character's personality, appearance, and role in the story.

2. **Apply the Artistic Style**: Transform the reference image to match ${this.properties.style} style while maintaining character recognition.

3. **Incorporate Story Context**: 
   - The story "${this.properties.storyTitle}" is about: ${this.properties.storyDescription}
   - Setting: ${this.properties.settingBackground}
   - This should inform the character's pose, expression, and surroundings

4. **Optimize for Mood & Atmosphere**: 
   - The ${this.properties.mood} mood requires specific visual cues
   - ${moods[this.properties.mood as keyof typeof moods] || this.properties.mood}

5. **Technical Specifications**:
   - Style: ${promptTemplates[this.properties.style as keyof typeof promptTemplates] || this.properties.style}
   - Colors: ${colorSchemes[this.properties.colorScheme as keyof typeof colorSchemes] || this.properties.colorScheme}
   - Quality: High resolution, print-ready for ${this.properties.printSize}

6. **Compose the Final Prompt**: Synthesize all elements into a coherent, detailed prompt that balances artistic vision with technical requirements.

I will now generate the optimized prompt focusing on transforming the uploaded character image while incorporating all story elements.`;
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
    
    async generatePrompt(properties: StoryImageProperties): Promise<string> {
        this.properties = properties;
        const { response } = await this.performTask(
            "Generate the optimized image generation prompt based on the story elements provided."
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

