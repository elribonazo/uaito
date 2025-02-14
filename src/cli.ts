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
            const onToolPath = path.resolve(process.cwd(), 'uaito.ontool.js');
            const thoughtPath = path.resolve(process.cwd(), 'uaito.thought.js');
            const toolsPath = path.resolve(process.cwd(), 'uaito.tools.js');


            let fileContents: BinConfig<LLMProvider>;
            let onTool: OnTool = (await import(onToolPath)).default;
            let chainOfThought: (tools: Tool[]) => string = (await import(thoughtPath)).default;
            let tools: Tool[] = (await import(toolsPath)).default;
            try {
                // Check if config file exists
                if (!fs.existsSync(configPath)) {
                    console.error(`Configuration file not found at: ${configPath}`);
                    console.error(argv.agent
                        ? `Please create a config file named uaito.${argv.agent}.js`
                        : 'Please create a config file or specify one using the --config option');
                    process.exit(1);
                }
                fileContents = (await import(configPath)).default;
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
                    chainOfThought(tools),
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


