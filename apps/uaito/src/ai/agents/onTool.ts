import { Agent, ToolUseBlock, Message, LLMProvider, type MessageInput, MessageArray, type AgentTypeToOptions  } from "@uaito/sdk";
import type { AutomatedEngineer } from "./AutomatedEngineer";
import { ToolModel } from '@/db/models/Tool';
import type {AbortSignal} from 'abort-controller';
import { AbortController } from 'abort-controller';
import { Execution } from "./Execution";
import { AnthropicModels } from "@uaito/sdk";
async function toolCompletion(id: string, signal: AbortSignal) {
    const maxRetries = 400;
    for (let retries = 0; retries < maxRetries; retries++) {
        if (signal.aborted) {
            throw new Error('Operation aborted');
        }
        const toolStatus = await ToolModel.findOne({
            _id:id
        });
        if (toolStatus && toolStatus.state === 'completed') {
            console.log('Tool status is completed');
            return toolStatus;
        }
        await new Promise((resolve) => {
            const timer = setTimeout(resolve, 1000);
            signal.addEventListener('abort', () => {
                clearTimeout(timer);
                resolve(null);
            }, { once: true });
        });
    }

    throw new Error('Tool completion timed out');
}

export async function onTool<T extends LLMProvider>(
    this: Agent<T>,
    userId: string,
    threadId: string,
    message: Message,
    inputs: MessageArray<MessageInput>,
    abortController: AbortController
) {
    const { content } = message;
    if (typeof content === "string") {
        throw new Error("You must use ToolUseBlockParam on onTool content, string is not yet supported")
    }
    const tool = content.find(
        (content): content is ToolUseBlock => content.type === 'tool_use',
    );
    if (!tool) {
        throw new Error("Could not find ToolUseBlockParam on onTool")
    }
    const canUse = this.tools.find((toolN) => toolN.name === tool.name)
    if (!canUse) {
        throw new Error(`Invalid tool ${tool.name} is not enabled in your subscription`)
    }

    const localTools = ['tavilySearch', 'browseWebPage'];
    const toolName = tool.name as any;
    const toolFunction = (this as any)[toolName];

    const agentOptions = this.options as AgentTypeToOptions[T];
    if (agentOptions) {
        agentOptions.tools = [];
        (agentOptions as any).inputs = MessageArray.from([])
    }

    const execution = new Execution(LLMProvider.Anthropic, {
        ...agentOptions,
        model: AnthropicModels['claude-4-sonnet'],
        maxTokens: 4096
    })
    if (localTools.includes(tool.name)) {

        if (tool.name === "browseWebPage" && typeof toolFunction === 'function') {
            await this.runSafeCommand(
                tool,
                async (instance) => {
                    const codeInput = tool.input as any;
                    const key = tool.name as any;
                    const method = (instance as any)[key];
                    if (!method || typeof method !== 'function') {
                        throw new Error(`The method ${method} does not exist in AutomatedEngineer, must be implemented first.`)
                    }
                    const result = await method.bind(this)(codeInput.url, codeInput.extractText ?? false);
                    (this.inputs as MessageArray<MessageInput>).push({
                        role:'user',
                        content:[{
                            name: tool.name,
                            type: 'tool_result',
                            tool_use_id: tool.id,
                            content: [
                                {
                                    "type": "text",
                                    "text": result
                                }
                            ],
                        }]
                    })
                })
        } else if (tool.name === "tavilySearch" && typeof toolFunction === 'function') {
            await this.runSafeCommand(
                tool,
                async (instance: AutomatedEngineer<T>) => {
                    const codeInput = tool.input as any;
                    const key = tool.name as any;
                    const method = (instance as any)[key];
                    if (!method || typeof method !== 'function') {
                        throw new Error(`The method ${method} does not exist in AutomatedEngineer, must be implemented first.`)
                    }
                    const list = await method.bind(this)(codeInput.query)
                    inputs.push({
                        role:'user',
                        content: [
                            {
                                name: tool.name,
                                type: 'tool_result',
                                tool_use_id: tool.id,
                                content: list
                            }
                        ]
                    })
                }
            )
        }
    } else {
        const dbTool = await ToolModel.create({
            userId,
            threadId,
            name: toolName,
            input: JSON.stringify(tool.input),
            state: 'pending'
        })
        try {
            const completed = await toolCompletion(dbTool._id as string, abortController.signal);
            const input = JSON.parse(completed.input ?? '{}');
            if (completed) {
                if (toolName === "executeCommand") {
                    const response = JSON.parse(completed.content)[0].text;
                    const executionAnalize = await execution.request(input.code, response)
                    
                    inputs.push({
                        role:'user',
                        content: [
                            {
                                name: tool.name,
                                type: 'tool_result',
                                tool_use_id: tool.id,
                                isError: completed.error,
                                content: [
                                    {
                                        type: 'text',
                                        text: ((executionAnalize.response as Message).content[0] as any).text
                                    }
                                ]
                            }
                        ]
                    })
                }  else {
                    inputs.push({
                        role:'user',
                        content: [
                            {
                                name: tool.name,
                                type: 'tool_result',
                                isError: completed.error,
                                tool_use_id: tool.id,
                                content: JSON.parse(completed.content)
                            }
                        ]
                    })
                }
            }
        } catch (err: unknown) {
            abortController.abort()
        }
    }
}
