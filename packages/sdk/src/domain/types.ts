import type { MessageArray } from "@/utils";

  export * from './BaseLLM'
  /**
   * A function that transforms a chunk of data from a provider's stream into the SDK's standard `Message` format.
   * @template T The type of the input chunk from the provider's stream.
   * @template M The type of the output message, which must extend `Message`.
   * @param {T} chunk - The input chunk to be transformed.
   * @returns {Promise<M | null>} A promise that resolves to the transformed message or null if the chunk should be ignored.
   */
  export type TransformStreamFn<T, M> = (
    chunk: T,
  ) => Promise<M | null>
  /**
   * Defines the structure for a cache used by a `BaseLLM` instance.
   * This can be used to store intermediate data like partial tool inputs or response chunks.
   * @type
   */
  export type BaseLLMCache = {
    /**
     * Stores partial input for a tool as it's being streamed.
     * @type {(BlockType | null)}
     */
    toolInput: BlockType | null,
    /**
     * A buffer for accumulating response chunks from the stream.
     * @type {(string | null)}
     */
    chunks: string | null,
    /**
     * Tracks the number of input and output tokens for a request.
     * @type {{ input: number, output: number }}
     */
    tokens: {
      input: number,
      output: number
    }
  }
  /**
   * Describes a tool that an LLM can use. This structure is used to define the tool's
   * name, purpose, and the schema for its inputs.
   * @type
   */
  export type Tool = {
    /**
     * The unique ID of the tool.
     * @type {(number | undefined)}
     */
    id?: number;
    /**
     * The name of the tool, which the LLM will use to call it.
     * @type {string}
     */
    name: string;
    /**
     * The description of the tool.
     * @type {string}
     */
    description: string;
    /**
     * A JSON schema defining the inputs for the tool.
     * The `properties` object describes each parameter the tool accepts.
     * @type {{ type: "object", properties: Record<string, { type: string, description: string, default?: unknown }>, required?: string[] }}
     */
    input_schema: {
      type: "object";
      properties: Record<string, {
        type: string;
        description: string;
        default?: unknown;
        items?: unknown;
      }>;
      required?: string[];
    };
    /**
     * The implementation code for the tool (optional).
     * @type {(string | undefined)}
     */
    code?: string;
    /**
     * Whether the tool is currently enabled and can be used by the LLM.
     * @type {(boolean | undefined)}
     */
    enabled?: boolean;
    /**
     * UI hint for whether the tool's definition should be collapsed by default.
     * @type {(boolean | undefined)}
     */
    isCollapsed?: boolean;
  };

  /**
   * A union type representing all possible tool-related blocks in a message.
   * This includes tool inputs, tool usage requests, and tool results.
   * @type
   */
  export type ToolBlock = ToolInputDelta | ToolUseBlock  | ToolResultBlock ;
  /**
   * Represents the role of the message's author.
   * - `user`: The end-user.
   * - `assistant`: The AI model.
   * - `system`: A configuration or instruction message.
   * - `tool`: A message containing the output of a tool.
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
   * Represents the content of a `WebSearchToolResultBlock`, which can either be an array of `WebSearchResultBlock` or a `WebSearchToolResultError`.
   * @type
   */
  export type WebSearchToolResultBlockContent = WebSearchToolResultError | Array<WebSearchResultBlock>;
  /**
   * Represents an error that occurred during a web search tool execution.
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
     * The type of the block, indicating a web search error.
     * @type {'web_search_tool_result_error'}
     */
    type: 'web_search_tool_result_error';
  }
  
  
  /**
   * Represents the result block from a web search tool.
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
     * The type of the block, indicating a web search result.
     * @type {'web_search_tool_result'}
     */
    type: 'web_search_tool_result';
  }
  
  /**
   * Represents a block for a tool that is executed on the server-side.
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
     * The type of the block, indicating a server-side tool use.
     * @type {'server_tool_use'}
     */
    type: 'server_tool_use';
  }
  
  /**
   * Represents a delta block in a streamed response, indicating changes or stop reasons.
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
   * Represents the token usage for a request.
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
   * Represents a block for search and replace operations.
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
   * An abstract base class for creating message structures.
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
     * An array of strings to be replaced in the message content.
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
     * Cleans a chunk of text by removing placeholder replacements.
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
 * An abstract class defining the core structure and functionality of an agent.
 * Agents encapsulate an LLM and provide a higher-level interface for performing tasks.
 * @abstract
 * @class BaseAgent
 */
 export abstract class BaseAgent {
    /**
     * Configuration options for the underlying `BaseLLM`.
     * @abstract
     * @type {BaseLLMOptions}
     */
    abstract options: BaseLLMOptions;
    /**
     * An optional callback function that is triggered when a tool is used.
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
     * An array that holds the history of messages for a conversation.
     * @abstract
     * @type {MessageArray<MessageInput>}
     */
    abstract inputs: MessageArray<MessageInput>;
    /**
     * The system prompt that defines the agent's behavior and context.
     * @abstract
     * @type {string}
     */
    abstract systemPrompt: string;
    /**
     * The chain of thought or reasoning steps for the agent to follow.
     * @abstract
     * @type {string}
     */
    abstract chainOfThought: string;

    /**
     * Adds a message history to the agent's context.
     * @abstract
     * @param {MessageArray<MessageInput>} inputs - The message history to add.
     * @returns {Promise<void>}
     */
    abstract addInputs(inputs: MessageArray<MessageInput>): Promise<void>;
    /**
     * Initializes or loads the agent, preparing it for task execution.
     * @abstract
     * @returns {Promise<void>}
     */
    abstract load(): Promise<void>;
    /**
     * Executes a task with the given prompt.
     * @abstract
     * @param {string} prompt - The prompt for the task.
     * @returns {Promise<{ usage: { input: number, output: number }, response: ReadableStreamWithAsyncIterable<Message> }>} A promise that resolves to the token usage and a stream of response messages.
     */
    abstract performTask(prompt: string): Promise<{
        usage: { input: number, output: number },
        response: ReadableStreamWithAsyncIterable<Message>
    }>;
}


  /**
   * A callback function that is invoked when an LLM uses a tool.
   * The `this` context within the callback is bound to the `BaseAgent` instance.
   * @param {Message} message - The message containing the tool use block.
   * @param {AbortSignal} [signal] - An optional abort signal to cancel the tool execution.
   * @returns {Promise<void>}
   * @type
   */
  export type OnTool = (
    this: BaseAgent,
    message: Message, 
    signal?: AbortSignal
  ) => Promise<void>

  
  /**
   * Represents a block containing token usage information for a request.
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
   * Represents a block containing an error message.
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
   * Represents a block for reporting progress.
   * @interface ProgressBlock
   */
  export interface ProgressBlock {
    /**
     * The type of the block.
     * @type {'progress'}
     */
    type: 'progress';
  
    /**
     * The progress percentage (0-100).
     * @type {number}
     */
    progress: number;
  
    /**
     * An optional message about the progress.
     * @type {(string | undefined)}
     */
    message?: string;
  }
  /**
   * Represents a thinking or reasoning block from the model that has been redacted.
   * @interface RedactedThinkingBlock
   */
  export interface RedactedThinkingBlock {
    /**
     * The redacted data.
     * @type {string}
     */
    data: string;
  
    /**
     * The type of the block, indicating redacted thinking.
     * @type {'redacted_thinking'}
     */
    type: 'redacted_thinking';
  }
  
  /**
   * Represents a block containing the model's thinking or reasoning process.
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
     * The type of the block, indicating thinking.
     * @type {'thinking'}
     */
    type: 'thinking';
  }
  
  /**
   * Represents a delta block for a signature.
   * @interface SignatureDeltaBlock
   */
  export interface SignatureDeltaBlock {
    /**
     * The signature of the block.
     * @type {string}
     */
    signature: string;
  
    /**
     * The type of the block, indicating a signature delta.
     * @type {'signature_delta'}
     */
    type: 'signature_delta';
  }
  
  

  /**
   * Represents a block containing a file.
   * @type
   */
  export type FileBlock = {
    /**
     * The source of the file.
     * @type {{ name: string, content: string, media_type: 'text/plain' | 'text/markdown' | 'text/csv' | 'application/json', type: 'string' }}
     */
    source: {
      name: string;
      content: string;
      media_type: 'text/plain' | 'text/markdown' | 'text/csv' | 'application/json';
      type: 'string';
    };
    /**
     * The type of the block, indicating a file.
     * @type {'file'}
     */
    type: 'file';
  }

  /**
   * Represents a block containing an image.
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
     * The type of the block, indicating an image.
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
   * Represents a block containing audio.
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
     * The type of the block, indicating audio.
     * @type {'audio'}
     */
    type: 'audio';
  }
  
  /**
   * Represents a block containing plain text.
   * @type
   */
  export type TextBlock = {
    /**
     * The text content.
     * @type {string}
     */
    text: string;
    /**
     * The type of the block, indicating text.
     * @type {'text'}
     */
    type: 'text';
  }
  
  
  /**
   * Represents a block indicating that the model wants to use a tool.
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
     * The type of the block, indicating a tool use request.
     * @type {'tool_use'}
     */
    type: 'tool_use';

    isRemote?: boolean;
  }
  
  /**
   * Represents a delta in the input of a tool as it's being streamed.
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
     * The partial input for the tool as a JSON string.
     * @type {string}
     */
    partial:string,
    /**
     * The type of the block, indicating a tool delta.
     * @type {'tool_delta'}
     */
    type: 'tool_delta';
  }
  /**
   * A utility type to extract the element type from an array.
   * @type
   */
  export type ArrayElementType<T> = T extends (infer U)[] ? U : never;


