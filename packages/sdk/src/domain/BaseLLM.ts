
import { v4 } from 'uuid';
import { MessageArray } from '../utils';
import { BaseLLMCache, BaseLLMOptions, ErrorBlock, Message, MessageInput, OnTool, ReadableStreamWithAsyncIterable, ToolInputDelta, ToolResultBlock, ToolUseBlock, TransformStreamFn, UsageBlock } from './types';



/**
 * An abstract class for a runner that performs a task stream.
 * @export
 * @abstract
 * @class Runner
 */
export abstract class Runner {
    /**
     * Performs a task stream.
     * @abstract
     * @param {string} userPrompt - The user prompt.
     * @param {string} chainOfThought - The chain of thought for the task.
     * @param {string} system - The system prompt.
     * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages.
     */
    abstract performTaskStream( userPrompt: string, chainOfThought: string, system: string,
 ): Promise<ReadableStreamWithAsyncIterable<Message>>;
 }
/**
 * Abstract base class for Language Model implementations.
 * @template TYPE The type of the language model.
 * @template OPTIONS The type of options for the language model, extending BaseLLMOptions.
 * @extends {Runner}
 */
export abstract class BaseLLM<TYPE, OPTIONS extends BaseLLMOptions> extends Runner {
    /**
     * The maximum number of retries for an API call.
     * @private
     * @type {number}
     */
    private MAX_RETRIES = 10;
    /**
     * The delay in milliseconds between retries for an API call.
     * @private
     * @type {number}
     */
    private RETRY_DELAY = 3000; // 3 seconds
    /**
     * The cache for the LLM.
     * @public
     * @abstract
     * @type {BaseLLMCache}
     */
    public abstract cache: BaseLLMCache
    /**
     * An array of message inputs.
     * @public
     * @abstract
     * @type {MessageArray<MessageInput>}
     */
    public abstract inputs: MessageArray<MessageInput>
    /**
     * A record of data for the LLM.
     * @public
     * @type {Record<string, unknown>}
     */
    public data: Record<string, unknown> = {}

    /**
     * Logs a message.
     * @param {string} message - The message to log.
     * @returns {void}
     */
    log(message: string) {
        const fn = this.options?.log ?? console.log;
        return fn(message);
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
     * Run a command safely, catching and handling any errors.
     * @param {ToolUseBlock} toolUse - The tool being used.
     * @param {(agent: unknown) => Promise<void>} run - Function to run the command.
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
     * @param {TYPE} type - The type of the language model.
     * @param {OPTIONS} options - The options for the language model.
     */
    constructor(public readonly type: TYPE, protected options: OPTIONS) {
        super()
    }

    /**
     * Includes the last prompt in the input.
     * @param {string} prompt - The user prompt.
     * @param {string} chainOfThought - The chain of thought for the task.
     * @param {MessageArray<MessageInput>} input - The input messages.
     * @returns {MessageArray<MessageInput>} The updated input messages.
     */
    includeLastPrompt(prompt: string, chainOfThought: string, input: MessageArray<MessageInput>): MessageArray<MessageInput> {
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
            const found = last.content.find((c) => c.type === "text" && c.text === promptWithChainOfThought);
            if (found) {
                return input;
            } else {
                if (input[input.length - 1].role === 'user' && input[input.length - 1].content[0].type === 'text') {
                    input[input.length - 1].content.push({ type: 'text', text: promptWithChainOfThought });
                } else {
                    input.push({ role: 'user', content: [{ type: 'text', text: promptWithChainOfThought }] })
                }
                return input;
            }
        }
        return MessageArray.from(
            [
                ...input,
                { role: 'user', content: [{ type: 'text', text: promptWithChainOfThought }] }
            ]
        )
    }

