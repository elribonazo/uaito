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
     this.log('Appending text to tool use buffer', { textLength: text.length, currentBufferLength: this.buffer.length });
      this.buffer += this.cleanChunk(text);
     this.log('Text appended to tool use buffer', { newBufferLength: this.buffer.length });
    }
  
    async render(): Promise<Message> {
     this.log('Rendering ToolUseMessage', { id: this.id, bufferLength: this.buffer.length, bufferContent: this.buffer });
      const toolCalls = extractPythonicCalls(this.buffer);
     this.log('Extracted pythonic calls', { callCount: toolCalls.length, calls: toolCalls });
      const toolUseBlocks: ToolUseBlock[] = toolCalls.flatMap(call => {
       this.log('Processing tool call', { call });
        
        const parsed = parsePythonicCall(call);
        if (!parsed) {
         this.log('Failed to parse tool call', { call });
          return [];
        }
        
       this.log('Parsed tool call', { parsed });
        
        const { name, positionalArgs, keywordArgs } = parsed;
        const toolSchema = this.tools?.find((t) => t.name === name);
        
        if (!toolSchema) {
         this.log('Tool schema not found', { toolName: name, availableTools: this.tools?.map(t => t.name) });
        } else {
         this.log('Found tool schema', { toolName: name, schema: toolSchema });
        }
        
        const paramNames = toolSchema ? Object.keys(toolSchema.input_schema.properties) : [];
        const input = mapArgsToNamedParams(paramNames, positionalArgs, keywordArgs);
        
       this.log('Mapped arguments to parameters', { paramNames, input });
        
        const { id } = this;
        const toolUseBlock = {
          id,
          name,
          input,
          type: 'tool_use' as const
        };
        
       this.log('Created tool use block', { toolUseBlock });
        
        return toolUseBlock;
      });
      
      const message = {
        id: this.id,
        role: 'assistant' as const,
        type: 'tool_use' as const,
        content: toolUseBlocks
      };
      
     this.log('ToolUseMessage rendered successfully', { 
        id: this.id, 
        toolUseBlockCount: toolUseBlocks.length,
        toolNames: toolUseBlocks.map(block => block.name)
      });
      
      return message;
    }
  }
  