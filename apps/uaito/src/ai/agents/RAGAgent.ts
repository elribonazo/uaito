import { Agent } from "@uaito/ai";
import { BaseLLM, LLMProvider, MessageArray, MessageInput } from "@uaito/sdk";
import { OpenAI, OpenAIOptions } from "@uaito/openai";
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = util.promisify(exec);

export interface RAGAgentOptions {
    agentRole?: string;
    projectName?: string;
    projectImportPath?: string;
    repoUrl?: string;
    repomixInclude?: string;
    repomixIgnore?: string;
}

export class RAGAgent extends Agent {
    protected name = "RAGAgent";
    private context: string;
    private agentRole: string;
    private projectName: string;
    private projectImportPath: string;

    override get systemPrompt() {
        return `You are a ${this.agentRole} that answers questions about ${this.projectName}.

        1. Analyze the user's question.
        2. Scrutinize the provided context(repository) to find the relevant information.
        3. Formulate an answer based solely on the information found in the context.
        4. If no relevant information is found, explicitly state that the answer is not in the context.
        
        CONTEXT:
        ---
        ${this.context}
        ---
        
        REQUIREMENTS: 
        -- You must show good code comments, starting with \`\`\`typescript\`\`\` or \`\`\`javascript\`\`\`;
        -- You must provide well defined and spaced responses to the user question
        -- You must provide a clear and concise answer to the user question
        -- \r\n\r\n Context package is published under ${this.projectImportPath}, when writing code make sure you provide the updated import paths.
        
        RESPONSE FORMAT:
        -- Add break lines \r\n\r\n before each new section or answer.
        -- If you introduce new code, please make sure to space it properly with \r\n\r\n.
        -- Provide well structured and developer oriented answers.
        `
    }

    override get chainOfThought() {
        return `Answer the user's question based on the context above. If the context doesn't contain the answer, state that you don't have enough information. Do not use any external knowledge.`;
    }

    private constructor(
      llm: BaseLLM<LLMProvider.OpenAI, OpenAIOptions<LLMProvider.OpenAI>>,
      context: string,
      options: RAGAgentOptions
    ) {
      super(llm);
      this.context = context;
      this.agentRole = options.agentRole || 'Senior software engineer';
      this.projectName = options.projectName || 'a project';
      this.projectImportPath = options.projectImportPath || 'the project';
    }

    static async create(
        llmOptions: OpenAIOptions<LLMProvider.OpenAI>,
        inputs: MessageArray<MessageInput>,
        ragOptions: RAGAgentOptions
    ) {
        const repoUrl = ragOptions.repoUrl || process.env.RAG_CLONE_URL;
        if (!repoUrl) {
            throw new Error("repoUrl is required in RAGAgentOptions or as RAG_CLONE_URL env var.");
        }

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'uaito-rag-'));
        let context = '';
        try {
            await execAsync(`git clone ${repoUrl} ${tempDir}`);

            const repomixOutputPath = path.join(process.cwd(), 'temp', 'llm.txt');
            await fs.mkdir(path.dirname(repomixOutputPath), { recursive: true });
            
            const include = ragOptions.repomixInclude || '**/*';
            const ignore = ragOptions.repomixIgnore || '';
            await execAsync(`npx repomix ${tempDir} -o ${repomixOutputPath} --include="${include}" --ignore="${ignore}"`);

            context = await fs.readFile(repomixOutputPath, 'utf-8');
        } finally {
            await fs.rm(tempDir, { recursive: true, force: true });
        }
        
        const llm = new OpenAI<LLMProvider.OpenAI>({ options:llmOptions });
        const instance = new RAGAgent(llm, context, ragOptions);
        await instance.addInputs(inputs);
        return instance;
    }
}
