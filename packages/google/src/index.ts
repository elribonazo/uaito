import {
  GoogleGenAI,
  type Content,
  type GenerateContentResponse,
  FinishReason,
  type Part,
  FunctionDeclaration,
  FunctionCallingConfigMode,
} from '@google/genai';
import { v4 } from 'uuid';
import type { GoogleOptions } from './types';
import {
  BaseLLM,
  LLMProvider,
  MessageArray,
  type BaseLLMCache,
  type DeltaBlock,
  type ErrorBlock,
  type Message,
  type MessageInput,
  type OnTool,
  type ReadableStreamWithAsyncIterable,
  type ToolInputDelta,
  type ToolUseBlock,
  type UsageBlock,
} from '@uaito/sdk';

export * from './types';
/**
 * A class for interacting with the Google Gemini API.
 * @class Google
 * @extends {BaseLLM<LLMProvider.Google>}
 */
export class Google extends BaseLLM<LLMProvider.Google, GoogleOptions> {
  private isThinking = false;
  /**
   * The cache for the LLM.
   * @public
   * @type {BaseLLMCache}
   */
  public cache: BaseLLMCache = {
    toolInput: null,
    chunks: '',
    tokens: { input: 0, output: 0 },
  };

  /**
   * Optional callback for tool usage.
   * @type {(OnTool | undefined)}
   */
  public onTool?: OnTool;
  /**
   * The Google API client.
   * @protected
   * @type {GoogleGenAI}
   */
  protected api: GoogleGenAI;
  /**
   * An array of message inputs.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();


  get tools() {
    return this.options.tools ?? [];
  }

  /**
   * Creates an instance of the Google LLM.
   * @param {{ options: GoogleOptions, onTool?: OnTool }} { options, onTool: onToolParam } - The options for the LLM.
   * @param {OnTool} [onTool] - Optional callback for tool usage.
   */
  constructor({ options }: { options: GoogleOptions }, onTool?: OnTool) {
    super(LLMProvider.Google, options);
    if (!options.apiKey) {
      throw new Error('Missing API key for Google provider');
    }
    this.api = new GoogleGenAI({ apiKey: options.apiKey });

    this.onTool = onTool ?? options.onTool;
    
    if (options.verbose) {
      this.log(`[Google LLM] Initialized with model: ${options.model}`);
      this.log(`[Google LLM] Max output tokens: ${this.maxTokens}`);
      this.log(`[Google LLM] Temperature: ${options.temperature ?? 'default'}`);
      this.log(`[Google LLM] TopP: ${options.topP ?? 'default'}`);
      this.log(`[Google LLM] TopK: ${options.topK ?? 'default'}`);
      this.log(`[Google LLM] Tools configured: ${options.tools?.length ?? 0}`);
    }
  }

  /**
   * Gets the maximum number of tokens for the model.
   * @returns {number} The maximum number of tokens.
   */
  get maxTokens() {
    return this.options.maxOutputTokens ?? 8192;
  }

  private fromInputToParam(model: MessageInput): Content | null {
    if (this.options.verbose) {
      this.log(`[Google LLM] Converting message input - Role: ${model.role}, Content blocks: ${model.content.length}`);
    }
    
    const parts: Part[] = model.content
      .map((content): Part | null => {
        switch (content.type) {
          case 'text':
            return { text: content.text };
          case 'image':
            return {
              inlineData: {
                mimeType: content.source.media_type,
                data: content.source.data as string,
              },
            };
          case 'tool_use':
            return {
              functionCall: {
                name: content.name,
                args: content.input as Record<string, unknown>,
              },
            };
          case 'tool_result': {
            const toolUse = this.inputs
              .flatMap((i) => i.content)
              .find(
                (c) => c.type === 'tool_use' && c.id === content.tool_use_id,
              );
            if (!toolUse) return null;
            return {
              functionResponse: {
                name: (toolUse as ToolUseBlock).name,
                response: {
                  content: content.content,
                },
              },
            };
          }
          default:
            return null;
        }
      })
      .filter((part): part is Part => part !== null);

    if (this.options.verbose) {
      this.log(`[Google LLM] Converted ${parts.length} content parts`);
    }

    let role: 'user' | 'model' | 'function';
    switch (model.role) {
      case 'assistant':
        role = 'model';
        break;
      case 'tool':
        role = 'function';
        break;
      default:
        role = 'user';
    }

    if (role === 'function') {
      const functionResponsePart = parts.find((p) => 'functionResponse' in p);
      if (functionResponsePart) {
        return { role, parts: [functionResponsePart] };
      }
      return null;
    }

    return { role, parts };
  }

