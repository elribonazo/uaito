import { MessageArray } from "@/utils";

  export * from './BaseLLM'
  /**
   * Represents a function that transforms a chunk of data in a stream.
   * @template T The type of the input chunk.
   * @template M The type of the output message.
   * @param {T} chunk - The input chunk to be transformed.
   * @returns {Promise<M | null>} A promise that resolves to the transformed message or null.
   */
  export type TransformStreamFn<T, M> = (
    chunk: T,
  ) => Promise<M | null>
  /**
   * Represents the cache for a base LLM.
   * @type
   */
  export type BaseLLMCache = {
    /**
     * The input for a tool.
     * @type {(BlockType | null)}
     */
    toolInput: BlockType | null,
    /**
     * The chunks of the response.
     * @type {(string | null)}
     */
    chunks: string | null,
    /**
     * The number of input and output tokens.
     * @type {{ input: number, output: number }}
     */
    tokens: {
      input: number,
      output: number
    }
  }
  /**
   * Represents a tool that can be used by an LLM.
   * @type
   */
  export type Tool = {
    /**
     * The unique ID of the tool.
     * @type {(number | undefined)}
     */
    id?: number;
    /**
     * The name of the tool.
     * @type {string}
     */
    name: string;
    /**
     * The description of the tool.
     * @type {string}
     */
    description: string;
    /**
     * The input schema for the tool.
     * @type {{ type: "object", properties: Record<string, { type: string, description: string, default?: unknown }>, required?: string[] }}
     */
    input_schema: {
      type: "object";
      properties: Record<string, {
        type: string;
        description: string;
        default?: unknown;
      }>;
      required?: string[];
    };
    /**
     * The code for the tool.
     * @type {(string | undefined)}
     */
    code?: string;
    /**
     * Whether the tool is enabled.
     * @type {(boolean | undefined)}
     */
    enabled?: boolean;
    /**
     * Whether the tool is collapsed.
     * @type {(boolean | undefined)}
     */
    isCollapsed?: boolean;
  };

  /**
   * Represents a block of a tool.
   * @type
   */
  export type ToolBlock = ToolInputDelta | ToolUseBlock  | ToolResultBlock ;
  /**
   * Represents the role of a message.
   * @type
   */
  export type Role = 'assistant' | 'user' | 'system' | 'tool';
  
  
  /**
   * Represents a web search result block.
   * @interface WebSearchResultBlock
   */
  export interface WebSearchResultBlock {
    /**
     * The encrypted content of the search result.
     * @type {string}
     */
    encrypted_content: string;
  
    /**
     * The age of the page.
     * @type {(string | null)}
     */
    page_age: string | null;
  
    /**
     * The title of the search result.
     * @type {string}
     */
    title: string;
  
    /**
     * The type of the block.
     * @type {'web_search_result'}
     */
    type: 'web_search_result';
  
    /**
     * The URL of the search result.
     * @type {string}
     */
    url: string;
  }
  
  /**
   * Represents the content of a web search tool result block.
   * @type
   */
  export type WebSearchToolResultBlockContent = WebSearchToolResultError | Array<WebSearchResultBlock>;
  /**
   * Represents a web search tool result error.
   * @interface WebSearchToolResultError
   */
  export interface WebSearchToolResultError {
    /**
     * The error code.
     * @type {('invalid_tool_input' | 'unavailable' | 'max_uses_exceeded' | 'too_many_requests' | 'query_too_long')}
     */
    error_code:
      | 'invalid_tool_input'
      | 'unavailable'
      | 'max_uses_exceeded'
      | 'too_many_requests'
      | 'query_too_long';
  
    /**
     * The type of the block.
     * @type {'web_search_tool_result_error'}
     */
    type: 'web_search_tool_result_error';
  }
  
  
  /**
   * Represents a web search tool result block.
   * @interface WebSearchToolResultBlock
   */
  export interface WebSearchToolResultBlock {
    /**
     * The content of the block.
     * @type {WebSearchToolResultBlockContent}
     */
    content: WebSearchToolResultBlockContent;
  
    /**
     * The ID of the tool use.
     * @type {string}
     */
    tool_use_id: string;
  
    /**
     * The type of the block.
     * @type {'web_search_tool_result'}
     */
    type: 'web_search_tool_result';
  }
  
  /**
   * Represents a server tool use block.
   * @interface ServerToolUseBlock
   */
  export interface ServerToolUseBlock {
    /**
     * The unique ID of the tool use.
     * @type {string}
     */
    id: string;
  
    /**
     * The input for the tool.
     * @type {unknown}
     */
    input: unknown;
  
    /**
     * The name of the tool.
     * @type {'web_search'}
     */
    name: 'web_search';
  
    /**
     * The type of the block.
     * @type {'server_tool_use'}
     */
    type: 'server_tool_use';
  }
  
  /**
   * Represents a delta block.
   * @type
   */
  export type DeltaBlock =   {
    /**
     * The type of the block.
     * @type {'delta'}
     */
    type:'delta',
    /**
     * The reason the stream stopped.
     * @type {('end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null)}
     */
    stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
  
    /**
     * The stop sequence.
     * @type {(string | null)}
     */
    stop_sequence: string | null;
  
  }
  /**
   * Represents the usage of tokens.
   * @type
   */
  export type USAGE = {
    /**
     * The number of input tokens.
     * @type {number}
     */
    input_tokens: number;
    /**
     * The number of output tokens.
     * @type {number}
     */
    output_tokens: number;
  }
  
  /**
   * Represents a search and replace block.
   * @interface SearchReplaceBlock
   */
  export interface SearchReplaceBlock {
    /**
     * The search string.
     * @type {string}
     */
    search: string;
    /**
     * The replace string.
     * @type {string}
     */
    replace: string;
  }
  
  /**
   * An abstract class for a base message.
   * @abstract
   * @class BaseMessage
   */
  export abstract class BaseMessage {
    /**
     * Renders the message.
     * @abstract
     * @returns {Promise<Message>} A promise that resolves to the rendered message.
     */
    abstract render(): Promise<Message>;
    /**
     * An array of strings to be replaced in the message.
     * @abstract
     * @type {string[]}
     */
    abstract replacements: string[];
    /**
     * The buffer for the message.
     * @abstract
     * @type {string}
     */
    abstract buffer: string;
  
    /**
     * An array of available tools.
     * @protected
     * @type {Tool[]}
     */
    protected tools: Tool[];
    /**
     * Cleans a chunk of text by removing replacements.
     * @protected
     * @param {string} chunk - The chunk to clean.
     * @returns {string} The cleaned chunk.
     */
    protected cleanChunk(chunk: string) {
      let replacedText = '';
      if (this.replacements) {
        const match = this.replacements.find(replacement => chunk.includes(replacement));
        if (match) {
          const replaced = chunk
            .replace(`${match}\r\n`, '')
            .replace(`${match}\r`, '')
            .replace(`${match}\n`, '')
            .replace(`${match}`, '');
            
            replacedText = replaced.trim();
        } else {
          replacedText = chunk;
        }
      } else {
        replacedText = chunk
      }
      return replacedText;
    }
  
  }

