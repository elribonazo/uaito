"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { createSystemPrompt } from "../constants/prompts";
import { tools as defaultTools } from "../constants/tools";
import type { HuggingFaceONNXOptions, Message, TextBlock, ToolUseBlock, Tool as BaseTool } from "@uaito/sdk";
import { Agent, LLMProvider, HuggingFaceONNXModels, MessageArray } from "@uaito/sdk";
import { Messages } from "./Messages";
import { openDB, type IDBPDatabase } from "idb";
import ToolItem from "./ToolItem";
import {
  Plus,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { generateSchemaFromCode, extractFunctionAndRenderer } from "../utils";

// Extended Tool type for the web application
export interface Tool extends BaseTool {
  id?: number;
  code?: string;
  enabled?: boolean;
  isCollapsed?: boolean;
}

const DB_NAME = "tool-caller-db";
const STORE_NAME = "tools";
const SETTINGS_STORE_NAME = "settings";

const defaultHistory: Message[] = []

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
        db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: "key" });
      }
    },
  });
}


function useUaito<T extends LLMProvider>(
  type: T,
  tools: Tool[]
) {

  const [progress, setProgress] = useState<number>(0);
  const agent = useMemo(() => {
    const enabledTools = tools.filter(tool => tool.enabled !== false);
    // Convert to base tools for the agent
    const baseTools = enabledTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.input_schema
    }));
    const hfOptions: HuggingFaceONNXOptions = {
      model: HuggingFaceONNXModels.LMF2_1_2B,
      inputs: new MessageArray([]),
      dtype: "q4f16",
      device: "webgpu",
      tools: baseTools,
      onProgress: (p) => {
        setProgress(p);
      },
    };

    return new Agent(
      type,
      hfOptions,
      async function (this: Agent<T>, message: Message, _signal) {        const toolUses = message.content.filter((c): c is ToolUseBlock => c.type === 'tool_use');

        for (const toolUse of toolUses) {
          await this.runSafeCommand(
            toolUse,
            async () => {
              const tool = enabledTools.find(t => t.name === toolUse.name);
              if (!tool || !tool.code) {
                  throw new Error(`Tool ${toolUse.name} not found or has no code`);
              }
              
              const { functionCode } = extractFunctionAndRenderer(tool.code);

              const schema = generateSchemaFromCode(functionCode);
              const paramNames = Object.keys(schema.parameters.properties);
              const inputArgs = toolUse.input as Record<string, unknown>;
              
              const finalArgs: unknown[] = [];
              for (const paramName of paramNames) {
                  finalArgs.push(inputArgs[paramName]);
              }
              
              const bodyMatch = functionCode.match(/function[^{]+\{([\s\S]*)\}/);
              if (!bodyMatch) {
                throw new Error(
                  "Could not parse function body. Ensure it's a standard `function` declaration."
                );
              }
              const body = bodyMatch[1];
              const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (...args: string[]) => (...args: unknown[]) => Promise<unknown>;
              const func = new AsyncFunction(...paramNames, body);
              const result = await func(...finalArgs);
              
              this.inputs.push({
                  role: 'user',
                  content: [{
                      type: 'tool_result',
                      name: toolUse.name,
                      tool_use_id: toolUse.id,
                      content: [
                          {
                              "type": "text",
                              "text": JSON.stringify(result)
                          }
                      ],
                  }]
              });
            }
          );
        }
      },
    );
  }, [type, tools]);


  useEffect(() => {
    agent.load()
  }, [agent])

  return {
    agent,
    progress
  }
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [collapsedTools, setCollapsedTools] = useState<Record<number, boolean>>({});
  const { agent, progress } = useUaito(LLMProvider.HuggingFaceONNX, tools)
  const [userInput, setUserInput] = useState<string>("What's the current date?");
  const [chatHistory, setChatHistory] = useState<Message[]>(defaultHistory);
  const [verboseLog, setVerboseLog] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isToolsPanelVisible, setIsToolsPanelVisible] = useState<boolean>(false);
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const toolsContainerRef = useRef<HTMLDivElement>(null);

  const loadTools = useCallback(async (): Promise<void> => {
    const db = await getDB();
    const allTools: Tool[] = await db.getAll(STORE_NAME);
    if (allTools.length === 0) {
      const defaultToolsWithIds: Tool[] = defaultTools.map(
        (tool, id) => ({
          ...tool,
          id,
          enabled: true,
        })
      );
      const tx = db.transaction(STORE_NAME, "readwrite");
      await Promise.all(defaultToolsWithIds.map((tool) => tx.store.put(tool)));
      await tx.done;
      setTools(defaultToolsWithIds);
      const initialCollapsedState: Record<number, boolean> = {};
       defaultToolsWithIds.forEach(t => {
        if (t.id) initialCollapsedState[t.id] = false
      });
      setCollapsedTools(initialCollapsedState);
    } else {
      setTools(allTools.map((t) => ({ ...t, enabled: t.enabled !== false })));
      const initialCollapsedState: Record<number, boolean> = {};
      allTools.forEach(t => {
        if (t.id) initialCollapsedState[t.id] = false
      });
      setCollapsedTools(initialCollapsedState);
    }
  }, []);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  const updateToolInDB = useCallback(async (tool: Tool): Promise<void> => {
    const db = await getDB();
    await db.put(STORE_NAME, tool);
  }, []);

  const saveToolDebounced = useCallback((tool: Tool): void => {
    if (tool.id !== undefined && debounceTimers.current[tool.id]) {
      clearTimeout(debounceTimers.current[tool.id]);
    }
    if (tool.id !== undefined) {
      debounceTimers.current[tool.id] = setTimeout(() => {
        updateToolInDB(tool);
      }, 300);
    }
  }, [updateToolInDB]);

  const addTool = useCallback(async (): Promise<void> => {
    const code = `/**
* Description of the tool.
* @param {any} parameter1 - Description of the first parameter.
* @param {any} parameter2 - Description of the second parameter.
* @returns {any} Description of the return value.
*/
export function new_tool(parameter1, parameter2) {
 // TODO: Implement the tool logic here
 return true; // Placeholder return value
}`;
    const schema = generateSchemaFromCode(code);
    const newTool: Omit<Tool, "id"> = {
      name: schema.name,
      description: schema.description,
      input_schema: {
        type: "object",
        properties: schema.parameters.properties,
        required: schema.parameters.required,
      },
      code,
      enabled: true,
    };
    const db = await getDB();
    const id = await db.add(STORE_NAME, newTool);
    setTools((prev) => {
      const updated = [...prev, { ...newTool, id: id as number }];
      setTimeout(() => {
        if (toolsContainerRef.current) {
          toolsContainerRef.current.scrollTop =
            toolsContainerRef.current.scrollHeight;
        }
      }, 0);
      return updated;
    });
    setCollapsedTools(prev => ({ ...prev, [id as number]: false }));
  }, []);

  const deleteTool = useCallback(async (id: number): Promise<void> => {
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    const db = await getDB();
    await db.delete(STORE_NAME, id);
    setTools(tools.filter((tool) => tool.id !== id));
    setCollapsedTools(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    })
  }, [tools]);

  const toggleToolEnabled = useCallback((id: number): void => {
    let changedTool: Tool | undefined;
    const newTools = tools.map((tool) => {
      if (tool.id === id) {
        changedTool = { ...tool, enabled: !tool.enabled };
        return changedTool;
      }
      return tool;
    });
    setTools(newTools);
    if (changedTool) saveToolDebounced(changedTool);
  }, [tools, saveToolDebounced]);

  const toggleToolCollapsed = useCallback((id: number): void => {
    setCollapsedTools(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const expandTool = useCallback((id: number): void => {
    setCollapsedTools(prev => ({ ...prev, [id]: false }));
  }, []);

  const handleToolCodeChange = useCallback((id: number, newCode: string): void => {
    let changedTool: Tool | undefined;
    const newTools = tools.map((tool) => {
      if (tool.id === id) {
        const schema = generateSchemaFromCode(newCode);
        changedTool = { 
          ...tool, 
          code: newCode,
          name: schema.name,
          description: schema.description,
          input_schema: {
            type: "object",
            properties: schema.parameters.properties,
            required: schema.parameters.required,
          },
        };
        return changedTool;
      }
      return tool;
    });
    setTools(newTools);
    if (changedTool) saveToolDebounced(changedTool);
  }, [tools, saveToolDebounced]);


  const onChatSubmit = useCallback(async () => {
   try {
    setVerboseLog([])
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    agent.clear();
    agent.client.log = (message: string) => {
      setVerboseLog(prev => [...prev, message]);
    }

    const enabledTools = tools.filter(tool => tool.enabled !== false);
    const { response } = await agent.performTask(
      userInput,
      '',
      createSystemPrompt(enabledTools as BaseTool[]),
      true
    );

    const reader = response.getReader();

    while (true) {
      const readerResult = await reader.read();
      if (readerResult.done) {
        break;
      }

      if (!readerResult.value) {
        continue;
      }

      const message = readerResult.value;

      // Use the functional form of setChatHistory so you don't
      // mutate the old chatHistory array directly. This also
      // ensures that multiple quick updates don't stomp each other.
      setChatHistory((prevChatHistory) => {
        const newChatHistory = [...prevChatHistory];

        // Find if a message with the same ID already exists.
        const index = newChatHistory.findIndex((m) => m.id === message.id);

        if (index !== -1 && message.chunk) {
          // If the message exists and this incoming message is a chunk,
          // append the text to the existing text block.
          const existingBlock = newChatHistory[index].content[0] as TextBlock;
          const newChunkBlock = message.content[0] as TextBlock;
          newChatHistory[index] = {
            ...newChatHistory[index],
            content: [
              {
                type: 'text',
                text: existingBlock.text + newChunkBlock.text,
              },
            ],
          };
        } else if (index === -1) {
          // If message not found, push a new one.
          newChatHistory.push(message);
        }

        return newChatHistory;
      });
    }
   } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.error(err)
    }
   }
  }, [agent, userInput, tools]);

  const isLoaded = progress >= 100;
  return (
    <div className="flex h-screen text-white">
      <div className={`flex flex-col p-4 transition-all duration-300 ${isToolsPanelVisible ? "w-1/2" : "w-full"}`}>
        <main className="flex flex-col gap-8 row-start-2 items-center w-full">
          <div className="flex justify-between items-center mb-4 w-full">
            <div className="flex justify-center w-full">
              <Image src="/UAITO.png" alt="UAITO logo" width={180} height={38} priority />
            </div>
            <button
                  type="button"
                  onClick={() => setIsToolsPanelVisible(!isToolsPanelVisible)}
                  className="h-10 flex items-center px-3 py-2 rounded-lg font-bold transition-colors bg-gray-600 hover:bg-gray-700 text-sm"
                  title={
                    isToolsPanelVisible
                      ? "Hide Tools Panel"
                      : "Show Tools Panel"
                  }
                >
                  {isToolsPanelVisible ? (
                    <PanelRightClose size={16} />
                  ) : (
                    <PanelRightOpen size={16} />
                  )}
                </button>
          </div>
          

          <div className="flex flex-col w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-md">

            {/* 3) Display the current download progress here (optional). */}
            <div className="text-sm font-[family-name:var(--font-geist-mono)] text-center">
                {isLoaded ? `Model loaded` : `Downloading model: ${progress}%`}
              </div>
                <label htmlFor="chat-input" className="text-sm font-medium dark:text-white">
                  Send a prompt to the model
                </label>
                <textarea
                  id="chat-input"
                  className="border border-gray-400 dark:border-gray-700 rounded-md p-2 dark:bg-gray-800 dark:text-white"
                  rows={3}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your prompt here..."
                />
                <button
                  type="button"
                  onClick={onChatSubmit}
                  className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Send
                </button>
                <div className="mt-4 text-sm dark:text-white">
                  <h2 className="font-bold">Chat Contents</h2>
                  <Messages messages={chatHistory} searchText={''} />
                </div>
                <div className="mt-4 text-sm dark:text-white">
                  <h2 className="font-bold">Verbose Log</h2>
                  <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-2 bg-white dark:bg-gray-800 max-h-64 overflow-auto">
                    {verboseLog.map((log, i) => (
                      <div key={`log-${i}-${log}`} className="whitespace-pre-wrap mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              
          </div>
        </main>
      </div>
      {isToolsPanelVisible && (
            <div className="w-1/2 flex flex-col p-4 border-l border-gray-700 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-teal-400">Tools</h2>
                <button
                  type="button"
                  onClick={addTool}
                  className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" /> Add Tool
                </button>
              </div>
              <div
                ref={toolsContainerRef}
                className="flex-grow bg-gray-800 rounded-lg p-4 overflow-y-auto space-y-3"
              >
                {tools.map((tool) => (
                  <ToolItem
                    key={tool.id}
                    tool={{...tool, isCollapsed: collapsedTools[tool.id as number]}}
                    onToggleEnabled={() => toggleToolEnabled(tool.id as number)}
                    onToggleCollapsed={() => toggleToolCollapsed(tool.id as number)}
                    onExpand={() => expandTool(tool.id as number)}
                    onDelete={() => deleteTool(tool.id as number)}
                    onCodeChange={(newCode) =>
                      handleToolCodeChange(tool.id as number, newCode)
                    }
                  />
                ))}
              </div>
            </div>
          )}
    </div>
  )
}

