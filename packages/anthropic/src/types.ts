import type { BaseLLMOptions } from "@uaito/sdk";

/**
 * An enumeration of the available Anthropic models that can be used with the SDK.
 * Each enum member maps to a specific model identifier provided by Anthropic.
 * @enum {string}
 */
export enum AnthropicModels {
    /**
     * The Claude 4 Sonnet model, a powerful and versatile model suitable for a wide range of tasks.
     * This is often a good default choice for balanced performance and cost.
     */
    'claude-4-sonnet' = "claude-sonnet-4-5-20250929",
    // 'claude-4-sonnet' = "claude-sonnet-4-20250514",

  }

  /**
   * Defines the configuration options for the `Anthropic` LLM client.
   * It extends the `BaseLLMOptions` with an optional `apiKey`.
   * @type
   */
  export type AnthropicOptions = { 
    /**
     * The API key for authenticating with the Anthropic API.
     * If not provided, the client may attempt to use an environment variable.
     * @type {string | undefined}
     */
    apiKey?: string 
  } & BaseLLMOptions;
