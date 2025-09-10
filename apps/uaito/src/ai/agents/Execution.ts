import { Agent, type MessageInput, ANSI_YELLOW, type Tool, MessageArray, LLMProvider } from "@uaito/sdk";

export class Execution extends Agent<LLMProvider.Anthropic> {
    protected override color = ANSI_YELLOW;
    protected override name = "Executor"
    protected _systemPrompt: string = `You are an AI code execution agent. 
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
    public override tools: Tool[] = []

    public override inputs: MessageArray<MessageInput> = MessageArray.from([]);
    private code!: string;
    private execution_result!: string;

    get systemPrompt() {
        return this._systemPrompt
            .replace("$$command", this.code)
            .replace("$$result", this.execution_result)
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
        return this.performTask(
            prompt,
            "",
            this.systemPrompt,
            false
        )
    }
}