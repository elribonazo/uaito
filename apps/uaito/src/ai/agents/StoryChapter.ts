import { Agent } from "@uaito/ai";
import { OpenAI, OpenAIModels } from "@uaito/openai";
import { LLMProvider, type DeltaBlock } from "@uaito/sdk";

export interface Chapter {
    title: string;
    content: string;
    image?: string;
}

export interface StoryChapterProperties {
    age: number;
    detailedPrompt: string;
    chapterNumber: number;
    previousChapters: Chapter[];
}

export class StoryChapter extends Agent {
    protected name = "StoryChapter";
    properties!: StoryChapterProperties;

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
        return new StoryChapter();
    }

    public usage = {
        type: 'usage',
        input: 0,
        output: 0
    };

    override get systemPrompt() {
        const previousChaptersContent = this.properties.previousChapters
            .map(c => `<chapter><title>${c.title}</title><content>${c.content}</content></chapter>`)
            .join('\n\n');

        return `You are an expert storyteller for children. Your task is to write a captivating and age-appropriate story based on the provided detailed prompt. Follow these guidelines strictly:

**1. Follow the Detailed Prompt**: The prompt you receive has all story elements, structure, themes, and age-appropriate guidelines. Adhere to it precisely.

**2. Age-Appropriate Language & Complexity (Strict Rules)**: 
  *   **Words**: Use simple, common words for the age range provided. Avoid complex words unless absolutely necessary.
  *   **Sentences**: Write short sentences, mostly under 10 words. Vary sentence length to create a nice rhythm.
  *   **Length**: Each chapter MUST be under 100 words.

**3. Narrative and Character**:
  *   Follow the chapter-by-chapter outline for plot points.
  *   Keep character personalities consistent as described in the prompt.
  *   Write natural, simple dialogue.

**4. Formatting**:
  *   Structure output clearly with chapter titles.
  *   Use proper paragraphing for readability.

**IMPORTANT: Response Format**
You MUST wrap each chapter in the following XML-like tags:
<chapter>
<title>Your Chapter Title Here</title>
<content>
  The full content of the chapter goes here...
</content>
</chapter>

**Story Prompt to Follow**:
${this.properties.detailedPrompt}

**Previously Generated Chapters**:
${previousChaptersContent || 'None - this is the first chapter.'}

**Your Task**:
Write ONLY chapter number ${this.properties.chapterNumber}.
`;
    }

    override get chainOfThought() {
        return `The following set of rules and requirements are strictly enforced to generate a proper chapter.
1.  **Follow the Prompt Exactly**: Adhere to all plot points, themes, and guidelines.
2.  **Chapter-by-Chapter Execution**:
    *   Write each chapter based on its outline.
    *   **Strictly enforce age-appropriate language**: 90% simple words, and short, varied-length sentences (mostly under 10/15 words).
    *   **Strictly enforce length**: Each chapter must be under 100 words.
3.  **Character Consistency**: Maintain the character's personality and simple voice.
4.  **Final Quality Check**: Ensure the story is complete, follows all rules, and is perfect for a young child.

I will write the story following these rules to make it engaging and easy to understand.`;
    }

    async generate(properties: StoryChapterProperties): Promise<Chapter | null> {
        this.properties = properties;

        console.log(`[StoryChapter Agent] Generating chapter ${properties.chapterNumber}...`);

        const { response } = await this.retryApiCall(
            () => this.performTask(
                "Write the next chapter following the detailed prompt and previous chapters provided."
            )
        )

        let storyBuffer = "";
        for await (const chunk of response) {
            if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
                storyBuffer += chunk.content[0].text;
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

        if (storyBuffer.length === 0) {
            console.error('Chapter generation produced no content');
            return null;
        }

        const openTag = "<chapter>";
        const closeTag = "</chapter>";
        const openIndex = storyBuffer.indexOf(openTag);
        const closeIndex = storyBuffer.indexOf(closeTag, openIndex);

        if (openIndex === -1 || closeIndex === -1) {
            console.error('Could not find chapter tags in the response');
            return null;
        }

        const chapterContent = storyBuffer.substring(openIndex, closeIndex + closeTag.length);
        const titleMatch = chapterContent.match(/<title>(.*?)<\/title>/s);
        const contentMatch = chapterContent.match(/<content>(.*?)<\/content>/s);

        if (titleMatch && contentMatch) {
            console.log(`[StoryChapter Agent] Chapter ${properties.chapterNumber} generated successfully.`);
            return {
                title: titleMatch[1].trim(),
                content: contentMatch[1].trim(),
            };
        }

        return null;
    }
}

