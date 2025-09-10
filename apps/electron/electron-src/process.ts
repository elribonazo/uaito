import fs from 'fs-extra';
import path from "path";
import { promisify } from 'util';
import { exec } from 'child_process';


import { UaitoAPI } from "./client";
import { SearchReplaceBlock } from "@uaito/sdk";

const execAsync = promisify(exec);

const safeCommands = process.env.SAFE_COMMANDS?.split(",") ?? [
    'git', 'npm', 'rm', 'for', "cd","wget","awk","grep","ps",
    'npx', 'grep', 'find', 'cp',
    'ls', 'yarn', 'docker', "tsc"
]

function safeCommand(command: string) {
    const commands = command.split("&&");
    commands.forEach((splitCommand) => {
        const shellCommand = splitCommand.trim().split(" ")[0]
        if (!safeCommands.includes(shellCommand)) {
            throw new Error("Unsupported command " + shellCommand)
        }
    })
    return command
}

function parseSearchReplaceBlocks(responseText: string): SearchReplaceBlock[] {
    const blocks: SearchReplaceBlock[] = [];
    const lines = responseText.split('\n');
    let currentBlock: { search?: string[], replace?: string[] } = {};
    let currentSection: 'search' | 'replace' | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '<SEARCH>') {
            currentSection = 'search';
            currentBlock.search = [];
        } else if (trimmedLine === '</SEARCH>') {
            currentSection = null;
        } else if (trimmedLine === '<REPLACE>') {
            currentSection = 'replace';
            currentBlock.replace = [];
        } else if (trimmedLine === '</REPLACE>') {
            currentSection = null;
            if (currentBlock.search && currentBlock.replace) {
                blocks.push({
                    search: currentBlock.search.join('\n'),
                    replace: currentBlock.replace.join('\n')
                });
            }
            currentBlock = {};
        } else if (currentSection) {
            currentBlock[currentSection]!.push(line);
        }
    }

    return blocks;
}

export async function processTools(
    client: UaitoAPI,
    chatId: string,
    threadId: string,
    directory: string,
    signal: AbortSignal
) {
    if (signal.aborted) {
        return null;
    }

    try {
        const tools = await client.fetchTools({
            chatId,
            threadId,
            signal: signal,
            directory
        })
        for (let tool of tools) {
            const toolName = tool.name;
            try {
                const input = JSON.parse(tool.input as string);
                if (toolName === "executeCommand") {
                    const command = safeCommand(input.code)
                    const { stdout } = await execAsync(
                        command,
                        {
                            cwd: directory, maxBuffer: 1024 * 1024 * 10,
                            env: { ...process.env, PATH: process.env.PATH + ':/usr/local/bin:/usr/bin' }
                        }
                    );
                    await client.updateTool({
                        threadId: tool.threadId,
                        toolName: toolName,
                        isError: false,
                        result: [
                            {
                                type: 'text', text: stdout.trim()
                            }
                        ]
                    })
                } else if (toolName === "editAndApply") {
                    if (!input.path) {
                        throw new Error("The tool createFolder requires a 'path' input")
                    }
                    const inputPath = path.resolve(directory, input.path);
                    const originalContent = input.original_content ? input.original_content : Buffer.from(fs.readFileSync(inputPath)).toString();
                    const instructions = input.instructions;
                    const projectContext = input.project_context;
                    const editorResponse = await client.editorRequest(
                        {
                            inputPath,
                            originalContent,
                            instructions,
                            projectContext
                        }
                    );
                    const responseText = editorResponse?.[0]?.text;
                    const editInstructions = parseSearchReplaceBlocks(responseText)
                    let updateText = originalContent;
                    editInstructions.forEach((instruction) => {
                        updateText = updateText.replace(instruction.search, instruction.replace)
                    });
                    fs.writeFileSync(inputPath, Buffer.from(updateText));
                    await client.updateTool({
                        threadId: threadId,
                        toolName: toolName,
                        isError: false,
                        result: [
                            {
                                type: 'text', text: Buffer.from(updateText).toString()
                            }
                        ]
                    })
                } else if (toolName === "createFolder") {
                    if (!input.path) {
                        throw new Error("The tool createFolder requires a 'path' input")
                    }
                    fs.mkdir(path.resolve(directory, input.path))
                    await client.updateTool({
                        threadId: threadId,
                        toolName: toolName,
                        isError: false,
                        result: [
                            {
                                type: 'text', text: "Folder created successfully!"
                            }
                        ]
                    })
                } else if (toolName === "createFile") {
                    if (!input.path) {
                        throw new Error("The tool createFolder requires a 'path' input")
                    }
                    const inputPath = path.resolve(directory, input.path);
                    const content = input.content;
                    const dirPath = path.dirname(inputPath);
                    if (!fs.existsSync(dirPath)) {
                        await fs.mkdir(dirPath, { recursive: true });
                    }
                    fs.writeFileSync(path.resolve(inputPath), Buffer.from(content))
                    await client.updateTool({
                        threadId: threadId,
                        toolName: toolName,
                        isError: false,
                        result: [
                            {
                                type: 'text', text: "File created successfully!"
                            }
                        ]
                    })
                } else if (toolName === "readFile") {
                    if (!input.path) {
                        throw new Error("The tool createFolder requires a 'path' input")
                    }
                    const inputPath = path.resolve(directory, input.path);
                    const file = await fs.readFile(inputPath)
                    await client.updateTool({
                        threadId: threadId,
                        toolName: toolName,
                        isError: false,
                        result: [
                            {
                                type: 'text', text: file.toString()
                            }
                        ]
                    })
                }
            } catch (err) {
                await client.updateTool({
                    toolName: toolName,
                    threadId: threadId,
                    isError: true,
                    result: [
                        {
                            type: 'text',
                            text: 'An error ocurred:' + err.message
                        }
                    ]
                })
            }
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 2000))
        return processTools(
            client,
            chatId,
            threadId,
            directory,
            signal
    
        )
    } catch (err) {
        if ((err as Error).message.includes("AbortError")) {
            console.log("Process was aborted gracefully")
            return null
        } else {
            throw err
        }
    }
}