  private chunk(chunk: GenerateContentResponse): Message | null {
    this.log(`[Google LLM] Chunk received - ${JSON.stringify(chunk)}`);
    const candidate = chunk.candidates?.[0];

    if (this.options.verbose) {
      this.log(`[Google LLM] Processing chunk - Has candidate: ${!!candidate}, Finish reason: ${candidate?.finishReason ?? 'none'}`);
    }

    // Handle usage metadata first
    if (chunk.usageMetadata) {
      this.cache.tokens.input = chunk.usageMetadata.promptTokenCount ?? 0;
      this.cache.tokens.output +=
        chunk.usageMetadata.candidatesTokenCount ?? 0;
      
      if (this.options.verbose) {
        this.log(`[Google LLM] Usage - Input tokens: ${this.cache.tokens.input}, Output tokens: ${this.cache.tokens.output}`);
      }
    }

    if (!candidate) {
      return null;
    }

    const contents = candidate.content?.parts;
    const firstContent = contents?.[0];
    // Check for content first before handling finish reasons
    if (!firstContent) {
      // Only handle finish reasons if there's no content
      if (candidate.finishReason === FinishReason.STOP) {
        if (this.cache.toolInput && this.cache.toolInput.type === 'tool_use') {
          const toolCall = {
            ...this.cache.toolInput,
            input: this.cache.toolInput.input,
          };
          this.cache.toolInput = null;
          return {
            id: v4(),
            role: 'assistant',
            type: 'tool_use',
            content: [toolCall],
          };
        }
        const usageBlock: UsageBlock = {
          type: 'usage',
          output: this.cache.tokens.output,
          input: this.cache.tokens.input,
        };
        return {
          id: v4(),
          role: 'assistant',
          type: 'delta',
          content: [
            {
              stop_reason: 'end_turn',
              stop_sequence: null,
              type: 'delta',
            } as DeltaBlock,
            usageBlock,
          ],
        };
      }
      return null;
    }

    // Handle text content first
    if ('text' in firstContent && firstContent.text) {
      if (this.options.verbose) {
        this.log(`[Google LLM] Text chunk received - Length: ${firstContent.text.length}`);
      }
      
      // Store that we've seen text, so we can emit delta/usage on next iteration
      if (!this.cache.chunks) {
        this.cache.chunks = v4();
      }

      if (firstContent.thought) {
        this.isThinking = true;
        return {
          id: this.cache.chunks,
          role: 'assistant',
          type: 'thinking',
          chunk: true,
          content: [
            {
              type: 'thinking',
              thinking: firstContent.text,
              signature: firstContent.thoughtSignature ?? '',
            },
          ],
        };
      }
      
      if (this.isThinking) {
        this.isThinking = false;
        this.cache.chunks = v4();
      }

      return {
        id: this.cache.chunks,
        role: 'assistant',
        type: 'message',
        chunk: true,
        content: [
          {
            type: 'text',
            text: firstContent.text,
          },
        ],
      };
    }

    // Handle function calls
    if ('functionCall' in firstContent && firstContent.functionCall) {
      const functionCall = firstContent.functionCall;
      
      if (this.options.verbose) {
        this.log(`[Google LLM] Function call detected - Name: ${functionCall.name}`);
      }
      
      if (!this.cache.toolInput) {
        this.cache.toolInput = {
          type: 'tool_use',
          id: v4(),
          name: functionCall.name ?? '',
          input: {},
        };
      }
      (this.cache.toolInput as ToolUseBlock).input = functionCall.args;

      const toolUseBlock: ToolUseBlock = {
        id: v4(),
        type: 'tool_use',
        name: functionCall.name ?? '',
        input: functionCall.args,
      };
      return {
        id: toolUseBlock.id,
        role: 'assistant',
        type: 'tool_use',
        content: [toolUseBlock],
      };
    }

    // Handle tool call finish reason
    // @ts-ignore
    if (candidate.finishReason === FinishReason.TOOL_CALLS) {
      if (this.cache.toolInput && this.cache.toolInput.type === 'tool_use') {
        const toolCall = { ...this.cache.toolInput };
        this.cache.toolInput = null;
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_use',
          content: [toolCall] as ToolUseBlock[],
        };
      }
    }

