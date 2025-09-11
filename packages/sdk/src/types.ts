import { AbortSignal } from 'abort-controller';

import type { Anthropic } from "./llm/Anthropic";
import type { OpenAI } from "./llm/Openai";
import type { Agent } from "./agents";
import { HuggingFaceONNX } from './llm/HuggingFaceONNX';

export enum HuggingFaceONNXModels {
  Llama32_3B = "onnx-community/Llama-3.2-3B-Instruct-onnx-web",
  Llama32_1B = "onnx-community/Llama-3.2-1B-Instruct-q4f16",
  Test2 = "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX",
  Test = "elribonazo/demo",
  LMF2_350M = "onnx-community/LFM2-350M-ONNX",
  LMF2_700M = "onnx-community/LFM2-700M-ONNX",
  LMF2_1_2B = "onnx-community/LFM2-1.2B-ONNX",
  QWEN_1 = "onnx-community/Qwen3-0.6B-ONNX",
  QWEN_2 = "onnx-community/Qwen3-1.7B-ONNX"
}

export enum AnthropicModels {
  'claude-3-5-sonnet' = 'claude-3-5-sonnet-20240620',
  'claude-3-haiku' = 'claude-3-haiku-20240307',
  'claude-3-opus' = 'claude-3-opus-20240229',
  'claude-4-sonnet' = 'claude-sonnet-4-20250514'
}

export enum OpenAIModels {
  'gpt-4o' = 'gpt-4o',
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
  HuggingFaceONNX = 'HuggingFaceONNX'
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
    [LLMProvider.HuggingFaceONNX]: HuggingFaceONNXOptions;
    [name: string]: unknown
  };

export type AgentTypeToClass = {
  [LLMProvider.Anthropic]: Anthropic;
  [LLMProvider.OpenAI]: OpenAI;
  [LLMProvider.HuggingFaceONNX]: HuggingFaceONNX;
  [name: string]: unknown
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
  ErrorBlock['type']


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

export type BlockType = ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock;
export type Message = {
  id: string,
  type: MessageType,
  content: BlockType[],
  chunk?: boolean,
  role: Role
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

 abstract performTaskNonStream(
    userPrompt: string,
    chainOfThought: string,
    system: string,
): Promise<Message>;
}

export const AgentTypeToModel = {
  [LLMProvider.Anthropic]: AnthropicModels,
  [LLMProvider.OpenAI]: OpenAIModels,
  [LLMProvider.HuggingFaceONNX]: HuggingFaceONNXModels,
};
