import SDK from '@anthropic-ai/sdk';
import { v4 } from 'uuid';
import { ImageBlockParam, MessageParam, TextBlockParam, ToolResultBlockParam, ToolUseBlockParam } from '@anthropic-ai/sdk/resources';
import { AnthropicOptions, MessageInput, Message, ToolUseBlock, ToolInputDelta, DeltaBlock, OnTool, UsageBlock, ErrorBlock, LLMProvider, BlockType, BaseLLMCache, ReadableStreamWithAsyncIterable } from "../types";
import { BaseLLM } from "./Base";
import { MessageArray } from '../utils';

type AnthropicConstructor = {
  options: AnthropicOptions,
  onTool?: OnTool
}

export class Anthropic extends BaseLLM<LLMProvider.Anthropic, AnthropicOptions> {
  public cache: BaseLLMCache = { toolInput: null, chunks: '',  tokens: { input: 0, output: 0 } }

  private onTool?: OnTool
  protected api: SDK;
  public inputs: MessageArray<MessageInput> = new MessageArray();

  constructor(
    { options }: AnthropicConstructor,
    onTool?: OnTool,
  ) {
    super(LLMProvider.Anthropic, options);
    this.api = new SDK({
      apiKey: options.apiKey,
      dangerouslyAllowBrowser: true
    })
    this.onTool = onTool;
  }

  get maxTokens() {
    return this.options.maxTokens ?? 8192
  }

  private fromInputToParam(model: MessageInput): MessageParam {
    const content: Array<TextBlockParam | ImageBlockParam | ToolUseBlockParam | ToolResultBlockParam>
      = model.content
        .filter((contentModel) =>
          contentModel.type !== "tool_delta" &&
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
      role: model.role,
      content
    } as MessageParam
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
          type: 'tool_use',
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
        this.cache.toolInput = toolInputBlock;
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

  get llmInputs() {
    return this.inputs
    .flatMap((input) => this.fromInputToParam(input))
    .filter((c) => {
      if (Array.isArray(c.content) && c.content.length === 0) {
        return false;
      }
      return true;
    })
    .flat()
  }

   async performTaskStream(
    prompt: string,
    chainOfThought: string,
    system: string,
  ): Promise<ReadableStreamWithAsyncIterable<Message>> {
    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs);

    const params: SDK.MessageCreateParams = {
      max_tokens: this.maxTokens,
      system: system,
      messages:this.llmInputs,
      model: this.options.model,
      tools: this.options.tools
    };
    const apiHeaders: Record<string, string> = {}

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
          return stream.toReadableStream() as ReadableStreamWithAsyncIterable<SDK.RawMessageStreamEvent>
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
        params.messages = this.llmInputs
        const stream =await createStream();
        return this.transformStream<SDK.RawMessageStreamEvent, Message>(
          stream, 
          this.chunk.bind(this)
        )
      },
      this.onTool?.bind(this)
    )
    

    return automodeStream
  }

   async performTaskNonStream(
    prompt: string,
    chainOfThought: string,
    system: string,
  ): Promise<Message> {
    const apiHeaders: Record<string, string> = {
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15'
    }
    const apiOptions = { headers: apiHeaders, signal: this.options?.signal as any }
    this.inputs.push(...this.includeLastPrompt(prompt, chainOfThought, this.inputs))
    let sdkMessage: SDK.Messages.Message;
    while(true) {
      const params: SDK.MessageCreateParamsNonStreaming = {
        max_tokens: this.maxTokens,
        system: system,
        messages: this.inputs.map(this.fromInputToParam),
        model: this.options.model,
        // @ts-ignore
        tools: this.options.tools,
        stream: false
      };
      sdkMessage = await this.retryApiCall(() => this.api.messages.create(params, apiOptions));
      const message = {role: sdkMessage.role, content: sdkMessage.content};
      this.inputs.push(message)

      if (sdkMessage.stop_reason === "end_turn") break;
      if (sdkMessage.stop_reason === "tool_use") {
        const tool = sdkMessage.content.find(
          (content): content is SDK.ToolUseBlock => content.type === 'tool_use',
        );
        console.log(`[task messages]tool is ${tool?.name}`);
        if (tool && this.onTool) {
          await this.onTool.bind(this)(message, this.options.signal);
        } else {
          console.log(`[task messages] tool not found ${tool?.name}`);
        }
        // The next iteration will include any (tool) content appended in onTool if needed
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