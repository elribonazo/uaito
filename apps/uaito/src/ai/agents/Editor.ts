import { Agent,   SearchReplaceBlock, LLMProvider } from "@uaito/sdk";

export class Editor extends Agent<LLMProvider.Anthropic> {
    protected name = "Editor";
        private fileContent!: string;
    private instructions!: string;
    private projectContext!: string;
    private memoryContext!: string;
    private fullFileContentsContext!: string;

    override get systemPrompt() {
        return `You are an AI coding agent that generates edit instructions for code files. Your task is to analyze the provided code and generate SEARCH/REPLACE blocks for necessary changes. Follow these steps:

    1. Review the entire file content to understand the context:
    $$file_content

    2. Carefully analyze the specific instructions:
    $$instructions

    3. Take into account the overall project context:
    $$project_context

    4. Consider the memory of previous edits:
    $$memory_context

    5. Consider the full context of all files in the project:
    $$full_file_contents_context

    6. Generate SEARCH/REPLACE blocks for each necessary change. Each block should:
       - Include enough context to uniquely identify the code to be changed
       - Provide the exact replacement code, maintaining correct indentation and formatting
       - Focus on specific, targeted changes rather than large, sweeping modifications

    7. Ensure that your SEARCH/REPLACE blocks:
       - Address all relevant aspects of the instructions
       - Maintain or enhance code readability and efficiency
       - Consider the overall structure and purpose of the code
       - Follow best practices and coding standards for the language
       - Maintain consistency with the project context and previous edits
       - Take into account the full context of all files in the project

    IMPORTANT: RETURN ONLY THE SEARCH/REPLACE BLOCKS. NO EXPLANATIONS OR COMMENTS.
    USE THE FOLLOWING FORMAT FOR EACH BLOCK:

    <SEARCH>
    Code to be replaced
    </SEARCH>
    <REPLACE>
    New code to insert
    </REPLACE>

    If no changes are needed, return an empty list.
`
            .replace("$$file_content", this.fileContent)
            .replace("$$instructions", this.instructions)
            .replace("$$project_context", this.projectContext)
            .replace("$$memory_context", this.memoryContext)
            .replace("$$full_file_contents_context", this.fullFileContentsContext)
    }

    override get chainOfThought() {
        return ``;
    }

    parseSearchReplaceBlocks(responseText: string): SearchReplaceBlock[] {
        const blocks: SearchReplaceBlock[] = [];
        const lines = responseText.split('\n');
        let currentBlock: { search?: string[], replace?: string[] } = {};
        let currentSection: 'search' | 'replace' | null = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '<SEARCH>') {
                currentSection = 'search';
                currentBlock.search = [];
            } else if (trimmedLine === '</SEARCH>') {
                currentSection = null;
            } else if (trimmedLine === '<REPLACE>') {
                currentSection = 'replace';
                currentBlock.replace = [];
            } else if (trimmedLine === '</REPLACE>') {
                currentSection = null;
                if (currentBlock.search && currentBlock.replace) {
                    blocks.push({
                        search: currentBlock.search.join('\n'),
                        replace: currentBlock.replace.join('\n')
                    });
                }
                currentBlock = {};
            } else if (currentSection) {
                currentBlock[currentSection]!.push(line);
            }
        }

        return blocks;
    }

    async request(
        inputPath: string,
        originalContent: string,
        instructions: string,
        projectContext: string,
        fileContents: { [name: string]: string }
    ) {
        const code_editor_files: string[] = [];
        const code_editor_memory: string[] = [];
        const memoryContext: string = code_editor_memory
            .map((mem, i) => `Memory ${i + 1}:\n${mem}`)
            .join('\n');

        const fullFileContentsContext: string = Object.entries(fileContents)
            .filter(([path, _]) => path !== inputPath || !code_editor_files.includes(path))
            .map(([path, content]) => `--- ${path} ---\n${content}`)
            .join('\n\n');

        this.fileContent = originalContent;
        this.instructions = instructions;
        this.projectContext = projectContext;
        this.memoryContext = memoryContext;
        this.fullFileContentsContext = fullFileContentsContext;

        const response = await this.performTask(
            "Generate SEARCH/REPLACE blocks for the necessary changes.",
        );
        return response;
    }



}