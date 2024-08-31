import { MessageInput, BaseLLMOptions, AnthropicOptions,  Message, ToolUseBlock, OnTool, AgentTypeToOptions, LLMProvider, Tool } from "../types";
import { ANSI_RESET } from "../config";
import { Anthropic } from "../llm/anthropic";
import { BaseLLM } from "../llm/base";
import { MessageArray } from "../utils";
/**
 * Abstract base class for AI agents.
 */
export abstract class Agent {
    /** Color used for logging. */
    protected abstract color: string;
    /** Name of the agent. */
    protected abstract name: string;
    abstract tools: Tool[];
    
    abstract systemPrompt: string;

    abstract createInitialMessageInput(
        prompt: string, 
        input: MessageArray<MessageInput>
    ): MessageArray<MessageInput>;


    /** The LLM client used by the agent. */
    private client: BaseLLM<any, BaseLLMOptions>;

    /**
     * Log a message with the agent's color and name.
     * @param message - The message to log.
     */
    log(message: string) {
        console.log(`${this.color}[${this.name}] ${message}${ANSI_RESET}`);
    }

    /**
     * Create a new Agent instance.
     * @param type - The type of LLM provider.
     * @param options - Configuration options for the LLM.
     */
    constructor(
        protected type: LLMProvider,
        protected options: AgentTypeToOptions[typeof type],
        onTool?: OnTool,
        public inputs: MessageArray<MessageInput> = new MessageArray(),
    ) {

        if (type === LLMProvider.Anthropic) {
            this.client = new Anthropic({ 
                options: options as AnthropicOptions}, 
                this,
                onTool,
            );
        } else {
            throw new Error("not implemented")
        }
    }

    /**
     * Perform a task using the LLM.
     * @param prompt - The user prompt.
     * @param stream - Whether to stream the response.
     * @returns A Promise resolving to either a ReadableStream of Messages or a single Message.
     */
    performTask(
        userPrompt: string,
        system: string,
        stream?: true
    ): Promise<{
        usage: {input:number, output: number},
        response: ReadableStream<Message>
    }>;
    performTask(
        userPrompt: string,
        system: string,
        stream?: false
    ): Promise<{
        usage: {input:number, output: number},
        response: Message
    }>;
    async performTask(
        userPrompt: string, 
        system: string,
        stream?: boolean
    ): Promise<{ 
        usage: {input:number, output: number},
        response: Message | ReadableStream<Message>
    }> {
        const response = await this.client.performTask(
            userPrompt,
            system,
            this.inputs,
            stream ?? false
        );
        return {
            usage:this.client.cache.tokens,
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
                role:'user',
                content: [
                    {
                        name:toolUse.name ,
                        type:'tool_result',
                        tool_use_id: toolUse.id,
                        isError: true,
                        content:[{
                            type:'text',
                            text: `An error occurred while running ${toolUse.name}: we got error -> ${error.message}`
                        }]
                        
                    }
                ]
            })
        }
    }
}