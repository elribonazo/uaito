/**
 * @packageDocumentation 
 * UAITO AI 
 */
import { OnTool, MessageInput, BaseLLM, ReadableStreamWithAsyncIterable, Message, ToolUseBlock, BlockType } from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import type { MessageArray } from "@uaito/sdk";

/**
 * Represents a higher-level abstraction for an AI agent. It encapsulates a `BaseLLM` instance
 * and provides a structured way to manage prompts, tools, and conversation history. This class
 * simplifies the process of performing tasks with an LLM by handling the underlying details of
 * API calls, retries, and stream processing.
 *
 * @example
 * ```typescript
 * // Assuming `myCustomLLM` is an instance of a class that extends `BaseLLM`
 * const agent = new Agent(myCustomLLM);
 * await agent.load();
 * const { response } = await agent.performTask("Tell me a joke.");
 * for await (const chunk of response) {
 *   // Process each message chunk from the stream
 * }
 * ```
 */
export class Agent {

    /**
     * The maximum number of times to retry an API call in case of connection errors.
     * @type {number}
     */
    private MAX_RETRIES = 10;
    /**
     * The delay in milliseconds between retries for an API call.
     * @type {number}
     */
    private RETRY_DELAY = 3000; // 3 seconds
    /**
     * The name of the agent, used for identification and logging.
     * @type {string}
     */
    protected name: string;
    
    /**
     * The system prompt that defines the agent's persona, context, and instructions.
     * @type {string}
     */
    private _systemPrompt: string = '';
    /**
     * The chain of thought or reasoning steps for the agent to follow when performing a task.
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
     * Gets the message history (inputs) for the agent's conversation.
     * @returns {MessageArray<MessageInput>} The inputs.
     */
    public get inputs() {
        return this.#agent.inputs;
    }

    public get cache() {
        return this.#agent.cache;
    }

    /**
     * Gets the list of tools available to the agent.
     * @returns {any[]} The tools.
     */
    public get tools() {
        if ('tools' in (this.#agent.options as { tools?: unknown[] })) {
            return (this.#agent.options as { tools?: any[] }).tools ?? [];
        }
        return [];
    }

    /**
     * Gets the configuration options of the underlying LLM.
     * @returns {any} The options.
     */
    public get options() {
        return this.#agent.options;
    }

    /**
     * Gets the provider type of the underlying LLM (e.g., OpenAI, Anthropic).
     * @returns {LLMProvider} The provider type.
     */
    public get type() {
        return this.#agent.type;
    }

    /**
     * An optional callback function that is triggered when a tool is used.
     * The `this` context within the callback is bound to the `Agent` instance.
     * @protected
     * @type {OnTool | undefined}
     */
    protected onTool?: OnTool

    #agent: BaseLLM<LLMProvider, unknown>

    /**
     * Creates a new `Agent` instance.
     * @param {BaseLLM<LLMProvider, any>} agent - An instance of a class that extends `BaseLLM`. This is the core LLM that the agent will use.
     * @param {OnTool} [onTool] - An optional callback function for handling tool usage.
     * @param {string} [name] - An optional name for the agent. If not provided, it defaults to the LLM provider's name.
     */
    constructor(
        agent: BaseLLM<LLMProvider, unknown>,
         onTool?: OnTool,
        name?: string
    ) {
        this.#agent = agent;
        this.name = name ?? this.#agent.type.toString();
        this.onTool = onTool?.bind(this)
     }

     /**
      * Sets the message history for the agent. This will overwrite any existing history.
      * @param {MessageArray<MessageInput>} inputs - The message history to set.
      * @returns {Promise<void>}
      */
     async addInputs(inputs: MessageArray<MessageInput>) {
        this.#agent.inputs = inputs;
     }

    /**
     * Gets the model name being used by the agent.
     * @returns {string} The model name.
     */
     get model() {
        return (this.#agent.options as { model?: string }).model ?? ''
     }

    /**
     * Initializes the agent by loading the underlying LLM. This is particularly important
     * for models that need to be downloaded or initialized, such as local WebGPU models.
     * @returns {Promise<void>}
     */
    async load() {
        if ("load" in this.#agent) {
            await (this.#agent as { load: () => Promise<void> }).load();
        }
    }

    /**
     * A robust wrapper for API calls that automatically retries on `APIConnectionError`.
     * It uses exponential backoff to wait between retries. This is inherited from `BaseLLM`.
     * @template T The expected return type of the API call.
     * @param {() => Promise<T>} apiCall - The function that makes the API call.
     * @returns {Promise<T>} The result of the successful API call.
     * @throws {Error} Throws an error if the API call fails after all retries or if a non-connection error occurs.
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
     * Executes a task with the given prompt and returns the LLM's response as a stream.
     * This is the primary method for interacting with the agent.
     * @param {string | BlockType[]} prompt - The user's prompt, which can be a simple string or a rich array of content blocks (e.g., text and images).
     * @param {string} [image] - An optional image to include with the prompt (legacy). It's recommended to use the `BlockType[]` format for prompts with images.
     * @returns {Promise<{ usage: { input: number, output: number }, response: ReadableStreamWithAsyncIterable<Message> }>} A promise that resolves to the token usage and a stream of response messages.
     */
    async performTask(
        prompt: string | BlockType[],
        image?: string
    ): Promise<{
        usage: { input: number, output: number },
        response: ReadableStreamWithAsyncIterable<Message>
    }> {
        const {cache:{tokens: usage}} = this.#agent;
        const {systemPrompt, chainOfThought} = this;
        if (image) {
            const response = await this.#agent.performTaskStream(prompt, image, '');
            return {  usage,    response  }
        }
        const response = await this.#agent.performTaskStream(prompt, chainOfThought, systemPrompt);
        return {  usage,    response  }
    }

    /**
     * A safe execution wrapper for tool calls. It catches errors during tool execution,
     * formats them into a standard error message, and pushes the error back into the input stream
     * for the LLM to process. This prevents tool failures from crashing the application.
     * @param {ToolUseBlock} toolUse - The tool use block that triggered the command.
     * @param {(agent: any) => Promise<void>} run - The function that executes the tool's logic.
     * @returns {Promise<void>}
     */
    async runSafeCommand(
        toolUse: ToolUseBlock,
        run: (agent: Agent) => Promise<void>
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