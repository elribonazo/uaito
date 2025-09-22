/**
 * 
 * 
 * Our client needs to:
 * 
 * use API, OpenAI, Anthropic, or Local models
 */
import { BaseLLM } from "@uaito/sdk";
import { BaseLLMCache, Message, MessageInput, OnTool, ReadableStreamWithAsyncIterable } from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import { MessageArray } from "@uaito/sdk";
import { UaitoAPIOptions } from "./types";

export * from './types'
export class UaitoAPI extends BaseLLM<LLMProvider.API, UaitoAPIOptions> {

    public cache: BaseLLMCache = {
        toolInput: null,
        chunks: '',
        tokens: {
            input: 0,
            output: 0
        }
    }
    public inputs: MessageArray<MessageInput>
    public baseUrl: string;
    public onTool?: OnTool;
    
    constructor({options}: {options: UaitoAPIOptions},onTool?: OnTool) {
        super(LLMProvider.API, options);
        this.inputs = options.inputs ?? new MessageArray();
        this.baseUrl = options.baseUrl ?? 'https://uaito.io';
        this.onTool = onTool ?? options.onTool;
    }

    async request(prompt: string) {
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

    performTaskStream(userPrompt: string, chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
        if (chainOfThought) {
            throw new Error("Chain of thought is not supported for API provider");
        }
        if (system) {
            throw new Error("System prompt is not supported for API provider");
        }
        return this.request(userPrompt);
    }

}