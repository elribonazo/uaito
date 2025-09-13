import OpenAIAPI from 'openai';
import { v4 } from 'uuid';
import { BaseLLM } from "./Base";
import {
  LLMProvider,
  OpenAIOptions,
  Message,
  MessageInput,
  ToolUseBlock,
  OnTool,
  DeltaBlock,
  TextBlock,
  UsageBlock,
  BaseLLMCache,
  ReadableStreamWithAsyncIterable
} from "../types";
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
import { ToolInputDelta } from '../types';
import { Stream } from 'openai/streaming';
import { MessageArray } from '..';


/**
 * A more complete implementation of the OpenAI-based LLM,
 * mirroring the structure and patterns found in the Anthropic class.
 */
export class OpenAI extends BaseLLM<LLMProvider.OpenAI, OpenAIOptions> {
  private onTool?: OnTool;
  private openai: OpenAIAPI;
  public inputs: MessageArray<MessageInput> = new MessageArray();

  public cache: BaseLLMCache = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }

  constructor(
    { options }: { options: OpenAIOptions },
    onTool?: OnTool
  ) {
    super(LLMProvider.OpenAI, options);
    this.onTool = onTool;

    // Initialize the OpenAI client
    this.openai = new OpenAIAPI({
      apiKey: options.apiKey,
    });
  }

  /**
   * Return max tokens or a default (e.g. 4096).
   */
  get maxTokens() {
    return this.options.maxTokens ?? 4096;
  }

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
    if (toolResult && toolResult.type === 'tool_result') {
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
            text: `Tool result (${toolResult.name} -> ${toolResult.tool_use_id}):\n${textContent}`,
          } as ResponseInputText,
        ],
      } as ResponseInputItem;
    }

    for (const c of filteredContent) {
      if (c.type === "text") {
        const typeForRole = mappedRole === 'assistant' ? 'output_text' : 'input_text';
        contents.push({ type: typeForRole as 'input_text' | 'output_text', text: c.text } as ResponseInputText);
      } else if (c.type === "image") {
        const dataUrl = `data:${c.source.media_type};base64,${c.source.data}`;
        contents.push({ type: 'input_image', image_url: dataUrl, detail: 'auto' } as ResponseInputImage);
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

  get tools() {
    const functionTools: ResponsesTool[] | undefined = this.options.tools?.map((tool) => {
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


  get llmInputs() {
    return this.inputs
    .flatMap((input) => this.fromInputToParam(input) as any)
    .filter((c: any) => {
      if ((c as any).type === 'message') {
        const content = (c as any).content ?? [];
        if (Array.isArray(content) && content.length === 0) {
          return false;
        }
      }
      return true;
    })
  }

   async performTaskStream(
    prompt: string,
    chainOfThought: string,
    system: string,
  ): Promise<ReadableStreamWithAsyncIterable<Message>> {

    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs);
    
    const tools = this.tools && this.tools.length > 0 ? this.tools : undefined;

    const request: ResponseCreateParamsStreaming = {
      model: this.options.model,
      input: this.llmInputs as any,
      instructions: system,
      max_output_tokens: this.maxTokens,
      stream: true,
      tools,
    };

    // Reset usage
    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;

    const createStream = async (params: ResponseCreateParamsStreaming) => {
      return this.retryApiCall(async () => {
        const stream = await this.openai.responses.create(params) as Stream<ResponseStreamEvent>;
        return stream.toReadableStream() as ReadableStreamWithAsyncIterable<ResponseStreamEvent>
      });
    };

    const stream = await createStream(request);
    const transform = await this.transformStream<
      ResponseStreamEvent, 
      Message
    >(
      stream,
      this.chunk.bind(this)
    );

    // auto-mode logic
    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        const newStream = await createStream({
          ...request,
          input: this.llmInputs as any,
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



  private chunk(
    chunk: ResponseStreamEvent,
  ): Message | null {
    // Initialize function call cache map
    (this.data as any).__functionCallsByItemId ??= {} as Record<string, { name?: string, call_id?: string }>;

    // Text streaming
    if (chunk.type === 'response.output_text.delta') {
      const { delta } = chunk as ResponseTextDeltaEvent;
      // Ensure a stable message id for all text deltas in this turn
      if (!this.cache.chunks) {
        this.cache.chunks = v4();
      }
      const textBlock: TextBlock = {
        type: 'text',
        text: delta,
      };
      return {
        id: this.cache.chunks!,
        role: 'assistant',
        type: 'message',
        chunk: true,
        content: [textBlock]
      };
    }

    // Function call item added (gives us name and call_id)
    if (chunk.type === 'response.output_item.added') {
      const { item } = chunk as ResponseOutputItemAddedEvent;
      const outputItem = item as ResponseOutputItem;
      if ((outputItem as any).type === 'function_call') {
        const fc = outputItem as ResponseFunctionToolCallItem;
        (this.data as any).__functionCallsByItemId[fc.id] = { name: fc.name, call_id: fc.call_id };
        const tool_delta: ToolInputDelta = {
          id: fc.id,
          name: fc.name,
          type: 'tool_delta',
          partial: '',
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

    // Function call arguments streaming delta
    if (chunk.type === 'response.function_call_arguments.delta') {
      const ev = chunk as ResponseFunctionCallArgumentsDeltaEvent;
      const itemId: string = ev.item_id;
      const current: ToolInputDelta = (this.cache.toolInput as ToolInputDelta) ?? {
        id: itemId,
        name: (this.data as any).__functionCallsByItemId[itemId]?.name,
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
      const meta = (this.data as any).__functionCallsByItemId[itemId] ?? {};
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
        type: 'delta',
        content: [deltaBlock, usageBlock]
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
} 