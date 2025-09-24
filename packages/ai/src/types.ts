import type { Anthropic, AnthropicOptions } from "@uaito/anthropic";
import type { UaitoAPI, UaitoAPIOptions } from "@uaito/api";
import type { HuggingFaceONNX, HuggingFaceONNXTextToImage, HuggingFaceONNXTextToAudio, HuggingFaceONNXOptions } from "@uaito/huggingface";
import type { OpenAI, OpenAIOptions } from "@uaito/openai";
import type { LLMProvider } from "@uaito/sdk";


/**
 * Maps each LLM provider to its specific options type.
 * @type
 */
export type AgentTypeToOptions = {
    /**
     * Options for the Anthropic provider.
     */
    [LLMProvider.Anthropic]: AnthropicOptions;
    /**
     * Options for the OpenAI provider.
     */
    [LLMProvider.OpenAI]: OpenAIOptions;
    /**
     * Options for the Local provider.
     */
    [LLMProvider.Local]: HuggingFaceONNXOptions;
    /**
     * Options for the LocalImage provider.
     */
    [LLMProvider.LocalImage]: HuggingFaceONNXOptions;
    /**
     * Options for the LocalAudio provider.
     */
    [LLMProvider.LocalAudio]: HuggingFaceONNXOptions;

    /**
     * Options for the Uaito API provider.
     */
    [LLMProvider.API]: UaitoAPIOptions;
};

/**
 * Maps each LLM provider to its corresponding class implementation.
 * @type
 */
export type AgentTypeToClass = {
  /**
   * Class for the Anthropic provider.
   */
  [LLMProvider.Anthropic]: Anthropic;
  /**
   * Class for the OpenAI provider.
   */
  [LLMProvider.OpenAI]: OpenAI;
  /**
   * Class for the Local provider.
   */
  [LLMProvider.Local]: HuggingFaceONNX;
  /**
   * Class for the LocalImage provider.
   */
  [LLMProvider.LocalImage]: HuggingFaceONNXTextToImage;
  /**
   * Class for the LocalAudio provider.
   */
  [LLMProvider.LocalAudio]: HuggingFaceONNXTextToAudio;
  [LLMProvider.API]: UaitoAPI;
};
