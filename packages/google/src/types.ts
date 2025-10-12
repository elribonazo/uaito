import type { BaseLLMOptions, Message, Tool } from '@uaito/sdk';

/**
 * An enumeration of the available Google models that can be used with the SDK.
 * Each enum member maps to a specific model identifier provided by Google.
 * @enum {string}
 */
export enum GoogleModels {
  'gemini-2.5' = 'gemini-2.5-pro'
}

/**
 * Defines the configuration options for the `Google` LLM client.
 * It extends the `BaseLLMOptions` with Google-specific properties.
 * @type
 */
export type GoogleOptions = Omit<BaseLLMOptions, 'tools' | 'onTool'> & {
  /**
   * The API key for authenticating with the Google Generative AI API.
   * If not provided, the client will throw an error.
   * @type {string | undefined}
   */
  apiKey?: string;
  /**
   * The specific Google model to use, e.g., 'gemini-2.5-pro'.
   * @type {string}
   */
  model: string;
  /**
   * An array of tools that the LLM is allowed to use.
   * @type {Tool[] | undefined}
   */
  tools?: Tool[];
  /**
   * An optional callback function that is triggered when a tool is used.
   * @type {((this: any, message: Message, signal?: AbortSignal | undefined) => Promise<void>) | undefined}
   */
  onTool?: (
    this: unknown,
    message: Message,
    signal?: AbortSignal | undefined
  ) => Promise<void>;
  /**
   * The maximum number of tokens to generate in the response.
   * @type {number | undefined}
   */
  maxOutputTokens?: number;
  /**
   * Controls the randomness of the output. Higher values (e.g., 1.0) make the output more random,
   * while lower values (e.g., 0.2) make it more deterministic.
   * @type {number | undefined}
   */
  temperature?: number;
  /**
   * The maximum number of tokens to consider when sampling.
   * @type {number | undefined}
   */
  topK?: number;
  /**
   * The cumulative probability of tokens to consider when sampling.
   * @type {number | undefined}
   */
  topP?: number;
  /**
   * If `true`, enables verbose logging to the console.
   * @type {boolean | undefined}
   */
  verbose?: boolean;
  /**
   * A custom logging function. If not provided, `console.log` will be used when `verbose` is `true`.
   * @type {((message: string) => void) | undefined}
   */
  log?: (message: string) => void;
};
