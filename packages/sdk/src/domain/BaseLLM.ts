
import { v4 } from 'uuid';
import { MessageArray } from '../utils';
import type { BaseLLMCache, BlockType, DeltaBlock, ErrorBlock, Message, MessageInput, OnTool, ReadableStreamWithAsyncIterable, ToolInputDelta, ToolResultBlock, ToolUseBlock, TransformStreamFn, UsageBlock } from './types';
import type { LLMProvider } from '@/types';



/**
 * An abstract class representing a task runner that executes an operation and returns a stream of messages.
 * This is useful for long-running processes where results are produced incrementally.
 * @abstract
 * @class Runner
 */
export abstract class Runner {
    /**
     * Executes a task and returns a stream of messages.
     * @abstract
     * @param {string | BlockType[]} userPrompt - The initial user prompt, which can be a simple string or a rich array of content blocks.
     * @param {string} chainOfThought - A string outlining the reasoning steps the model should take.
     * @param {string} system - The system prompt that sets the context and instructions for the model.
     * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages.
     */
    abstract performTaskStream(userPrompt: string, chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>>;
    abstract performTaskStream(userPrompt: BlockType[], chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>>;
    abstract performTaskStream(userPrompt: string | BlockType[], chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>>;
}
/**
 * Abstract base class for Language Model (LLM) implementations. It provides a standardized interface
 * for interacting with various LLM providers, handling API retries, stream transformations, and tool usage.
 *
 * @template TYPE The specific LLM provider, extending from `LLMProvider`.
 * @template OPTIONS The configuration options for the LLM.
 * @extends {Runner}
 *
 * @example
 * ```typescript
 * class MyCustomLLM extends BaseLLM<LLMProvider.OpenAI, MyOptions> {
 *   // ... implementation of abstract properties and methods
 * }
 * ```
 */
export abstract class BaseLLM<TYPE extends LLMProvider, OPTIONS> extends Runner {
    /**
     * The maximum number of times to retry an API call in case of connection errors.
     * @private
     * @type {number}
     */
    private MAX_RETRIES = 10;
    /**
     * The initial delay in milliseconds between retries for an API call. The delay increases exponentially.
     * @private
     * @type {number}
     */
    private RETRY_DELAY = 3000; // 3 seconds
    /**
     * An optional cache for storing LLM responses to improve performance and reduce costs.
     * Must be implemented by subclasses if caching is desired.
     * @public
     * @abstract
     * @type {BaseLLMCache}
     */
    public abstract cache: BaseLLMCache
    /**
     * An array that holds the history of messages for a conversation, including user prompts and model responses.
     * This is used to maintain context in multi-turn conversations.
     * @public
     * @abstract
     * @type {MessageArray<MessageInput>}
     */
    public abstract inputs: MessageArray<MessageInput>
    /**
     * A generic key-value store for attaching arbitrary data to the LLM instance.
     * Can be used for session management, tracking metadata, etc.
     * @public
     * @type {Record<string, unknown>}
     */
    public data: Record<string, unknown> = {}

    /**
     * A utility for logging messages. It can be configured to use a custom logger
     * by passing a `log` function in the options. Defaults to `console.log`.
     * @param {string} message - The message to log.
     * @returns {void}
     */
    log(message: string) {
        const fn = (this.options as {log?: (message:string) => void})?.log ?? console.log;
        return fn(message);
    }

    /**
     * A robust wrapper for API calls that automatically retries on `APIConnectionError`.
     * It uses exponential backoff to wait between retries, making it resilient to transient network issues.
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
                    console.log(`API call failed. Retrying in 3 seconds... (Attempt ${retries}/${this.MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
                } else {
                    throw error; // Rethrow if it's not a connection error
                }
            }
        }
        throw new Error(`Max retries (${this.MAX_RETRIES}) reached. Unable to complete the API call.`);
    }

    /**
     * A safe execution wrapper for tool calls. It catches errors during tool execution,
     * formats them into a standard error message, and pushes the error back into the input stream
     * for the LLM to process. This prevents tool failures from crashing the application.
     * @param {ToolUseBlock} toolUse - The tool use block that triggered the command.
     * @param {(agent: unknown) => Promise<void>} run - The function that executes the tool's logic.
     * @returns {Promise<void>}
     */
    async runSafeCommand(
        toolUse: ToolUseBlock,
        run: (agent: unknown) => Promise<void>
    ) {
        if (toolUse.type !== "tool_use") {
            throw new Error("Expected ToolUseBlock content inside tool_use type message")
        }
        try {
            await run(this);
        } catch (err) {
            const error = (err as Error);
            console.log(err);
            this.inputs.push({
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

    /**
     * Creates an instance of BaseLLM.
     * @param {TYPE} type - The type of the language model provider (e.g., `LLMProvider.OpenAI`).
     * @param {OPTIONS} options - The configuration options for the language model.
     */
    constructor(public readonly type: TYPE, public readonly options: OPTIONS) {
        super()
    }

    /**
     * Appends the latest user prompt and the chain of thought to the message history.
     * It handles both simple string prompts and complex `BlockType` array prompts (e.g., with images).
     * This method ensures that the prompt is correctly formatted and added to the conversation context.
     * @param {string | BlockType[]} prompt - The user's prompt.
     * @param {string} chainOfThought - The reasoning steps for the model.
     * @param {MessageArray<MessageInput>} input - The current message history.
     * @returns {MessageArray<MessageInput>} The updated message history with the new prompt.
     */
    includeLastPrompt(prompt: string | BlockType[], chainOfThought: string, input: MessageArray<MessageInput>): MessageArray<MessageInput> {
        if (typeof prompt === 'string') {
            const promptWithChainOfThought = `${prompt}\r\n\r\n${chainOfThought}`
            if (input.length <= 0) {
                return MessageArray.from(
                    [
                        { role: 'user', content: [{ type: 'text', text: promptWithChainOfThought }] }
                    ]
                )
            }
            const last = input[input.length - 1];
            if (last && last.content.length > 0) {
                const found = last.content.find((c) => c.type === "text" && c.text === prompt);
                if (found) {
                    return input;
                } else {
                    if (input[input.length - 1].role === 'user' && input[input.length - 1].content[0].type === 'text') {
                        input[input.length - 1].content.push({ type: 'text', text: prompt });
                    } else {
                        input.push({ role: 'user', content: [{ type: 'text', text: prompt }] })
                    }
                    return input;
                }
            }

            return MessageArray.from(
                [
                    ...input,
                    { role: 'user', content: [{ type: 'text', text: prompt }] }
                ]
            )

        } else {
            const textBlock = prompt.find((p) => p.type === 'text');
            const imageBlock = prompt.find((p) => p.type === 'image');

            if (!textBlock || !imageBlock) {
                throw new Error("Expected text and image block in prompt if prompt is not string");
            }

            if (input.length<=0) {
                textBlock.text = `${textBlock.text}\r\n\r\n${chainOfThought}`
            }

            return MessageArray.from(
                [
                    ...input,
                    { role: 'user', content: [textBlock, imageBlock] }
                ]
            )
        }
    }

    /**
     * Transforms a raw stream from an AI provider into the standardized Uaito SDK `Message` format.
     * It processes chunks from the input stream, applies the provided `transform` function,
     * and emits standardized `Message` objects. It also separates out usage and delta blocks.
     * @template AChunk - The type of the chunks in the input stream.
     * @template BChunk - The type of the chunks in the output stream, which must extend `Message`.
     * @param {ReadableStreamWithAsyncIterable<AChunk>} input - The raw stream from the provider.
     * @param {TransformStreamFn<unknown, BChunk>} transform - A function to transform each chunk.
     * @returns {Promise<ReadableStreamWithAsyncIterable<BChunk>>} A promise that resolves to the transformed stream.
     */
    async transformStream<AChunk, BChunk extends Message>(
        input: ReadableStreamWithAsyncIterable<AChunk>,
        transform: TransformStreamFn<unknown, BChunk>,
    ): Promise<ReadableStreamWithAsyncIterable<BChunk>> {

        const reader = input.getReader();
        const stream = new ReadableStream({
            start: async (controller) => {
                let usageBlock: UsageBlock | null = null;
                let deltaBlock: DeltaBlock | null = null;


                while (true) {
                    const s = await reader.read();
                    if (s.done) {
                        reader.releaseLock()
                        break;
                    }

                    if (!s.value) {
                        continue;
                    }

                    const messageInput = s.value instanceof Uint8Array ?
                        JSON.parse(Buffer.from(s.value).toString()) :
                        s.value;

                    const message = await transform(messageInput);

                    if (!message) {
                        continue;
                    }


                    for (const content of message.content) {
                        if (content.type === "usage") {
                            const id = message.content.findIndex((c) => c.type === "usage");
                            if (id !== -1) {
                                usageBlock = message.content.splice(id, 1)[0] as UsageBlock;
                                controller.enqueue({
                                    id: v4(),
                                    role: 'assistant',
                                    type: 'usage',
                                    content: [usageBlock]
                                });
                            }
                        } else if (content.type === 'delta') {
                            const id = message.content.findIndex((c) => c.type === "delta");
                            if (id !== -1) {
                                deltaBlock = message.content.splice(id, 1)[0] as DeltaBlock;
                                controller.enqueue({
                                    id: v4(),
                                    role: 'assistant',
                                    type: 'delta',
                                    content: [deltaBlock]
                                });
                            }
                        }
                    }

                    if (message.content.length) {
                        controller.enqueue(message);
                    }
                }
            }
        })
        return stream as ReadableStream<BChunk> & AsyncIterable<BChunk>
    }


    /**
     * Handles the execution flow for an "auto mode" or agentic stream, where the LLM can use tools
     * and continue its task without waiting for user input. It processes the stream, handles tool calls
     * via the `onTool` callback, and then recursively calls `getNext` to continue the task with the tool's output.
     * @template AChunk - The type of chunks in the stream, which must extend `Message`.
     * @param {ReadableStreamWithAsyncIterable<AChunk>} input - The initial stream from the LLM.
     * @param {() => Promise<ReadableStreamWithAsyncIterable<AChunk>>} getNext - A function that gets the next stream after a tool call.
     * @param {OnTool} [onTool] - An optional callback to handle tool usage.
     * @returns {Promise<ReadableStreamWithAsyncIterable<AChunk>>} A promise that resolves to the final transformed stream.
     */
    async transformAutoMode<AChunk extends Message>(
        input: ReadableStreamWithAsyncIterable<AChunk>,
        getNext: () => Promise<ReadableStreamWithAsyncIterable<AChunk>>,
        onTool?: OnTool
    ) {
        const stream = new ReadableStream({
            start: async (controller) => {
                let reader: ReadableStreamDefaultReader<AChunk> = input.getReader();

                while (true) {
                    const readerResult = await reader.read();
                    if (readerResult.done) {
                        reader.releaseLock()
                        break;
                    }
                    if (!readerResult.value) {
                        continue;
                    }
                    const tChunk: AChunk = readerResult.value;

                    try {
                        this.log(`tChunk: ${tChunk.type} ${JSON.stringify(tChunk)}`);

                        if (tChunk.type === "thinking" || tChunk.type === "redacted_thinking" || tChunk.type === "signature_delta") {
                            // Only push non-chunked thinking/signature blocks to inputs for context preservation
                            const lastInput = this.inputs[this.inputs.length - 1];
                            if (lastInput.type !== "thinking" && lastInput.type !== "signature_delta") {
                                this.inputs.push(tChunk);
                            } else {
                                if (tChunk.type === "thinking") {
                                    (this.inputs[this.inputs.length - 1].content[0] as {thinking: string}).thinking += (tChunk.content[0] as {thinking: string}).thinking;
                                } else {
                                    (this.inputs[this.inputs.length - 1].content[0] as {signature: string}).signature += (tChunk.content[0] as {signature: string}).signature;
                                }
                            }
                            controller.enqueue(tChunk);
                        } else if (tChunk.type === "tool_use") {
                            this.inputs.push(tChunk);
                            controller.enqueue({
                                id: tChunk.id,
                                role: tChunk.role,
                                content: tChunk.content,
                                type: 'tool_use'
                            })
                            if (onTool && tChunk.content[0].type === "tool_use" && !tChunk.content[0].isRemote) {
                                const toolUse = tChunk.content[0] as ToolUseBlock;
                                const cacheEntry = (this.cache.toolInput ?? { input: tChunk.content[0].input }) as ToolInputDelta;
                                const partial = cacheEntry?.partial || (cacheEntry as any).input;
                                if (partial) {
                                    try {
                                        toolUse.input = JSON.parse(partial)
                                    } catch {
                                    }
                                } else {
                                    toolUse.input = typeof partial === "string" ? JSON.parse(partial === "" ? "{}" : partial) : partial;
                                }

                                await onTool.bind(this)(tChunk, (this.options as {signal: AbortSignal}).signal);
                                const lastOutput = this.inputs[this.inputs.length - 1];
                                if (lastOutput.content[0].type !== 'tool_result') {
                                    throw new Error("Tool call finished but expected to have a user reply with the tool response");
                                }

                                lastOutput.content[0] = {
                                    ...lastOutput.content[0],
                                    name: (tChunk.content[0] as ToolUseBlock).name
                                } as ToolResultBlock;

                                controller.enqueue({
                                    id: v4(),
                                    role: 'assistant',
                                    content: lastOutput.content,
                                    type: 'tool_result'
                                });

                                this.cache.toolInput = null;


                                const newStream = await getNext.bind(this)();
                                const oldReader = reader;
                                reader = newStream.getReader()
                                oldReader.releaseLock()

                            }
                        } else if (tChunk.content.length) {
                            controller.enqueue(tChunk)
                        }
                    } catch (err) {
                        console.error('Error in transformAutoMode:', err, tChunk);
                        if (err instanceof Error && !err.message.includes("aborted")) {
                            const errorBlock: ErrorBlock = {
                                type: "error",
                                message: (err as Error).message
                            }
                            controller.enqueue({
                                id: v4(),
                                role: 'assistant',
                                type: 'error',
                                content: [errorBlock]
                            } as Message)
                        }
                    }
                }
            }
        })
        return stream as ReadableStreamWithAsyncIterable<AChunk>
    }

}