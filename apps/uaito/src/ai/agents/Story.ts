import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";

export interface StoryProperties {
    storyTitle: string;
    storyDescription: string;
    characterDescription: string;
    settingBackground: string;
    mood: string;
    additionalElements?: string;
    numChapters: number;
    age: number;
}

export interface Chapter {
	title: string;
	content: string;
	image?: string;
}

export class Story extends Agent {
    protected name = "Story";
    private properties!: StoryProperties;
    private generatedPrompt!: string;
    private phase: 'prompt_generation' | 'story_generation' = 'prompt_generation';

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
    override get systemPrompt() {
        if (this.phase === 'prompt_generation') {
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
1. Expands on the story description with specific plot points for each chapter
2. Develops the character's personality, goals, and growth arc
3. Elaborates on the setting with sensory details appropriate for age ${this.properties.age}
4. Identifies age-appropriate themes and educational elements to weave in
5. Outlines the narrative structure across ${this.properties.numChapters} chapters
6. Specifies vocabulary level, sentence complexity, and pacing suitable for ${this.properties.age}-year-olds
7. Suggests recurring characters, objects, or motifs that build familiarity
8. Defines the emotional journey and what the child reader should feel/learn

**Age-Specific Guidelines for ${this.properties.age}-year-olds:**
${this.properties.age <= 7 
    ? `- Use simple, concrete language with 5-10 word sentences
- Focus on immediate, observable experiences
- Include repetition and predictable patterns
- Themes: friendship, sharing, curiosity, daily routines, simple emotions
- Educational elements: colors, numbers 1-10, basic shapes, animal sounds
- Story length: 150-300 words per chapter` 
    : `- Use richer vocabulary with 10-15 word sentences
- Introduce simple cause-and-effect relationships
- Include basic problem-solving scenarios
- Themes: cooperation, empathy, exploration, overcoming small fears, creativity
- Educational elements: simple science concepts, basic morals, social skills
- Story length: 300-500 words per chapter`}

**Response Format:**
Provide a detailed, structured story prompt that includes:
- Overall narrative arc
- Chapter-by-chapter outline with key events
- Character development notes
- Specific themes and learning objectives
- Vocabulary and complexity guidelines
- Recurring elements for continuity`;
        }

        // Phase 2: Story Generation
        return `You are an expert storyteller for children. Your task is to write a captivating and age-appropriate story based on the provided detailed prompt. Follow these guidelines to create a masterpiece:

1.  **Follow the Detailed Prompt**: The prompt you receive has been carefully crafted with all story elements, structure, themes, and age-appropriate guidelines.

2.  **Age-Appropriate Language & Complexity**: 
    *   The prompt specifies the exact vocabulary level and sentence structure needed.
    *   Maintain consistency with the age guidelines provided.

3.  **Educational Value**:
    *   Weave in the educational concepts specified in the prompt naturally.
    *   Make learning fun and seamless within the narrative.

4.  **Character Development**:
    *   **Consistency**: Keep character personalities exactly as described in the prompt.
    *   **Growth**: Show character learning and development throughout the story.
    *   **Recurring Characters**: Include supporting characters that appear across multiple chapters to build familiarity.
    *   **Dialogue**: Write natural, age-appropriate dialogue with distinct character voices.

5.  **Narrative Structure**:
    *   **Clear Arc**: Beginning establishes the world, middle develops challenges/discoveries, ending provides satisfying resolution.
    *   **Chapter Flow**: Each chapter builds on previous ones with callbacks and continuity.
    *   **Pacing**: Match the pacing guidelines in the prompt (varies by age).
    *   **Repetition**: Use gentle repetition of phrases or scenarios for younger ages.

6.  **Immersive Storytelling**:
    *   **Sensory Details**: Engage sight, sound, touch, smell, taste in age-appropriate ways.
    *   **Show, Don't Tell**: Use actions, dialogue, and descriptions rather than stating emotions.
    *   **Atmosphere**: Maintain the specified mood consistently.

7.  **Themes & Learning**:
    *   **Friendship**: Show characters helping each other and building bonds.
    *   **Problem-Solving**: Present challenges appropriate to the age level.
    *   **Emotional Intelligence**: Name emotions and show healthy ways to handle them.
    *   **Activities**: Include engaging activities that advance the plot.
    *   **Moral Lessons**: Subtle, age-appropriate life lessons embedded naturally.

8.  **Formatting**:
    *   Structure output clearly with chapter titles.
    *   Use proper paragraphing and line breaks for readability.

**IMPORTANT: Response Format**
You MUST wrap each chapter in the following XML-like tags:
<chapter>
  <title>Your Chapter Title Here</title>
  <content>
    The full content of the chapter goes here...
  </content>
</chapter>

Each chapter must be enclosed in its own \`<chapter>\` block.

**Story Prompt to Follow**:
$$story_prompt`.replace("$$story_prompt", this.generatedPrompt)
    }

    override get chainOfThought() {
        if (this.phase === 'prompt_generation') {
            return `To create an effective story prompt, I need to:

1. **Analyze Input Elements**: Review title, description, character, setting, mood, and additional elements.

2. **Age Calibration**: For ${this.properties.age}-year-olds, I need to specify:
   ${this.properties.age <= 7 
       ? `- Very simple vocabulary (common words a kindergartener knows)
   - Short sentences (5-10 words)
   - Concrete, observable experiences
   - Repetitive patterns for comfort
   - Focus on immediate emotions and actions` 
       : `- Age-appropriate vocabulary with some new words
   - Moderate sentences (10-15 words)
   - Cause-effect relationships
   - Simple problem-solving
   - Emotional awareness and social skills`}

3. **Structure ${this.properties.numChapters} Chapters**: 
   - Chapter 1: Introduction to character and world
   - Middle chapters: Progressive discoveries/challenges
   - Final chapter: Satisfying resolution with learning

4. **Educational Integration**: Identify age-appropriate concepts:
   ${this.properties.age <= 7 ? '- Counting, colors, shapes, animal sounds, sharing' : '- Simple science, social cooperation, basic morals, empathy'}

5. **Develop Recurring Elements**: Create familiarity through:
   - Catchphrases the character uses
   - Supporting characters who reappear
   - Objects or rituals that repeat
   - Predictable story patterns

6. **Emotional & Thematic Depth**: Define what children should feel and learn.

I will create a comprehensive prompt that guides the story generation phase.`;
        }

        // Phase 2: Story Generation
        return `I have a detailed story prompt to follow. I need to:

1. **Study the Prompt**: Understand all specified elements, structure, themes, and guidelines.

2. **Chapter-by-Chapter Execution**:
   - Follow the outlined plot points for each chapter
   - Maintain the specified vocabulary and sentence complexity
   - Integrate educational elements naturally
   - Use recurring characters and motifs as planned

3. **Age-Appropriate Writing**: 
   - Match the language level precisely
   - Use the emotional tone specified
   - Keep concepts concrete and relatable for the target age

4. **Character Consistency**: 
   - Main character has consistent personality and voice
   - Supporting characters are distinct and memorable
   - Dialogue reflects each character's traits

5. **Engaging Narrative Flow**:
   - Each chapter ends with anticipation for the next
   - Sensory details bring scenes to life
   - Balance action, dialogue, and description

6. **Quality Assurance**: 
   - Ensure the story is complete and satisfying
   - Check that all chapters connect logically
   - Verify age-appropriateness throughout

I will write the story following the detailed prompt, ensuring it's engaging, educational, and perfectly suited for the target age.`;
    }

    /**
     * Phase 1: Generate a detailed story prompt from properties
     */
    private async generateStoryPrompt(properties: StoryProperties): Promise<string> {
        this.properties = properties;
        this.phase = 'prompt_generation';

        console.log('[Story Agent] Phase 1: Generating story prompt...');
        const { response } = await this.performTask(
            "Create a comprehensive, detailed story prompt based on the provided story elements."
        );

        // Collect the full prompt
        let fullPrompt = "";
        let promptChunkCount = 0;
        for await (const chunk of response) {
            promptChunkCount++;
            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                fullPrompt += chunk.content[0].text;
            } else if (chunk.type === 'delta') {
                const deltaContent = chunk.content.find(c => c.type === 'delta');
                if (deltaContent && deltaContent.type === 'delta') {
                    const delta = deltaContent as DeltaBlock;
                    if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'tool_use' || delta.stop_reason === 'end_turn') {
                        console.log(`[Story Agent] Phase 1 completed after ${promptChunkCount} chunks`);
                        break;
                    }
                }
            }
        }

