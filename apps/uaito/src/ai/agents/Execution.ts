import { Agent, type MessageInput,  MessageArray, LLMProvider, AgentTypeToOptions, OnTool } from "@uaito/sdk";

export class Execution<T extends LLMProvider> extends Agent<T> {
    protected override name = "Executor"
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

     constructor(
        public type: T,
        protected llmOptions:AgentTypeToOptions[typeof type],
        protected onTool?: OnTool,
      ) {
        super(type, llmOptions, onTool)
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