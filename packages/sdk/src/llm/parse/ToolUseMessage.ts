import { v4 } from "uuid";

import { BaseMessage, type Message,  type ToolUseBlock } from "@/types";
import { extractPythonicCalls, mapArgsToNamedParams, parsePythonicCall } from "../huggingface/utils";



export class ToolUseMessage extends BaseMessage {
    public id: string = v4();
    public replacements = [
      '<|tool_call_start|>', '<|tool_call_end|>',
      '<tool_call>', '</tool_call>'
    ];
  
  
    appendText(text: string) {
      this.buffer += this.cleanChunk(text);
    }
  
    async render(): Promise<Message> {
      const toolCalls = extractPythonicCalls(this.buffer);
      const toolUseBlocks: ToolUseBlock[] = toolCalls.flatMap(call => {
        const parsed = parsePythonicCall(call);
        if (!parsed) return [];
        const { name, positionalArgs, keywordArgs } = parsed;
        const toolSchema = this.tools?.find((t) => t.name === name);
        const paramNames = toolSchema ? Object.keys(toolSchema.input_schema.properties) : [];
        const input = mapArgsToNamedParams(paramNames, positionalArgs, keywordArgs);
        const { id } = this;
        return {
          id,
          name,
          input,
          type: 'tool_use'
        };
      });
      return {
        id: this.id,
        role: 'assistant',
        type: 'tool_use',
        content: toolUseBlocks
      };
    }
  }
  