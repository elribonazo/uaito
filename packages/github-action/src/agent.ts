import { Agent } from "@uaito/ai";
import { LLMProvider, MessageInput, OnTool, MessageArray, BaseLLM, BaseLLMOptions } from "@uaito/sdk";
import { createSystemPrompt } from "./prompts/GithubAgent";
import * as tools from './tools';

export class GithubAgent extends Agent {
    protected name = "GithubAgent";

    override get systemPrompt() {
        return createSystemPrompt(this.tools ?? []);
    }

    override get chainOfThought() {
        return `Answer the user's request using relevant tools only if the tool exists. 
  Before calling a tool, do some analysis within <thinking></thinking> tags. 
  1. First, determine if you have access to the requested tool.
  2. Second, think about which of the provided tools is the relevant tool to answer the user's request. 
  3. Third, go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. 
  When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value.
  If all of the required parawmeters are present or can be reasonably inferred, close the thinking tag and proceed with the tool call. 
  BUT, if one of the values for a required parameter is missing, 
  DO NOT invoke the function (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters. 
  DO NOT ask for more information on optional parameters if it is not provided.
  DO NOT reflect on the quality of the returned search results in your response.`;
    }

    private constructor(
        llm: BaseLLM<LLMProvider, unknown>,
    ) {
        (llm as any).options.tools = Object.values(tools);
        super(llm);
    }

    private static async getClient(type: LLMProvider, options: any): Promise<BaseLLM<LLMProvider, unknown>> {
        let Client: new ({ options }: { options: any }, onTool?: OnTool) => BaseLLM<any, unknown>
        if (type === LLMProvider.Anthropic) {
            const { Anthropic } = (await import("@uaito/anthropic"));
            Client = Anthropic;
        } else if (type === LLMProvider.OpenAI) {
            const { OpenAI } = (await import("@uaito/openai"));
            Client = OpenAI;
        } else if (type === LLMProvider.Grok) {
            const { OpenAI: Grok } = (await import("@uaito/openai"));
            Client = Grok;
        } else if (type === LLMProvider.Google) {
            const { Google } = (await import("@uaito/google"));
            Client = Google;
        } else {
            throw new Error("not implemented")
        }
        const client = new Client({ options: { type, ...options } }, options.onTool) as BaseLLM<LLMProvider, unknown>
        return client
    }

    static async create<T extends LLMProvider>(
        type: T,
        llmOptions: BaseLLMOptions,
        inputs: MessageArray<MessageInput>,
    ) {
        const llm = await GithubAgent.getClient(type, llmOptions);
        const instance = new GithubAgent(llm);
        await instance.addInputs(inputs);
        return instance;
    }
}
