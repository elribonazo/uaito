#!/usr/bin/env node
/**
 * @packageDocumentation 
 * UAITO CLI 
 */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Agent } from '.';
import { MessageArray } from '@uaito/sdk';
import type { BaseLLM, Tool } from '@uaito/sdk';
import { LLMProvider } from '@uaito/sdk';
import { GrokModels, OpenAIModels } from '@uaito/openai';
import { HuggingFaceONNXModels } from '@uaito/huggingface';

const browseWebPageTool: Tool = {
    name: "browseWebPage",
    description: `Opens the desired url to either get the source html code or to directly extract the redable texts`,
    input_schema: {
        type: "object",
        properties: {
            url: {
                type: "string",
                description: "The url parameter must include http or https or file."
            },
            extractText: {
                type: 'boolean',
                description: "If true, will return the content texts only. When not specified, or when false, we will return the whole html code."
            }
        },
        required: ['url']
    }
}


const tavilySearch: Tool = {
    name: "tavilySearch",
    description: "Perform a web search using the Tavily API to get up-to-date information or additional context. This tool should be used when you need current information or feel a search could provide a better answer to the user's query. It will return a summary of the search results, including relevant snippets and source URLs.",
    input_schema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The search query. Be as specific and detailed as possible to get the most relevant results."
            }
        },
        required: ["query"]
    }
}


const availableTools = [browseWebPageTool, tavilySearch];


class CLIAgent extends Agent {
    constructor(
        agent: BaseLLM<LLMProvider, any>,
        private systemPromptTemplate: string,
        private chainOfThoughtTemplate: string,
    ) {
        super(agent);
    }
    override get systemPrompt() {
        return this.systemPromptTemplate;
    }
    override get chainOfThought() {
        return this.chainOfThoughtTemplate;
    }
}



yargs(hideBin(process.argv))
    .command(
        'run <message>',
        'Runs the application with a given configuration',
        (yargs) => {
            return yargs
                .positional('message', {
                    type: 'string',
                    describe: 'Message to send to the agent',
                })
                .option('provider', {
                    alias: 'p',
                    type: 'string',
                    choices: [LLMProvider.Anthropic, LLMProvider.OpenAI, LLMProvider.Local, LLMProvider.Grok, LLMProvider.API],
                    required: true,
                    describe: 'LLM provider to use',
                })
                .option('model', {
                    alias: 'm',
                    type: 'string',
                    required: true,
                    describe: `Model to use`,
                })
                .option('apiKey', {
                    type: 'string',
                    describe: 'API key for the provider. Can also be set via ENV (ANTHROPIC_API_KEY, OPENAI_API_KEY)',
                })
        },
        async (argv) => {
            const { message, provider: providerStr, model, apiKey } = argv;
            const provider = providerStr as LLMProvider;

            if (!message) {
                console.error('You need to specify a message');
                process.exit(1);
            }
            const originalLog = console.log;
            const originalError = console.error;
            console.log = () => { };
            console.error = () => { };

            try {
                const tools = availableTools;
                const systemPrompt = `You are a helpful AI assistant.`;
                const chainOfThought = `Answer the user's request using relevant tools only if the tool exists and is relevant.`;

                let llm: BaseLLM<LLMProvider, any>;

                if (provider === LLMProvider.Anthropic) {
                    const { default: { Anthropic } } = (await import("@uaito/anthropic"));
                    llm = new Anthropic({
                        options: {
                            model,
                            tools,
                            apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
                            log: () => {}
                        }
                    });
                } else if (provider === LLMProvider.OpenAI) {
                    const { default: { OpenAI } } = (await import("@uaito/openai"));
                    llm = new OpenAI({
                        options: {
                            type: LLMProvider.OpenAI,
                            model: model as OpenAIModels,
                            tools,
                            apiKey: apiKey || process.env.OPENAI_API_KEY,
                            log: () => {}
                        }
                    });
                } else if (provider === LLMProvider.Local) {
                    const { default: { HuggingFaceONNX: Local } } = await import("@uaito/huggingface");
                    if (model !== HuggingFaceONNXModels.LUCY) {
                        throw new Error(`Model ${model} is not supported for local models, only ${HuggingFaceONNXModels.LUCY} is supported`);
                    }
                    llm = new Local({
                        options: {
                            model: model as HuggingFaceONNXModels,
                            tools,
                            device: "auto",
                            dtype: "q4f16",
                            log: () => {}
                        }
                    });
                } else if (provider === LLMProvider.Grok) {
                    const { default: { OpenAI: Grok } } = (await import("@uaito/openai"));
                    llm = new Grok({
                        options: {
                            type: LLMProvider.Grok,
                            model: model as GrokModels,
                            tools,
                            apiKey: apiKey || process.env.GROK_API_KEY,
                            log: () => {}
                        }
                    });
                } else if (provider === LLMProvider.API) {
                    const { default: { UaitoAPI } } = (await import("@uaito/api"));
                    llm = new UaitoAPI({
                        options: {
                            provider: LLMProvider.Anthropic,
                            model: model as string,
                            tools,
                            apiKey: (apiKey || process.env.GROK_API_KEY)!,
                            log: () => {}
                        }
                    });
                } else {
                    throw new Error(`Unsupported provider: ${provider}`);
                }

                const agent = new CLIAgent(
                    llm,
                    systemPrompt,
                    chainOfThought
                );
                await agent.addInputs(new MessageArray([]));

                const { response } = await agent.performTask(message);

                console.log = originalLog;
                console.error = originalError;

                let thinking: boolean = false;
                for await (const chunk of response) {

                    if (chunk.type === 'message') {
                        if (thinking) {
                            process.stdout.write('\n</thinking>\n');
                            thinking = false;
                        }
                        for (const content of chunk.content) {
                            if (content.type === 'text') {
                                process.stdout.write(content.text);
                            }
                        }
                    }
                    if (chunk.type === 'thinking') {
                        if (!thinking) {
                            process.stdout.write('\n<thinking>\n');
                            thinking = true;
                        }
                        for (const content of chunk.content) {
                            if (content.type === 'thinking') {
                                process.stdout.write(content.thinking);
                            }
                        }
                    }
                }
                process.stdout.write('\n');

            } catch (error) {
                console.log = originalLog;
                console.error = originalError;
                console.error('Error:', error);
            }
        }
    )
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .help()
    .argv;



