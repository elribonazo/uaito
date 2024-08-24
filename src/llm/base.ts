import { Agent } from "../agents";
import { BaseLLMOptions, Runner, MessageInput, Message, ToolUseBlock, OnTool, DeltaBlock, TextBlock, ToolResultBlock, UsageBlock, ErrorBlock } from "../types";
import { v4 } from 'uuid';

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
  public abstract cache: {
    toolInput: ToolUseBlock | null,
    chunks: string | null
    tokens: {
      input: number,
      output: number
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

  protected includeLastPrompt(prompt: string, input: MessageInput[]):MessageInput[]  {
    if (input.length<= 0) {
      return [
        { role: 'user', content: [{ type: 'text', text: prompt }] }
      ]
    }
    const last = input[input.length - 1];
    if (last && last.content.length > 0) {
      const found = last.content.find((c) => c.type === "text" && c.text === prompt);
      if (found) {
          return input;
      } else {
          if (input[input.length - 1].role === 'user') {
              input[input.length - 1].content.push({ type: 'text', text: prompt });
          } else {
              input.push({ role: 'user', content: [{ type: 'text', text: prompt }] })
          }
          return input;
      }
  }
    return [
      ...input,
      { role: 'user', content: [{ type: 'text', text: prompt }] }
    ]
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
    input: ReadableStream<AChunk>,
    getNext: () => Promise<ReadableStream<AChunk>>,
    onTool?:OnTool

  ) {
    let toolCache: ToolUseBlock | null = null;
    
    const agent = this.agent;
    return new ReadableStream({
       start :async (controller) => {
        let reader: ReadableStreamDefaultReader<AChunk> = input.getReader();
        let readerResult: ReadableStreamReadResult<AChunk>;
        while ((readerResult = await reader.read()).done !== true) {
          try {
            if (!readerResult.value) {
              continue;
            }
            const tChunk:AChunk =  readerResult.value;
            if (tChunk.type === "error") {
              const errorBlock = tChunk.content[0] as ErrorBlock;
  
              controller.enqueue({
                id: v4(),
                role:'assistant',
                type: 'error',
                content: [errorBlock]
              } as Message)
  
            }else  if (tChunk.type === "delta") {
              const content = tChunk.content[0] as DeltaBlock;
              const usage = tChunk.content[1] as UsageBlock;
              if (usage) {
  
                controller.enqueue({
                  id: v4(),
                  role:'assistant',
                  type: 'usage',
                  content: [usage]
                } as Message)
              }
              if (content.stop_reason === "tool_use") {
                const newStream = await getNext.bind(agent)();
                const oldReader = reader;
                reader = newStream.getReader()
                oldReader.releaseLock()
              } else if (content.stop_reason === "max_tokens" || content.stop_reason === "end_turn") {
                controller.enqueue(tChunk)
                agent.inputs.push(tChunk)
                controller.close()
              } 
            } else if (tChunk.type === "tool_start") {
              toolCache = tChunk.content[0] as ToolUseBlock;
              agent.inputs.push(tChunk)
            } else if (tChunk.type === "tool_delta") {
              if (toolCache) { 
                if (!toolCache.input) {
                  toolCache.input = ""
                }
                if (tChunk.content[0].type === "tool_delta") {
                  toolCache.input += tChunk.content[0].partial
                } 
              }
  
  
            } else if (tChunk.type === "tool_use") {
              controller.enqueue({
                id: tChunk.id,
                role: tChunk.role,
                content: tChunk.content,
                type: 'tool_use'
              })
              if (onTool && tChunk.content[0].type === "tool_use" ) {
               
                tChunk.content[0].input = toolCache && typeof toolCache.input === 'string' ? JSON.parse(toolCache.input === "" ? "{}" : toolCache.input): toolCache?.input ||''
                await onTool(tChunk, agent.inputs, this.options.signal)
                const lastOutput = agent.inputs[agent.inputs.length - 1];
                if (lastOutput.role !== "user" && lastOutput.content[0].type !== 'tool_result') {
                    throw new Error("Expected to have a user reply with the tool response");
                }
  
                lastOutput.content[0] = {
                  ...lastOutput.content[0],
                  name: tChunk.content[0].name
                } as ToolResultBlock;
                
                await controller.enqueue({
                  id: tChunk.id,
                  role:'user',
                  content: lastOutput.content,
                  type: 'tool_result'
                });
                
              }
            } else if (tChunk.type === "message") {
              await controller.enqueue(tChunk);
              
              if (tChunk.chunk) {
                if (agent.inputs.length > 0 && agent.inputs[agent.inputs.length - 1].role === "assistant") {
                  const content = (agent.inputs[agent.inputs.length - 1].content[0] as any).text;
                  agent.inputs[agent.inputs.length - 1] = {
                    ...agent.inputs[agent.inputs.length - 1],
                    content: [
                      {
                        type:'text',
                        text: content + ( tChunk.content[0] as TextBlock).text
                      }
                    ]
                  }
                } else {
                  agent.inputs.push(tChunk)
                }
    
              } else {
                agent.inputs.push(tChunk)
              }
            } else if (tChunk.type === "usage" ) {
              controller.enqueue(tChunk)
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
  }

  private async release<AChunk extends Message>(reader: ReadableStreamDefaultReader<AChunk>, controller: ReadableStreamDefaultController<any>) {
    try {
      reader.releaseLock()
      controller.close()
    } catch (err) {
      console.log("error can be ignore but ", err)
    }
  }

  async transformStream<AChunk, BChunk extends Message>(
    input: ReadableStream<AChunk>,
    transform: TransformStreamFn<any, BChunk>,
  ): Promise<ReadableStream<BChunk>> {
    const reader = input.getReader();
    return new ReadableStream({
      async start(controller) {
        let s: ReadableStreamReadResult<AChunk>
        while ((s = await reader.read()).done !== true) {
          if (!s.value) {
            continue;
          }
          const tChunk = s.value instanceof Uint8Array ? transform(
            JSON.parse(
              Buffer.from(
                s.value as any
              ).toString()
            )
          ) : transform(s.value);
          if (tChunk !== null) {
            await controller.enqueue(tChunk);
          } 
        }
        reader.releaseLock()
      }
    })
  }
}