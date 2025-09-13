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

import type {
  Message as HMessage,
  PreTrainedTokenizer,
  PreTrainedModel,
} from "@huggingface/transformers";
import { AutoTokenizer, AutoModelForCausalLM, TextStreamer, AutoConfig } from "@huggingface/transformers";



import { BaseLLM } from "./Base";
import type { TensorDataType } from "./huggingface/types";
import { MessageArray } from "../utils";
import { extractPythonicCalls, mapArgsToNamedParams, parsePythonicCall } from "./huggingface/utils";

// Removed unused IM_START_TAG to satisfy linter and avoid confusion
const IM_END_TAG = '<|im_end|>';

const modelCache = new Map<string, PreTrainedModel>();
const tokenizerCache = new Map<string, PreTrainedTokenizer>();

type HuggingFaceMessage = HMessage & {
  type?: MessageType,
  id?: string
}



export class HuggingFaceONNX extends BaseLLM<LLMProvider.HuggingFaceONNX, HuggingFaceONNXOptions> {
  public cache: BaseLLMCache = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }
  public loadProgress: number = 0;
  public inputs: MessageArray<MessageInput> = new MessageArray();

  private tokenizer!: PreTrainedTokenizer;
  private model!: PreTrainedModel;
  private currentMessageId: string | null = null;

  constructor(
    { options }: { options: HuggingFaceONNXOptions },
    public onTool?: OnTool
  ) {
    super(LLMProvider.HuggingFaceONNX, options);
    this.data.progress = 0;
  }

  async load() {
    this.log(`Loading model: ${this.options.model}`);
    const modelId = this.options.model;
    
    if (tokenizerCache.has(modelId)) {
      this.tokenizer ??= tokenizerCache.get(modelId)!;
    } else {
      this.tokenizer ??= await AutoTokenizer.from_pretrained(modelId);
      tokenizerCache.set(modelId, this.tokenizer);
    }

    this.log(`Tokenizer loaded for ${modelId}`);
    if (modelCache.has(modelId)) {
      this.model ??= modelCache.get(modelId)!;
    } else {
      const config =  await AutoConfig.from_pretrained(modelId);

      this.model ??= await AutoModelForCausalLM.from_pretrained(modelId, {
        device: this.options.device ?? "webgpu",
        dtype: this.options.dtype ?? "auto",
        config: {
          ...config,
           'transformers.js_config':{
            ...config["transformers.js_config"],
            kv_cache_dtype:{
              "q4f16": "float16" as const,
              "fp16": "float16" as const
            } as any
           }
        } ,
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
    let role = message.role;


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
        id: message.id,
        role: 'assistant',
        content: toolUseContent,
      };
      
    }

    if (toolResultContent) role = 'tool';

    const finalContent = [textContent, toolUseContent, toolResultContent].filter(Boolean).join('\n\n');
    return {
      role: role,
      content: finalContent,
    };
  }

  private getTensorData() {
    const currentInputs =  Array.from([
      ...this.inputs
    ])
      .filter((m) => m.content.length >  0 && m.content[0].type !== 'tool_use' && m.role !== 'tool')
      .map(this.fromInputToParam);

    return this.tokenizer.apply_chat_template(currentInputs, {
      add_generation_prompt: true,
      return_dict: true,
      tools: this.options.tools,
    }) as TensorDataType;
  }

  private state: {
    buffer: string,
    capturingToolCall: boolean,
    inThinking: boolean,
    openTag: '' | '<thinking>' | '<think>',
    bufferTag: string,
    carryVisible: string,
    carryThinking: string,
  } = {
      buffer: '',
      capturingToolCall: false,
      inThinking: false,
      openTag: '',
      bufferTag: '',
      carryVisible: '',
      carryThinking: '',
    }

  private processThinkingTags(delta: string) {
    const state = this.state;
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
    const state = this.state;
    const out = state.carryThinking;
    state.carryThinking = '';
    return out;
  }

  private takeVisibleChunk(): string {
    const state = this.state;
    const out = state.carryVisible;
    state.carryVisible = '';
    return out;
  }




  private thinkingId: string | null = null;

  private chunk(chunk: string): Message | null {
    
    this.processThinkingTags(chunk);

    const thinkingText = this.takeThinkingChunk();
    if (thinkingText) {
      this.thinkingId ??= v4();
      return {
        id: this.thinkingId,
        role: 'assistant',
        type: 'thinking',
        chunk: true,
        content: [{
          type: 'thinking',
          thinking: thinkingText,
          signature: ''
        }]
      };
    }

    

    const visibleText = this.takeVisibleChunk();
    if (visibleText) {
      if (!this.state.buffer || this.state.buffer.length === 0) {
        this.currentMessageId ??= v4();
      }
      this.state.buffer += visibleText;
    }


    if (!this.state.capturingToolCall) {
      const startIndex = this.state.buffer.indexOf('<|tool_call_start|>') !== -1?
        this.state.buffer.indexOf('<|tool_call_start|>') :
        this.state.buffer.indexOf('<tool_call>');
      
      if (startIndex !== -1) {
        const textPart = this.state.buffer.substring(0, startIndex);
        if (this.state.buffer.indexOf('<|tool_call_start|>') !== -1) {
          this.state.buffer = this.state.buffer.substring(startIndex + '<|tool_call_start|>'.length);
        } else if (this.state.buffer.indexOf('<tool_call>') !== -1) {
          this.state.buffer = this.state.buffer.substring(startIndex + '<tool_call>'.length);
        }
        this.state.capturingToolCall = true;
        if (textPart) {
          return {
            id: this.currentMessageId!,
            role: 'assistant',
            type: 'message',
            chunk: true,
            content: [{ type: 'text', text: textPart }]
          };
        }
      }
    }

    if (this.state.capturingToolCall) {
      const endIndex = this.state.buffer.indexOf('<|tool_call_end|>') !== -1?
        this.state.buffer.indexOf('<|tool_call_end|>') :
        this.state.buffer.indexOf( '</tool_call>');

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

          return {
            id: v4(),
            name,
            input,
            type: 'tool_use'
          };
        });

        if (toolUseBlocks.length > 0) {
          this.log(`Emitting ${toolUseBlocks.length} tool_use blocks.`);
          this.currentMessageId = null;
          // For simplicity in this refactor, we'll wrap all tool calls in a single message.
          // The `BaseLLM`'s `transformAutoMode` will handle dispatching them.
          return {
            id: v4(),
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
      if (textToEmit) {
        return {
          id: this.currentMessageId!,
          role: 'assistant',
          type: 'message',
          chunk: true,
          content: [{ type: 'text', text: textToEmit }]
        };
      }
    }

    return null;
  }
  
  async createStream(input: TensorDataType): Promise<ReadableStreamWithAsyncIterable<string>> {
    this.log("createStream called.");
    this.state.buffer = '';
    this.state.capturingToolCall = false;
    this.state.inThinking = false;
    this.state.openTag = '';
    this.state.bufferTag = '';
    this.state.carryVisible = '';
    this.state.carryThinking = '';

    let __past_key_values: any =null;

    const stream = new ReadableStream<string>({
      start: async (controller) => {
        this.log("ReadableStream started for model generation.");

        try {
          const streamer = new TextStreamer(this.tokenizer, {
            skip_prompt: true,
            skip_special_tokens: false,
            callback_function: (value: string) => {
              controller.enqueue(value.replace(IM_END_TAG, "")
              );
            },
          });
      
      
          const { sequences, past_key_values } = await (this.model as any).generate({
           ...input,
           past_key_values:__past_key_values,
            do_sample: false,
            generation_config:{
              output_attentions: true,
              max_new_tokens: this.options.maxTokens ?? 4096,
            },
            streamer,
            return_dict_in_generate: true,
          });

          if (sequences) {
            const response = this.tokenizer
            .batch_decode(sequences.slice(null, [input.input_ids.dims[1], null]), {
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

        
          this.currentMessageId= null
          __past_key_values = past_key_values;
         
          controller.close();
        } catch (e) {
          this.log(`Model generation error: ${e}`);
          controller.error(e);
        }
      },
    });

    return stream as ReadableStreamWithAsyncIterable<string>;
  }

  private addDefaultItems(prompt: string, system: string, chainOfThought: string) {
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
    this.inputs =  MessageArray.from(
      [
        ...this.inputs,
        { role: 'user', content: [{ type: 'text', text: `${prompt}${chainOfThought !== '' ? `\r\n\r\n${chainOfThought}` : ''}` }] }
      ]
    )
  }

  async performTaskStream(prompt: string, chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
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