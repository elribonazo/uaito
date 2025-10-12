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

  /**
   * An enumeration of the available OpenAI image generation models.
   * @enum {string}
   */
  export enum OpenAIImageModels {
    /**
     * A smaller, faster model for image generation, suitable for previews or less demanding tasks.
     */
    'gpt-image-1-mini' = "gpt-image-1-mini",
    /**
     * The standard high-quality image generation model.
     */
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

  /**
   * Defines the configuration for image generation when using the OpenAI provider.
   * @type
   */
  export type ImageGenConfig = {
    /**
     * The specific image generation model to use.
     * @type {OpenAIImageModels}
     */
    model: OpenAIImageModels;
    /**
     * The desired quality of the generated image. 'high' provides better detail at a higher cost.
     * @type {'high' | 'low'}
     */
    quality: 'high' | 'low';
    /**
     * The output format for the generated image.
     * @type {'png' | 'jpeg'}
     */
    output_format: 'png' | 'jpeg';
    /**
     * The desired size of the generated image. 'auto' allows the model to choose an appropriate size.
     * @type {"auto" | "1024x1024" | "1024x1536" | "1536x1024"}
     */
    size: "auto" | "1024x1024" | "1024x1536" | "1536x1024" ;
    /**
     * The fidelity of the input image, if one is provided for editing.
     * @type {'high' | 'low'}
     */
    input_fidelity: 'high' | 'low';
  }

/**
 * Defines the configuration options for the `OpenAI` client, which can be used for both
 * OpenAI and Grok providers. It extends `BaseLLMOptions` with provider-specific properties.
 * @type
 */
export type OpenAIOptions<T extends OpenAIProviderType> =
  BaseLLMOptions & {
    /**
     * The type of the provider, either `LLMProvider.OpenAI` or `LLMProvider.Grok`.
     * @type {T}
     */
    type: T,
    /**
     * The API key for the selected provider.
     * @type {string | undefined}
     */
    apiKey?: string,
    /**
     * An optional base URL for the API, useful for proxying or using custom endpoints.
     * @type {string | undefined}
     */
    baseURL?: string,
    /**
     * The specific model to use, which is typed based on the selected provider.
     * @type {LLMProviderToOpenAIModel[T]}
     */
    model: LLMProviderToOpenAIModel[T],
    /**
     * Optional configuration for image generation when using the OpenAI provider.
     * @type {ImageGenConfig | undefined}
     */
    imageGenConfig?: ImageGenConfig
  };
