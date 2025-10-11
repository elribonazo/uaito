import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";

export interface StoryPromptProperties {
    name: string;
    gender: string;
    likes: string;
    age: number;
    numChapters: number;
    mood: string;
    storyTitle: string;
    storyDescription: string;
    characterDescription: string;
    settingBackground: string;
    additionalElements?: string;
}

export class StoryPrompt extends Agent {
    protected name = "StoryPrompt";
    properties!: StoryPromptProperties;

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
        return new StoryPrompt();
    }

    public usage = {
        type: 'usage',
        input: 0,
        output: 0
    };

    override get systemPrompt() {
        return `You are an expert story planning assistant for children's books. Your task is to analyze the provided story elements and create a comprehensive, detailed story prompt that will guide the creation of an engaging, age-appropriate story.

**Story Elements:**
- Title: ${this.properties.storyTitle}
- Description: ${this.properties.storyDescription}
- Main Character: ${this.properties.characterDescription}
- Setting: ${this.properties.settingBackground}
- Mood: ${this.properties.mood}
${this.properties.additionalElements ? `- Additional Elements: ${this.properties.additionalElements}` : ''}
- Number of Chapters: ${this.properties.numChapters}
- Target Age: ${this.properties.age} years old

**Your Goal:**
Create a comprehensive story prompt that:
1. Expands on the story description with specific plot points for each chapter.
2. Develops the character's personality, goals, and growth arc.
3. Elaborates on the setting with sensory details (1 per scene, e.g., touch: "warm side," sound: "drip, drip").
4. Identifies age-appropriate themes and educational elements to weave in.
5. Outlines the narrative structure across ${this.properties.numChapters} chapters.
6. Specifies vocabulary level, sentence complexity, and pacing suitable for ${this.properties.age}-year-olds.
7. Suggests recurring characters, objects, or motifs that build familiarity.
8. Defines the emotional journey and what the child reader should feel/learn.

**Age-Specific Guidelines for ${this.properties.age}-year-olds (Tiny Tales Mode):**
${this.properties.age <= 7 
  ? `- **Words**: Use only common, easy words kids know (e.g., bed, run, big, small, happy, count, friend, glow, help, one/two/three). At least 90% simple words (no words over 2 syllables unless it's 'dinosaur'). Swap fancy words: "pulsed" → "lit up", "whimpered" → "cried", "talisman" → "special stone".
- **Sentences**: Keep them short, mostly under 10/15 words, but vary the length to create a nice rhythm.
- **Length**: Under 70 words per chapter.
- **Themes**: Ideate the perfect scenario for each chapter, set a theme specific for each section but keeping the overall story consistent.` 
  : `- Use richer vocabulary with 10-15 word sentences
- Introduce simple cause-and-effect relationships
- Include basic problem-solving scenarios
- Themes: cooperation, empathy, exploration, overcoming small fears, creativity
- Educational elements: simple science concepts, basic morals, social skills
- Story length: 300-500 words per chapter`}

**Response Format:**
Provide a detailed, structured story prompt that includes all the sections mentioned in 'Your Goal'.`;
    }

    override get chainOfThought() {
        return `To create an effective story prompt, I need to:

1. **Analyze Input Elements**: Review title, description, character, setting, mood, and additional elements.

2. **Age Calibration**: For ${this.properties.age}-year-olds, I must apply "Tiny Tales Mode":
 ${this.properties.age <= 7 
     ? `- **Words**: 90% simple, common words. Swap complex words (e.g., 'talisman' -> 'special stone').
 - **Sentences**: Mostly under 10 words, with varied length for rhythm.
 - **Length**: Under 70 words per chapter.
 - **Themes**: Friends, counting, colors, simple magic.`
     : `- Age-appropriate vocabulary with some new words
 - Moderate sentences (10-15 words)
 - Cause-effect relationships
 - Simple problem-solving
 - Emotional awareness and social skills`}

3. **Structure ${this.properties.numChapters} Chapters**: 
 - Chapter 1: Introduction
 - Middle chapters: Adventure/Challenge
 - Final chapter: Resolution and lesson

4. **Add Sensory Details**: Include one simple sensory detail per scene (e.g., touch, sound).

I will create a comprehensive prompt that guides the story generation phase with these strict rules.`;
    }

    async generate(properties: StoryPromptProperties): Promise<string> {
        this.properties = properties;

        console.log('[StoryPrompt Agent] Generating story prompt...');

        const { response } = await this.retryApiCall(
            () => this.performTask(
                "Create a comprehensive, detailed story prompt based on the provided story elements."
            )
        );

        // Collect the full prompt
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

        console.log('[StoryPrompt Agent] Story prompt generated successfully.');

        return fullPrompt.trim();
    }
}

