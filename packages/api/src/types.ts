import type { BaseLLMOptions, MessageInput } from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import type { MessageArray } from "@uaito/sdk";

/**
 * Defines the configuration options for the `UaitoAPI` client.
 * It extends `BaseLLMOptions` with properties specific to the Uaito API,
 * such as the API key, provider, agent, and model to use.
 * @type
 */
export type UaitoAPIOptions = {
    /**
     * The API key for authenticating with the Uaito API.
     * @type {string}
     */
    apiKey: string;
    /**
     * An optional base URL for the Uaito API. Defaults to 'https://uaito.io'.
     * @type {string | undefined}
     */
    baseUrl?: string;
    /**
     * An optional array of initial messages to provide context to the conversation.
     * @type {MessageArray<MessageInput> | undefined}
     */
    inputs?: MessageArray<MessageInput>;
    /**
     * The underlying LLM provider to use for the request (e.g., OpenAI or Anthropic).
     * @type {(LLMProvider.Anthropic | LLMProvider.OpenAI)}
     */
    provider: LLMProvider.Anthropic | LLMProvider.OpenAI;
    /**
     * The specific agent to use for the request. Defaults to 'orquestrator'.
     * @type {string | undefined}
     */
    agent?: string;
    /**
     * An optional `AbortSignal` to cancel the API request.
     * @type {AbortSignal | undefined}
     */
    signal?: AbortSignal;
    /**
     * The specific model to use for the request, e.g., 'gpt-4o'.
     * @type {string | undefined}
     */
    model?: string;
} & BaseLLMOptions