/**
 * An abstract class for a base agent.
 * @abstract
 * @class BaseAgent
 */
 export abstract class BaseAgent {
    /**
     * The options for the base LLM.
     * @abstract
     * @type {BaseLLMOptions}
     */
    abstract options: BaseLLMOptions;
    /**
     * Optional callback for tool usage.
     * @abstract
     * @type {(OnTool | undefined)}
     */
    abstract onTool?: OnTool;
    /**
     * The name of the agent.
     * @abstract
     * @type {string}
     */
    abstract name: string;
    /**
     * An array of message inputs.
     * @abstract
     * @type {MessageArray<MessageInput>}
     */
    abstract inputs: MessageArray<MessageInput>;
    /**
     * The system prompt for the agent.
     * @abstract
     * @type {string}
     */
    abstract systemPrompt: string;
    /**
     * The chain of thought for the agent.
     * @abstract
     * @type {string}
     */
    abstract chainOfThought: string;

    /**
     * Adds inputs to the agent.
     * @abstract
     * @param {MessageArray<MessageInput>} inputs - The inputs to add.
     * @returns {Promise<void>}
     */
    abstract addInputs(inputs: MessageArray<MessageInput>): Promise<void>;
    /**
     * Loads the agent.
     * @abstract
     * @returns {Promise<void>}
     */
    abstract load(): Promise<void>;
    /**
     * Performs a task using the agent.
     * @abstract
     * @param {string} prompt - The prompt for the task.
     * @returns {Promise<{ usage: { input: number, output: number }, response: ReadableStreamWithAsyncIterable<Message> }>} A promise that resolves to the usage and response stream.
     */
    abstract performTask(prompt: string): Promise<{
        usage: { input: number, output: number },
        response: ReadableStreamWithAsyncIterable<Message>
    }>;
}


  /**
   * Represents a callback for tool usage.
   * @type
   */
  export type OnTool = (
    this: BaseAgent,
    message: Message, 
    signal?: AbortSignal
  ) => Promise<void>

  
  /**
   * Represents a usage block.
   * @type
   */
  export type UsageBlock = {
    /**
     * The type of the block.
     * @type {'usage'}
     */
    type: 'usage',
    /**
     * The number of input tokens.
     * @type {(number | undefined)}
     */
    input?: number,
    /**
     * The number of output tokens.
     * @type {(number | undefined)}
     */
    output?: number
  }
  
  /**
   * Represents an error block.
   * @type
   */
  export type ErrorBlock = {
    /**
     * The type of the block.
     * @type {'error'}
     */
    type:'error',
    /**
     * The error message.
     * @type {string}
     */
    message: string
  }
  /**
   * Represents a redacted thinking block.
   * @interface RedactedThinkingBlock
   */
  export interface RedactedThinkingBlock {
    /**
     * The redacted data.
     * @type {string}
     */
    data: string;
  
    /**
     * The type of the block.
     * @type {'redacted_thinking'}
     */
    type: 'redacted_thinking';
  }
  
  /**
   * Represents a thinking block.
   * @interface ThinkingBlock
   */
  export interface ThinkingBlock {
    /**
     * The signature of the thinking block.
     * @type {string}
     */
    signature: string;
  
    /**
     * The thinking content.
     * @type {string}
     */
    thinking: string;
  
    /**
     * The type of the block.
     * @type {'thinking'}
     */
    type: 'thinking';
  }
  
  /**
   * Represents a signature delta block.
   * @interface SignatureDeltaBlock
   */
  export interface SignatureDeltaBlock {
    /**
     * The signature of the block.
     * @type {string}
     */
    signature: string;
  
    /**
     * The type of the block.
     * @type {'signature_delta'}
     */
    type: 'signature_delta';
  }
  
  

  /**
   * Represents an image block.
   * @type
   */
  export type ImageBlock = {
    /**
     * The source of the image.
     * @type {{ data: string, media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', type: 'base64' }}
     */
    source: {
      data: string;
      media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
      type: 'base64';
    };
    /**
     * The type of the block.
     * @type {'image'}
     */
    type: 'image';
    /**
     * Optional ID reference to a previous image generation call (for multi-turn editing).
     * @type {(string | undefined)}
     */
    imageGenerationCallId?: string;
  }
  
  /**
   * Represents an audio block.
   * @type
   */
  export type AudioBlock = {
    /**
     * The source of the audio.
     * @type {{ data: string, media_type: 'audio/wav', type: 'base64' }}
     */
    source: {
      data: string;
      media_type: 'audio/wav';
      type: 'base64';
    };
    /**
     * The type of the block.
     * @type {'audio'}
     */
    type: 'audio';
  }
  
  /**
   * Represents a text block.
   * @type
   */
  export type TextBlock = {
    /**
     * The text content.
     * @type {string}
     */
    text: string;
    /**
     * The type of the block.
     * @type {'text'}
     */
    type: 'text';
  }
  
  
  /**
   * Represents a tool use block.
   * @type
   */
  export type ToolUseBlock = {
    /**
     * The unique ID of the tool use.
     * @type {string}
     */
    id: string;
    /**
     * The input for the tool.
     * @type {unknown}
     */
    input: unknown;
    /**
     * The name of the tool.
     * @type {string}
     */
    name: string;
    /**
     * The type of the block.
     * @type {'tool_use'}
     */
    type: 'tool_use';

    isRemote?: boolean;
  }
  
  /**
   * Represents a tool input delta.
   * @type
   */
  export type ToolInputDelta = {
    /**
     * The unique ID of the tool input.
     * @type {(string | undefined)}
     */
    id?:string,
    /**
     * The name of the tool.
     * @type {(string | undefined)}
     */
    name?:string,
    /**
     * The partial input for the tool.
     * @type {string}
     */
    partial:string,
    /**
     * The type of the block.
     * @type {'tool_delta'}
     */
    type: 'tool_delta';
  }
  /**
   * Gets the element type of an array.
   * @type
   */
  export type ArrayElementType<T> = T extends (infer U)[] ? U : never;


