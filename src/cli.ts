#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { LLMProvider, BinConfig, OnTool, Tool } from './types';
import { Agent } from './agents/index';




// Add a command named "run" (you can rename it). 
// The command loads a configuration file specified via --config or defaults to uaito.config.json.
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
                .option('config', {
                    alias: 'c',
                    type: 'string',
                    default: 'uaito.config.js',
                    describe: 'Path to a configuration file. Defaults to [cwd]/uaito.config.js',
                })
                .option('agent', {
                    alias: 'a',
                    type: 'string',
                    describe: 'Agent name to load specific config (uaito.[agent].js)',
                })
                .option('verbose', {
                    alias: 'v',
                    type: 'boolean',
                    default: false,
                    describe: 'Show detailed log output',
                })
                .option('stream', {
                    alias: 's',
                    type: 'boolean',
                    default: false,
                    describe: 'Use streaming mode',
                });
        },
        async (argv) => {
            // Capture the message from the positional argument
            if (!argv.message) {
                console.error('You need to specify a message');
                process.exit(1);
            }
            const message = argv.message;
            
            // Determine config file path based on agent option
            const configFileName = argv.agent 
                ? `uaito.${argv.agent}.js`
                : 'uaito.config.js';
            
            const configPath = path.resolve(process.cwd(), configFileName);
            let fileContents: BinConfig<LLMProvider> = (await import(configPath)).default;


    

    

            try {
                const onTool = fileContents?.onTool;
                const tools = fileContents?.tools;
                const createSystemPrompt = fileContents?.createSystemPrompt;
                const chainOfThought = fileContents?.chainOfThought ??  `Answer the user's request using relevant tools only if the tool exists. 
                Before calling a tool, do some internal analysis. 
                1. First, determine if you have access to the requested tool.
                2. Second, think about which of the provided tools is the relevant tool to answer the user's request. 
                3. Third, go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. 
                When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value.
                If all of the required parawmeters are present or can be reasonably inferred, close the thinking tag and proceed with the tool call. 
                BUT, if one of the values for a required parameter is missing, 
                DO NOT invoke the function (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters. 
                DO NOT ask for more information on optional parameters if it is not provided.
                DO NOT reflect on the quality of the returned search results in your response.`;


                // Check if config file exists
                if (!fs.existsSync(configPath)) {
                    console.error(`Configuration file not found at: ${configPath}`);
                    console.error(argv.agent
                        ? `Please create a config file named uaito.${argv.agent}.js`
                        : 'Please create a config file or specify one using the --config option');
                    process.exit(1);
                }
                if (argv.verbose) {
                    console.log('Raw configuration file contents:\n', fileContents);
                }


                const agent = new Agent(
                    fileContents.provider,
                    fileContents.options,
                    onTool,
                    [],
                    undefined,
                    tools
                );

                const useStream = argv.stream ? true: undefined;
                const {response} = await agent.performTask(
                    message,
                    chainOfThought,
                    createSystemPrompt ? createSystemPrompt(tools ?? []) : '',
                    useStream 
                );

                if (useStream) {
                    for await (const chunk of response) {
                        agent.log(`Stream response: ${chunk.type}: ${JSON.stringify(chunk, null, 2)}`);
                    }
                } else {
                    agent.log(`Final response: ${JSON.stringify(response, null, 2)}`);
                }
                
            } catch (error) {
                console.error('Error:', error);
                process.exit(1);
            }
        }
    )
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .help()
    .argv;


