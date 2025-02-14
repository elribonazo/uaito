import { MessageInput, BaseLLMOptions, AnthropicOptions, Message, OnTool, AgentTypeToOptions, LLMProvider, Tool, OpenAIOptions, OllamaOptions } from "../types";
import { Anthropic } from "../llm/anthropic";
import { BaseLLM } from "../llm/base";
import { MessageArray } from "../utils";
import { OpenAI } from "../llm/openai";
import { Ollama } from "../llm/ollama";

export const LOG_ANSI_RED = "\u001B[31m";
export const LOG_ANSI_GREEN = "\u001B[32m";
export const LOG_ANSI_GRAY = "\u001B[90m";
export const LOG_ANSI_BLUE = "\u001B[34m";
export const LOG_ANSI_RESET = "\u001B[0m";
export const LOG_ANSI_YELLOW = "\u001B[33m";


/**
 * base class for AI agents.
 */
export class Agent {
    private MAX_RETRIES = 10;
    private RETRY_DELAY = 3000; // 3 seconds
    /** The LLM client used by the agent. */
    private client: BaseLLM<any, BaseLLMOptions>;

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
        protected type: LLMProvider,
        protected options: AgentTypeToOptions[typeof type],
        protected onTool?: OnTool,
        public inputs: MessageArray<MessageInput> = new MessageArray(),
        public systemPrompt: string = "",
        public tools: Tool[] = [],
        protected color: string = LOG_ANSI_BLUE,
        protected name: string = type.toString()
    ) {

        if (type === LLMProvider.Anthropic) {
            this.client = new Anthropic({
                options: options as AnthropicOptions
            },
                this,
                onTool,
            );
        } else if (type === LLMProvider.OpenAI) {
            this.client = new OpenAI({
                options: options as OpenAIOptions
            },
                this,
                onTool);
        } else if (type === LLMProvider.Ollama) {
            this.client = new Ollama({
                options: options as OllamaOptions
            },
                this,
                onTool);
        } else {
            throw new Error("not implemented")
        }
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
    performTask(
        prompt: string,
        chainOfThought: string,
        system: string,
        stream?: true
    ): Promise<{
        usage: { input: number, output: number },
        response: ReadableStream<Message> & AsyncIterable<Message>
    }>;
    performTask(
        prompt: string,
        chainOfThought: string,
        system: string,
        stream?: false
    ): Promise<{
        usage: { input: number, output: number },
        response: Message
    }>;
    async performTask(
        prompt: string,
        chainOfThought: string,
        system: string,
        stream?: boolean
    ): Promise<{
        usage: { input: number, output: number },
        response: Message | (ReadableStream<Message> & AsyncIterable<Message>)
    }> {
        const response = stream === true ?
            await this.retryApiCall(() => this.client.performTaskStream(prompt, chainOfThought, system)) :
            await this.retryApiCall(() => this.client.performTaskNonStream(prompt, chainOfThought, system));

        return {
            usage: this.client.cache.tokens,
            response
        }
    }

    /**
     * Run a command safely, catching and handling any errors.
     * @param tool - The tool being used.
     * @param input - Array of input messages.
     * @param run - Function to run the command.
     */
    async runSafeCommand(
        tool: Message,
        input: MessageArray<MessageInput>,
        run: (agent: any) => Promise<void>
    ) {
        const toolUse = tool.content.find((con) => con.type === "tool_use")!
        if (toolUse.type !== "tool_use") {
            throw new Error("Expected ToolUseBlock content inside tool_use type message")
        }
        try {
            await run(this);
        } catch (err) {
            const error = (err as Error);
            console.log(err);
            input.push({
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