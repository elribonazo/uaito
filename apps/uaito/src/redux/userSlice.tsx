import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { getApiKey, streamMessage } from '@/actions';
import type { Session } from 'next-auth';
import { LLMProvider } from '@uaito/sdk';
import type { DeltaBlock, ErrorBlock, ImageBlock, Message, TextBlock, ThinkingBlock, ToolBlock, UsageBlock } from '@uaito/sdk';

export type MessageState = Message;
export type UserSession = {
  user?: {
    email: string
  }
}
export interface Feature {
    title: string;
    description: string;
    icon: string;
  }
  

export interface HomeProps {
    features: Feature[];
    chats: FeaturedChat[];
  }
export type FeaturedChat = {
  visibleContent: (ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock)[],
  role: Message['role'],
  content: (ErrorBlock | TextBlock | ToolBlock | ImageBlock | DeltaBlock | UsageBlock)[]
}
export type FeatureSectionProps = {
    speed?: number,
    startScroll?: number,
    title: string,
    chats: FeaturedChat[], 
    reverse?: boolean,
    preview?: React.ReactNode
}
export interface Chat {
  id: string;
  name: string;
  messages: MessageState[];
  state: 'streaming' | 'ready';
  createdAt: number;
  updatedAt: number;
  provider: LLMProvider;
  model: string;
  usage: {
    input: number;
    output: number;
  };
}

export interface ChatState {
  error: SerializedError | null;
  chats: Record<string, Chat>;
  activeChatId: string | null;
  chatOrder: string[];
  usage: {
    apiKey: string | null;
    input: number;
    output: number;
  };
  provider: LLMProvider | null;
  selectedModel: string | null;
  isFetchingUsageToken: boolean;
  hasFetchedUsageToken: boolean;
  downloadProgress: number | null;
  isProviderInitialized: boolean;
}

export const initialState: ChatState = {
  error: null,
  chats: {},
  activeChatId: null,
  chatOrder: [],
  usage: {
    apiKey: null,
    input: 0,
    output: 0
  },
  provider: null,
  selectedModel: null,
  isFetchingUsageToken: false,
  hasFetchedUsageToken: false,
  downloadProgress: null,
  isProviderInitialized: false,
};

