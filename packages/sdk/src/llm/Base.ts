import type { AbortSignal } from 'abort-controller';
import type { 
  BaseLLMOptions, 
  Message,
  MessageInput,
  OnTool,
  ReadableStreamWithAsyncIterable,
  ToolUseBlock,
  ToolResultBlock,
  ErrorBlock,
  ToolInputDelta,
  BaseLLMCache
} from '../types';
import { Runner } from '../types';
import { v4 } from 'uuid';
import { MessageArray } from '../utils';

/**
 * Represents a function that transforms a chunk of data in a stream.
 * @template T The type of the input chunk.
 * @template M The type of the output message.
 * @param {T} chunk - The input chunk to be transformed.
 * @param {ReadableWritablePair<M, T>} stream - The stream to read from and write to.
 * @returns {Promise<M[]>} A promise that resolves to an array of transformed messages.
 */
export type TransformStreamFn<T, M> = (
  chunk: T,
) => M | null

/**
 * Abstract base class for Language Model implementations.
 * @template TYPE The type of the language model.
 * @template OPTIONS The type of options for the language model, extending BaseLLMOptions.
 * @extends {Runner}
 */
export abstract class BaseLLM<
  TYPE,
  OPTIONS extends BaseLLMOptions,
> extends Runner {
  /** An array of message inputs. */
  private MAX_RETRIES = 10;
  private RETRY_DELAY = 3000; // 3 seconds
  public abstract cache: BaseLLMCache
  public abstract inputs: MessageArray<MessageInput>
  public data: Record<string, unknown> = {}
  public log: (message: string) => void = console.log;

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
        await this.retryApiCall(() => this.performTaskStream(prompt, chainOfThought, system)) :
        await this.retryApiCall(() => this.performTaskNonStream(prompt, chainOfThought, system));

    return {
        usage: this.cache.tokens,
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

   includeLastPrompt(prompt: string, chainOfThought: string, input: MessageArray<MessageInput>):MessageArray<MessageInput>  {
    const promptWithChainOfThought = `${prompt}\r\n\r\n${chainOfThought}`
    if (input.length<= 0) {
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
            debugger;
              input[input.length - 1].content.push({ type: 'text', text: promptWithChainOfThought });
          } else {
            debugger;
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
   * Transforms an input stream using the provided transform function.
   * @template T The type of the input chunk.
   * @template S The type of the output stream, extending ReadableStream.
   * @param {S} input - The input stream to be transformed.
   * @param {TransformStreamFn<T, S>} transform - The function to transform each chunk.
   * @returns {Promise<ReadableStream<S>>} A promise that resolves to the transformed readable stream.
   */
  async transformAutoMode<AChunk extends Message> (
    input: ReadableStreamWithAsyncIterable<AChunk>,
    getNext: () => Promise<ReadableStreamWithAsyncIterable<AChunk>>,
    onTool?:OnTool
  ) {
    const stream = new ReadableStream({
       start :async (controller) => {
        let reader: ReadableStreamDefaultReader<AChunk> = input.getReader();
        
        while (true) {
          const readerResult = await reader.read();
          if (readerResult.done) break;

          try {
            if (!readerResult.value) {
              continue;
            }
            const tChunk:AChunk =  readerResult.value;

            this.log(`tChunk: ${tChunk.type} ${JSON.stringify(tChunk)}`);

            if (tChunk.type === "error" || 
              tChunk.type === "usage" || 
              tChunk.type === "delta" || 
              tChunk.type === "tool_delta" || 
              tChunk.type === "message"
            ) {
              controller.enqueue(tChunk)
            } else if (tChunk.type === "tool_use") {
              this.inputs.push(tChunk);
              controller.enqueue({
                id: tChunk.id,
                role: tChunk.role,
                content: tChunk.content,
                type: 'tool_use'
              })
              if (onTool && tChunk.content[0].type === "tool_use" ) {
                const toolUse = tChunk.content[0] as ToolUseBlock;
                const cacheEntry = (this.cache.toolInput ?? {}) as ToolInputDelta;
                const partial = cacheEntry?.partial || (cacheEntry as unknown as { input: string }).input;
                if (partial) {
                  toolUse.input = {}  
                } else {
                  
                  toolUse.input = typeof partial === "string" ? JSON.parse(partial === "" ? "{}" : partial) : partial;
                }
                await onTool.bind(this)(tChunk, this.options.signal);
                const lastOutput = this.inputs[this.inputs.length - 1];
                if (lastOutput.role !== "user" || lastOutput.content[0].type !== 'tool_result') {
                    throw new Error("Expected to have a user reply with the tool response");
                }
  
                if (lastOutput.content[0].type === 'tool_result') {
                  lastOutput.content[0] = {
                    ...lastOutput.content[0],
                    name: (tChunk.content[0] as ToolUseBlock).name
                  } as ToolResultBlock;
                }

                controller.enqueue({
                  id: v4(),
                  role:'user',
                  content: lastOutput.content,
                  type: 'tool_result'
                });

              
                const newStream = await getNext.bind(this)();
                const oldReader = reader;
                reader = newStream.getReader()
                oldReader.releaseLock()
                
              }
            } 
          } catch (err: unknown) {
            const errorBlock: ErrorBlock = {
              type: "error",
              message: (err as Error).message
            }
            controller.enqueue({
              id: v4(),
              role:'assistant',
              type: 'error',
              content: [errorBlock]
            } as Message)
          }
        }
        await this.release(reader, controller)
      }
    })
    return stream as ReadableStreamWithAsyncIterable<AChunk>
  }

  private async release<AChunk extends Message>(
    reader: ReadableStreamDefaultReader<AChunk>, 
    controller: ReadableStreamDefaultController<Message>
  ) {
    try {
      reader.releaseLock()
      controller.close()
    } catch (err) {
      console.log("error can be ignore but ", err)
    }
  }

  /**
   * Transforms the given stream from an AI provider into a Uaito Stream
   * This also keeps track of the received messages
   * @param input 
   * @param transform 
   * @returns 
   */
  async transformStream<AChunk, BChunk extends Message>(
    input: ReadableStreamWithAsyncIterable<AChunk>,
    transform: TransformStreamFn<unknown, BChunk>,
  ): Promise<ReadableStreamWithAsyncIterable<BChunk>> {

    const reader = input.getReader();

    function emit(
      controller: ReadableStreamDefaultController<BChunk>,
      message: BChunk
    ) {
      controller.enqueue(message);
    }

    const stream = new ReadableStream({
      async start(controller) {
        while(true) {
          const s = await reader.read();
          if (s.done) break;
          
          if (!s.value) {
            continue;
          }
          const message = s.value instanceof Uint8Array ? transform(
            JSON.parse(
              Buffer.from(
                s.value as unknown as Uint8Array
              ).toString()
            )
          ) : transform(s.value);


          if (message !== null) {
            //Message pre-processing, cache and tools
            const isErrorMessage = message.type === "error";
            const isDeltaMessage = message.type === "delta";
            const isToolDeltaMessage = message.type === "tool_delta";
            const isToolUseMessage = message.type === "tool_use";
            const isChunkMessage = message.type === "message";
            const isUsageMessage = message.type === "usage";

            if (isChunkMessage || isErrorMessage || isToolDeltaMessage || isToolUseMessage || isUsageMessage) {
              emit(controller, message);
            } else if (isDeltaMessage) {
              for (const content of message.content) {
                if (content.type === "usage") {
                  const usageMessage = {
                    id: v4(),
                    role:'assistant',
                    type: 'usage',
                    content: [content]
                  } as BChunk
                  emit(controller, usageMessage)
                } else if (content.type === "delta") {
                  if (content.stop_reason === "max_tokens" || content.stop_reason === "end_turn") {
                    emit(controller, message)
                  } 
                }
              }
            } 
          } 
        }
        reader.releaseLock()
      }
    })
    return stream as ReadableStream<BChunk> & AsyncIterable<BChunk>
  }
}