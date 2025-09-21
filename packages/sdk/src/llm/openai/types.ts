import { BaseLLMOptions } from "@/domain/types";

/**
 * Enumeration of the available OpenAI models.
 * @enum {string}
 */
export enum OpenAIModels {
    /**
     * The GPT-5 Nano model.
     */
    'gpt-5-nano' = "gpt-5-nano-2025-08-07",
    /**
     * The GPT-5 Mini model.
     */
    'gpt-5-mini' = "gpt-5-mini-2025-08-07",
  }
  
  /**
   * Type alias for OpenAI options, extending BaseLLMOptions with an optional apiKey.
   * @type
   */
  export type OpenAIOptions = { apiKey?: string } & BaseLLMOptions;
/**
 * Type alias for Anthropic options, extending BaseLLMOptions with an optional apiKey.
 * @type
 */
export type AnthropicOptions = { apiKey?: string } & BaseLLMOptions;
