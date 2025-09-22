
/**
 * Enumeration of the available LLM providers.
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
  LocalAudio = 'LocalAudioGeneration',
  /**
   * Uaito Api provider.
   */
  API='API'
}

