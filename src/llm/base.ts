import { MessageArray } from "../utils";
import { Agent } from "../agents";
import { BaseLLMOptions, Runner, MessageInput, Message, ToolUseBlock, OnTool, DeltaBlock, TextBlock, ToolResultBlock, UsageBlock, ErrorBlock, BlockType, ToolInputDelta, BaseLLMCache, ReadableStreamWithAsyncIterable } from "../types";
import { v4 } from 'uuid';
import fs from 'fs';
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
  protected abstract agent:Agent;
  public abstract cache: BaseLLMCache
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
          if (input[input.length - 1].role === 'user') {
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
    const agent = this.agent;
    const stream = new ReadableStream({
       start :async (controller) => {
        let reader: ReadableStreamDefaultReader<AChunk> = input.getReader();
        let readerResult: ReadableStreamReadResult<AChunk>;
        while ((readerResult = await reader.read()).done !== true) {
          try {
            if (!readerResult.value) {
              continue;
            }
            const tChunk:AChunk =  readerResult.value;
            if (tChunk.type === "error" || 
              tChunk.type === "usage" || 
              tChunk.type === "delta" || 
              tChunk.type === "tool_delta" || 
              tChunk.type === "message"
            ) {
              controller.enqueue(tChunk)
            } else if (tChunk.type === "tool_use") {
              controller.enqueue({
                id: tChunk.id,
                role: tChunk.role,
                content: tChunk.content,
                type: 'tool_use'
              })
              if (onTool && tChunk.content[0].type === "tool_use" ) {
                const toolUse = tChunk.content[0] as ToolUseBlock;
                const cacheEntry = this.cache.toolInput! as ToolInputDelta;
                if (cacheEntry.partial === "") {
                  toolUse.input = {}  
                } else {
                  const partial = cacheEntry.partial || (cacheEntry as any).input;
                  
                  toolUse.input = typeof partial === "string" ? JSON.parse(partial === "" ? "{}" : partial) : partial;
                }
                await onTool.bind(this)(tChunk, this.options.signal);
                const lastOutput = agent.inputs[agent.inputs.length - 1];
                if (lastOutput.role !== "user" && lastOutput.content[0].type !== 'tool_result') {
                    throw new Error("Expected to have a user reply with the tool response");
                }
  
                if (lastOutput.content[0].type === 'tool_result') {
                  lastOutput.content[0] = {
                    ...lastOutput.content[0],
                    name: tChunk.content[0].name
                  } as ToolResultBlock;
                                }

      

               
                await controller.enqueue({
                  id: tChunk.id,
                  role:'user',
                  content: lastOutput.content,
                  type: 'tool_result'
                });

              
                const newStream = await getNext.bind(agent)();
                const oldReader = reader;
                reader = newStream.getReader()
                oldReader.releaseLock()
                
              }
            } 
          } catch (err) {
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
    controller: ReadableStreamDefaultController<any>
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
    transform: TransformStreamFn<any, BChunk>,
  ): Promise<ReadableStreamWithAsyncIterable<BChunk>> {

    const reader = input.getReader();
    const agent = this.agent;

    function emit(
      controller: ReadableStreamDefaultController<BChunk>,
      message: BChunk
    ) {
      controller.enqueue(message);
      agent.inputs.push(message)
    }

    const stream = new ReadableStream({
      async start(controller) {
        let s: ReadableStreamReadResult<AChunk>
        while ((s = await reader.read()).done !== true) {
          if (!s.value) {
            continue;
          }
          const message = s.value instanceof Uint8Array ? transform(
            JSON.parse(
              Buffer.from(
                s.value as any
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

            if (isErrorMessage || isToolDeltaMessage || isToolUseMessage || isUsageMessage) {
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
            } else if (isChunkMessage) {
              emit(controller, message)
            }
          } 
        }
        reader.releaseLock()
      }
    })
    return stream as ReadableStream<BChunk> & AsyncIterable<BChunk>
  }
}