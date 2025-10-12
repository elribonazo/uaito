

  import type { BaseMessage, Tool } from "@uaito/sdk";
import { ThinkingMessage } from "./parse/ThinkMessage";
import { ToolUseMessage } from "./parse/ToolUseMessage";
import { ImageMessage } from "./parse/ImageMessage";
import { TextMessage } from "./parse/TextMessage";
import { AudioMessage } from "./parse/AudioMessage";

/**
 * Represents a parsed Pythonic function call, separating the function name,
 * positional arguments, and keyword arguments.
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
 * Parses a string of arguments, handling nested structures like quotes, parentheses, and braces.
 * This is a utility for parsing arguments from a Pythonic function call string.
 * @param {string} argsString - The string of arguments to parse.
 * @returns {string[]} An array of parsed argument strings.
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
   * Extracts Pythonic function call strings from a larger content block.
   * It can handle both JSON arrays of calls and single or multiple calls in a string.
   * @param {string} toolCallContent - The string containing the tool calls.
   * @returns {string[]} An array of extracted function call strings.
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
   * Parses a Pythonic function call string (e.g., `my_func(arg1, kwarg1='value')`)
   * into a `ParsedCall` object with the function name, positional args, and keyword args.
   * @param {string} command - The function call string to parse.
   * @returns {ParsedCall | null | ParsedCall[]} A `ParsedCall` object, an array of them, or `null` if parsing fails.
   */
  export function  parsePythonicCall(command: string): ParsedCall | null | ParsedCall[] {
    try {
      const parsed = JSON.parse(command);
      if (Array.isArray(parsed)) {
        return parsed.map((call) => parsePythonicCall(call) as ParsedCall).filter(Boolean);
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
   * Maps positional and keyword arguments from a parsed function call to a named parameter object.
   * This is useful for matching the extracted arguments to the a tool's defined `input_schema`.
   * @param {string[]} paramNames - An array of the target parameter names in order.
   * @param {unknown[]} positionalArgs - An array of the positional arguments from the call.
   * @param {Record<string, unknown>} keywordArgs - A record of the keyword arguments from the call.
   * @returns {Record<string, unknown>} An object where keys are parameter names and values are the mapped arguments.
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
 * A class that caches and processes incoming message chunks from a stream to construct
 * complete, structured `Message` objects. It handles different message types like text,
 * thinking steps, and tool calls by using specialized parsers.
 *
 * @class MessageCache
 */
export class MessageCache {
  /**
   * The current message parser element that is actively processing chunks.
   * This will be an instance of a class that extends `BaseMessage` (e.g., `ThinkingMessage`, `ToolUseMessage`).
   * @type {(BaseMessage | null)}
   */
  public currentElement: BaseMessage | null = null;

  /**
   * Creates an instance of `MessageCache`.
   * @param {Tool[]} tools - An array of available tools that can be parsed from the stream.
   * @param {(...messages: any[]) => void} [log=console.log] - A logging function.
   */
  constructor(public tools: Tool[], private log: (...messages: unknown[]) => void = console.log) { }

  /**
   * Processes an incoming chunk from the stream. It identifies the type of message
   * being streamed (e.g., thinking, tool_use, text) and uses the appropriate parser
   * to build a complete message. It returns the message once it's fully parsed.
   * @param {string} chunk - The chunk of the message to process.
   * @returns {Promise<any>} The fully parsed `Message` object, or `null` if more chunks are needed.
   */
  async processChunk(chunk: string): Promise<any> {
    
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
