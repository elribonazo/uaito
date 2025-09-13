import { Agent, ToolUseBlock, Message, LLMProvider, MessageInput, MessageArray, AgentTypeToOptions, TextBlock  } from "@uaito/sdk";
import type { AutomatedEngineer } from "./AutomatedEngineer";
import { ToolModel } from '@/db/models/Tool';
import type { AbortSignal } from 'abort-controller';
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
        (contentBlock): contentBlock is ToolUseBlock => contentBlock.type === 'tool_use',
    );
    if (!tool) {
        throw new Error("Could not find ToolUseBlockParam on onTool")
    }
    const canUse = this.options.tools.find((toolN) => toolN.name === tool.name)
    if (!canUse) {
        throw new Error(`Invalid tool ${tool.name}`)
    }

    const localTools = ['tavilySearch', 'browseWebPage'];
    const toolName = tool.name as 'tavilySearch' | 'browseWebPage' | 'executeCommand' | 'editAndApply' | 'createFile' | 'createFolder' | 'readFile' | 'listFiles';

    const agentOptions = this.options as AgentTypeToOptions[T];
    const execution = new Execution(this.type, {
        ...agentOptions,
        model: AnthropicModels['claude-3-5-sonnet'],
        maxTokens: 4096
    })
    if (localTools.includes(tool.name)) {
        if (tool.name === "browseWebPage") {
            await this.runSafeCommand(
                tool,
                async (instance: AutomatedEngineer<T>) => {
                    const codeInput = tool.input as { url: string, extractText?: boolean };
                    const key = tool.name;
                    const method = instance[key];
                    if (!method || typeof method !== 'function') {
                        throw new Error(`The method ${method} does not exist in AutomatedEngineer, must be implemented first.`)
                    }
                    const result = await method.bind(this)(codeInput.url, codeInput.extractText ?? false);
                    (this.client.inputs as MessageArray<MessageInput>).push({
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
        } else if (tool.name === "tavilySearch") {
            await this.runSafeCommand(
                tool,
                async (instance: AutomatedEngineer<T>) => {
                    
                    const codeInput = tool.input as { query: string };
                    const key = tool.name;
                    const method = instance[key];
                    if (!method || typeof method !== 'function') {
                        throw new Error(`The method ${method} does not exist in AutomatedEngineer, must be implemented first.`)
                    }
                    const list = await method.bind(this)(codeInput.query)
                    instance.client.inputs.push({
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
                    throw new Error("executeCommand is not implemented")
                    // const response = JSON.parse(completed.content)[0].text;
                    // const executionAnalize = await execution.request(input.code, response)
                    // this.client.inputs.push({
                    //     role:'user',
                    //     content: [
                    //         {
                    //             name: tool.name,
                    //             type: 'tool_result',
                    //             tool_use_id: tool.id,
                    //             isError: completed.error,
                    //             content: [
                    //                 {
                    //                     type: 'text',
                    //                     text: ((executionAnalize.response as Message).content[0] as TextBlock).text
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // })
                }  else {
                    this.client.inputs.push({
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
        } catch (err) {
            abortController.abort()
        }
    }
}
