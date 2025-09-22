#!/usr/bin/env node
/**
 * @packageDocumentation 
 * 
 */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Agent } from '.';
import { MessageArray } from '@uaito/sdk';
import type { BaseLLM, Tool } from '@uaito/sdk';
import { LLMProvider } from '@uaito/sdk';
/**
 * Default tools available in the CLI.
 * @type {Tool}
 */
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

/**
 * The Tavily search tool.
 * @type {Tool}
 */
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

/**
 * An array of available tools.
 * @type {Tool[]}
 */
const availableTools = [browseWebPageTool, tavilySearch];

/**
 * Custom Agent to override prompts.
 * @class CLIAgent
 * @extends {Agent<T>}
 * @template T
 */
class CLIAgent extends Agent {
    /**
     * Creates an instance of CLIAgent.
     * @param {T} type - The type of LLM provider.
     * @param {AgentTypeToOptions[T]} options - The options for the agent.
     * @param {string} systemPromptTemplate - The template for the system prompt.
     * @param {string} chainOfThought - The chain of thought for the agent.
     */
    constructor(
        agent: BaseLLM<LLMProvider, any>,
        private systemPromptTemplate: string,
        private chainOfThoughtTemplate: string,
    ) {
        super(agent);
    }

    /**
     * Gets the system prompt for the agent.
     * @returns {string} The system prompt.
     */
    override get systemPrompt() {
        return this.systemPromptTemplate;
    }

    /**
     * Gets the chain of thought for the agent.
     * @returns {string} The chain of thought.
     */
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
                    choices: [LLMProvider.Anthropic, LLMProvider.OpenAI, LLMProvider.Local],
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
                    const Anthropic = (await import("@uaito/anthropic")).Anthropic;
                    llm = new Anthropic({
                        options: {
                            model,
                            tools,
                            apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
                        },
                    });
                } else if (provider === LLMProvider.OpenAI) {
                    const OpenAI = (await import("@uaito/openai")).OpenAI;
                    llm = new OpenAI({
                        options: {
                            model,
                            tools,
                            apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
                        },
                    });
                } else if (provider === LLMProvider.Local) {
                    const Local = (await import("@uaito/huggingFace")).HuggingFaceONNX;
                    llm = new Local({
                        options: {
                            model: model as any,
                            tools,
                            device: 'auto',
                            dtype: 'q4f16',
                            log: () => { }
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

                const { response } = await agent.performTask(
                    message
                );

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



