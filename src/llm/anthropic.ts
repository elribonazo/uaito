import SDK from '@anthropic-ai/sdk';
import { v4 } from 'uuid';
import { ImageBlockParam, MessageParam, TextBlockParam, ToolResultBlockParam, ToolUseBlockParam } from '@anthropic-ai/sdk/resources';
import { AnthropicOptions, MessageInput, Message, ToolUseBlock, ToolInputDelta, DeltaBlock, OnTool, UsageBlock, ErrorBlock, LLMProvider } from "../types";
import { BaseLLM } from "./base";
import { Agent } from '../agents';

type AnthropicConstructor = {
  options: AnthropicOptions,
  onTool?: OnTool
}

export class Anthropic extends BaseLLM<LLMProvider.Anthropic, AnthropicOptions> {
  protected agent: Agent;
  public cache: {
    toolInput: ToolUseBlock | null,
    chunks: string | null
    tokens: {
      input: number,
      output: number
    }
  } = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }
  private onTool?: OnTool
  protected api: SDK;
  private MAX_RETRIES = 10;
  private RETRY_DELAY = 3000; // 3 seconds

  constructor(
    { options }: AnthropicConstructor,
    agent: Agent,
    onTool?: OnTool,
  ) {
    super(LLMProvider.Anthropic, options);
    this.api = new SDK({
      apiKey: options.apiKey
    })
    this.onTool = onTool;
    this.agent = agent;
  }

  get maxTokens() {
    return this.options.maxTokens ?? 8192
  }

  performTask(
    prompt: string,
    system: string,
    input: MessageInput[],
    stream: true
  ): Promise<ReadableStream<Message>>;
  performTask(
    prompt: string,
    system: string,
    input: MessageInput[],
    stream: false
  ): Promise<Message>;
  performTask(
    prompt: string,
    system: string,
    input: MessageInput[],
    stream: boolean
  ): Promise<ReadableStream<Message> | Message> {
    if (stream === true) {
      return this.retryApiCall(() => this.performTaskStream(prompt, system, input));
    }
    return this.retryApiCall(() => this.performTaskNonStream(prompt, system, input));
  }

  private async retryApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        return await apiCall();
      } catch (error) {
        if (error instanceof Error && error.message.includes('APIConnectionError')) {
          retries++;
          this.agent.log(`API call failed. Retrying in 3 seconds... (Attempt ${retries}/${this.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        } else {
          throw error; // Rethrow if it's not a connection error
        }
      }
    }
    throw new Error(`Max retries (${this.MAX_RETRIES}) reached. Unable to complete the API call.`);
  }

  private fromInputToParam(model: MessageInput): MessageParam {
    const content: Array<TextBlockParam | ImageBlockParam | ToolUseBlockParam | ToolResultBlockParam>
      = model.content
        .filter((contentModel) =>
          contentModel.type !== "tool_delta" &&
          contentModel.type !== "tool_start" &&
          contentModel.type !== 'usage' &&
          contentModel.type !== "delta" &&
          contentModel.type !== "error"
        )
        .map((contentModel) => {
          if (contentModel.type === "text") {
            const textBlock: TextBlockParam = {
              type: 'text',
              text: contentModel.text
            }
            return textBlock
          } else if (contentModel.type === "image") {
            const imageBlock: ImageBlockParam = contentModel
            return imageBlock
          } else if (contentModel.type === "tool_use") {
            const toolUseBlock: ToolUseBlockParam = {
              type: 'tool_use',
              id: contentModel.id,
              input: contentModel.input,
              name: contentModel.name
            }
            return toolUseBlock
          }

          const toolResultBlock: ToolResultBlockParam = {
            is_error: contentModel.isError,
            tool_use_id: contentModel.tool_use_id,
            type: contentModel.type,
            content: contentModel.content!
              .map((content) => {
                if (content.type === "image") {
                  const imageBlock: ImageBlockParam = content
                  return imageBlock
                }
                if (content.type === "text") {
                  const textBlock: TextBlockParam = {
                    type: 'text',
                    text: content.text
                  }
                  return textBlock;
                }
                return content
              }) as any
          }
          return toolResultBlock
        })
    return {
      ...model,
      content
    }
  }

  private chunk(
    chunk: SDK.RawMessageStreamEvent
  ): Message | null {
    if (chunk.type === "content_block_start") {
      if (chunk.content_block.type === 'tool_use') {
        this.cache.chunks = null
        this.cache.toolInput = chunk.content_block
        this.cache.toolInput.input = ""
        const toolUseBlock: ToolUseBlock = chunk.content_block
        this.cache.toolInput = toolUseBlock;
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_start',
          content: [
            toolUseBlock
          ]
        }
      }
    } else if (chunk.type === "content_block_delta") {
      const delta = chunk.delta;
      if (delta.type === 'text_delta') {
        return {
          id: this.cache.chunks!,
          role: 'assistant',
          type: 'message',
          chunk: true,
          content: [
            {
              type: 'text',
              text: delta.text,
            }
          ]
        }
      } else if (delta.type === 'input_json_delta') {
        this.cache.chunks = null
        const toolInputBlock: ToolInputDelta = {
          type: 'tool_delta',
          partial: delta.partial_json
        }
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_delta',
          content: [toolInputBlock]
        }
      }
    } else if (chunk.type === "content_block_stop") {
      this.cache.chunks = null
      const isTool = this.cache.toolInput?.type === "tool_use";
      if (isTool) {
        const toolInput = this.cache.toolInput as SDK.ToolUseBlock;
        this.cache.toolInput = null
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_use',
          content: [toolInput]
        }
      }
    } else if (chunk.type === "message_delta") {
      this.cache.tokens.output = chunk.usage.output_tokens;
      this.cache.chunks = null;

      if (chunk.delta.stop_reason === "max_tokens") {
        const errorBlock: ErrorBlock = {
          type: 'error',
          message: `Exceeding the token limit, ${chunk.usage.output_tokens}`
        }
        return {
          id: v4(),
          role: 'assistant',
          type: 'error',
          content: [
            errorBlock
          ]
        }

      } else {
        const usageBlock: UsageBlock = {
          type: "usage",
          output: chunk.usage.output_tokens,
          input: this.cache.tokens.input
        }
        return {
          id: v4(),
          role: 'assistant',
          type: 'delta',
          content: [
            chunk.delta as DeltaBlock,
            usageBlock
          ]
        }
      }
    } else if (chunk.type === "message_start") {
      this.cache.chunks = chunk.message.id;
      this.cache.toolInput = null
      this.cache.tokens.input = chunk.message.usage.input_tokens;
      const usageBlock: UsageBlock = {
        type: "usage",
        output: 0,
        input: this.cache.tokens.input
      }
      return {
        id: v4(),
        role: 'assistant',
        type: 'usage',
        content: [
          usageBlock
        ]
      }
    }
    return null
  }

  private async performTaskStream(
    prompt: string,
    system: string,
    input: MessageInput[],
  ): Promise<ReadableStream<Message>> {

    const messages = this
      .includeLastPrompt(prompt, input)
      .map(this.fromInputToParam);

    const params: SDK.MessageCreateParams = {
      max_tokens: this.maxTokens,
      system: system,
      messages: messages,
      model: this.options.model,
      // @ts-ignore
      tools: this.options.tools
    };
    const apiHeaders: Record<string, string> = {
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15'
    }

    const options = { headers: apiHeaders, signal: this.options?.signal as any }

    const createStream = async () => {
      return this.retryApiCall(async() => {
          const stream = await this.api.messages.create(
            {
              ...params,
              stream: true
            },
            options
          )
          return stream.toReadableStream()
      });
    };

    const stream = await createStream();
    const transform = await this.transformStream<SDK.RawMessageStreamEvent, Message>(
      stream,
      this.chunk.bind(this)
    )

    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        const thread = messages;

        input.forEach((item) => {
          item.content.forEach((content) => {
            const lastThreadIndex = thread.length - 1;
            const lastThread = thread[lastThreadIndex];
            if (content.type === "text") {
              if (lastThread.role === item.role) {
                if (typeof thread[lastThreadIndex].content !== 'string') {
                  const converted = this.fromInputToParam(item)
                  if (typeof converted.content !== 'string') {
                    thread[lastThreadIndex].content.push(...converted.content)
                  }
                }
              } else {
                const converted = this.fromInputToParam(item)
                thread.push({
                  role: converted.role,
                  content: converted.content
                })
              }
            } else if (content.type === "image") {
              if (lastThread.role === item.role) {
                if (typeof thread[lastThreadIndex].content !== 'string') {
                  const converted = this.fromInputToParam(item)
                  if (typeof converted.content !== 'string') {
                    thread[lastThreadIndex].content.push(...converted.content)
                  }
                }
              } else {
                const converted = this.fromInputToParam(item)
                thread.push({
                  role: converted.role,
                  content: converted.content
                })
              }
            } else if (content.type === "tool_result" || content.type === "tool_use") {
              if (lastThread.role === item.role) {
                if (typeof thread[lastThreadIndex].content !== 'string') {
                  const converted = this.fromInputToParam(item);
                  if (typeof converted.content !== 'string') {

                    const newContent = converted.content.filter((c) => {
                      if (c.type === "text") {
                        return c.text !== (thread[lastThreadIndex].content as any).find((c: any) => c.type === "text")?.text
                      }
                      if (c.type === "tool_use") {
                        return c.id !== (thread[lastThreadIndex].content as any).find((c: any) => c.type === "tool_use")?.id
                      }
                      if (c.type === "tool_result") {
                        return c.tool_use_id !== (thread[lastThreadIndex].content as any).find((c: any) => c.type === "tool_result")?.tool_use_id
                      }
                      return true
                    })

                    thread[lastThreadIndex].content.push(
                      ...newContent
                    );
                  }
                }
              }
              else {
                const converted = this.fromInputToParam(item);
                thread.push({
                  role: converted.role,
                  content: converted.content
                });
              }
            }
          })
        })

        params.messages = thread

        const stream =await createStream();
        const transform = await this.transformStream<SDK.RawMessageStreamEvent, Message>(
          stream,
          this.chunk.bind(this)
        )
        return transform
      },
      this.onTool!.bind(this.agent)
    )

    return automodeStream
  }

  private async performTaskNonStream(
    prompt: string,
    system: string,
    input: MessageInput[],
  ): Promise<Message> {

    const messages = this
      .includeLastPrompt(prompt, input)
      .map(this.fromInputToParam);

    const params: SDK.MessageCreateParams = {
      max_tokens: this.maxTokens,
      system: system,
      messages: messages,
      model: this.options.model,
      // @ts-ignore
      tools: this.options.tools,
      stream: false
    };
    const apiHeaders: Record<string, string> = {
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15'
    }
    const options = { headers: apiHeaders, signal: this.options?.signal as any }
    const lastRole = input[input.length - 1]?.role!
    this.agent.log(`[task messages] ${input.length}, last one is ${lastRole}`);

    let sdkMessage: SDK.Messages.Message;
    while (true) {
      // @ts-ignore
      sdkMessage = await this.retryApiCall(() => this.api.messages.create(params, options));
      if (sdkMessage.stop_reason === "end_turn") break;

      this.agent.log(`[task messages]stop_reason is ${sdkMessage.stop_reason}`);
      params.messages.push({
        role: sdkMessage.role,
        content: sdkMessage.content
      });

      if (sdkMessage.stop_reason === "tool_use") {
        const tool = sdkMessage.content.find(
          (content): content is SDK.ToolUseBlock => content.type === 'tool_use',
        );
        this.agent.log(`[task messages]tool is ${tool!.name}`);
        if (tool && this.onTool) {
          await this.onTool.bind(this.agent)(sdkMessage, input);
        } else {
          this.agent.log(`[task messages] tool not found ${tool!.name}`);
        }
      } else {
        params.messages.push({
          role: 'user',
          content: sdkMessage.content
        });
      }
    }

    return {
      id: sdkMessage.id,
      role: sdkMessage.role,
      type: "message",
      content: sdkMessage.content
    };
  }
}