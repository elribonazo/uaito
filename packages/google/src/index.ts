import {
  GoogleGenAI,
  type Content,
  type GenerateContentResponse,
  FinishReason,
  type Part,
  type FunctionDeclaration,
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
  type ToolUseBlock,
  type UsageBlock,
  type BlockType,
} from '@uaito/sdk';

export * from './types';
/**
 * A class for interacting with Google's Generative AI models (e.g., Gemini).
 * It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK,
 * handling stream processing, tool usage, and message format conversion.
 *
 * @class Google
 * @extends {BaseLLM<LLMProvider.Google, GoogleOptions>}
 *
 * @example
 * ```typescript
 * const google = new Google({
 *   options: {
 *     apiKey: 'YOUR_GOOGLE_API_KEY',
 *     model: GoogleModels['gemini-2.5'],
 *   }
 * });
 *
 * const { response } = await google.performTaskStream("What is the capital of France?", "", "");
 * for await (const chunk of response) {
 *   // Process each message chunk
 * }
 * ```
 */
export class Google extends BaseLLM<LLMProvider.Google, GoogleOptions> {
  private isThinking = false;
  /**
   * A cache for storing intermediate data during stream processing, such as partial tool inputs
   * and token counts.
   * @public
   * @type {BaseLLMCache}
   */
  public cache: BaseLLMCache = {
    toolInput: null,
    chunks: '',
    tokens: { input: 0, output: 0 },
  };

  /**
   * An optional callback function that is triggered when a tool is used.
   * @type {(OnTool | undefined)}
   */
  public onTool?: OnTool;
  /**
   * The underlying Google Generative AI client.
   * @protected
   * @type {GoogleGenAI}
   */
  protected api: GoogleGenAI;
  /**
   * An array that holds the history of messages for the conversation.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();


  /**
   * Gets the list of tools available to the agent.
   * @returns {any[]} The tools.
   */
  get tools() {
    return this.options.tools ?? [];
  }

  /**
   * Creates an instance of the `Google` LLM client.
   * @param {{ options: GoogleOptions }} params - The configuration options for the client.
   * @param {OnTool} [onTool] - An optional callback for handling tool usage, which can also be provided in the options.
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
   * Gets the maximum number of output tokens for the model.
   * Defaults to 8192 if not specified in the options.
   * @returns {number} The maximum number of tokens.
   */
  get maxTokens() {
    return this.options.maxOutputTokens ?? 8192;
  }

