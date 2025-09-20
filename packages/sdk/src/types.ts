import type { Anthropic } from "./llm/Anthropic";
import type { OpenAI } from "./llm/Openai";
import type { Agent } from "./agents";
import type { HuggingFaceONNX } from './llm/HuggingFaceONNX';
import { HuggingFaceONNXTextToImage } from './llm/HuggingFaceONNXImage';

export enum HuggingFaceONNXModels {
  JANO = "onnx-community/Jan-nano-ONNX",
  QWEN3 = "onnx-community/Qwen3-0.6B-ONNX",
  Llama32 = "onnx-community/Llama-3.2-1B-Instruct-q4f16",
  LMF2 = "onnx-community/LFM2-1.2B-ONNX"
}
export enum AnthropicModels {
  'claude-4-sonnet' = "claude-sonnet-4-20250514"
}
export enum OpenAIModels {
  'gpt-5' = "gpt-5-mini-2025-08-07"
}

export type ArrayElementType<T> = T extends (infer U)[] ? U : never;
export type AnthropicOptions = { apiKey?: string } & BaseLLMOptions;
export type OpenAIOptions = { apiKey?: string } & BaseLLMOptions;
export type HuggingFaceONNXOptions =  BaseLLMOptions & {
  model: HuggingFaceONNXModels,
  dtype: DType,
  device: "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined
};
export type Tool = {
  id?: number;
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, {
      type: string;
      description: string;
      default?: unknown;
    }>;
    required?: string[];
  };
  code?: string;
  enabled?: boolean;
  isCollapsed?: boolean;
};
export type DType = "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16" | Record<string, "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16"> | undefined

export type BaseLLMCache = {
    toolInput: BlockType | null,
    chunks: string | null,
    tokens: {
      input: number,
      output: number
    }
  }

export enum LLMProvider {
  OpenAI = 'OpenAI',
  Anthropic = 'Anthropic',
  Local = 'Local',
  LocalImage = 'LocalImageGeneration'
}

export type OnTool<T extends LLMProvider = LLMProvider> = (
  this: Agent<T>,
  message: Message, 
  signal?: AbortSignal
) => Promise<void>



export interface SearchReplaceBlock {
  search: string;
  replace: string;
}

export type AgentTypeToOptions = {
    [LLMProvider.Anthropic]: AnthropicOptions;
    [LLMProvider.OpenAI]: OpenAIOptions;
    [LLMProvider.Local]: HuggingFaceONNXOptions;
    [LLMProvider.LocalImage]: {};
  };

export type AgentTypeToClass = {
  [LLMProvider.Anthropic]: Anthropic;
  [LLMProvider.OpenAI]: OpenAI;
  [LLMProvider.Local]: HuggingFaceONNX;
  [LLMProvider.LocalImage]: HuggingFaceONNXTextToImage;
};

export type BinConfig<P extends LLMProvider> = {
  provider: P,
  options: AgentTypeToOptions[P],
  tools?: Tool[],
  createSystemPrompt?: (tools: Tool[]) => string,
  chainOfThought?: string,
  onTool?: OnTool,
}

export type USAGE = {
  input_tokens: number;
  output_tokens: number;
}

export type MessageType =
  'message' |
  ToolInputDelta['type'] |
  ToolUseBlock['type'] |
  ToolResultBlock['type'] |
  DeltaBlock['type'] |
  UsageBlock['type'] | 
  ErrorBlock['type'] |
  ThinkingBlock['type'] |
  RedactedThinkingBlock['type'] | 
  SignatureDeltaBlock['type']


export type ImageBlock = {
  source: {
    data: string;
    media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    type: 'base64';
  };
  type: 'image';
}

export type TextBlock = {
  text: string;
  type: 'text';
}


export type ToolUseBlock = {
  id: string;
  input: unknown;
  name: string;
  type: 'tool_use';
}

export type ToolInputDelta = {
  id?:string,
  name?:string,
  partial:string,
  type: 'tool_delta';
}

export type ToolResultBlock = {
  tool_use_id: string;
  name: string,
  type: 'tool_result';
  content?: MessageContent[];
  isError?: boolean;
}

export type ToolBlock = ToolInputDelta | ToolUseBlock  | ToolResultBlock ;
export type Role = 'assistant' | 'user' | 'system' | 'tool';

export type BlockType = ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock | ThinkingBlock | RedactedThinkingBlock |ServerToolUseBlock | WebSearchToolResultBlock | SignatureDeltaBlock;
export type Message = {
  id: string,
  type: MessageType,
  content: BlockType[],
  chunk?: boolean,
  role: Role
}
export interface WebSearchResultBlock {
  encrypted_content: string;

  page_age: string | null;

  title: string;

  type: 'web_search_result';

  url: string;
}

export type WebSearchToolResultBlockContent = WebSearchToolResultError | Array<WebSearchResultBlock>;
export interface WebSearchToolResultError {
  error_code:
    | 'invalid_tool_input'
    | 'unavailable'
    | 'max_uses_exceeded'
    | 'too_many_requests'
    | 'query_too_long';

  type: 'web_search_tool_result_error';
}


export interface WebSearchToolResultBlock {
  content: WebSearchToolResultBlockContent;

  tool_use_id: string;

  type: 'web_search_tool_result';
}

export interface ServerToolUseBlock {
  id: string;

  input: unknown;

  name: 'web_search';

  type: 'server_tool_use';
}

export type DeltaBlock =   {
  type:'delta',
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;

  stop_sequence: string | null;

}

export type UsageBlock = {
  type: 'usage',
  input?: number,
  output?: number
}

export type ErrorBlock = {
  type:'error',
  message: string
}
export interface RedactedThinkingBlock {
  data: string;

  type: 'redacted_thinking';
}

export interface ThinkingBlock {
  signature: string;

  thinking: string;

  type: 'thinking';
}

export interface SignatureDeltaBlock {
  signature: string;

  type: 'signature_delta';
}


export type MessageContent = ArrayElementType<Message['content']>

export type MessageInput = {
  id?: string,
  type?: MessageType,
  role: Role,
  content: MessageContent[]
}

export type BaseLLMOptions = {
    model: string,
    tools?: Tool[]
    maxTokens?: number,
    signal?: AbortSignal,
    directory?: string,
    onProgress?: (progress: number) => void,
}

export type ReadableStreamWithAsyncIterable<T> = ReadableStream<T> & AsyncIterable<T>;

export abstract class Runner {
   abstract performTaskStream(
    userPrompt: string,
    chainOfThought: string,
    system: string,
): Promise<ReadableStreamWithAsyncIterable<Message>>;
}

export const AgentTypeToModel = {
  [LLMProvider.Anthropic]: AnthropicModels,
  [LLMProvider.OpenAI]: OpenAIModels,
  [LLMProvider.Local]: HuggingFaceONNXModels,
};

export abstract class BaseMessage {
  abstract render(): Promise<Message>;
  abstract replacements: string[];

  protected buffer: string;
  protected tools: Tool[];
  protected cleanChunk(chunk: string) {
    this.replacements?.forEach(replacement => {
      chunk = chunk.replace(replacement, '');
    });
    return chunk;
  }

  constructor(buffer: string = '', tools: Tool[] = []) {
    this.buffer = this.cleanChunk(buffer);
    this.tools = tools;
  }
}