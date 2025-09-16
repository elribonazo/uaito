import { v4 } from "uuid";

import type {
  BaseLLMCache,
  OnTool,
  ReadableStreamWithAsyncIterable,
  Message,
  HuggingFaceONNXOptions,
  MessageInput,
  MessageType,
  ToolUseBlock,
  ToolResultBlock,
  TextBlock,
} from "../types";
import { LLMProvider } from "../types";

import {
  Message as HMessage,
  PreTrainedTokenizer,
  PreTrainedModel,
  Tensor,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";
import {
  AutoTokenizer,
  AutoModelForCausalLM,
  TextStreamer,
  AutoConfig,
} from "@huggingface/transformers";
import { BaseLLM } from "./Base";
import type { TensorDataType } from "./huggingface/types";
import { MessageArray } from "../utils";
import { extractPythonicCalls, mapArgsToNamedParams, parsePythonicCall } from "./huggingface/utils";

const IM_END_TAG = '<|im_end|>';
const modelCache = new Map<string, PreTrainedModel>();
const tokenizerCache = new Map<string, PreTrainedTokenizer>();

type HuggingFaceMessage = HMessage & {
  type?: MessageType,
  id?: string
}

type GenerativeModel = PreTrainedModel & {
  generate: (inputs: unknown, options?: unknown) => Promise<unknown>;
};

type GenerateOutput = {
  sequences: Tensor,
  past_key_values: unknown
}

export class HuggingFaceONNX extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {
  public cache: BaseLLMCache & { thinkingId?: string | null, textId?: string | null } = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }
  public loadProgress: number = 0;
  public inputs: MessageArray<MessageInput> = new MessageArray();
  private tokenizer!: PreTrainedTokenizer;
  private model!: PreTrainedModel;
  private stoppingCriteria = new InterruptableStoppingCriteria();

  // Internal state for extracting <thinking> tags
  private _thinkingState?: {
    inThinking: boolean,
    openTag: '' | '<thinking>' | '<think>',
    bufferTag: string,
    carryVisible: string,
    carryThinking: string,
  };

  
  constructor(
    { options }: { options: HuggingFaceONNXOptions },
    public onTool?: OnTool
  ) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;
  }

  async runAbortable<Fn extends Promise<unknown>>(fn: Fn) {
    return new Promise( (resolve, reject) => {
      this.options.signal?.addEventListener('abort', () => {  
        if (!this.stoppingCriteria.interrupted ) {
          this.stoppingCriteria.interrupt();
        }
        reject(new Error('Operation aborted'));
      });
      fn.then(resolve).catch(reject);
    });
  }

  async load() {
    this.log(`Loading model: ${this.options.model}`);
    const modelId = this.options.model;

    if (tokenizerCache.has(modelId)) {
      const tokenizer = tokenizerCache.get(modelId);
      if (tokenizer) {
        this.tokenizer ??= tokenizer;
      }
    } else {
      this.tokenizer ??= await AutoTokenizer.from_pretrained(modelId);
      tokenizerCache.set(modelId, this.tokenizer);
    }

    this.log(`Tokenizer loaded for ${modelId}`);
    if (modelCache.has(modelId)) {
      const model = modelCache.get(modelId);
      if (model) {
        this.model ??= model;
      }
    } else {
      const config = await AutoConfig.from_pretrained(modelId);

      this.model ??= await AutoModelForCausalLM.from_pretrained(modelId, {
        device: this.options.device ?? "webgpu",
        dtype: this.options.dtype ?? "auto",
        config: {
          ...config,
          'transformers.js_config': {
            ...config["transformers.js_config"],
            kv_cache_dtype: {
              "q4f16": "float16" as const,
              "fp16": "float16" as const
            } as never
          }
        },
        progress_callback: (info: Record<string, unknown>) => {
          if (info.status === "progress") {
            const progress = parseInt(info.progress as string, 10);
            this.data.progress = progress;
            if (this.options.onProgress) {
              this.options.onProgress(progress);
            }
          } else {
            this.log(`Model loading status: ${info.status}`);
          }
        },
      });
      modelCache.set(modelId, this.model);
    }
    this.log(`Model loaded: ${modelId}`);
  }

  private fromInputToParam(message: MessageInput): HuggingFaceMessage {
    const { content } = message;
    const textContent = content
      .filter((c): c is TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n\n");

    const toolUseContent = content
      .filter((c): c is ToolUseBlock => c.type === "tool_use")
      .map((toolUse) =>
        JSON.stringify({
          id: toolUse.id,
          name: toolUse.name,
          parameters: toolUse.input,
          type: 'tool_use'
        })
      )
      .join("\n");

    const toolResultContent = content
      .filter((c): c is ToolResultBlock => c.type === "tool_result")
      .map((toolResult) => {

        const textContent = (toolResult.content ?? [])
          .filter((c): c is TextBlock => c.type === "text")
          .map((c) => c.text)
          .join("\n\n");

        return JSON.stringify({
          tool_use_id: toolResult.tool_use_id,
          name: toolResult.name,
          content: textContent,
          is_error: toolResult.isError ?? false,
        });
      })
      .join("\n");


    if (toolUseContent) {
      return {
        role: 'assistant',
        content: toolUseContent,
      };

    }

    const finalContent = [textContent, toolUseContent, toolResultContent].filter(Boolean).join('\n\n');
    return {
      role: message.role,
      content: finalContent,
    };
  }

  private getTensorData() {
    const currentInputs = MessageArray.from(this.inputs).map(this.fromInputToParam);
    return this.tokenizer.apply_chat_template(currentInputs, {
      add_generation_prompt: true,
      return_dict: true,
      tools: this.options.tools,
    }) as TensorDataType;
  }

  private state: {
    buffer: string,
    capturingToolCall: boolean,
  } = {
      buffer: '',
      capturingToolCall: false,
    }

  /**
  * Internal state for extracting <thinking> / <think> tags from streamed text.
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

  private takeThinkingChunk(): string {
    const state = this.thinkingState;
    const out = state.carryThinking;
    state.carryThinking = '';
    return out;
  }

  private takeVisibleChunk(): string {
    const state = this.thinkingState;
    const out = state.carryVisible;
    state.carryVisible = '';
    return out;
  }

  private chunk(chunk: string): Message | null {
    this.log("KChunk" + JSON.stringify(chunk, null, 2));
    this.processThinkingDelta(chunk);

    const state = this.thinkingState;

    // Emit pending visible or thinking fairly; prioritize thinking when we're inside
    let toEmitType: 'thinking' | 'visible' | null = null;
    if (state.carryThinking.length > 0) {
      toEmitType = 'thinking';
    } else if (state.carryVisible.length > 0) {
      toEmitType = 'visible';
    }

    if (toEmitType === 'thinking') {
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

    if (toEmitType === 'visible') {
      this.cache.thinkingId = null;
      if (!this.cache.textId) {
        this.cache.textId = v4();
      }
      const textOut = this.takeVisibleChunk();
      if (textOut.length > 0) {
        this.state.buffer += textOut;
      }
    }

    if (!this.state.capturingToolCall) {
      const startIndex = this.state.buffer.indexOf('<|tool_call_start|>') !== -1 ?
        this.state.buffer.indexOf('<|tool_call_start|>') :
        this.state.buffer.indexOf('<tool_call>');

      if (startIndex !== -1) {
        const textPart = this.state.buffer.substring(0, startIndex);
        if (this.state.buffer.indexOf('<|tool_call_start|>') !== -1) {
          this.state.buffer = this.state.buffer.substring(startIndex + '<|tool_call_start|>'.length);
          this.cache.textId = v4()
        } else if (this.state.buffer.indexOf('<tool_call>') !== -1) {
          this.state.buffer = this.state.buffer.substring(startIndex + '<tool_call>'.length);
        }
        this.state.capturingToolCall = true;
        if (textPart && this.cache.textId) {
          return {
            id: this.cache.textId,
            role: 'assistant',
            type: 'message',
            chunk: true,
            content: [{ type: 'text', text: textPart }]
          };
        }
      }
    }

    if (this.state.capturingToolCall) {
      const endIndex = this.state.buffer.indexOf('<|tool_call_end|>') !== -1 ?
        this.state.buffer.indexOf('<|tool_call_end|>') :
        this.state.buffer.indexOf('</tool_call>');

      if (endIndex !== -1) {
        const toolCallContent = this.state.buffer.substring(0, endIndex);
        this.log(`Detected tool call content: "${toolCallContent}"`);
        if (this.state.buffer.indexOf('<|tool_call_end|>') !== -1) {
          this.state.buffer = this.state.buffer.substring(endIndex + '<|tool_call_end|>'.length);
        } else if (this.state.buffer.indexOf('</tool_call>') !== -1) {
          this.state.buffer = this.state.buffer.substring(endIndex + '</tool_call>'.length);
        }
        this.state.capturingToolCall = false;

        const toolCalls = extractPythonicCalls(toolCallContent);

        const toolUseBlocks: ToolUseBlock[] = toolCalls.flatMap(call => {
          this.log(`Parsing tool call: "${call}"`);
          const parsed = parsePythonicCall(call);
          if (!parsed) return [];

          const { name, positionalArgs, keywordArgs } = parsed;
          const toolSchema = this.options.tools?.find((t) => t.name === name);
          const paramNames = toolSchema ? Object.keys(toolSchema.input_schema.properties) : [];
          const input = mapArgsToNamedParams(paramNames, positionalArgs, keywordArgs);

          if (!this.cache.textId) return [];
          return {
            id: this.cache.textId,
            name,
            input,
            type: 'tool_use'
          };
        });

        if (toolUseBlocks.length > 0) {
          if (!this.cache.textId) return null;
          const toolCallID = `${this.cache.textId}`;
          this.log(`Emitting ${toolUseBlocks.length} tool_use blocks.`);
          this.cache.textId = null;
          // For simplicity in this refactor, we'll wrap all tool calls in a single message.
          // The `BaseLLM`'s `transformAutoMode` will handle dispatching them.
          return {
            id: toolCallID,
            role: 'assistant',
            type: 'tool_use',
            content: toolUseBlocks
          };
        }
      }
    }

    // If no tool call markers are processed, treat the buffer as text
    if (!this.state.capturingToolCall) {
      const textToEmit = this.state.buffer;
      this.state.buffer = '';
      if (textToEmit && this.cache.textId) {
        return {
          id: this.cache.textId,
          role: 'assistant',
          type: 'message',
          chunk: true,
          content: [{ type: 'text', text: textToEmit }]
        };
      }
    }

    debugger;
    return null;
  }

  async createStream(input: TensorDataType): Promise<ReadableStreamWithAsyncIterable<string>> {
    const stopping_criteria = new InterruptableStoppingCriteria();

    this.log("createStream called.");
    this.state.buffer = '';
    this.state.capturingToolCall = false;

    const state = this.thinkingState;
    state.inThinking = false;
    state.openTag = '';
    state.bufferTag = '';
    state.carryThinking = '';
    state.carryVisible = '';

    this.cache.thinkingId = null;
    this.cache.textId = null;

    let __past_key_values: unknown = null;

    const stream = new ReadableStream<string>({
      start: async (controller) => {

        
        this.log("ReadableStream started for model generation.");
        try {
          const streamer = new TextStreamer(this.tokenizer, {
            skip_prompt: true,
            skip_special_tokens: false,
            callback_function: (value: string) => {
              const isEnd = value.includes(IM_END_TAG);
              const chunk = value.replace(IM_END_TAG, "");
              if (chunk !== "\n") {
                controller.enqueue(chunk);
              }
              if (isEnd) {
                controller.close();
              }
            },
          });

          
          try {
            const { sequences, past_key_values } = await (this.model as GenerativeModel).generate({
              ...input,
              past_key_values: __past_key_values,
              do_sample: false,
              generation_config: {
                output_attentions: true,
                max_new_tokens: this.options.maxTokens ?? 4096,
              },
              streamer,
              return_dict_in_generate: true,
              stopping_criteria
            }) as GenerateOutput;

            if (sequences) {
              const response = this.tokenizer
                .batch_decode(sequences.slice(null, [input.input_ids.dims[1], 0]), {
                  skip_special_tokens: false,
                })[0]
                .replace(IM_END_TAG, "");

              this.inputs.push({
                id: v4(),
                role: 'assistant',
                type: 'message',
                content: [{ type: 'text', text: response }]
              })
            }


            this.cache.textId = null
            __past_key_values = past_key_values;
            controller.close();
          } catch { }

        } catch (e) {
          this.log(`Model generation error: ${e}`);
          controller.error(e);
        } 
      },
    });

    return stream as ReadableStreamWithAsyncIterable<string>;
  }

  private addDefaultItems(prompt: string, chainOfThought: string, system: string) {
    if (this.inputs.length === 0 && system !== '') {
      //Internal message
      const systemPrompt: Message = {
        id: v4(),
        role: "system",
        type: "message",
        content: [{
          text: system,
          type: "text"
        }]
      }
      this.inputs.push(systemPrompt as MessageInput);
    }
    this.inputs = MessageArray.from(
      [
        ...this.inputs,
        { role: 'user', content: [{ type: 'text', text: `${prompt}${chainOfThought !== '' ? `\r\n\r\n${chainOfThought}` : ''}` }] }
      ]
    )
  }

  async performTaskStream(prompt: string, chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
    this.stoppingCriteria.reset();
    this.log("Starting performTaskStream");
    await this.load();
    this.addDefaultItems(prompt, system, chainOfThought);
    const tensor = this.getTensorData();
    this.log(`Tensor created. Shape: ${tensor.input_ids.dims}`);
    const rawStream = await this.createStream(tensor);
    const transformedStream = await this.transformStream<string, Message>(
      rawStream,
      this.chunk.bind(this)
    );
    const automodeStream = await this.transformAutoMode(
      transformedStream,
      async () => {
        const nextTensor = this.getTensorData();
        const nextRawStream = await this.createStream(nextTensor);
        return this.transformStream<string, Message>(
          nextRawStream,
          this.chunk.bind(this)
        );
      },
      this.onTool
    );

    return automodeStream;
  }


}