/**
 * @packageDocumentation 
 * UAITO AI 
 */
import type { OnTool, MessageInput, BaseLLM, ReadableStreamWithAsyncIterable, Message, ToolUseBlock } from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import type { MessageArray } from "@uaito/sdk";

/**
 * base class for AI agents.
 * @template T - The type of LLM provider.
 */
export class Agent {

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
        return this.#agent.inputs;
    }

    /**
     * Gets the tools available to the agent.
     * @returns {any[]} The tools.
     */
    public get tools() {
        if ('tools' in this.#agent.options) {
            return this.#agent.options.tools ?? [];
        }
        return [];
    }

    public get options() {
        return this.#agent.options;
    }

    public get type() {
        return this.#agent.type;
    }

    protected onTool?: OnTool

    #agent: BaseLLM<LLMProvider, any>

    /**
     * Create a new Agent instance.
     * @param {LLMProvider} type - The type of LLM provider.
     * @param {AgentTypeToOptions[T]} options - Configuration options for the LLM.
     * @param {OnTool} [onTool] - Optional callback for tool usage.
     * @param {string} [name] - Optional name for the agent.
     */
    constructor(
        agent: BaseLLM<LLMProvider, any>,
         onTool?: OnTool,
        name?: string
    ) {
        this.#agent = agent;
        this.name = name ?? this.#agent.type.toString();
        this.onTool = onTool?.bind(this)
     }

     /**
      * Adds inputs to the agent's client.
      * @param {MessageArray<MessageInput>} inputs - The inputs to add.
      * @returns {Promise<void>}
      */
     async addInputs(inputs: MessageArray<MessageInput>) {
        this.#agent.inputs = inputs;
     }

     get model() {
        return this.#agent.options.model ?? ''
     }

    /**
     * Loads the agent's client.
     * @returns {Promise<void>}
     */
    async load() {
        if ("load" in this.#agent) {
            await (this.#agent as any).load();
        }
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
                    this.#agent.log(`API call failed. Retrying in 3 seconds... (Attempt ${retries}/${this.MAX_RETRIES})`);
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
        const {cache:{tokens: usage}} = this.#agent;
        const {systemPrompt, chainOfThought} = this;
        const response = await this.#agent.performTaskStream(prompt, chainOfThought, systemPrompt);
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
            this.#agent.inputs.push({
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