  /**
   * Converts a Uaito SDK `MessageInput` object into the `Content` format expected by the Google Generative AI API.
   * It maps various block types (text, image, tool use, etc.) to their corresponding `Part` representations.
   * @private
   * @param {MessageInput} model - The `MessageInput` object to convert.
   * @returns {Content | null} The converted `Content` object, or `null` if the message should be filtered out.
   */
  private fromInputToParam(model: MessageInput): Content | null {
    if (this.options.verbose) {
      this.log(`[Google LLM] Converting message input - Role: ${model.role}, Content blocks: ${model.content.length}`);
    }

    const parts: Part[] = model.content
      .map((content): Part | null => {
        switch (content.type) {
          case 'text':
            return { text: content.text };
          case 'thinking':
            return { thought: true, text: content.thinking };
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

  /**
   * Processes a chunk from the Google Generative AI stream (`GenerateContentResponse`) and transforms it
   * into a standardized Uaito SDK `Message` object. This method handles text deltas, tool calls,
   * thinking steps, and stop reasons.
   * @private
   * @param {GenerateContentResponse} chunk - The raw chunk from the stream.
   * @returns {(Message | null)} The processed `Message` object, or `null` if the chunk is empty or doesn't need to be emitted.
   */
  private chunk(chunk: GenerateContentResponse): Message | null {
    this.log(`[Google LLM] Chunk received - ${JSON.stringify(chunk)}`);
    const candidate = chunk.candidates?.[0];

    if (this.options.verbose) {
      this.log(`[Google LLM] Processing chunk - Has candidate: ${!!candidate}, Finish reason: ${candidate?.finishReason ?? 'none'}`);
    }
    if (!candidate) {
      return null;
    }

    const contents = candidate.content?.parts || [];
    const [content] = contents;

    const inputTokens = chunk.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = chunk.usageMetadata?.totalTokenCount ?? 0;

    this.cache.tokens.input += inputTokens;
    this.cache.tokens.output += outputTokens - inputTokens;

    if (!this.cache.chunks) {
      this.cache.chunks = v4();
    }

    if (content) {

      if (content.text) {
        if (this.options.verbose) {
          this.log(`[Google LLM] Text chunk received - Length: ${content.text.length}`);
        }

        if (content.thought) {
          this.isThinking = true;
          return {
            id: this.cache.chunks,
            role: 'assistant',
            type: 'thinking',
            chunk: true,
            content: [
              {
                type: 'thinking',
                thinking: content.text,
                signature: content.thoughtSignature ?? '',
              },
            ],
          };
        }

        if (this.isThinking) {
          this.isThinking = false;
          this.cache.chunks = v4();
        }

        const blocks: BlockType[] = [
          {
            type: 'text',
            text: content.text,
          },
        ];
  
        if (candidate.finishReason) {
          if (candidate.finishReason === FinishReason.STOP) {
            const usageBlock: UsageBlock = {
              type: 'usage',
              output: this.cache.tokens.output,
              input: this.cache.tokens.input,
            };
            const deltaBlock: DeltaBlock = {
              type: 'delta',
              stop_reason: 'end_turn',
              stop_sequence: null,
            };
            blocks.push(usageBlock);
            blocks.push(deltaBlock);
          } else {
            const errorBlock: ErrorBlock = {
              type: 'error',
              message: `Stream stopped for reason: ${candidate.finishReason}`,
            };
            blocks.push(errorBlock);
          }

        }
        return {
          id: this.cache.chunks,
          role: 'assistant',
          type: 'message',
          chunk: true,
          content: blocks
        };
      }

      if (content.functionCall) {
        const functionCall = content.functionCall;
  
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
    }
    return null;
  }

  /**
   * Gets the formatted message history for the LLM, converting each message from the
   * Uaito SDK format to the Google Generative AI API's `Content` format.
   * @returns {Content[]} The formatted LLM inputs.
   */
  get llmInputs(): Content[] {
    return this.inputs
      .map((input) => this.fromInputToParam(input))
      .filter((c): c is Content => c !== null);
  }

  /**
   * Converts the tools defined in the options into the `FunctionDeclaration` format
   * expected by the Google Generative AI API.
   * @private
   * @returns {FunctionDeclaration[]} An array of function declarations.
   */
  private getTools(): FunctionDeclaration[] {
    const tools = this.options.tools ?? []
    return tools.map((tool) => {
      return {
        name: tool.name,
        parametersJsonSchema: tool.input_schema,
      }
    })
  }

  /**
   * Executes a task by sending the prompt and conversation history to the Google Generative AI API
   * and returns the response as a stream. It handles API retries, stream transformations,
   * and tool usage via `transformAutoMode`.
   * @param {string | BlockType[]} prompt - The user's prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of `Message` objects.
   */
  async performTaskStream(
    prompt,
    chainOfThought,
    system,
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
            tools: [
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
            try {
              for await (const chunk of result) {
                controller.enqueue(chunk);
              }
              controller.close();
            } catch (error) {
              if (error.message.includes('aborted')) {
                controller.close();
              } else {
                controller.error(error);
              }
            }
          }
        });
        return stream as ReadableStreamWithAsyncIterable<GenerateContentResponse>;
      });
    };

    const stream = await createStream();
    const transform = await this.transformStream<GenerateContentResponse, Message>(stream, this.chunk.bind(this));


    return this.transformAutoMode(
      transform,
      async () => {
        const stream = await createStream();
        return this.transformStream<GenerateContentResponse, Message>(stream, this.chunk.bind(this));
      },
      this.onTool,
    );
  }
}