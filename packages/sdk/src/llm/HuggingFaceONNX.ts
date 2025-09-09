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

// Removed unused IM_START_TAG to satisfy linter and avoid confusion
const IM_END_TAG = '<|im_end|>';

const modelCache = new Map<string, PreTrainedModel>();
const tokenizerCache = new Map<string, PreTrainedTokenizer>();

type HuggingFaceMessage = HMessage & {
  type?: MessageType,
  id?: string
}

interface ParsedCall {
  name: string;
  positionalArgs: unknown[];
  keywordArgs: Record<string, unknown>;
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

  private fromInputToParam(model: MessageInput): HuggingFaceMessage {
    const textContent = model.content
      .filter((c): c is TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n\n");

    const toolUseContent = model.content
      .filter((c): c is ToolUseBlock => c.type === "tool_use")
      .map((toolUse) =>
        JSON.stringify({
          id: toolUse.id,
          name: toolUse.name,
          parameters: toolUse.input,
        })
      )
      .join("\n");

    const toolResultContent = model.content
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
    
    let role = model.role;
    if (toolUseContent) role = 'assistant';
    if (toolResultContent) role = 'tool';

    const finalContent = [textContent, toolUseContent, toolResultContent].filter(Boolean).join('\n\n');

    return {
      role: role,
      content: finalContent,
    };
  }

  private getTensorData() {
    const currentInputs =  Array.from(this.inputs)
      .map(this.fromInputToParam);
    return this.tokenizer.apply_chat_template(currentInputs, {
      add_generation_prompt: true,
      return_dict: true,
      tools: this.options.tools,
    }) as TensorDataType;
  }

  private _parseArguments(argsString: string): string[] {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    let pDepth = 0; 
    let bDepth = 0; 

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = "";
        current += char;
      } else if (!inQuotes && char === "(") {
        pDepth++;
        current += char;
      } else if (!inQuotes && char === ")") {
        pDepth--;
        current += char;
      } else if (!inQuotes && char === "{") {
        bDepth++;
        current += char;
      } else if (!inQuotes && char === "}") {
        bDepth--;
        current += char;
      } else if (!inQuotes && char === "," && pDepth === 0 && bDepth === 0) {
        args.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    return args;
  };

  private _extractPythonicCalls(toolCallContent: string): string[] {
    try {
      const cleanContent = toolCallContent.trim();

      try {
        const parsed = JSON.parse(cleanContent);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback to manual parsing
      }

      if (cleanContent.startsWith("[") && cleanContent.endsWith("]")) {
        const inner = cleanContent.slice(1, -1).trim();
        if (!inner) return [];
        return this._parseArguments(inner).map((call) =>
          call.trim().replace(/^['"]|['"]$/g, ""),
        );
      }

      return [cleanContent];
    } catch (error) {
      console.error("Error parsing tool calls:", error);
      return [];
    }
  };

  private _parsePythonicCall(command: string): ParsedCall | null {
    const callMatch = command.match(/^([a-zA-Z0-9_]+)\((.*)\)$/s);
    if (!callMatch) return null;

    const [, name, argsStr] = callMatch;
    const args = this._parseArguments(argsStr);
    const positionalArgs: unknown[] = [];
    const keywordArgs: Record<string, unknown> = {};

    for (const arg of args) {
      const kwargMatch = arg.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/s);
      if (kwargMatch) {
        const [, key, value] = kwargMatch;
        try {
          keywordArgs[key] = JSON.parse(value);
        } catch {
          keywordArgs[key] = value;
        }
      } else {
        try {
          positionalArgs.push(JSON.parse(arg));
        } catch {
          positionalArgs.push(arg);
        }
      }
    }
    return { name, positionalArgs, keywordArgs };
  };

  private _mapArgsToNamedParams(  paramNames: string[],  positionalArgs: unknown[], keywordArgs: Record<string, unknown>): Record<string, unknown> {
    const namedParams: Record<string, unknown> = {};
    positionalArgs.forEach((arg, idx) => {
      if (idx < paramNames.length) {
        namedParams[paramNames[idx]] = arg;
      }
    });
    Object.assign(namedParams, keywordArgs);
    return namedParams;
  };

  private state: {
    buffer: string,
    capturingToolCall: boolean
  } = {
      buffer: '',
      capturingToolCall: false
    }

  private chunk(chunk: string): Message | null {
    this.state.buffer += chunk;
    this.currentMessageId ??= v4();

    if (!this.state.capturingToolCall) {
      debugger;
      const startIndex = this.state.buffer.indexOf('<|tool_call_start|>');
      if (startIndex !== -1) {
        const textPart = this.state.buffer.substring(0, startIndex);
        this.state.buffer = this.state.buffer.substring(startIndex + '<|tool_call_start|>'.length);
        this.state.capturingToolCall = true;

        if (textPart) {
          return {
            id: this.currentMessageId,
            role: 'assistant',
            type: 'message',
            chunk: true,
            content: [{ type: 'text', text: textPart }]
          };
        }
      }
    }

    if (this.state.capturingToolCall) {
      const endIndex = this.state.buffer.indexOf('<|tool_call_end|>');
      if (endIndex !== -1) {
        debugger;
        const toolCallContent = this.state.buffer.substring(0, endIndex);
        this.log(`Detected tool call content: "${toolCallContent}"`);
        this.state.buffer = this.state.buffer.substring(endIndex + '<|tool_call_end|>'.length);
        this.state.capturingToolCall = false;

        const toolCalls = this._extractPythonicCalls(toolCallContent);
        const toolUseBlocks: ToolUseBlock[] = toolCalls.flatMap(call => {
          this.log(`Parsing tool call: "${call}"`);
          const parsed = this._parsePythonicCall(call);
          if (!parsed) return [];
          
          const { name, positionalArgs, keywordArgs } = parsed;
          const toolSchema = this.options.tools?.find((t) => t.name === name);
          const paramNames = toolSchema ? Object.keys(toolSchema.input_schema.properties) : [];
          const input = this._mapArgsToNamedParams(paramNames, positionalArgs, keywordArgs);

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
    if (!this.state.capturingToolCall && chunk.indexOf('<|tool_call_start|>') === -1) {
      const textToEmit = this.state.buffer;
      this.state.buffer = '';
      if (textToEmit) {
        return {
          id: this.currentMessageId,
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

    let __past_key_values: any =null;

    const stream = new ReadableStream<string>({
      start: async (controller) => {
        this.log("ReadableStream started for model generation.");

        try {
          const streamer = new TextStreamer(this.tokenizer, {
            skip_prompt: true,
            skip_special_tokens: false,
            callback_function: (value: string) => {
              controller.enqueue(value.replace(IM_END_TAG, ""));
            },
          });
      
      
          const { past_key_values } = await (this.model as any).generate({
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
    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs)
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
      this.onTool?.bind(this)
    );

    const lastMessage = this.inputs.slice(-1)[0];
    if (!lastMessage || lastMessage.role !== 'user') {
      return automodeStream;
    }
    
    const userMessage: Message = {
      ...(lastMessage as MessageInput),
      id: lastMessage.id || v4(),
      type: 'message',
    };

    const stream = new ReadableStream<Message>({
      async start(controller) {
        controller.enqueue(userMessage);

        const reader = automodeStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
      cancel(reason) {
        automodeStream.cancel(reason);
      },
    });

    return stream as ReadableStreamWithAsyncIterable<Message>;
  }

  performTaskNonStream(_prompt: string, _chainOfThought: string, _system: string): Promise<Message> {
    throw new Error("Method not implemented.");
  }

}