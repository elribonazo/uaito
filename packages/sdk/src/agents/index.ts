import { OnTool, MessageInput, BaseLLMOptions, ReadableStreamWithAsyncIterable } from "@/domain/types";
import { Message, ToolUseBlock } from "@/domain/types";
import { MessageArray } from "../utils";
import { BaseLLM } from "@/domain/BaseLLM";
import { LLMProvider, AgentTypeToClass, AgentTypeToOptions } from "@/types";



/**
 * base class for AI agents.
 * @template T - The type of LLM provider.
 */
export class Agent<T extends LLMProvider> {
    /**
     * The maximum number of retries for an API call.
     * @type {number}
     */
    private MAX_RETRIES = 10;
    /**
     * The delay in milliseconds between retries for an API call.
     * @type {number}
     */
    private RETRY_DELAY = 3000; // 3 seconds
    /**
     * The client instance for the LLM provider.
     * @type {AgentTypeToClass[T]}
     */
    #client!: AgentTypeToClass[T];
    /**
     * The name of the agent.
     * @type {string}
     */
    protected name: string;

    
    /**
     * The system prompt for the agent.
     * @type {string}
     */
    private _systemPrompt: string = '';
    /**
     * The chain of thought for the agent.
     * @type {string}
     */
    private _chainOfThought: string = '';

    /**
     * Gets the system prompt for the agent.
     * @returns {string} The system prompt.
     */
    public get systemPrompt() {
        return this._systemPrompt;
    }

    /**
     * Gets the chain of thought for the agent.
     * @returns {string} The chain of thought.
     */
    public get chainOfThought() {
        return this._chainOfThought;
    }

    /**
     * Gets the inputs for the agent.
     * @returns {MessageArray<MessageInput>} The inputs.
     */
    public get inputs() {
        return this.#client.inputs;
    }


    /**
     * Gets the tools available to the agent.
     * @returns {any[]} The tools.
     */
    public get tools() {
        if ('tools' in this.options) {
            return this.options.tools ?? [];
        }
        return [];
    }

    /**
     * Create a new Agent instance.
     * @param {LLMProvider} type - The type of LLM provider.
     * @param {AgentTypeToOptions[T]} options - Configuration options for the LLM.
     * @param {OnTool} [onTool] - Optional callback for tool usage.
     * @param {string} [name] - Optional name for the agent.
     */
    constructor(
        public type: LLMProvider,
        protected options: AgentTypeToOptions[T],
        protected onTool?: OnTool,
        name?: string
    ) {
        this.name = name ?? this.type.toString();
     }

     /**
      * Adds inputs to the agent's client.
      * @param {MessageArray<MessageInput>} inputs - The inputs to add.
      * @returns {Promise<void>}
      */
     async addInputs(inputs: MessageArray<MessageInput>) {
        await this.getClient();
        this.#client.inputs = inputs;
     }

    /**
     * Loads the agent's client.
     * @returns {Promise<void>}
     */
    async load() {
        await this.getClient();
        if ("load" in this.#client) {
            await this.#client.load();
        }
    }

    /**
     * Loads the client for the LLM provider.
     * @private
     * @param {new ({ options }: { options: AgentTypeToOptions[LLMProvider] }, onTool?: OnTool) => BaseLLM<LLMProvider, BaseLLMOptions>} Client - The client class to instantiate.
     * @returns {Promise<AgentTypeToClass[T]>} The loaded client.
     */
    private async loadClient(Client:new ({ options }: {options:AgentTypeToOptions[LLMProvider]}, onTool?: OnTool) => BaseLLM<LLMProvider, BaseLLMOptions>): Promise<AgentTypeToClass[T]> {
        this.#client ??= new Client({ options: this.options}, this.onTool?.bind(this)) as AgentTypeToClass[T];
        return this.#client;
    }

    /**
     * Gets the client for the LLM provider.
     * @private
     * @returns {Promise<BaseLLM<any, BaseLLMOptions>>} The client.
     */
    private async getClient(): Promise<BaseLLM<any, BaseLLMOptions>> {
        let client: new ({ options }: {options:AgentTypeToOptions[LLMProvider]}, onTool?: OnTool) => BaseLLM<LLMProvider, BaseLLMOptions>;
        if (this.type === LLMProvider.Anthropic) {
            client = (await import("../llm/anthropic/Anthropic")).Anthropic;
        } else if (this.type === LLMProvider.OpenAI) {
            client = (await import("../llm/openai/Openai")).OpenAI;
        } else if (this.type === LLMProvider.Local) {
            client = (await import("../llm/huggingface/HuggingFaceONNX")).HuggingFaceONNX;
        } else if (this.type === LLMProvider.LocalImage) {
            client = (await import("../llm/huggingface/HuggingFaceONNXImage")).HuggingFaceONNXTextToImage;
        } else if (this.type === LLMProvider.LocalAudio) {
            client = (await import("../llm/huggingface/HuggingFaceONNXAudio")).HuggingFaceONNXTextToAudio;
        } else {
            throw new Error("not implemented")
        }
        return this.loadClient(client);
    }

    /**
     * Retries an API call with a delay.
     * @template T
     * @param {() => Promise<T>} apiCall - The API call to retry.
     * @returns {Promise<T>} The result of the API call.
     */
    async retryApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
        let retries = 0;
        while (retries < this.MAX_RETRIES) {
            try {
                return await apiCall();
            } catch (error) {
                if (error instanceof Error && error.message.includes('APIConnectionError')) {
                    retries++;
                    this.#client.log(`API call failed. Retrying in 3 seconds... (Attempt ${retries}/${this.MAX_RETRIES})`);
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
     * @param {string} prompt - The user prompt.
     * @returns {Promise<{ usage: { input: number, output: number }, response: ReadableStreamWithAsyncIterable<Message> }>} A Promise resolving to the usage and response stream.
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
     * @param {ToolUseBlock} toolUse - The tool being used.
     * @param {(agent: any) => Promise<void>} run - Function to run the command.
     * @returns {Promise<void>}
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
            this.#client.inputs.push({
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