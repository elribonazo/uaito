/**
 * 
 * 
 * Our client needs to:
 * 
 * use API, OpenAI, Anthropic, or Local models
 */
import { BaseLLM } from "@uaito/sdk";
import type { BaseLLMCache, BlockType, Message, MessageInput, OnTool, ReadableStreamWithAsyncIterable } from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import { MessageArray } from "@uaito/sdk";
import type { UaitoAPIOptions } from "./types";

export * from './types'
/**
 * A client for interacting with the Uaito API, which acts as a proxy to various
 * underlying LLM providers. It extends the `BaseLLM` class to provide a consistent
 * interface for making API requests and handling streaming responses.
 *
 * @class UaitoAPI
 * @extends {BaseLLM<LLMProvider.API, UaitoAPIOptions>}
 *
 * @example
 * ```typescript
 * const api = new UaitoAPI({
 *   options: {
 *     apiKey: 'YOUR_UAITO_API_KEY',
 *     provider: LLMProvider.OpenAI,
 *     agent: 'orquestrator',
 *     model: 'gpt-4o',
 *   }
 * });
 *
 * const responseStream = await api.performTaskStream("Tell me a joke.");
 * for await (const chunk of responseStream) {
 *   // Process each message chunk
 * }
 * ```
 */
export class UaitoAPI extends BaseLLM<LLMProvider.API, UaitoAPIOptions> {

    /**
     * A cache for storing intermediate data.
     * @public
     * @type {BaseLLMCache}
     */
    public cache: BaseLLMCache = {
        toolInput: null,
        chunks: '',
        tokens: {
            input: 0,
            output: 0
        }
    }
    /**
     * An array that holds the history of messages for the conversation.
     * @public
     * @type {MessageArray<MessageInput>}
     */
    public inputs: MessageArray<MessageInput>
    /**
     * The base URL for the Uaito API. Defaults to 'https://uaito.io'.
     * @public
     * @type {string}
     */
    public baseUrl: string;
    /**
     * An optional callback function that is triggered when a tool is used.
     * @type {OnTool | undefined}
     */
    public onTool?: OnTool;
    
    /**
     * Creates an instance of the `UaitoAPI` client.
     * @param {{ options: UaitoAPIOptions }} params - The configuration options for the client.
     * @param {OnTool} [onTool] - An optional callback for handling tool usage.
     */
    constructor({options}: {options: UaitoAPIOptions},onTool?: OnTool) {
        super(LLMProvider.API, options);
        this.inputs = options.inputs ?? new MessageArray();
        this.baseUrl = options.baseUrl ?? 'https://uaito.io';
        this.onTool = onTool ?? options.onTool;
    }

    /**
     * Sends a request to the Uaito API and returns the response as a `ReadableStream`.
     * This method constructs the request body, including the prompt, message history, and model,
     * and handles the parsing of the delimited stream of `Message` objects.
     * @param {string} prompt - The user's prompt.
     * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of `Message` objects.
     */
    async request(prompt: string | BlockType[]): Promise<ReadableStreamWithAsyncIterable<Message>> {
        const { provider, agent, model, inputs, signal, apiKey } = this.options;
        const url = `${this.baseUrl}/api/${provider}/${agent}/messages`;

        const body = {
            prompt,
            inputs: inputs ? inputs.map((i) => (typeof i.content === 'string' ? { ...i, content: [{ type: 'text', text: i }] } : i)) : [],
            model,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': apiKey,
            },
            body: JSON.stringify(body),
            signal,
        });

        return new ReadableStream<Message>({
            start: async (controller) => {
                try {
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
                    }

                    if (!response.body) {
                        throw new Error('Response body is empty.');
                    }

                    let buffer = "";
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    const delimiter = "<-[*0M0*]->";

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            break;
                        }

                        buffer += decoder.decode(value, { stream: true });

                        let delimiterIndex: number | undefined;
                        // biome-ignore lint/suspicious/noAssignInExpressions: ok
                        while ((delimiterIndex = buffer.indexOf(delimiter)) !== -1) {
                            const message = buffer.slice(0, delimiterIndex);
                            buffer = buffer.slice(delimiterIndex + delimiter.length);

                            if (message) {
                                const parsed: Message = JSON.parse(message);
                                controller.enqueue(parsed);
                            }
                        }
                    }
                    reader.cancel();
                    reader.releaseLock();

                } catch (err) {
                    controller.error(err);
                    controller.close();
                }

            }
        }) as ReadableStreamWithAsyncIterable<Message>;
    }

    /**
     * An alias for the `request` method to conform to the `BaseLLM` interface.
     * @param {string | BlockType[]} userPrompt - The user's prompt.
     * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of `Message` objects.
     */
    performTaskStream(userPrompt: string | BlockType[], chainOfThought?: string, system?: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
        return this.request(userPrompt);
    }

}