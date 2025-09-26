import { Agent } from "@uaito/ai";
import {  type MessageInput,  BaseLLM,  BaseLLMOptions,  LLMProvider,  MessageArray, OnTool } from "@uaito/sdk";
import { AutomatedEngineer } from "./AutomatedEngineer";

export class Execution extends Agent {
    private code!: string;
    private execution_result!: string;

    get systemPrompt() {
        return `You are an AI code execution agent. 
    Your task is to analyze the provided code and its execution result from the 'code_execution_env' virtual environment, then provide a concise summary of what worked, what didn't work, and any important observations. Follow these steps:
    1. Review the code that was executed in the 'code_execution_env' virtual environment:
    $$command

    2. Analyze the execution result from the 'code_execution_env' virtual environment:
    $$result

    3. Provide a brief summary of:
       - What parts of the code executed successfully in the virtual environment
       - Any errors or unexpected behavior encountered in the virtual environment
       - Potential improvements or fixes for issues, considering the isolated nature of the environment
       - Any important observations about the code's performance or output within the virtual environment
       - If the execution timed out, explain what this might mean (e.g., long-running process, infinite loop)

    Be concise and focus on the most important aspects of the code execution within the 'code_execution_env' virtual environment.
    IMPORTANT: PROVIDE ONLY YOUR ANALYSIS AND OBSERVATIONS. DO NOT INCLUDE ANY PREFACING STATEMENTS OR EXPLANATIONS OF YOUR ROLE.`
            .replace("$$command", this.code)
            .replace("$$result", this.execution_result)
    }

    get tools() {
        return this.options.tools ?? [];
    }

    get chainOfThought() {
        return ``;
    }

    private constructor(
        llm: BaseLLM<LLMProvider, unknown>,
        protected directory: string
      ) {
        super(llm);
      }
  
      private static async getClient(type: LLMProvider, options: any): Promise<BaseLLM<LLMProvider, unknown>> {
        let Client: new ({ options }: {options:any}, onTool?: OnTool) => BaseLLM<any, unknown>
        if (type === LLMProvider.Anthropic) {
           Client = (await import("@uaito/anthropic")).Anthropic;
        } else if (type === LLMProvider.OpenAI) {
           Client = (await import("@uaito/openai")).OpenAI;
        } else if (type === LLMProvider.Local) {
           Client = (await import("@uaito/huggingface")).HuggingFaceONNX;
        } else if (type === LLMProvider.LocalImage) {
           Client = (await import("@uaito/huggingface")).HuggingFaceONNXTextToImage;
        } else if (type === LLMProvider.LocalAudio) {
           Client = (await import("@uaito/huggingface")).HuggingFaceONNXTextToAudio;
        } else if (type === LLMProvider.API) { 
           Client = (await import("@uaito/api")).UaitoAPI;
        } else {
            throw new Error("not implemented")
        }
        const client = new Client({options: {type, ...options}}, options.onTool) as BaseLLM<LLMProvider, unknown>
        return client
    }
  
      static async create<T extends LLMProvider>(
         type: T,
         llmOptions:BaseLLMOptions,
         directory: string,
      ) {
  
        const llm = await Execution.getClient(type, llmOptions);
        const instance = new Execution(llm, directory);
        return instance;
      }

    createInitialMessageInput(
        prompt: string, 
        input: MessageArray<MessageInput>
    ): MessageArray<MessageInput> {
        input.push({ role: 'user', content: [{type:'text', text:prompt}]});
        return input;
    }

    async request(code: string, execution_result: string) {
        this.code = code;
        this.execution_result = execution_result;
        const prompt = `Analyze this code execution from the 'code_execution_env' virtual environment:\n\nCode:\n${code}\n\nExecution Result:\n${execution_result}`
        return this.performTask( prompt )
    }
}