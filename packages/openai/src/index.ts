import OpenAIAPI from 'openai';
import { v4 } from 'uuid';
import { BaseLLM, LLMProvider,
  Message,
  MessageInput,
  ToolUseBlock,
  OnTool,
  DeltaBlock,
  UsageBlock,
  BaseLLMCache,
  ReadableStreamWithAsyncIterable,
  ToolInputDelta,
  MessageArray,
  blobToDataURL,
  ImageBlock,
  BlockType
 } from "@uaito/sdk";
import type {
  ResponseStreamEvent,
  ResponseCreateParamsStreaming,
  ResponseInputItem,
  ResponseInputMessageContentList,
  FunctionTool,
  Tool as ResponsesTool,
  ResponseInputText,
  ResponseInputImage,
  ResponseOutputItem,
  ResponseFunctionToolCallItem,
  ResponseTextDeltaEvent,
  ResponseOutputItemAddedEvent,
  ResponseFunctionCallArgumentsDeltaEvent,
  ResponseFunctionCallArgumentsDoneEvent,
  ResponseCompletedEvent,
  ResponseErrorEvent,
} from 'openai/resources/responses/responses';
import type { Stream } from 'openai/streaming';
import { ImageGenConfig, OpenAIImageModels, type OpenAIOptions } from './types';

export * from './types';


type llmTypeToOptions = {
  [LLMProvider.OpenAI]: OpenAIOptions<LLMProvider.OpenAI>,
  [LLMProvider.Grok]: OpenAIOptions<LLMProvider.Grok>,
}

type OpenAIProviderType = LLMProvider.OpenAI | LLMProvider.Grok;

/**
 * A more complete implementation of the OpenAI-based LLM,
 * mirroring the structure and patterns found in the Anthropic class.
 */
