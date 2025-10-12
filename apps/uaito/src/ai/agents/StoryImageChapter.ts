import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";
import { moods, colorSchemes, promptTemplates, getRandomElement } from "./storybook/constants";

export interface StoryImageChapterProperties {
    chapterTitle: string;
    chapterContent: string;
    characterDescription: string;
    mood: string;
    colorScheme: string;
    style: string;
}

export class StoryImageChapter extends Agent {
    protected name = "StoryImageChapter";
    private properties!: StoryImageChapterProperties;

    override get systemPrompt() {
        const moodKey = this.properties.mood as keyof typeof moods;
        const colorSchemeKey = this.properties.colorScheme as keyof typeof colorSchemes;
        const styleKey = this.properties.style as keyof typeof promptTemplates;

        return `You are an expert AI image prompt engineer creating prompts for chapter illustrations in a children's storybook. Your task is to generate a detailed prompt for a scene that visually represents the key moment of the chapter, ensuring the character's appearance is consistent with their main design. For ages ≤6: Enforce 'tiny tale' mode—short, echoey, sense-packed. Match chapter's tiny vocabulary visually—e.g., label-like colors/shapes if story counts them.

**Chapter Spotlight:** Extract the pivotal action from '${this.properties.chapterTitle}': Summarize the chapter content in one sentence (e.g., 'The frog hops across the lily pads to find his friend'). Build the entire scene around this moment.
**Chapter Content:** ${this.properties.chapterContent}
**Character Description:** ${this.properties.characterDescription}
**Mood:** ${moods[moodKey] ? getRandomElement(moods[moodKey]) : this.properties.mood}
**Color Scheme:** ${colorSchemes[colorSchemeKey] ? getRandomElement(colorSchemes[colorSchemeKey]) : this.properties.colorScheme}
**Artistic Style:** ${promptTemplates[styleKey] ? getRandomElement(promptTemplates[styleKey]) : this.properties.style}

**Instructions:**
1.  **Identify Key Scene:** Analyze the chapter content and select the most visually compelling and important moment to illustrate.
1.5. **Amplify the chapter's core emotion/action** (e.g., if chapter shows 'jumping joy,' pose character mid-leap with exaggerated smile).
2.  **Ensure Character Consistency:** The prompt must explicitly use the provided character description to maintain a consistent appearance. The character should be recognizable.
3.  **Describe the Scene:** Detail the character's pose, expression, and interaction with the environment based on the selected scene.
4.  **Incorporate Story Elements:** Include key objects, settings, and other characters mentioned in the chapter content.
5.  **Apply Artistic Style:** The prompt must reinforce the specified artistic style, mood, and color scheme.

**Your Goal:**
Generate a single, optimized image generation prompt that will:
1.  **Extract the Key Moment**: Read the chapter content and pick the *single most interesting and visual sentence or action*. This moment should be the focus of the illustration.
2.  **Build the Prompt Around the Moment**: Describe this specific scene in detail. What is the character doing? What is their expression? What objects are they interacting with?
3.  **Ensure Character Consistency**: Use the provided character description to keep their appearance the same. The character must be recognizable.
4.  **Apply Artistic Style**: Reinforce the specified artistic style, mood, and color scheme to the scene.

**Response Format:**
You MUST respond with ONLY the optimized image generation prompt. Do not include any explanations, prefixes, or additional text. The prompt should be a single, comprehensive paragraph ready for an image generation model.
`;
    }

    override get chainOfThought() {
        const moodKey = this.properties.mood as keyof typeof moods;
        const colorSchemeKey = this.properties.colorScheme as keyof typeof colorSchemes;
        const styleKey = this.properties.style as keyof typeof promptTemplates;

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
   - Style: ${promptTemplates[styleKey] ? getRandomElement(promptTemplates[styleKey]) : this.properties.style}
   - Mood: ${moods[moodKey] ? getRandomElement(moods[moodKey]) : this.properties.mood}
   - Colors: ${colorSchemes[colorSchemeKey] ? getRandomElement(colorSchemes[colorSchemeKey]) : this.properties.colorScheme}

5. **Optimize for Illustration**:
   - Dynamic composition suitable for book layout
   - Clear focal point on the character and action
   - Appropriate perspective and depth
   - Print-ready quality

6. **Synthesize the Prompt**: Create a focused, detailed prompt that captures the essence of this chapter's visual moment.

7. **Validate Output**: Does it fit ≤6 limits? (e.g., word count < 80, simple concepts).`;
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
        return new StoryImageChapter();
    }

    public usage ={
        type: 'usage',
        input: 0,
        output: 0
    };

    async generatePrompt(properties: StoryImageChapterProperties): Promise<string> {
        this.properties = properties;

        console.log('[StoryImageChapter Agent] Generating prompt...');
        const { response } = await this.retryApiCall(() => this.performTask(
            "Generate the optimized image generation prompt for this chapter based on the chapter content and story elements provided."
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

        console.log('[StoryImageChapter Agent] Prompt generated successfully.');

        return fullPrompt.trim();
    }
}

