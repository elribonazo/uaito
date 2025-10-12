import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";
import { moods, colorSchemes, promptTemplates, getRandomElement } from "./storybook/constants";

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

export class StoryImage extends Agent {
    protected name = "StoryImage";
    private properties!: StoryImageProperties;

    override get systemPrompt() {
        const moodKey = this.properties.mood as keyof typeof moods;
        const colorSchemeKey = this.properties.colorScheme as keyof typeof colorSchemes;
        const styleKey = this.properties.style as keyof typeof promptTemplates;
        
        return `You are an expert prompt engineer for image stylization in children's books. Your task is to generate a concise prompt for editing/adapting an EXISTING REFERENCE IMAGE (provided separately) to fit a story's aesthetic. For ages ≤6: Enforce 'tiny tale' mode—short, echoey, sense-packed. Match chapter's tiny vocabulary visually—e.g., label-like colors/shapes if story counts them.

IMPORTANT RULES:
- PRIORITIZE the reference image: Treat it as the base. Preserve the main subject's identity, pose, facial features, clothing, and overall composition. Do NOT add new characters, actions, or backgrounds that override the reference—focus on subtle enhancements.
- Apply STYLE ADAPTATION only: Transform the reference to match ${promptTemplates[styleKey] ? getRandomElement(promptTemplates[styleKey]) : this.properties.style} art style, with a ${colorSchemes[colorSchemeKey] ? getRandomElement(colorSchemes[colorSchemeKey]) : this.properties.colorScheme} palette, and a ${moods[moodKey] ? getRandomElement(moods[moodKey]) : this.properties.mood} tone. Make it suitable for ${this.properties.printSize} format.
- Reference the story: Briefly incorporate the theme of "${this.properties.storyTitle}" and character details like "${this.properties.characterDescription}" to ensure the style fits, but keep it minimal.
- Keep prompts short (50-100 words): Focus on visual style transfer, not narrative storytelling. End with "high quality, detailed, children's book illustration."
- Output ONLY the prompt—no explanations. Example: "Adapt the reference image to a colorful cartoon style with a vibrant color palette, maintaining the child's pose and features while adding a gentle adventurous expression for a book page."`;
    }

    override get chainOfThought() {
        const moodKey = this.properties.mood as keyof typeof moods;
        const colorSchemeKey = this.properties.colorScheme as keyof typeof colorSchemes;
        const styleKey = this.properties.style as keyof typeof promptTemplates;

        return `To create an optimal image generation prompt, I need to:

1. **Analyze the Character & Story**: Understand the main character's personality, appearance, and role in the story.
2. **Apply the Artistic Style**: Transform the reference image to match ${this.properties.style} style while maintaining character recognition. Match chapter's tiny vocabulary visually—e.g., label-like colors/shapes if story counts them.
3. **Incorporate Story Context**: 
   - The story "${this.properties.storyTitle}" is about: ${this.properties.storyDescription}
   - Setting: ${this.properties.settingBackground}
   - This should inform the character's pose, expression, and surroundings
4. **Optimize for Mood & Atmosphere**: 
   - The ${this.properties.mood} mood requires specific visual cues
   - ${moods[moodKey] ? getRandomElement(moods[moodKey]) : this.properties.mood}
5. **Technical Specifications**:
   - Style: ${promptTemplates[styleKey] ? getRandomElement(promptTemplates[styleKey]) : this.properties.style}
   - Colors: ${colorSchemes[colorSchemeKey] ? getRandomElement(colorSchemes[colorSchemeKey]) : this.properties.colorScheme}
   - Quality: High resolution, print-ready for ${this.properties.printSize}
6. **Compose the Final Prompt**: Synthesize all elements into a coherent, detailed prompt that balances artistic vision with technical requirements.
7. **Validate output**: Does it fit ≤6 limits? (e.g., word count < 80, 80% simple words).

I will now generate the optimized prompt focusing on transforming the uploaded character image while incorporating all story elements.`;
    }

    private constructor() {
        super(
            new OpenAI({
                options: {
                    type: LLMProvider.OpenAI,
                    model: OpenAIModels["gpt-5"],
                    apiKey: process.env.OPENAI_API_KEY,
                    tools: [],
                },
            })
        )

    }

    static create() {
        return new StoryImage();
    }


    public usage ={
        type: 'usage',
        input: 0,
        output: 0
    };
    
    async generatePrompt(properties: StoryImageProperties): Promise<string> {
        this.properties = properties;
        console.log('[StoryImage Agent] Generating prompt...');
        const { response } = await this.retryApiCall(() =>  this.performTask(
            "Generate the optimized image generation prompt based on the story elements provided."
        ));

        // Collect the full response
        let fullPrompt = "";
        for await (const chunk of response) {
            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                fullPrompt += chunk.content[0].text;
            } else {
                const deltaContent = chunk.content.find(c => c.type === 'delta');
                const usageContent = chunk.content.find(c => c.type === 'usage');
                if (usageContent && usageContent.type === 'usage') {
                    this.usage.input += usageContent.input || 0;
                    this.usage.output += usageContent.output || 0;
                }
                if (deltaContent && deltaContent.type === 'delta') {
                    const delta = deltaContent as DeltaBlock;
                    if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'tool_use' || delta.stop_reason === 'end_turn') {
                        break;
                    }
                }
            }
        }

        console.log('[StoryImage Agent] Prompt generated successfully.');

        return fullPrompt.trim();
    }
}

