import { BaseLLMOptions } from "@uaito/sdk";

/**
 * Enumeration of the available Anthropic models.
 * @enum {string}
 */
export enum AnthropicModels {
    /**
     * The Claude 4 Sonnet model.
     */
    'Sonnet-4.5' = "claude-sonnet-4-5-20250929",
    // 'claude-4-sonnet' = "claude-sonnet-4-20250514",

  }

  /**
   * Type alias for Anthropic options, extending BaseLLMOptions with an optional apiKey.
   * @type
   */
  export type AnthropicOptions = { apiKey?: string } & BaseLLMOptions;
