import { BaseLLMOptions, LLMProvider } from "@uaito/sdk";

/**
 * Enumeration of the available OpenAI models.
 * @enum {string}
 */
export enum OpenAIModels {
    /**
     * The GPT-5 Nano model.
     */
    // 'gpt-5-nano' = "gpt-5-nano-2025-08-07",
    /**
     * The GPT-5 Mini model.
     */
    'gpt-5' = "gpt-5-mini-2025-08-07",
  }

  export enum GrokModels {
    'grok-4' = "grok-4-fast-reasoning",
  }

  export enum OpenAIImageModels {
    'gpt-image-1-mini' = "gpt-image-1-mini",
    'gpt-image-1'='gpt-image-1'
  }
  
  type OpenAIProviderType = LLMProvider.OpenAI | LLMProvider.Grok;

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