    /**
     * Transforms the given stream from an AI provider into a Uaito Stream
     * This also keeps track of the received messages
     * @template AChunk - The type of the input chunk.
     * @template BChunk - The type of the output chunk.
     * @param {ReadableStreamWithAsyncIterable<AChunk>} input - The input stream.
     * @param {TransformStreamFn<unknown, BChunk>} transform - The transform function.
     * @returns {Promise<ReadableStreamWithAsyncIterable<BChunk>>} A promise that resolves to the transformed stream.
     */
    async transformStream<AChunk, BChunk extends Message>(
        input: ReadableStreamWithAsyncIterable<AChunk>,
        transform: TransformStreamFn<unknown, BChunk>,
    ): Promise<ReadableStreamWithAsyncIterable<BChunk>> {

        const reader = input.getReader();
        const stream = new ReadableStream({
            start: async (controller) => {
                while (true) {
                    const s = await reader.read();
                    if (s.done) {
                        controller.close();
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

                    if (message !== null) {
                        //Message pre-processing, cache and tools
                        const isErrorMessage = message.type === "error";
                        const isDeltaMessage = message.type === "delta";
                        const isToolDeltaMessage = message.type === "tool_delta";
                        const isToolUseMessage = message.type === "tool_use";
                        const isChunkMessage = message.type === "message";
                        const isUsageMessage = message.type === "usage";
                        const isThinkingMessage = message.type === "thinking";
                        const isRedactedThinkingMessage = message.type === "redacted_thinking";
                        const isSignatureDeltaMessage = message.type === "signature_delta";
                        let usageBlock: UsageBlock | null = null;

                        if (isChunkMessage || isErrorMessage || isToolDeltaMessage || isToolUseMessage || isUsageMessage || isThinkingMessage || isRedactedThinkingMessage || isSignatureDeltaMessage) {

                            for (const content of message.content) {
                                if (content.type === "usage") {
                                    const id = message.content.findIndex((c) => c.type === "usage");
                                    if (id !== -1) {
                                        usageBlock = message.content.splice(id, 1)[0] as UsageBlock;
                                    }
                                }
                            }
                            if (message.content.length) {
                                controller.enqueue(message);;
                            }
                        } else if (isDeltaMessage) {
                            for (const content of message.content) {
                                if (content.type === "usage") {
                                    const id = message.content.findIndex((c) => c.type === "usage");
                                    if (id !== -1) {
                                        usageBlock = message.content.splice(id, 1)[0] as UsageBlock;
                                    }
                                }
                            }
                            if (message.content.length) {
                                controller.enqueue(message);
                            }
                        }

                        if (usageBlock) {
                            const usageMessage = {
                                id: v4(),
                                role: 'assistant',
                                type: 'usage',
                                content: [usageBlock]
                            } as BChunk;

                            controller.enqueue(usageMessage);
                        }
                    }
                }

            }
        })
        return stream as ReadableStream<BChunk> & AsyncIterable<BChunk>
    }


    /**
     * Transforms an input stream using the provided transform function.
     * @template AChunk - The type of the input chunk.
     * @param {ReadableStreamWithAsyncIterable<AChunk>} input - The input stream to be transformed.
     * @param {() => Promise<ReadableStreamWithAsyncIterable<AChunk>>} getNext - A function to get the next stream.
     * @param {OnTool} [onTool] - Optional callback for tool usage.
     * @returns {Promise<ReadableStreamWithAsyncIterable<AChunk>>} A promise that resolves to the transformed readable stream.
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
                        break;
                    }

                    try {
                        if (!readerResult.value) {
                            continue;
                        }
                        const tChunk: AChunk = readerResult.value;

                        this.log(`tChunk: ${tChunk.type} ${JSON.stringify(tChunk)}`);

                        if (tChunk.type === "error" ||
                            tChunk.type === "usage" ||
                            tChunk.type === "delta" ||
                            tChunk.type === "tool_delta" ||
                            tChunk.type === "message"
                        ) {
                            controller.enqueue(tChunk)
                        } else if (tChunk.type === "thinking" || tChunk.type === "redacted_thinking" || tChunk.type === "signature_delta") {
                            // Only push non-chunked thinking/signature blocks to inputs for context preservation
                            const lastInput = this.inputs[this.inputs.length - 1];
                            if (lastInput.type !== "thinking" && lastInput.type !== "signature_delta") {
                                this.inputs.push(tChunk);
                            } else {
                                if (tChunk.type === "thinking") {
                                    (this.inputs[this.inputs.length - 1].content[0] as any).thinking += (tChunk.content[0] as any).thinking;
                                } else {
                                    (this.inputs[this.inputs.length - 1].content[0] as any).signature += (tChunk.content[0] as any).signature;
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
                            if (onTool && tChunk.content[0].type === "tool_use") {
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

                                await onTool.bind(this)(tChunk, this.options.signal);
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
                        }
                    } catch (err: unknown) {
                        console.error('Error in transformAutoMode:', err);
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
                reader.releaseLock()
            }
        })
        return stream as ReadableStreamWithAsyncIterable<AChunk>
    }

}