

  import type { BaseMessage, Tool } from "@/domain/types";
import { ThinkingMessage } from "./parse/ThinkMessage";
import { ToolUseMessage } from "./parse/ToolUseMessage";
import { ImageMessage } from "./parse/ImageMessage";
import { TextMessage } from "./parse/TextMessage";
import { AudioMessage } from "./parse/AudioMessage";

/**
 * Represents a parsed Pythonic call.
 * @interface
 */
interface ParsedCall {
    /**
     * The name of the function called.
     * @type {string}
     */
    name: string;
    /**
     * An array of positional arguments.
     * @type {unknown[]}
     */
    positionalArgs: unknown[];
    /**
     * A record of keyword arguments.
     * @type {Record<string, unknown>}
     */
    keywordArgs: Record<string, unknown>;
  }


/**
 * Parses a string of arguments into an array of strings.
 * @param {string} argsString - The string of arguments to parse.
 * @returns {string[]} An array of parsed arguments.
 */
export function parseArguments(argsString: string): string[] {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    let pDepth = 0; 
    let bDepth = 0; 

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = "";
        current += char;
      } else if (!inQuotes && char === "(") {
        pDepth++;
        current += char;
      } else if (!inQuotes && char === ")") {
        pDepth--;
        current += char;
      } else if (!inQuotes && char === "{") {
        bDepth++;
        current += char;
      } else if (!inQuotes && char === "}") {
        bDepth--;
        current += char;
      } else if (!inQuotes && char === "," && pDepth === 0 && bDepth === 0) {
        args.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    return args;
  };

  /**
   * Extracts Pythonic function calls from a string.
   * @param {string} toolCallContent - The string containing tool calls.
   * @returns {string[]} An array of extracted function calls.
   */
  export function extractPythonicCalls(toolCallContent: string): string[] {
    try {
      const cleanContent = toolCallContent.trim();

      try {
        const parsed = JSON.parse(cleanContent);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback to manual parsing
      }

      if (cleanContent.startsWith("[") && cleanContent.endsWith("]")) {
        const inner = cleanContent.slice(1, -1).trim();
        if (!inner) return [];
        return parseArguments(inner).map((call) =>
          call.trim().replace(/^['"]|['"]$/g, ""),
        );
      }

      return [cleanContent];
    } catch (error) {
      console.error("Error parsing tool calls:", error);
      return [];
    }
  };

  /**
   * Parses a Pythonic function call string into a ParsedCall object.
   * @param {string} command - The function call string to parse.
   * @returns {ParsedCall | null} A ParsedCall object or null if parsing fails.
   */
  export function  parsePythonicCall(command: string): ParsedCall | null {
    try {
      const parsed = JSON.parse(command);
      if (Array.isArray(parsed)) {
        return parsed.map((call) => this.parsePythonicCall(call)) as any;
      }
      return {
        ...parsed,
        positionalArgs:[],
        keywordArgs: parsed.arguments
      };
    } catch {
      const callMatch = command.match(/^([a-zA-Z0-9_]+)\((.*)\)$/s);
      if (!callMatch) return null;
  
      const [, name, argsStr] = callMatch;
      const args = parseArguments(argsStr);
      const positionalArgs: unknown[] = [];
      const keywordArgs: Record<string, unknown> = {};
  
      for (const arg of args) {
        const kwargMatch = arg.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/s);
        if (kwargMatch) {
          const [, key, value] = kwargMatch;
          try {
            keywordArgs[key] = JSON.parse(value);
          } catch {
            keywordArgs[key] = value;
          }
        } else {
          try {
            positionalArgs.push(JSON.parse(arg));
          } catch {
            positionalArgs.push(arg);
          }
        }
      }
      return { name, positionalArgs, keywordArgs };
    }

  };


  /**
   * Maps positional and keyword arguments to named parameters.
   * @param {string[]} paramNames - An array of parameter names.
   * @param {unknown[]} positionalArgs - An array of positional arguments.
   * @param {Record<string, unknown>} keywordArgs - A record of keyword arguments.
   * @returns {Record<string, unknown>} A record of named parameters.
   */
  export function mapArgsToNamedParams(  paramNames: string[],  positionalArgs: unknown[], keywordArgs: Record<string, unknown>): Record<string, unknown> {
    const namedParams: Record<string, unknown> = {};
    positionalArgs.forEach((arg, idx) => {
      if (idx < paramNames.length) {
        namedParams[paramNames[idx]] = arg;
      }
    });
    Object.assign(namedParams, keywordArgs);
    return namedParams;
  };





/**
 * Caches and processes incoming message chunks to construct complete messages.
 * @class
 */
export class MessageCache {
  /**
   * The current message element being processed.
   * @type {(BaseMessage | null)}
   */
  public currentElement: BaseMessage | null = null;

  /**
   * Creates an instance of MessageCache.
   * @param {Tool[]} tools - An array of available tools.
   * @param {(...messages: any[]) => void} [log=console.log] - A logging function.
   */
  constructor(public tools: Tool[], private log: (...messages: any[]) => void = console.log) { }

  /**
   * Processes an incoming chunk of a message.
   * @param {string} chunk - The chunk of the message to process.
   * @returns {Promise<any>} The processed message or null if more chunks are needed.
   */
  async processChunk(chunk: string) {
    
    if (!this.currentElement) {
      //We need to know which type of element it is we are processing
      //thinking, tool_use, etc

      const idxThinking = chunk.indexOf('<thinking>');
      const idxThink = chunk.indexOf('<think>');
      const hasThinkingOpenTags = idxThinking !== -1 || idxThink !== -1;
      if (hasThinkingOpenTags) {
        this.currentElement = new ThinkingMessage(chunk, this.log);
        const result = await this.currentElement.render();
        return result;
      }

      const toolUseOpenTagIndex = chunk.indexOf('<|tool_call_start|>') !== -1 ?
        chunk.indexOf('<|tool_call_start|>') :
        chunk.indexOf('<tool_call>');

      if (toolUseOpenTagIndex !== -1) {
        this.currentElement = new ToolUseMessage(chunk, this.tools, this.log);
        return null
      }

      const audioOpenTagIndex = chunk.indexOf('<audio>');
      if (audioOpenTagIndex !== -1) {
        this.currentElement = new AudioMessage(chunk.replace('<audio>', ''), this.log);
        const result = await this.currentElement.render();
        this.currentElement = null;
        return result;
      }

      const imageOpenTagIndex = chunk.indexOf('<image>');
      if (imageOpenTagIndex !== -1) {
        this.currentElement = new ImageMessage(chunk.replace('<image>', ''), this.log);
        const result = await this.currentElement.render();
        this.currentElement = null;
        return result;
      }

      this.currentElement = new TextMessage(chunk, this.log);
      const result = await this.currentElement.render();
      return result;


    } else {
 
      if (this.currentElement instanceof ToolUseMessage) {
        const endIndex = chunk.indexOf('<|tool_call_end|>') !== -1 ?
          chunk.indexOf('<|tool_call_end|>') :
          chunk.indexOf('</tool_call>');
        
        if (endIndex !== -1) {
          this.currentElement.appendText(chunk.slice(0, endIndex));
          const rendered = await this.currentElement.render();
          this.currentElement = null;
          return rendered;
        }

        this.currentElement.appendText(chunk);
        return null
      }

      if (this.currentElement instanceof ThinkingMessage) {
        const idxThinking = chunk.indexOf('</thinking>');
        const idxThink = chunk.indexOf('</think>');
        
        if (idxThinking !== -1 || idxThink !== -1) {
          if (idxThinking !== -1) {
            this.currentElement.appendText(chunk.slice(0, idxThinking));
          } else if (idxThink !== -1) {
            this.currentElement.appendText(chunk.slice(0, idxThink));
          }
          const rendered = await this.currentElement.render();
          this.currentElement = null;
          return rendered;
        } else {
          this.currentElement.appendText(chunk);
          const rendered = await this.currentElement.render();
          return rendered
        }
      }

      if (this.currentElement instanceof TextMessage) {
        this.currentElement.appendText(chunk);
        const rendered = await this.currentElement.render();
        return rendered;
      }
    }

    return null;
  }
}
