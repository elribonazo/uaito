import { BaseMessage, Message, Tool, ToolUseBlock } from "@uaito/sdk";
import { v4 } from "uuid";
import { extractPythonicCalls, parsePythonicCall, mapArgsToNamedParams } from "../utils";


/**
 * A class that represents a tool use message.
 * @export
 * @class ToolUseMessage
 * @extends {BaseMessage}
 */
export class ToolUseMessage extends BaseMessage {
    /**
     * The buffer for the message.
     * @public
     * @type {string}
     */
    public buffer: string = '';
    /**
     * An array of available tools.
     * @public
     * @type {Tool[]}
     */
    public tools: Tool[] = [];
    /**
     * The unique ID of the message.
     * @public
     * @type {string}
     */
    public id: string = v4();
    /**
     * An array of strings to be replaced in the message.
     * @public
     * @type {string[]}
     */
    public replacements = [
      '<|tool_call_start|>', '<|tool_call_end|>',
      '<tool_call>', '</tool_call>'
    ];

    /**
     * Creates an instance of ToolUseMessage.
     * @param {string} initialText - The initial text of the message.
     * @param {Tool[]} tools - An array of available tools.
     * @param {(...messages: any[]) => void} [log=console.log] - A logging function.
     */
    constructor(initialText: string,  tools: Tool[], private log: (...messages: any[]) => void = console.log) {
      super();
      this.buffer = this.cleanChunk(initialText);
      this.tools = tools;
    }
  
    /**
     * Appends text to the message buffer.
     * @param {string} text - The text to append.
     */
    appendText(text: string) {
      this.buffer += this.cleanChunk(text);
    }
  
    /**
     * Renders the message.
     * @returns {Promise<Message>} A promise that resolves to the rendered message.
     */
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
  