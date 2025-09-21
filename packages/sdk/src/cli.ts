#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
    LLMProvider,
    HuggingFaceONNXModels,
    AnthropicModels,
    OpenAIModels,
} from './types';
import type {
    Tool,
    AgentTypeToOptions,
    Message,
    TextBlock,
} from './types';
import { Agent } from './agents/index';
import { MessageArray } from './utils';

// Default tools available in the CLI
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

// Custom Agent to override prompts
class CLIAgent<T extends LLMProvider> extends Agent<T> {
    constructor(
        type: T,
        options: AgentTypeToOptions[T],
        private systemPromptTemplate: string,
        private cot: string,
    ) {
        super(type, options);

        
    }

    override get systemPrompt() {
        return this.systemPromptTemplate;
    }

    override get chainOfThought() {
        return this.cot;
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
                    choices: [LLMProvider.Anthropic, LLMProvider.OpenAI, LLMProvider.Local],
                    required: true,
                    describe: 'LLM provider to use',
                })
                .option('model', {
                    alias: 'm',
                    type: 'string',
                    required: true,
                    describe: `Model to use. \nAnthropic: ${Object.keys(AnthropicModels).join(", ")} \nOpenAI: ${Object.keys(OpenAIModels).join(", ")} \nLocal: ${Object.keys(HuggingFaceONNXModels).join(", ")}`,
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

            try {
                const tools = availableTools;
                const systemPrompt = `You are a helpful AI assistant.`;
                const chainOfThought = `Answer the user's request using relevant tools only if the tool exists and is relevant.`;

                let agent: CLIAgent<LLMProvider>;
                console.log = () => {}

                if (provider === LLMProvider.Anthropic || provider === LLMProvider.OpenAI) {
                    const options: AgentTypeToOptions[LLMProvider.Anthropic] | AgentTypeToOptions[LLMProvider.OpenAI] = {
                        model,
                        tools,
                        apiKey: apiKey || (provider === LLMProvider.Anthropic ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY),
                    };
                    if (!options.apiKey) {
                        throw new Error(`API key for ${provider} is required. Use --apiKey or set the corresponding environment variable.`);
                    }
                    agent = new CLIAgent(
                        provider,
                        options,
                        systemPrompt,
                        chainOfThought
                    );
                } else if (provider === LLMProvider.Local) {
                    const options: AgentTypeToOptions[LLMProvider.Local] = {
                        model: model as HuggingFaceONNXModels,
                        tools,
                        device: 'auto',
                        dtype: 'q4f16',
                        log: (message: string) => { }
                    };
                    
                    agent = new CLIAgent(
                        provider,
                        options,
                        systemPrompt,
                        chainOfThought
                    );
                } else {
                    throw new Error(`Unsupported provider: ${provider}`);
                }


                await agent.addInputs(new MessageArray([]));

                const { response } = await agent.performTask(
                    message
                );

              
                for await (const chunk of response) {
                    if (chunk.type === 'message') {
                        for (const content of chunk.content) {
                            if (content.type === 'text') {
                                console.log(content.text);
                            }
                        }
                    }
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }
    )
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .help()
    .argv;


