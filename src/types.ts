import { JSONObject } from "llamaindex";
import { AbortSignal } from 'abort-controller';

import { Anthropic } from "./llm/anthropic";
import { MessageArray } from "./utils";
import { Agent } from "./agents";

export type ArrayElementType<T> = T extends (infer U)[] ? U : never;
export type AnthropicOptions = { apiKey?: string } & BaseLLMOptions;
export type OpenAIOptions = { apiKey?: string } & BaseLLMOptions;
export type OllamaOptions = { host: string } & BaseLLMOptions;

export type Tool = JSONObject;

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
  Ollama = 'Ollama'
}

export type OnTool = (
  this: Agent,
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
    [LLMProvider.Ollama]: OllamaOptions;
    [name: string]: unknown
  };

export type AgentTypeToClass = {
  [LLMProvider.Anthropic]: Anthropic;
  //Todo: replace when done
  [LLMProvider.OpenAI]: any;
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
export type Role = 'assistant' | 'user';

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
  role: Role,
  content: MessageContent[]
}

export type BaseLLMOptions = {
    model: string,
    tools?: Tool[]
    maxTokens?: number,
    signal?: AbortSignal,
    directory?: string,
    inputs:  MessageArray<MessageInput>
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
  