        console.log(`[Story Agent] Phase 1 done. Generated prompt length: ${fullPrompt.length}`);
        return fullPrompt.trim();
    }

    /**
     * Phase 2: Generate the actual story from the detailed prompt
     */
    private async generateStoryFromPrompt(prompt: string) {
        this.generatedPrompt = prompt;
        this.phase = 'story_generation';

        console.log('[Story Agent] Phase 2: Generating actual story...');
        const response = await this.performTask(
            "Write the complete story following the detailed prompt provided."
        );

        console.log('[Story Agent] Phase 2 response received');
        return response;
    }

    /**
     * Main entry point: Generate story from properties
     */
    async generate(properties: StoryProperties): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        const detailedPrompt = await this.retryApiCall(() => this.generateStoryPrompt(properties));
        const {response} = await this.retryApiCall(() => this.generateStoryFromPrompt(detailedPrompt));

        // Parse story chapters
        let storyBuffer = "";
        let chunkCount = 0;

        for await (const chunk of response) {
            chunkCount++;					
            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                storyBuffer += chunk.content[0].text;
            } else if (chunk.type === 'delta') {
                const deltaContent = chunk.content.find(c => c.type === 'delta');
                if (deltaContent && deltaContent.type === 'delta') {
                    const delta = deltaContent as DeltaBlock;
                    console.log(`Delta stop_reason: ${delta.stop_reason}`);
                    if (delta.stop_reason === 'stop_sequence' || delta.stop_reason === 'tool_use' || delta.stop_reason === 'end_turn') {
                        console.log('Story generation completed');
                        break;
                    }
                }
            }
        }

        console.log(`Total story chunks received: ${chunkCount}`);
        console.log(`Story buffer length: ${storyBuffer.length}`);
        
        if (storyBuffer.length === 0) {
            throw new Error('Story generation produced no content');
        }

        const openTag = "<chapter>";
		const closeTag = "</chapter>";
		let currentIndex = 0;

		while (true) {
			const openIndex = storyBuffer.indexOf(openTag, currentIndex);
			if (openIndex === -1) break;

			const closeIndex = storyBuffer.indexOf(closeTag, openIndex);
			if (closeIndex === -1) break;

			const chapterContent = storyBuffer.substring(openIndex, closeIndex + closeTag.length);
			const titleMatch = chapterContent.match(/<title>(.*?)<\/title>/s);
			const contentMatch = chapterContent.match(/<content>(.*?)<\/content>/s);

			if (titleMatch && contentMatch) {
				chapters.push({
					title: titleMatch[1].trim(),
					content: contentMatch[1].trim(),
				});
			}

			currentIndex = closeIndex + closeTag.length;
		}

		console.log(`Generated ${chapters.length} chapters`);
		
		if (chapters.length === 0) {
			throw new Error('No chapters were extracted from the story. Check story format.');
		}

        return chapters;
    }
}