/**
 * Represents the content of a message.
 * @type
 */
export type MessageContent = ArrayElementType<Message['content']>

/**
 * Represents a message input.
 * @type
 */
export type MessageInput = {
  /**
   * The unique ID of the message.
   * @type {(string | undefined)}
   */
  id?: string,
  /**
   * The type of the message.
   * @type {(MessageType | undefined)}
   */
  type?: MessageType,
  /**
   * The role of the message.
   * @type {Role}
   */
  role: Role,
  /**
   * The content of the message.
   * @type {MessageContent[]}
   */
  content: MessageContent[]
}

  
  /**
   * Represents a tool result block.
   * @type
   */
  export type ToolResultBlock = {
    /**
     * The ID of the tool use.
     * @type {string}
     */
    tool_use_id: string;
    /**
     * The name of the tool.
     * @type {string}
     */
    name: string,
    /**
     * The type of the block.
     * @type {'tool_result'}
     */
    type: 'tool_result';
    /**
     * The content of the block.
     * @type {(MessageContent[] | undefined)}
     */
    content?: MessageContent[];
    /**
     * Whether the tool result is an error.
     * @type {(boolean | undefined)}
     */
    isError?: boolean;
  }

  /**
   * Represents the type of a message.
   * @type
   */
  export type MessageType =
  'message' |
  ToolInputDelta['type'] |
  ToolUseBlock['type'] |
  ToolResultBlock['type'] |
  DeltaBlock['type'] |
  UsageBlock['type'] | 
  ErrorBlock['type'] |
  ThinkingBlock['type'] |
  RedactedThinkingBlock['type'] | 
  SignatureDeltaBlock['type']

  /**
   * Represents the type of a block.
   * @type
   */
  export type BlockType = ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock |AudioBlock| ThinkingBlock | RedactedThinkingBlock |ServerToolUseBlock | WebSearchToolResultBlock | SignatureDeltaBlock;


  /**
   * Represents a message.
   * @type
   */
  export type Message = {
    /**
     * The unique ID of the message.
     * @type {string}
     */
    id: string,
    /**
     * The type of the message.
     * @type {MessageType}
     */
    type: MessageType,
    /**
     * The content of the message.
     * @type {BlockType[]}
     */
    content: BlockType[],
    /**
     * Whether the message is a chunk.
     * @type {(boolean | undefined)}
     */
    chunk?: boolean,
    /**
     * The role of the message.
     * @type {Role}
     */
    role: Role
  }

/**
 * Represents the options for a base LLM.
 * @type
 */
export type BaseLLMOptions = {
    /**
     * The model to use.
     * @type {string}
     */
    model: string,
    /**
     * An array of available tools.
     * @type {(Tool[] | undefined)}
     */
    tools?: Tool[]
    /**
     * The maximum number of tokens to generate.
     * @type {(number | undefined)}
     */
    maxTokens?: number,
    /**
     * An optional abort signal.
     * @type {(AbortSignal | undefined)}
     */
    signal?: AbortSignal,
    /**
     * The directory for the model.
     * @type {(string | undefined)}
     */
    directory?: string,
    /**
     * An optional progress callback.
     * @type {(((progress: number) => void) | undefined)}
     */
    onProgress?: (progress: number) => void,
    /**
     * An optional logging function.
     * @type {(((message: string) => void) | undefined)}
     */
    log?: (message: string) => void

    onTool?: OnTool
}

/**
 * Represents a readable stream with an async iterable.
 * @type
 */
export type ReadableStreamWithAsyncIterable<T> = ReadableStream<T> & AsyncIterable<T>;

