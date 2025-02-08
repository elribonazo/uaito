import { JSONValue } from "llamaindex";
import { AbortSignal } from 'abort-controller';

import { Anthropic } from "./llm/anthropic";
import { MessageArray } from "./utils";

export type ArrayElementType<T> = T extends (infer U)[] ? U : never;
export type AnthropicOptions = {  apiKey?: string } & BaseLLMOptions;
export type OpenAIOptions = {  apiKey?: string } & BaseLLMOptions;
export type Tool = JSONValue;

export enum LLMProvider {
  OpenAI = 'OpenAI',
  Anthropic = 'Anthropic'
}

export type OnTool = (
  message: Message,inputs: MessageArray<MessageInput>, signal?: AbortSignal
) => Promise<void>

export interface SearchReplaceBlock {
  search: string;
  replace: string;
}

export type AgentTypeToOptions = {
    [LLMProvider.Anthropic]: AnthropicOptions;
    [LLMProvider.OpenAI]: OpenAIOptions;
    [name: string]: unknown
  };

export type AgentTypeToClass = {
  [LLMProvider.Anthropic]: Anthropic;
  //Todo: replace when done
  [LLMProvider.OpenAI]: any;
  [name: string]: unknown
};

export type USAGE = {
  input_tokens: number;
  output_tokens: number;
}

export type MessageType =
  'message' |
  ToolStartBlock['type'] |
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

export type ToolStartBlock = {
  id: string;
  input: unknown;
  name: string;
  type: 'tool_start';
}

export type ToolUseBlock = {
  id: string;
  input: unknown;
  name: string;
  type: 'tool_use';
}

export type ToolInputDelta = {
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

export type ToolBlock = ToolStartBlock | ToolInputDelta | ToolUseBlock  | ToolResultBlock ;
export type Role = 'assistant' | 'user';

export type Message = {
  id: string,
  type: MessageType,
  content: (ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock)[],
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

export abstract class Runner {
abstract performTask(
  prompt: string,
  system: string,
  input:  MessageArray<MessageInput>,
  stream: boolean
): Promise<ReadableStream<Message> | Message>;
}
  