
import { Anthropic } from "./llm/anthropic/Anthropic";
import { AnthropicOptions, AnthropicModels } from "./llm/anthropic/types";
import { HuggingFaceONNX } from "./llm/huggingface/HuggingFaceONNX";
import { HuggingFaceONNXTextToAudio } from "./llm/huggingface/HuggingFaceONNXAudio";
import { HuggingFaceONNXTextToImage } from "./llm/huggingface/HuggingFaceONNXImage";
import { HuggingFaceONNXOptions, HuggingFaceONNXModels } from "./llm/huggingface/types";
import { OpenAI } from "./llm/openai/Openai";
import { OpenAIOptions, OpenAIModels } from "./llm/openai/types";

/**
 * Enumeration of the available LLM providers.
 * @export
 * @enum {string}
 */
export enum LLMProvider {
  /**
   * OpenAI provider.
   */
  OpenAI = 'OpenAI',
  /**
   * Anthropic provider.
   */
  Anthropic = 'Anthropic',
  /**
   * Local provider.
   */
  Local = 'Local',
  /**
   * Local image generation provider.
   */
  LocalImage = 'LocalImageGeneration',
  /**
   * Local audio generation provider.
   */
  LocalAudio = 'LocalAudioGeneration'
}

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
};

/**
 * Maps each LLM provider to its available models.
 * @export
 * @const
 */
export const AgentTypeToModel = {
  /**
   * Models for the Anthropic provider.
   */
  [LLMProvider.Anthropic]: AnthropicModels,
  /**
   * Models for the OpenAI provider.
   */
  [LLMProvider.OpenAI]: OpenAIModels,
  /**
   * Models for the Local provider.
   */
  [LLMProvider.Local]: HuggingFaceONNXModels,
  /**
   * Models for the LocalImage provider.
   */
  [LLMProvider.LocalImage]: HuggingFaceONNXModels,
  /**
   * Models for the LocalAudio provider.
   */
  [LLMProvider.LocalAudio]: HuggingFaceONNXModels,
};
