import { LLMProvider, Message, MessageArray, MessageInput } from "@uaito/sdk"







export type FetchToolsOptions = { 
    directory: string, 
    chatId: string, 
    threadId: string, 
    signal: AbortSignal
  }
  export interface StreamOptions {
    chatId: string,
    prompt: string,
    inputs: MessageArray<MessageInput>,
    directory: string,
    signal: AbortSignal,
    provider: LLMProvider
  }
  

  export type UpdateToolOptions = {
    threadId: string,
    toolName: string,
    isError: boolean,
    result: Message['content']
  }

  export type EditorOptions = {
    inputPath: string,
    originalContent: string,
    instructions: string,
    projectContext: string
  }