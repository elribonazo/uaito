import type { Tool } from "@google/genai";
import type { BaseLLMOptions, Message } from '@uaito/sdk';

/**
 * Enumeration of the available Google models.
 * @enum {string}
 */
export enum GoogleModels {
  'gemini-2.5' = 'gemini-2.5-pro'
}

/**
 * Type alias for Google options, extending BaseLLMOptions.
 * @type
 */
export type GoogleOptions = Omit<BaseLLMOptions, 'tools' | 'onTool'> & {
  apiKey?: string;
  model: string;
  tools?: Tool[];
  onTool?: (
    // @ts-ignore
    this: any,
    message: Message,
    signal?: AbortSignal | undefined
  ) => Promise<void>;
  maxOutputTokens?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
  verbose?: boolean;
  log?: (message: string) => void;
};
