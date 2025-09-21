import { v4 } from "uuid";

import { BaseMessage, Tool, type Message,  type ToolUseBlock } from "@/types";
import { extractPythonicCalls, mapArgsToNamedParams, parsePythonicCall } from "../huggingface/utils";

export class ToolUseMessage extends BaseMessage {
    public buffer: string = '';
    public tools: Tool[] = [];
    public id: string = v4();
    public replacements = [
      '<|tool_call_start|>', '<|tool_call_end|>',
      '<tool_call>', '</tool_call>'
    ];

    constructor(initialText: string,  tools: Tool[], private log: (...messages: any[]) => void = console.log) {
      super();
      this.buffer = this.cleanChunk(initialText);
      this.tools = tools;
    }
  
    appendText(text: string) {
      this.buffer += this.cleanChunk(text);
    }
  
    async render(): Promise<Message> {
      const toolCalls = extractPythonicCalls(this.buffer);
      const toolUseBlocks: ToolUseBlock[] = toolCalls.flatMap(call => {
        
        const parsed = parsePythonicCall(call);
        if (!parsed) {
          return [];
        }
        
        const { name, positionalArgs, keywordArgs } = parsed;
        const toolSchema = this.tools?.find((t) => t.name === name);
        
        if (!toolSchema) {
        } else {
        }
        
        const paramNames = toolSchema ? Object.keys(toolSchema.input_schema.properties) : [];
        const input = mapArgsToNamedParams(paramNames, positionalArgs, keywordArgs);
        
        const { id } = this;
        const toolUseBlock = {
          id,
          name,
          input,
          type: 'tool_use' as const
        };
        
        return toolUseBlock;
      });
      
      const message = {
        id: this.id,
        role: 'assistant' as const,
        type: 'tool_use' as const,
        content: toolUseBlocks
      };
      
      return message;
    }
  }
  