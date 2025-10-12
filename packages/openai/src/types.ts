import type { BaseLLMOptions } from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";

/**
 * An enumeration of the available OpenAI models that can be used with the SDK.
 * Each enum member maps to a specific model identifier provided by OpenAI.
 * @enum {string}
 */
export enum OpenAIModels {
    /**
     * A highly capable and efficient model, suitable for a wide range of tasks.
     */
    'gpt-5' = "gpt-5-mini-2025-08-07",
  }

  /**
   * An enumeration of the available Grok models.
   * @enum {string}
   */
  export enum GrokModels {
    /**
     * A model optimized for fast reasoning and conversational tasks.
     */
    'grok-4' = "grok-4-fast-reasoning",
  }

  export enum OpenAIImageModels {
    'gpt-image-1-mini' = "gpt-image-1-mini",
    'gpt-image-1'='gpt-image-1'
  }
  
  /**
   * A union type representing the OpenAI-compatible providers.
   * @type
   */
  type OpenAIProviderType = LLMProvider.OpenAI | LLMProvider.Grok;

  /**
   * A mapping from an `LLMProvider` to its corresponding model enum.
   * This is used to ensure type safety when specifying a model for a given provider.
   * @type
   */
  type LLMProviderToOpenAIModel = {
    [LLMProvider.OpenAI]: OpenAIModels;
    [LLMProvider.Grok]: GrokModels;
  }

  export type ImageGenConfig = {
    model: OpenAIImageModels;
    quality: 'high' | 'low';
    output_format: 'png' | 'jpeg';
    size: "auto" | "1024x1024" | "1024x1536" | "1536x1024" ;
    input_fidelity: 'high' | 'low';
  }

/**
 * Type alias for OpenAI options, extending BaseLLMOptions with an optional apiKey.
 * @type
 */
export type OpenAIOptions<T extends OpenAIProviderType> =
  BaseLLMOptions & {
    type: T,
    apiKey?: string,
    baseURL?: string,
    model: LLMProviderToOpenAIModel[T],
    imageGenConfig?: ImageGenConfig
  };