    // Handle error finish reasons
    if (
      candidate.finishReason &&
      candidate.finishReason !== FinishReason.STOP &&
      // @ts-ignore
      candidate.finishReason !== FinishReason.TOOL_CALLS
    ) {
      const errorBlock: ErrorBlock = {
        type: 'error',
        message: `Stream stopped for reason: ${candidate.finishReason}`,
      };
      return {
        id: v4(),
        role: 'assistant',
        type: 'error',
        content: [errorBlock],
      };
    }

    return null;
  }

  get llmInputs(): Content[] {
    return this.inputs
      .map((input) => this.fromInputToParam(input))
      .filter((c): c is Content => c !== null);
  }

  private getTools(): FunctionDeclaration[] {
    const tools = this.options.tools ?? []
    return tools.map((tool) => {
      return {
        name: tool.name,
        parametersJsonSchema: tool.input_schema,
      }
    })
  }

  async performTaskStream(
    prompt: string,
    chainOfThought: string,
    system: string,
  ): Promise<ReadableStreamWithAsyncIterable<Message>> {
    if (this.options.verbose) {
      this.log(`[Google LLM] Starting task stream`);
      this.log(`[Google LLM] System prompt length: ${system.length}`);
      this.log(`[Google LLM] User prompt length: ${prompt.length}`);
      this.log(`[Google LLM] Chain of thought length: ${chainOfThought.length}`);
    }
    
    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs);

    if (this.options.verbose) {
      this.log(`[Google LLM] Total inputs: ${this.inputs.length}`);
      this.log(`[Google LLM] LLM inputs count: ${this.llmInputs.length}`);
    }

    const createStream = async () => {
      return this.retryApiCall(async () => {
        if (this.options.verbose) {
          this.log(`[Google LLM] Making API call to generateContentStream`);
        }
        
        const result = await this.api.models.generateContentStream({
          contents: this.llmInputs,
          model: this.options.model,
          config: {
            thinkingConfig: {
              includeThoughts: true,
            },
            abortSignal: this.options.signal,
            toolConfig: {
              functionCallingConfig: {
                mode: FunctionCallingConfigMode.AUTO,
              }
            },
            tools:[
              {
                functionDeclarations: this.getTools(),
              }
            ],
            systemInstruction: system,
            maxOutputTokens: this.maxTokens,
            temperature: this.options.temperature,
            topP: this.options.topP,
            topK: this.options.topK,
          }
        });
        
        if (this.options.verbose) {
          this.log(`[Google LLM] API call successful, creating stream`);
        }
        
        const stream = new ReadableStream({
          async start(controller) {
            for await (const chunk of result) {
              controller.enqueue(chunk);
            }
            controller.close();
          }
        });
        return stream as ReadableStreamWithAsyncIterable<GenerateContentResponse>;
      });
    };

    const stream = await createStream();
    const transform = await this.transformStream<
      GenerateContentResponse,
      Message
    >(stream, this.chunk.bind(this));

    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        const stream = await createStream();
        return this.transformStream<GenerateContentResponse, Message>(
          stream,
          this.chunk.bind(this),
        );
      },
      this.onTool,
    );

    return automodeStream;
  }
}