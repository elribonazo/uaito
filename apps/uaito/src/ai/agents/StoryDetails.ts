import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";

export interface StoryInputProperties {
    name: string;
    gender: string;
    likes: string; // comma-separated keywords
    age: number;
    numChapters: number;
    mood: string;
}

export interface GeneratedStoryDetails {
    storyTitle: string;
    storyDescription: string;
    characterDescription: string;
    settingBackground: string;
    additionalElements?: string;
}

export class StoryDetails extends Agent {
    protected name = "StoryDetails";
    properties!: StoryInputProperties;

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
        return new StoryDetails();
    }

    public usage = {
        type: 'usage',
        input: 0,
        output: 0
    };

    override get systemPrompt() {
        const { name, gender, likes, age, mood } = this.properties;
        return `You are a creative assistant that generates story ideas for children's books. Based on the following user preferences, create a compelling story concept.
**User Preferences:**
- Child's Name: ${name}
- Child's Gender: ${gender}
- Child Likes: ${likes}
- Target Age: ${age} years old
- Mood: ${mood}

**Your Task:**
Generate a JSON object with the following fields:
- \`storyTitle\`: A catchy and imaginative title for the story.
- \`storyDescription\`: A simple summary of the story's plot, suitable for a ${age}-year-old. Use simple words and short sentences (under 100 words).
- \`characterDescription\`: A description of the main character, incorporating their name, gender, and interests and story context, theme.
- \`settingBackground\`: A vivid description of the story's setting.
- \`additionalElements\`: Any extra elements of interest that interact with the story, quests, or characters, items.

**Response Format:**
You MUST respond with ONLY the generated JSON object. Do not include any explanations or other text.
`;
    }

    override get chainOfThought() {
        return "";
    }

    async generate(properties: StoryInputProperties): Promise<GeneratedStoryDetails> {
        this.properties = properties;

        console.log('[StoryDetails Agent] Generating story details...');
        const { response } = await this.retryApiCall(
            () => this.performTask(
                "Generate story details based on the user's preferences."
            )
        )

        let detailsJson = "";
        for await (const chunk of response) {
            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                detailsJson += chunk.content[0].text;
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

        try {
            // Clean the JSON string before parsing
            const cleanedJson = detailsJson.replace(/```json\n|```/g, '').trim();
            const parsedDetails = JSON.parse(cleanedJson);
            console.log('[StoryDetails Agent] Story details generated successfully.');

            return parsedDetails;
        } catch (error) {
            console.error('Failed to parse story details JSON:', error);
            throw new Error('Could not generate story details.');
        }
    }
}

