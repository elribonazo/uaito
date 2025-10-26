import SDK from '@anthropic-ai/sdk';
import { v4 } from 'uuid';
import type { ImageBlockParam, MessageParam, RedactedThinkingBlockParam, ServerToolUseBlockParam, SignatureDelta, TextBlockParam, ThinkingBlockParam, ToolResultBlockParam, ToolUseBlock, ToolUseBlockParam, WebSearchToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import type { AnthropicOptions } from './types';
import {
  LLMProvider,BaseLLM, MessageArray,  BaseLLMCache, OnTool, MessageInput, ToolInputDelta, ErrorBlock, UsageBlock, DeltaBlock, ReadableStreamWithAsyncIterable, Message
} from '@uaito/sdk';


export * from './types'
/**
 * A class for interacting with the Anthropic API, providing a standardized interface
 * for streaming responses, handling tool usage, and managing conversation history.
 * It extends the `BaseLLM` class to ensure compatibility with the Uaito SDK.
 *
 * @class Anthropic
 * @extends {BaseLLM<LLMProvider.Anthropic, AnthropicOptions>}
 *
 * @example
 * ```typescript
 * const anthropic = new Anthropic({
 *   options: {
 *     apiKey: 'YOUR_ANTHROPIC_API_KEY',
 *     model: AnthropicModels['claude-4-sonnet'],
 *   }
 * });
 *
 * const { response } = await anthropic.performTaskStream("Hello, world!", "", "");
 * for await (const chunk of response) {
 *   // Process each message chunk
 * }
 * ```
 */
export class Anthropic extends BaseLLM<LLMProvider.Anthropic, AnthropicOptions> {
  /**
   * A cache for storing intermediate data during stream processing, such as partial tool inputs
   * and token counts.
   * @public
   * @type {BaseLLMCache}
   */
  public cache: BaseLLMCache = { toolInput: null, chunks: '',  tokens: { input: 0, output: 0 } }

  /**
   * An optional callback function that is triggered when a tool is used.
   * @type {(OnTool | undefined)}
   */
  public onTool?: OnTool
  /**
   * The underlying Anthropic SDK client.
   * @protected
   * @type {SDK}
   */
  protected api: SDK;
  /**
   * An array that holds the history of messages for the conversation.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();

  /**
   * Creates an instance of the `Anthropic` LLM client.
   * @param {{ options: AnthropicOptions, onTool?: OnTool }} params - The configuration options for the client.
   * @param {OnTool} [onTool] - An optional callback for handling tool usage, which can also be provided in the options.
   */
  constructor(
    { options }: { options: AnthropicOptions,onTool?: OnTool},
    onTool?: OnTool,
  ) {
    super(LLMProvider.Anthropic, options);
    this.api = new SDK({
      apiKey: options.apiKey,
      dangerouslyAllowBrowser: true
    })
    this.onTool = onTool ?? options.onTool;
  }

  /**
   * Gets the maximum number of tokens to generate in the response.
   * Defaults to 8192 if not specified in the options.
   * @returns {number} The maximum number of tokens.
   */
  get maxTokens() {
    return this.options.maxTokens ?? 8192
  }

  /**
   * Converts a Uaito SDK `MessageInput` object into the format expected by the Anthropic API (`MessageParam`).
   * This method handles the mapping of different content block types.
   * @private
   * @param {MessageInput} model - The `MessageInput` object to convert.
   * @returns {MessageParam} The converted `MessageParam` object.
   */
  private fromInputToParam(model: MessageInput): MessageParam {

    const filteredContent = model.content
      .filter((contentModel) =>
        contentModel.type !== "tool_delta" &&
        contentModel.type !== "audio" &&
        contentModel.type !== 'usage' &&
        contentModel.type !== "delta" &&
        contentModel.type !== "error" &&
        contentModel.type !== "file" && 
        contentModel.type !== "progress"
      );

    const content = filteredContent.map((contentModel) => {
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
      } else if (contentModel.type === "signature_delta") {
        const signatureDeltaBlock: SignatureDelta = {
          type: 'signature_delta',
          signature: contentModel.signature
        }
        return signatureDeltaBlock
      } else if (contentModel.type === "thinking") {
        const thinkingBlock: ThinkingBlockParam = {
          type: 'thinking',
          thinking: contentModel.thinking,
          signature: contentModel.signature
        }
        return thinkingBlock
      } else if (contentModel.type === "redacted_thinking") {
        const redactedThinkingBlock: RedactedThinkingBlockParam = {
          type: 'redacted_thinking',
          data: contentModel.data
        }
        return redactedThinkingBlock
      } else if (contentModel.type === "server_tool_use") {
        const serverToolUseBlock: ServerToolUseBlockParam = {
          type: 'server_tool_use',
          id: contentModel.id,
          input: contentModel.input,
          name: contentModel.name
        }
        return serverToolUseBlock
      } else if (contentModel.type === "web_search_tool_result") {
        const webSearchToolResultBlock: WebSearchToolResultBlockParam = {
          type: 'web_search_tool_result',
          content: contentModel.content,
          tool_use_id: contentModel.tool_use_id
        }
        return webSearchToolResultBlock
      }

      const toolResultBlock: ToolResultBlockParam = {
        is_error: contentModel.isError,
        tool_use_id: contentModel.tool_use_id,
        type: contentModel.type,
        content: (contentModel.content ?? [])
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
          }) as (TextBlockParam | ImageBlockParam)[]
      }
      return toolResultBlock
    }).filter(Boolean) // Remove null values from signature_delta entries
    
    return {
      role: content.find((c) => c.type === 'tool_result') ? 'user' : model.role,
      content
    } as MessageParam
  }

  /**
   * Processes a chunk from the Anthropic API's raw message stream and transforms it into a
   * standardized Uaito SDK `Message` object. This method is the core of the stream processing logic.
   * @private
   * @param {SDK.RawMessageStreamEvent} chunk - The raw chunk from the stream.
   * @returns {(Message | null)} The processed `Message` object, or `null` if the chunk does not need to be emitted.
   */
  private chunk(
    chunk: SDK.RawMessageStreamEvent
  ): Message | null {

    console.log('Processing chunk:', chunk.type, chunk);
    
    if (chunk.type === "content_block_start") {
      this.cache.chunks = v4()
      if (chunk.content_block.type === 'tool_use') {
       
        this.cache.toolInput = chunk.content_block
        this.cache.toolInput.input = "";
        (this.cache.toolInput as any).partial = ""
        const toolUseBlock: ToolUseBlock = chunk.content_block
        this.cache.toolInput = toolUseBlock;
        return {
          id:  this.cache.chunks,
          role: 'assistant',
          type: 'tool_delta',
          content: [
            {
              type: 'tool_delta',
              name: chunk.content_block.name,
              partial: ''
            }
          ]
        }
      } else if (chunk.content_block.type === 'thinking') {
        return {
          id:  this.cache.chunks,
          role: 'assistant',
          type: 'thinking',
          chunk: true,
          content: [
            {
              type: 'thinking',
              thinking: chunk.content_block.thinking || '',
              signature: ''
            }
          ]
        }
      } else if (chunk.content_block.type === 'redacted_thinking') {
        return {
          id:  this.cache.chunks,
          role: 'assistant',
          type: 'redacted_thinking',
          content: [
            {
              type: 'redacted_thinking',
              data: chunk.content_block.data || ''
            }
          ]
        }
      }
    } else if (chunk.type === "content_block_delta") {
      const delta = chunk.delta;
      if (delta.type === 'text_delta') {
        return {
          id: this.cache.chunks ?? v4(),
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
      } else if (delta.type === 'thinking_delta') {
        return {
          id:  this.cache.chunks ?? v4(),
          role: 'assistant',
          type: 'thinking',
          chunk: true,
          content: [
            {
              type: 'thinking',
              thinking: delta.thinking || '',
              signature: '' // Signature will be provided separately via signature_delta
            }
          ]
        }
      } else if (delta.type === 'input_json_delta') {
        this.cache.chunks = null
        const toolInputBlock: ToolInputDelta = {
          type: 'tool_delta',
          partial: delta.partial_json ?? ''
        }
        if (!this.cache.toolInput) {
          (this.cache.toolInput as unknown) = {
            ...toolInputBlock,
            partial: ''
          };
        }
        
        (this.cache.toolInput as {partial: string}).partial += delta.partial_json ?? '';

        try {
          (this.cache.toolInput as {input: unknown}).input = JSON.parse(toolInputBlock.partial)
        } catch  {
        }
       
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_delta',
          content: [toolInputBlock]
        }
      } else if (delta.type === "signature_delta") {
        return {
          id:  this.cache.chunks ?? v4(),
          role: 'assistant',
          type: 'signature_delta',
       
          content: [
            {
              type: 'signature_delta',
              signature: delta.signature || ''
            }
          ]
        }
      } 
    } else if (chunk.type === "message_delta") {
      this.cache.tokens.output = chunk.usage.output_tokens;
      this.cache.chunks = null;

      if (chunk.delta.stop_reason === "tool_use") {
        const isTool = this.cache.toolInput?.type === "tool_use";
        if (isTool) {
          (this.cache.toolInput as {partial: string}).partial = (this.cache.toolInput as {partial: string}).partial.replace(/undefined(.*)$/, '$1');
          const toolInput = this.cache.toolInput as SDK.ToolUseBlock;
          const cached = (this.cache.toolInput as {partial: string});
          try {
            toolInput.input = JSON.parse((cached as {partial: string}).partial)
            delete ((toolInput.input as {partial?: string}).partial)
          } catch  {
          }
          return {
            id: v4(),
            role: 'assistant',
            type: 'tool_use',
            content: [toolInput]
          }
        }
      }else if (chunk.delta.stop_reason === "max_tokens") {
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
            {
              ...chunk.delta,
              type: 'delta'
            } as DeltaBlock,
            usageBlock
          ]
        }
      }
    } else if (chunk.type === "message_start") {
      this.cache.chunks = chunk.message.id;
      this.cache.toolInput = null
      this.cache.tokens.input = chunk.message.usage.input_tokens;
      this.cache.tokens.output = chunk.message.usage.output_tokens ?? 0;
      const usageBlock: UsageBlock = {
        type: "usage",
        output: this.cache.tokens.output ?? 0,
        input: this.cache.tokens.input,
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

  /**
   * Gets the formatted message history for the LLM, converting each message from the
   * Uaito SDK format to the Anthropic API format.
   * @returns {any[]} The formatted LLM inputs.
   */
  get llmInputs() {
    const messages = this.inputs
      .flatMap((input) => this.fromInputToParam(input))
      .filter((c) => {
        if (c.content && Array.isArray(c.content) && c.content.length === 0) {
          return false;
        }
        return true;
      })
      .flat();
    return messages;
  }

  /**
   * Executes a task by sending the prompt and conversation history to the Anthropic API
   * and returns the response as a stream. It handles the inclusion of the latest prompt,
   * setting up the stream, and applying transformations for auto-mode and tool usage.
   * @param {string | BlockType[]} prompt - The user's prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of `Message` objects.
   */
   async performTaskStream<Input extends SDK.RawMessageStreamEvent, Output extends Message>(
    prompt,
    chainOfThought,
    system,
  ): Promise<ReadableStreamWithAsyncIterable<Message>> {
    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs);
    const params: SDK.MessageCreateParams = {
      max_tokens: this.maxTokens,
      system: system,
      messages:this.llmInputs,
      model: this.options.model,
      tools: this.options.tools,
      thinking: {
        type: "enabled",
        budget_tokens: this.maxTokens - 1000
    },
    };
    const apiHeaders: Record<string, string> = {}
    const options = { headers: apiHeaders, signal: this.options?.signal }

    const createStream = async () => {
      return this.retryApiCall(async() => {
          const stream = await this.api.messages.create(
            {
              ...params,
              stream: true
            },
            options
          )
          return stream.toReadableStream() as ReadableStreamWithAsyncIterable<Input>
      });
    };

    const stream = await createStream();
    const transform = await this.transformStream<Input, Output>( stream, this.chunk.bind(this))

    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        params.messages = this.llmInputs
        const stream = await createStream();
        return this.transformStream<Input, Output>(  stream,    this.chunk.bind(this)  )
      },
      this.onTool
    )
    

    return automodeStream
  }

   
}