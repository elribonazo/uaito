import {  BaseLLMOptions, MessageInput} from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import { MessageArray } from "@uaito/sdk";

export type UaitoAPIOptions = {
    apiKey: string;
    baseUrl?: string;
    inputs?: MessageArray<MessageInput>;
    provider: LLMProvider.Anthropic | LLMProvider.OpenAI;
    agent?: string;
    signal?: AbortSignal;
    model?: string;
} & BaseLLMOptions