export interface PushChatMessage {
  chatId: string;
  chatMessage: {
    message: Message;
    role?: 'user' | 'assistant'
  },
  session: Session
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<LLMProvider>) => {
      state.provider = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('uaito-selected-provider', action.payload);
      }
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
      if (typeof window !== 'undefined' && state.provider) {
        localStorage.setItem(`uaito-selected-model-${state.provider}`, action.payload);
      }
    },
    initializeProvider: (state) => {
      if (typeof window !== 'undefined') {
        const savedProvider = localStorage.getItem('uaito-selected-provider');
        if (savedProvider && Object.values(LLMProvider).includes(savedProvider as LLMProvider)) {
          state.provider = savedProvider as LLMProvider;
          const savedModel = localStorage.getItem(`uaito-selected-model-${savedProvider}`);
          if (savedModel) {
            state.selectedModel = savedModel;
          }
        }
      }
      state.isProviderInitialized = true;
    },
    setDownloadProgress: (state, action: PayloadAction<number | null>) => {
      state.downloadProgress = action.payload;
    },
    createNewChat: (state, action: PayloadAction<{
      provider: LLMProvider;
      model: string;
    }>) => {
      const id = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newChat: Chat = {
        id,
        name: `Chat ${Object.keys(state.chats).length + 1}`,
        messages: [],
        state: 'ready',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        provider: action.payload.provider,
        model: action.payload.model,
        usage: {
          input: 0,
          output: 0
        }
      };
      state.chats[id] = newChat;
      state.chatOrder.unshift(id);
      state.activeChatId = id;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('uaito-chats', JSON.stringify({
          chats: state.chats,
          activeChatId: state.activeChatId,
          chatOrder: state.chatOrder,
        }));
      }
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      if (state.chats[action.payload]) {
        state.activeChatId = action.payload;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('uaito-chats', JSON.stringify({
            chats: state.chats,
            activeChatId: state.activeChatId,
            chatOrder: state.chatOrder,
          }));
        }
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      delete state.chats[action.payload];
      state.chatOrder = state.chatOrder.filter(id => id !== action.payload);
      
      // Set new active chat if deleted was active
      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chatOrder[0] || null;
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('uaito-chats', JSON.stringify({
          chats: state.chats,
          activeChatId: state.activeChatId,
          chatOrder: state.chatOrder,
        }));
      }
    },
    deleteAllChats: (state) => {
      state.chats = {};
      state.chatOrder = [];
      state.activeChatId = null;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('uaito-chats', JSON.stringify({
          chats: state.chats,
          activeChatId: state.activeChatId,
          chatOrder: state.chatOrder,
        }));
      }
    },
    renameChat: (state, action: PayloadAction<{
      id: string;
      name: string;
    }>) => {
      const chat = state.chats[action.payload.id];
      if (chat) {
        chat.name = action.payload.name;
        chat.updatedAt = Date.now();
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('uaito-chats', JSON.stringify({
            chats: state.chats,
            activeChatId: state.activeChatId,
            chatOrder: state.chatOrder,
          }));
        }
      }
    },
    loadChatsFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('uaito-chats');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Reset all chat states to 'ready' since no chats can be actively streaming on page load
            const chats = parsed.chats || {};
            Object.keys(chats).forEach(chatId => {
              if (chats[chatId]) {
                chats[chatId].state = 'ready';
              }
            });
            state.chats = chats;
            state.activeChatId = parsed.activeChatId || null;
            state.chatOrder = parsed.chatOrder || [];
          } catch (error) {
            console.error('Failed to load chats from storage:', error);
          }
        }
      }
    },
    pushChatMessage: (state, action: PayloadAction<PushChatMessage>) => {
      const { chatId, chatMessage: { message } } = action.payload;
      const chat = state.chats[chatId];
      
      if (!chat) {
        console.error(`Chat ${chatId} not found`);
        return state;
      }

      console.log("SATH pushChatMessage", message);

      if (message.type === "error") {
        toast(
          <div>
            <p>{message.content[0].type === "error" ?
            message.content[0].message :
            'An unexpected error ocurred'} </p>
                           
            </div>,
          { position: 'bottom-right', })
        return state
      }
      
      if (message.type === "usage") {
        const { content } = message
        const usage = content[0] as UsageBlock
        const inputTokens = usage.input ?? 0;
        const outputTokens = usage.output ?? 0;
        state.usage.input += inputTokens;
        state.usage.output += outputTokens;
        chat.usage.input += inputTokens;
        chat.usage.output += outputTokens;
      } else if (message.type === "delta"){
        const [usageBlock] = message.content.filter((block) => block.type === "usage");
        const deltaBlocks = message.content.filter((block) => block.type === "delta");
        if (usageBlock) {
          state.usage.input += usageBlock.input ?? 0;
          state.usage.output += usageBlock.output ?? 0;
          chat.usage.input += usageBlock.input ?? 0;
          chat.usage.output += usageBlock.output ?? 0;
        }

        chat.messages.push({
          ...message,
          content: deltaBlocks
        })
      } else {
        const existingIndex = chat.messages.findIndex((m) =>  message.id === m.id);
        if (existingIndex < 0) {
          chat.messages.push(message)
        } else if (existingIndex > 0) {
          if (chat.messages[existingIndex]?.chunk ) {
              if (chat.messages[existingIndex]?.content[0].type === "text") {
                chat.messages[existingIndex].content[0].text += (message.content[0] as TextBlock).text
              } else if (chat.messages[existingIndex]?.content[0].type === "thinking") {
                const thinking = message.content[0] as ThinkingBlock;
                const existingThinking = chat.messages[existingIndex].content[0] as ThinkingBlock;
                existingThinking.thinking += thinking.thinking
              } 
          } else {
            chat.messages.push(message)
          }
        }
      }
      
      chat.updatedAt = Date.now();
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('uaito-chats', JSON.stringify({
          chats: state.chats,
          activeChatId: state.activeChatId,
          chatOrder: state.chatOrder,
        }));
      }
      
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getApiKey.pending, (state) => {
      state.error = null;
      state.isFetchingUsageToken = true;
      state.hasFetchedUsageToken = false;
    })
    builder.addCase(getApiKey.rejected, (state, action) => {
      state.error = action.error;
      state.isFetchingUsageToken = false;
      state.hasFetchedUsageToken = false;
    })
    builder
      .addCase(streamMessage.pending, (state, action) => {
        const { chatId } = action.meta.arg;
        const chat = state.chats[chatId];
        if (chat) {
          chat.state = "streaming";
        }
        state.error = null;
      })
    builder
      .addCase(streamMessage.fulfilled, (state, action) => {
        const { chatId } = action.meta.arg
        const chat = state.chats[chatId];
        if (chat) {
          chat.state = "ready";
        }
        state.error = null;
      })
    builder
      .addCase(streamMessage.rejected, (state, action) => {
        const { chatId } = action.meta.arg
        const chat = state.chats[chatId];
        if (chat) {
          chat.state = "ready";
        }
        state.error = action.error
      })
  },
});

export const { 
  pushChatMessage, 
  setDownloadProgress, 
  initializeProvider, 
  setProvider, 
  setSelectedModel,
  createNewChat,
  setActiveChat,
  deleteChat,
  renameChat,
  loadChatsFromStorage,
  deleteAllChats
} = userSlice.actions;
export default userSlice.reducer;