export class OpenAI<T extends OpenAIProviderType> extends BaseLLM<T, llmTypeToOptions[T]> {
  /**
   * Optional callback for tool usage.
   * @type {(OnTool | undefined)}
   */
  public onTool?: OnTool;
  /**
   * The OpenAI API client.
   * @private
   * @type {OpenAIAPI}
   */
  private openai: OpenAIAPI;
  /**
   * An array of message inputs.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();

  /**
   * The cache for the LLM.
   * @public
   * @type {BaseLLMCache & { imageGenerationCallId: string | null, imageBase64: string | null, thinkingId?: string | null, textId?: string | null }}
   */
  public cache: BaseLLMCache & {
    imageGenerationCallId: string | null,
    imageBase64: string | null,
    thinkingId?: string | null,
    textId?: string | null
  } = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 }, imageGenerationCallId: null, imageBase64: null }

  /**
   * Tracks function calls in the current turn.
   * @private
   * @type {Record<string, { name?: string, call_id?: string }>}
   */
  private functionCallsByItemId: Record<string, { name?: string, call_id?: string }> = {};

  /**
   * Tracks the current output item being processed.
   * @private
   * @type {({ itemId: string, type: 'reasoning' | 'message' | 'function_call', contentIndex?: number } | null)}
   */
  private currentOutputItem: {
    itemId: string,
    type: 'reasoning' | 'message' | 'function_call',
    contentIndex?: number
  } | null = null;

  /**
   * Internal state for extracting <thinking> / <think> tags from streamed text.
   * @private
   * @type {({ inThinking: boolean, openTag: '' | '<thinking>' | '<think>', bufferTag: string, carryVisible: string, carryThinking: string } | undefined)}
   */
  private _thinkingState?: {
    inThinking: boolean,
    openTag: '' | '<thinking>' | '<think>',
    bufferTag: string,
    carryVisible: string,
    carryThinking: string,
  };

  /**
   * Internal state for extracting <tool_call> tags (for Grok compatibility).
   * @private
   * @type {({ inToolCall: boolean, bufferTag: string, carryVisible: string, carryToolCall: string, completedToolCalls: string[] } | undefined)}
   */
  private _toolCallState?: {
    inToolCall: boolean,
    bufferTag: string,
    carryVisible: string,
    carryToolCall: string,
    completedToolCalls: string[],
  };

  private imageGenConfig: ImageGenConfig | null = null;

  /**
   * Creates an instance of the OpenAI LLM.
   * @param {{ options: OpenAIOptions }} { options } - The options for the LLM.
   * @param {OnTool} [onTool] - Optional callback for tool usage.
   */
  constructor(
    { options }: { options: llmTypeToOptions[T] },
    onTool?: OnTool
  ) {
    super(options.type as T, options);

    const defaultBaseUrl = options.baseURL ?? options.type === LLMProvider.OpenAI ? undefined : "https://api.x.ai/v1";
    // Initialize the OpenAI client
    this.openai = new OpenAIAPI({
      apiKey: options.apiKey,
      baseURL: defaultBaseUrl,
      
    });

    this.imageGenConfig = options.imageGenConfig ?? null;

    this.onTool = onTool ?? options.onTool;
  }

  /**
   * Return max tokens or a default (e.g. 4096).
   * @returns {number} The maximum number of tokens.
   */
  get maxTokens() {
    return this.options.maxTokens ?? 4096;
  }

  /**
   * Converts a MessageInput object to a ResponseInputItem object.
   * @private
   * @param {MessageInput} model - The MessageInput object to convert.
   * @returns {ResponseInputItem} The converted ResponseInputItem object.
   */
  private fromInputToParam(model: MessageInput): ResponseInputItem {
    const mappedRole = (model.role === 'tool' ? 'user' : model.role) as 'user' | 'assistant' | 'system' | 'developer';
    const contents: ResponseInputMessageContentList = [] as ResponseInputMessageContentList;
    const filteredContent = model.content
      .filter((c) =>
        c.type !== "tool_delta" &&
        c.type !== "usage" &&
        c.type !== "delta" &&
        c.type !== "error"
      );

    // Handle tool results
    // NOTE: We intentionally encode tool results as a normal user message instead of
    // function_call_output. The Responses API expects function_call_output to reference
    // a function call id from the SAME streaming session. Our SDK restarts a new
    // streaming session after tool execution, so sending function_call_output will cause
    // "No tool call found for function call with output id" errors. Treating tool
    // results as user input avoids that constraint while preserving the content.
    const toolResult = filteredContent.find((c) => c.type === 'tool_result');
    if (toolResult && toolResult.type === 'tool_result' && toolResult.name !== 'image_generation') {
      const textContent = (toolResult.content ?? [])
        .map((inner) => {
          if (inner.type === 'text') return inner.text;
          try { return JSON.stringify(inner); } catch { return `[Unhandled content type: ${inner.type}]`; }
        })
        .join('\n\n');

      return {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `[TOOL RESULT from ${toolResult.name}]\n${textContent}\n[END TOOL RESULT]\n\nPlease use the above tool result to complete your response to the user. Do not make the same tool call again unless you need different parameters.`,
          } as ResponseInputText,
        ],
      } as ResponseInputItem;
    }

    for (const c of filteredContent) {
      if (c.type === "text") {
        const typeForRole = mappedRole === 'assistant' ? 'output_text' : 'input_text';
        contents.push({ type: typeForRole as 'input_text' | 'output_text', text: c.text } as ResponseInputText);
      } else if (c.type === "image") {
        // Skip images that are references to image generation calls (they'll be handled separately)
        if (c.imageGenerationCallId) {
          continue;
        }
        if (c.source) {
          const dataUrl = `data:${c.source.media_type};base64,${c.source.data}`;
          contents.push({ type: 'input_image', image_url: dataUrl, detail: 'auto' } as ResponseInputImage);
        }
      } else if (c.type === "tool_use") {
        // Tool calls are outputs from the model; do not include them as inputs.
        continue;
      }
    }

    return {
      type: 'message',
      role: mappedRole,
      content: contents,
    } as ResponseInputItem;
  }

  /**
   * Gets the tools available to the LLM.
   * @returns {(ResponsesTool[] | undefined)} The available tools.
   */
  get tools() {
    const functionTools: ResponsesTool[] | undefined = this.options.tools
      ?.filter((tool) =>{
        if (this.options.type === LLMProvider.OpenAI  && tool.name !== "browseWebPage" && tool.name !== "tavilySearch"){
          return true;
        }
        return true;
        }
      )
      .map((tool) => {
        const parsedTool = JSON.parse(JSON.stringify(tool));
        const functionTool: FunctionTool = {
          type: 'function',
          name: parsedTool.name,
          description: parsedTool.description,
          parameters: parsedTool.input_schema,
          strict: false,
        };
        return functionTool;
      });
    return functionTools;
  }


  /**
   * Gets the inputs for the LLM.
   * @returns {ResponseInputItem[]} The LLM inputs.
   */
  get llmInputs(): ResponseInputItem[] {
    const result: ResponseInputItem[] = [];
    
    for (const input of this.inputs) {
      // Check if this input contains an image with imageGenerationCallId
      const imageGenCall = input.content.find(
        (c) => c.type === 'image' && c.imageGenerationCallId !== undefined
      );
      
      // Convert the normal input
      const convertedInput = this.fromInputToParam(input);
      // Only add if it has content
      if (convertedInput.type === 'message') {
        const content = (convertedInput as ResponseInputItem & { content?: unknown[] }).content ?? [];
        if (Array.isArray(content) && content.length > 0) {
          result.push(convertedInput);
        }
      } else {
        result.push(convertedInput);
      }
      
      // If we found an image generation call reference, add it as a separate item
      if (imageGenCall && imageGenCall.type === 'image' && imageGenCall.imageGenerationCallId) {
        result.push({
          type: 'image_generation_call',
          id: imageGenCall.imageGenerationCallId,
        } as ResponseInputItem);
      }
    }
    return result;
  }


  /**
   * Internal state for extracting <thinking> / <think> tags from streamed text.
   * @private
   * @returns {{ inThinking: boolean, openTag: '' | '<thinking>' | '<think>', bufferTag: string, carryVisible: string, carryThinking: string }} The thinking state.
   */
  private get thinkingState() {
    this._thinkingState ??= {
      inThinking: false,
      openTag: '',
      bufferTag: '',
      carryVisible: '',
      carryThinking: '',
    };
    return this._thinkingState as {
      inThinking: boolean,
      openTag: '' | '<thinking>' | '<think>',
      bufferTag: string,
      carryVisible: string,
      carryThinking: string,
    };
  }

  /**
   * Processes a delta of text to extract thinking tags.
   * @private
   * @param {string} delta - The delta of text to process.
   */
  private processThinkingDelta(delta: string) {
    const state = this.thinkingState;
    let s = (state.bufferTag || '') + (delta || '');
    state.bufferTag = '';

    const closeTagsByOpen: Record<string, string> = {
      '<thinking>': '</thinking>',
      '<think>': '</think>'
    };

    while (s.length > 0) {
      if (!state.inThinking) {
        const idxThinking = s.indexOf('<thinking>');
        const idxThink = s.indexOf('<think>');
        const hasOpen = idxThinking !== -1 || idxThink !== -1;
        if (!hasOpen) {
          state.carryVisible += s;
          s = '';
          break;
        }
        const idx = Math.min(...[idxThinking !== -1 ? idxThinking : Infinity, idxThink !== -1 ? idxThink : Infinity]);
        const tag = idx === idxThinking ? '<thinking>' : '<think>';
        if (idx > 0) {
          state.carryVisible += s.slice(0, idx);
        }
        state.inThinking = true;
        state.openTag = tag as '<thinking>' | '<think>';
        s = s.slice(idx + tag.length);
        continue;
      } else {
        const closeTag = closeTagsByOpen[state.openTag] || '</thinking>';
        const closeIdx = s.indexOf(closeTag);
        if (closeIdx === -1) {
          state.carryThinking += s;
          s = '';
          break;
        }
        if (closeIdx > 0) {
          state.carryThinking += s.slice(0, closeIdx);
        }
        state.inThinking = false;
        state.openTag = '';
        s = s.slice(closeIdx + closeTag.length);
        continue;
      }
    }

    // Keep at most a small potential tag prefix at the end for next round
    const candidates = ['<thinking>', '</thinking>', '<think>', '</think>'];
    const maxLen = Math.max(...candidates.map((t) => t.length));
    const tail = (state.inThinking ? state.carryThinking : state.carryVisible).slice(-maxLen + 1);
    for (const cand of candidates) {
      const need = cand.length - 1;
      if (tail && cand.startsWith(tail) && tail.length <= need) {
        state.bufferTag = tail;
        if (state.inThinking) {
          state.carryThinking = state.carryThinking.slice(0, -tail.length);
        } else {
          state.carryVisible = state.carryVisible.slice(0, -tail.length);
        }
        break;
      }
    }
  }

  /**
   * Takes the buffered thinking chunk.
   * @private
   * @returns {string} The thinking chunk.
   */
  private takeThinkingChunk(): string {
    const state = this.thinkingState;
    const out = state.carryThinking;
    state.carryThinking = '';
    return out;
  }

  /**
   * Takes the buffered visible chunk.
   * @private
   * @returns {string} The visible chunk.
   */
  private takeVisibleChunk(): string {
    const state = this.thinkingState;
    const out = state.carryVisible;
    state.carryVisible = '';
    return out;
  }

  /**
   * Internal state for extracting <tool_call> tags from streamed text.
   * @private
   * @returns {{ inToolCall: boolean, bufferTag: string, carryVisible: string, carryToolCall: string, completedToolCalls: string[] }} The tool call state.
   */
  private get toolCallState() {
    this._toolCallState ??= {
      inToolCall: false,
      bufferTag: '',
      carryVisible: '',
      carryToolCall: '',
      completedToolCalls: [],
    };
    return this._toolCallState as {
      inToolCall: boolean,
      bufferTag: string,
      carryVisible: string,
      carryToolCall: string,
      completedToolCalls: string[],
    };
  }

  /**
   * Processes a delta of text to extract tool_call tags.
   * @private
   * @param {string} delta - The delta of text to process.
   */
  private processToolCallDelta(delta: string) {
    const state = this.toolCallState;
    let s = (state.bufferTag || '') + (delta || '');
    state.bufferTag = '';

    const openTag = '<tool_call>';
    const closeTag = '</tool_call>';

    while (s.length > 0) {
      if (!state.inToolCall) {
        const idx = s.indexOf(openTag);
        if (idx === -1) {
          state.carryVisible += s;
          s = '';
          break;
        }
        if (idx > 0) {
          state.carryVisible += s.slice(0, idx);
        }
        state.inToolCall = true;
        s = s.slice(idx + openTag.length);
        continue;
      } else {
        const closeIdx = s.indexOf(closeTag);
        if (closeIdx === -1) {
          state.carryToolCall += s;
          s = '';
          break;
        }
        if (closeIdx > 0) {
          state.carryToolCall += s.slice(0, closeIdx);
        }
        // Complete tool call found
        state.completedToolCalls.push(state.carryToolCall.trim());
        state.carryToolCall = '';
        state.inToolCall = false;
        s = s.slice(closeIdx + closeTag.length);
        continue;
      }
    }

    // Keep at most a small potential tag prefix at the end for next round
    const candidates = [openTag, closeTag];
    const maxLen = Math.max(...candidates.map((t) => t.length));
    const tail = (state.inToolCall ? state.carryToolCall : state.carryVisible).slice(-maxLen + 1);
    for (const cand of candidates) {
      const need = cand.length - 1;
      if (tail && cand.startsWith(tail) && tail.length <= need) {
        state.bufferTag = tail;
        if (state.inToolCall) {
          state.carryToolCall = state.carryToolCall.slice(0, -tail.length);
        } else {
          state.carryVisible = state.carryVisible.slice(0, -tail.length);
        }
        break;
      }
    }
  }

  /**
   * Takes the buffered visible chunk from tool call processing.
   * @private
   * @returns {string} The visible chunk.
   */
  private takeToolCallVisibleChunk(): string {
    const state = this.toolCallState;
    const out = state.carryVisible;
    state.carryVisible = '';
    return out;
  }

  /**
   * Takes completed tool calls.
   * @private
   * @returns {string[]} Array of completed tool call JSON strings.
   */
  private takeCompletedToolCalls(): string[] {
    const state = this.toolCallState;
    const out = [...state.completedToolCalls];
    state.completedToolCalls = [];
    return out;
  }
      

  /**
   * Performs a task stream using the LLM.
   * @param {string} prompt - The user prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages.
   */
  async performTaskStream(
    prompt,
    chainOfThought,
    system,
  ): Promise<ReadableStreamWithAsyncIterable<Message>> {
    const {
      model:imageModel = OpenAIImageModels['gpt-image-1-mini'],
      quality = 'low',
      output_format = 'png',
      size = 'auto',
      input_fidelity = 'low'
    } = this.imageGenConfig ?? {};

    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs);
    const tools= (this.tools && this.tools.length > 0 ? this.tools : []) 

    if (this.options.type === LLMProvider.OpenAI) {
      tools.push({
        type: 'image_generation',
        size: size,
        output_format: output_format,
        model:imageModel as any,
        input_fidelity,
        quality
      })
      tools.push({
        type: "web_search",
        search_context_size: "high"
      });
    } 

    if (this.options.type === LLMProvider.Grok) {
      system += `\n\n When using tools, use the following format: <tool_call>{"name":"tool_name","parameters":{"parameter_name":"parameter_value"}}</tool_call>`
    }

    const request: ResponseCreateParamsStreaming = {
      model: this.options.model,
      input: this.llmInputs as ResponseCreateParamsStreaming['input'],
      instructions: system,
      max_output_tokens: this.maxTokens,
      stream: true,
      tools,
      reasoning:this.options.type === LLMProvider.OpenAI ? {
        effort:'low'
      } : undefined,
    };

    // Reset usage and per-turn state
    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;
    this.functionCallsByItemId = {};
    this.currentOutputItem = null;

    const createStream = async (params: ResponseCreateParamsStreaming) => {
      return this.retryApiCall(async () => {
        const stream = await this.openai.responses.create(params, {signal: this.options.signal}) as Stream<ResponseStreamEvent>;
        return stream.toReadableStream() as ReadableStreamWithAsyncIterable<ResponseStreamEvent>
      });
    };

    const stream = await createStream(request);
    const transform = await this.transformStream<ResponseStreamEvent, Message>(
      stream,
      this.chunk.bind(this)
    );

    // auto-mode logic
    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        const newStream = await createStream({
          ...request,
          input: this.llmInputs as ResponseCreateParamsStreaming['input'],
          stream: true,
        });
        return this.transformStream<ResponseStreamEvent, Message>(
          newStream,
          this.chunk.bind(this)
        );
      },
      this.onTool
    );

    return automodeStream;
  }

 

  /**
   * Processes a chunk of the response stream.
   * @private
   * @param {ResponseStreamEvent} chunk - The chunk to process.
   * @returns {(Promise<Message | null>)} The processed message or null.
   */
  private async chunk(
    chunk: ResponseStreamEvent,
  ): Promise<Message | null> {
    this.log(`Processing chunk: ${JSON.stringify(chunk, null, 2)}`);

    // Track when output items are added - this tells us what type of content to expect
    if (chunk.type === 'response.output_item.added') {
      const { item } = chunk as ResponseOutputItemAddedEvent;
      const outputItem = item as ResponseOutputItem;
      
      // Store the current output item being processed
      if (outputItem.type === 'reasoning') {
        this.currentOutputItem = {
          itemId: outputItem.id,
          type: 'reasoning',
        };
        // Don't return anything yet, wait for content
        return null;
      } else if (outputItem.type === 'message') {
        this.currentOutputItem = {
          itemId: outputItem.id,
          type: 'message',
        };
        // Don't return anything yet, wait for content
        return null;
      } else if (this.isFunctionCallItem(outputItem)) {
        const fc = outputItem;
        this.currentOutputItem = {
          itemId: fc.id,
          type: 'function_call',
        };
        
        if (fc.status === 'completed') {
          const tool_use: ToolUseBlock = {
            id: fc.id,
            name: fc.name,
            type: 'tool_use',
            input: JSON.parse(fc.arguments ?? '{}'),
          };
          this.cache.toolInput = tool_use;
          return {
            id: v4(),
            role: 'assistant',
            type: 'tool_use',
            content: [tool_use]
          };
        }
        
        this.functionCallsByItemId[fc.id] = { name: fc.name, call_id: fc.call_id };
        const tool_delta: ToolInputDelta = {
          id: fc.id,
          name: fc.name,
          type: 'tool_delta',
          partial: fc.arguments ?? '',
        };
        this.cache.toolInput = tool_delta;
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_delta',
          content: [tool_delta]
        };
      }
      return null;
    }

    // Track when output items are done
    if (chunk.type === 'response.output_item.done') {
      const { item } = chunk;
      // If this matches our current output item, clear it
      if (this.currentOutputItem && item.id === this.currentOutputItem.itemId) {
        this.currentOutputItem = null;
      }
      return null;
    }

    // Track content parts being added (helps with multi-part messages)
    if (chunk.type === 'response.content_part.added') {
      const { content_index, item_id } = chunk;
      if (this.currentOutputItem && item_id === this.currentOutputItem.itemId) {
        this.currentOutputItem.contentIndex = content_index;
      }
      return null;
    }

    // Text streaming - now we know what type based on currentOutputItem
    if (chunk.type === 'response.output_text.delta') {
      const { delta } = chunk as ResponseTextDeltaEvent;
      
      if (!delta) return null;

      // Determine type based on the current output item
      const outputType = this.currentOutputItem?.type;

      // Handle reasoning/thinking output
      if (outputType === 'reasoning') {
        if (!this.cache.thinkingId) {
          this.cache.thinkingId = v4();
        }
        return {
          id: this.cache.thinkingId,
          role: 'assistant',
          type: 'thinking',
          chunk: true,
          content: [
            {
              type: 'thinking',
              thinking: delta,
              signature: ''
            }
          ]
        };
      }

      // Handle regular message output
      if (outputType === 'message') {
        // Process thinking tags first (both OpenAI and Grok models use <thinking> tags in messages)
        this.processThinkingDelta(delta);
        
        // Check if we have thinking content to emit
        const state = this.thinkingState;
        if (state.carryThinking.length > 0) {
          // Emit thinking content
          this.cache.textId = null;
          if (!this.cache.thinkingId) {
            this.cache.thinkingId = v4();
          }
          const thinkingText = this.takeThinkingChunk();
          return {
            id: this.cache.thinkingId,
            role: 'assistant',
            type: 'thinking',
            chunk: true,
            content: [
              {
                type: 'thinking',
                thinking: thinkingText,
                signature: ''
              }
            ]
          };
        }

        // Get visible text (after thinking extraction)
        const visibleText = this.takeVisibleChunk();
        
        // For Grok: also process tool_call tags from visible text
        if (this.options.type === LLMProvider.Grok && visibleText) {
          this.processToolCallDelta(visibleText);
          
          // Check for completed tool calls
          const completedToolCalls = this.takeCompletedToolCalls();
          if (completedToolCalls.length > 0) {
            const toolCall = completedToolCalls[0];
            try {
              const toolData = JSON.parse(toolCall);
              const toolUseBlock: ToolUseBlock = {
                id: v4(),
                name: toolData.name ?? '',
                input: toolData.parameters ?? {},
                type: 'tool_use'
              };
              return {
                id: v4(),
                role: 'assistant',
                type: 'tool_use',
                content: [toolUseBlock]
              };
            } catch (error) {
              this.log(`Failed to parse tool call JSON: ${error}`);
            }
          }
          
          // Get final visible text (excluding tool_call tags)
          const finalVisibleText = this.takeToolCallVisibleChunk();
          // Skip if empty or whitespace-only
          if (!finalVisibleText || !finalVisibleText.trim()) return null;
          
          if (!this.cache.textId) {
            this.cache.textId = v4();
          }
          return {
            id: this.cache.textId,
            role: 'assistant',
            type: 'message',
            chunk: true,
            content: [{ type: 'text', text: finalVisibleText }]
          };
        }

        // For non-Grok or when no visible text after thinking extraction
        // Skip if empty or whitespace-only
        if (!visibleText || !visibleText.trim()) return null;
        
        this.cache.thinkingId = null;
        if (!this.cache.textId) {
          this.cache.textId = v4();
        }
        return {
          id: this.cache.textId,
          role: 'assistant',
          type: 'message',
          chunk: true,
          content: [{ type: 'text', text: visibleText }]
        };
      }

      // Unknown output type - log and skip
      this.log(`Received text delta for unknown output type: ${outputType}`);
      return null;
    }

    if (chunk.type === "response.image_generation_call.in_progress") {
      this.cache.imageGenerationCallId = chunk.item_id;
      const callId = this.cache.imageGenerationCallId ?? v4();
      const toolUseBlock: ToolUseBlock = {
        id: callId,
        name: "image_generation",
        type: "tool_use",
        input: {},
        isRemote: true
      };
      return {
        chunk: true,
        id: callId,
        role: "assistant",
        type: "tool_use",
        content: [
          toolUseBlock
        ]
      };
    }


    if (chunk.type === "response.image_generation_call.partial_image") {
      const imageBase64 = chunk.partial_image_b64;
      this.cache.imageBase64 = imageBase64;
      
      // Return the image as a proper ImageBlock with the generation call ID
      // This allows it to be referenced later for multi-turn editing
      const imageBlock: ImageBlock = {
        type: "image",
        source: {
          data: imageBase64,
          media_type: "image/png",
          type: "base64"
        },
        imageGenerationCallId: this.cache.imageGenerationCallId ?? undefined
      };
      
      return {
        role: "assistant",
        id: this.cache.imageGenerationCallId ?? v4(),
        type: "tool_result",
        content: [imageBlock]
      };
    }

    // Function call arguments streaming delta
    if (chunk.type === 'response.function_call_arguments.delta') {
      const ev = chunk as ResponseFunctionCallArgumentsDeltaEvent;
      const itemId: string = ev.item_id;
      const current: ToolInputDelta = (this.cache.toolInput as ToolInputDelta) ?? {
        id: itemId,
        name: this.functionCallsByItemId[itemId]?.name,
        type: 'tool_delta',
        partial: '',
      };
      current.partial += ev.delta || '';
      this.cache.toolInput = current;
      return {
        id: v4(),
        role: 'assistant',
        type: 'tool_delta',
        content: [current]
      };
    }
    // Function call arguments done -> emit tool_use
    if (chunk.type === 'response.function_call_arguments.done') {
      const ev = chunk as ResponseFunctionCallArgumentsDoneEvent;
      const itemId: string = ev.item_id;
      const meta = this.functionCallsByItemId[itemId] ?? {};
      const partial = (this.cache.toolInput as ToolInputDelta | null)?.partial ?? ev.arguments ?? '{}';
      const toolUseBlock: ToolUseBlock = {
        id: meta.call_id ?? itemId,
        name: meta.name ?? '',
        input: (() => { try { return JSON.parse(partial || '{}'); } catch { return {}; } })(),
        type: 'tool_use'
      };
      return {
        id: v4(),
        role: 'assistant',
        type: 'tool_use',
        content: [toolUseBlock]
      };
    }

    // Completed -> emit usage and end_turn
    if (chunk.type === 'response.completed') {
      const { response } = chunk as ResponseCompletedEvent;
      const usage = response?.usage;
      if (usage) {
        this.cache.tokens.input = usage.input_tokens ?? 0;
        this.cache.tokens.output = usage.output_tokens ?? 0;
      }
      // Reset chunk id on turn completion
      this.cache.chunks = null;
      this.cache.textId = null;
      this.cache.thinkingId = null;
      // Reset output item tracking
      this.currentOutputItem = null;
      // Reset thinking state for next turn
      if (this._thinkingState) {
        this._thinkingState.inThinking = false;
        this._thinkingState.openTag = '';
        this._thinkingState.bufferTag = '';
        this._thinkingState.carryThinking = '';
        this._thinkingState.carryVisible = '';
      }
      // Reset tool call state for next turn (Grok compatibility)
      if (this._toolCallState) {
        this._toolCallState.inToolCall = false;
        this._toolCallState.bufferTag = '';
        this._toolCallState.carryVisible = '';
        this._toolCallState.carryToolCall = '';
        this._toolCallState.completedToolCalls = [];
      }
      // Reset function calls map
      this.functionCallsByItemId = {};

      const deltaBlock: DeltaBlock = {
        type: 'delta',
        stop_reason: 'end_turn',
        stop_sequence: null,
      };
      const usageBlock: UsageBlock = {
        type: 'usage',
        input: this.cache.tokens.input,
        output: this.cache.tokens.output,
      };
      return {
        id: v4(),
        role: 'assistant',
        type: 'usage',
        content: [usageBlock, deltaBlock]
      };
    }

    // Surface errors
    if (chunk.type === 'error') {
      return {
        id: v4(),
        role: 'assistant',
        type: 'error',
        content: [
          {
            type: 'error',
            message: (chunk as ResponseErrorEvent).message ?? 'Unknown error'
          }
        ]
      } as Message;
    }
    return null;
  }

  /**
   * Checks if an item is a function call item.
   * @private
   * @param {ResponseOutputItem} item - The item to check.
   * @returns {item is ResponseFunctionToolCallItem} True if the item is a function call item, false otherwise.
   */
  private isFunctionCallItem(item: ResponseOutputItem): item is ResponseFunctionToolCallItem {
    return (item as { type?: string }).type === 'function_call';
  }
} 