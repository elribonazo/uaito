import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { Message, LLMProvider, TextBlock } from '@uaito/sdk';


export type MessageState = Message;

export interface ChatState {
  id: string,
  currentThreadId?: string | null,
  directory: string,
  name: string,
  messages: MessageState[],
  state: 'streaming' | 'ready',
  usage:{
    input:number,
    output: number
  },
  isLoadingToolRequests: boolean;
  hasLoadedToolRequests: boolean
}

export interface UserState {
  isRegistering: boolean;
  hasRegistered: boolean;
  isAuthenticating: boolean;
  hasAuthenticated: boolean;
  error: NonNullable<string>;
  chats: ChatState[];
  chatId: string | null;
  llmProvider: LLMProvider,
  apiKey: string|null,
  baseUrl: string|null,
}

export type RootState = {
  user: UserState;
};

export const initialState: UserState = {
  error: null,
  isRegistering: false,
  hasRegistered: false,
  isAuthenticating: false,
  hasAuthenticated: false,
  chats: [],
  chatId: null,
  llmProvider: LLMProvider.Anthropic,
  apiKey: null,
  baseUrl: null
};




export interface PushChatMessage {
  chatId: string;
  message: Message;
  role?: 'user' | 'assistant'
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    streamState: (state, action: PayloadAction<{chatId: string, state:  'streaming' | 'ready'}>) => {
      state.chats = state.chats.map((chat) => {
        if (chat.id === action.payload.chatId) {
          return {
            ...chat,
            state: action.payload.state
          }
        }
        return chat
      })
    },
    toggleConfig: (state, action: PayloadAction<{llm: LLMProvider, apiKey?: string, baseUrl?: string}>) => {
      state.llmProvider = action.payload.llm;
      state.apiKey = action.payload.apiKey ?? null;
      state.baseUrl = action.payload.baseUrl ?? null;
      return state;
    },
    setChatId: (state, action: PayloadAction<string | null>) => {
      state.chatId = action.payload;
      return state;
    },
    syncThread: (state, action: PayloadAction<{chatId: string, threadId: string}>) => {
      state.chats = state.chats.map((chat) => chat.id === action.payload.chatId ? ({ ...chat, currentThreadId: action.payload.threadId }) : chat);
      return state;
    },
    createChat: (state, action: PayloadAction<{ directory: string; name: string }>) => {
      const { directory, name } = action.payload;
      const chatId = `chatuuid-${crypto.randomUUID()}`
      state.chats.push({
        id: chatId,
        directory,
        name,
        messages: [],
        state: 'ready',
        usage:{
          input: 0,
          output:0
        },
        isLoadingToolRequests: false,
        hasLoadedToolRequests: false
      });
      state.chatId = chatId;
      return state;
    },
    updateChat: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { name, id } = action.payload;
      state.chats = state.chats.map((chat) => chat.id === id ? ({ ...chat, name }) : chat);
      state.chatId = id;
      return state;
    },
    removeChat: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;
      state.chats = state.chats.filter(({ id }) => chatId !== id);
      state.chatId = state.chats.length > 0 ? state.chats.at(state.chats.length - 1).id : null
      return state
    },
    pushChatMessage: (state, action: PayloadAction<PushChatMessage>) => {
      const { chatId, message } = action.payload;
      if (message.type === "error") {
        toast(message.content[0].type === "error" ? message.content[0].message : 'An unexpected error ocurred', {position:'bottom-right', })
        return state
      }
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex < 0) {
        return state;
      }
      const existingIndex = state.chats[chatIndex].messages.findIndex((c) => c.id === message.id);
      if (message.type === "usage" && message.content[0].type === "usage") {
        state.chats[chatIndex].usage.input = message.content[0].input ?? 0;
        state.chats[chatIndex].usage.output = message.content[0].output ?? 0;
      } else {
        if (existingIndex < 0) {
          console.log("pushing ", message)
          state.chats[chatIndex].messages.push(message)
        } else if (existingIndex > 0) {
          if (state.chats[chatIndex].messages[existingIndex].chunk &&
            state.chats[chatIndex].messages[existingIndex].content[0].type === "text") {
            state.chats[chatIndex].messages[existingIndex].content[0].text += (message.content[0] as TextBlock).text
          } else {
            state.chats[chatIndex].messages.push(message)
          }
        }
      }
      
      return state;
    },
  },
});

export const { toggleConfig, streamState, syncThread, createChat, removeChat, updateChat, pushChatMessage, setChatId } = userSlice.actions;
export default userSlice.reducer;