/**
 * A union type representing any of the possible content blocks within a message's `content` array.
 * @type
 */
export type MessageContent = ArrayElementType<Message['content']>

/**
 * Represents the structure of a message when it is being passed as input to an LLM.
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
   * Represents the result of a tool's execution.
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
     * The type of the block, indicating a tool result.
     * @type {'tool_result'}
     */
    type: 'tool_result';
    /**
     * The content of the block.
     * @type {(MessageContent[] | undefined)}
     */
    content?: MessageContent[];
    /**
     * Indicates whether the tool execution resulted in an error.
     * @type {(boolean | undefined)}
     */
    isError?: boolean;
  }

  /**
   * A union of all possible message types.
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
  SignatureDeltaBlock['type'] |
  FileBlock['type'] |
  ProgressBlock['type']

  /**
   * A union of all possible block types that can be part of a message's content.
   * @type
   */
  export type BlockType = ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock |AudioBlock| ThinkingBlock | RedactedThinkingBlock |ServerToolUseBlock | WebSearchToolResultBlock | SignatureDeltaBlock | FileBlock | ProgressBlock;


  /**
   * The core message structure used throughout the SDK.
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
     * An array of content blocks that make up the message.
     * @type {BlockType[]}
     */
    content: BlockType[],
    /**
     * Indicates if the message is a partial chunk from a stream.
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
 * Configuration options for a `BaseLLM` instance.
 * @type
 */
