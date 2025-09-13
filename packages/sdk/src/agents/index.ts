import { MessageInput, BaseLLMOptions, AnthropicOptions, Message, OnTool, AgentTypeToOptions, LLMProvider, Tool, OpenAIOptions, AgentTypeToClass, HuggingFaceONNXOptions, ToolUseBlock, ReadableStreamWithAsyncIterable } from "../types";
import { BaseLLM } from "../llm/Base";
import { MessageArray } from "../utils";

export const LOG_ANSI_RED = "\u001B[31m";
export const LOG_ANSI_GREEN = "\u001B[32m";
export const LOG_ANSI_GRAY = "\u001B[90m";
export const LOG_ANSI_BLUE = "\u001B[34m";
export const LOG_ANSI_RESET = "\u001B[0m";
export const LOG_ANSI_YELLOW = "\u001B[33m";


/**
 * base class for AI agents.
 */
export class Agent<T extends LLMProvider> {
    private MAX_RETRIES = 10;
    private RETRY_DELAY = 3000; // 3 seconds
    public client!: AgentTypeToClass[T];
    protected name: string;

    
    private _systemPrompt: string = '';
    private _chainOfThought: string = '';

    public get systemPrompt() {
        return this._systemPrompt;
    }

    public get chainOfThought() {
        return this._chainOfThought;
    }

    public get tools() {
        return this.options.tools ?? [];
    }


    
    /**
     * Log a message with the agent's color and name.
     * @param message - The message to log.
     */
    log(message: string) {
        console.log(`${this.color}[${this.name}] ${message}${LOG_ANSI_RESET}`);
    }

    /**
     * Create a new Agent instance.
     * @param type - The type of LLM provider.
     * @param options - Configuration options for the LLM.
     */
    constructor(
        public type: LLMProvider,
        protected options: AgentTypeToOptions[typeof type],
        protected onTool?: OnTool,
        protected color: string = LOG_ANSI_BLUE,
        name?: string
    ) {
        this.name = name ?? this.type.toString();
     }

     async addInputs(inputs: MessageArray<MessageInput>) {
        await this.getClient();
        this.client.inputs = inputs;
     }

    get data() {
        return this.client?.data ?? {};
    }

    async load() {
        await this.getClient();
        if ("load" in this.client) {
            await this.client.load();
        }
    }

    clear() {
        this.client.inputs.length = 0;
    }

    private async getClient(): Promise<BaseLLM<any, BaseLLMOptions>> {
        let client: new ({ options }: {options:AgentTypeToOptions[LLMProvider]}, onTool?: OnTool) => BaseLLM<LLMProvider, BaseLLMOptions>;
        if (this.type === LLMProvider.Anthropic) {
            client = (await import("../llm/Anthropic")).Anthropic;
        } else if (this.type === LLMProvider.OpenAI) {
            client = (await import("../llm/Openai")).OpenAI;
        } else if (this.type === LLMProvider.HuggingFaceONNX) {
            client = (await import("../llm/HuggingFaceONNX")).HuggingFaceONNX;
        } else {
            throw new Error("not implemented")
        }
        this.client = new client({ options: this.options}, this.onTool?.bind(this)) as AgentTypeToClass[T];
        this.client.log = this.log.bind(this);
        return this.client;
    }

    async retryApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
        let retries = 0;
        while (retries < this.MAX_RETRIES) {
            try {
                return await apiCall();
            } catch (error) {
                if (error instanceof Error && error.message.includes('APIConnectionError')) {
                    retries++;
                    this.log(`API call failed. Retrying in 3 seconds... (Attempt ${retries}/${this.MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
                } else {
                    throw error; // Rethrow if it's not a connection error
                }
            }
        }
        throw new Error(`Max retries (${this.MAX_RETRIES}) reached. Unable to complete the API call.`);
    }

    /**
     * Perform a task using the LLM.
     * @param prompt - The user prompt.
     * @param stream - Whether to stream the response.
     * @returns A Promise resolving to either a ReadableStream of Messages or a single Message.
     */
    async performTask(
        prompt: string,
    ): Promise<{
        usage: { input: number, output: number },
        response: ReadableStreamWithAsyncIterable<Message>
    }> {
        const client = await this.getClient();
        const {cache:{tokens: usage}} = client;
        const {systemPrompt, chainOfThought} = this;
        const response = await client.performTaskStream(prompt, chainOfThought, systemPrompt);
        return {  usage,    response  }
    }

    /**
     * Run a command safely, catching and handling any errors.
     * @param tool - The tool being used.
     * @param input - Array of input messages.
     * @param run - Function to run the command.
     */
    async runSafeCommand(
        toolUse: ToolUseBlock,
        run: (agent: any) => Promise<void>
    ) {
        if (toolUse.type !== "tool_use") {
            throw new Error("Expected ToolUseBlock content inside tool_use type message")
        }
        try {
            await run(this);
        } catch (err) {
            const error = (err as Error);
            console.log(err);
            this.client.inputs.push({
                role: 'user',
                content: [
                    {
                        name: toolUse.name,
                        type: 'tool_result',
                        tool_use_id: toolUse.id,
                        isError: true,
                        content: [{
                            type: 'text',
                            text: `An error occurred while running ${toolUse.name}: we got error -> ${error.message}`
                        }]

                    }
                ]
            })
        }
    }
}