export type BaseLLMOptions = {
    /**
     * The specific model to use, e.g., 'gpt-4o'.
     * @type {string}
     */
    model: string,
    /**
     * An array of tools that the LLM is allowed to use.
     * @type {(Tool[] | undefined)}
     */
    tools?: Tool[]
    /**
     * The maximum number of tokens to generate in the response.
     * @type {(number | undefined)}
     */
    maxTokens?: number,
    /**
     * An abort signal to cancel the request.
     * @type {(AbortSignal | undefined)}
     */
    signal?: AbortSignal,
    /**
     * A directory path, often used for file-based operations.
     * @type {(string | undefined)}
     */
    directory?: string,
    /**
     * A callback function to report progress, e.g., for model downloads.
     * @type {(((progress: number) => void) | undefined)}
     */
    onProgress?: (progress: number) => void,
    /**
     * A custom logging function. Defaults to `console.log`.
     * @type {(((message: string) => void) | undefined)}
     */
    log?: (message: string) => void

    onTool?: OnTool
}

/**
 * A type that combines a `ReadableStream` with an `AsyncIterable`, allowing it to be used
 * with both `for await...of` loops and standard stream consumers.
 * @type
 */
export type ReadableStreamWithAsyncIterable<T> = ReadableStream<T> & AsyncIterable<T>;

