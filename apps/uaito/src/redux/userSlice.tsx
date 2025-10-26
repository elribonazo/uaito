import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { getApiKey, streamMessage } from '@/actions';
import type { Session } from 'next-auth';
import { LLMProvider } from '@uaito/sdk';
import type { DeltaBlock, ErrorBlock, ImageBlock, Message, TextBlock, ToolBlock, UsageBlock } from '@uaito/sdk';
import { STORAGE_CONFIG } from '@/config/storage';

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
  theme: 'light' | 'dark' | 'system';
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
  theme: 'system',
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
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setProvider: (state, action: PayloadAction<LLMProvider>) => {
      state.provider = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    initializeProvider: (state) => {
        if (!state.provider) {
            state.provider = LLMProvider.Anthropic;
        }
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
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      if (state.chats[action.payload]) {
        state.activeChatId = action.payload;
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      delete state.chats[action.payload];
      state.chatOrder = state.chatOrder.filter(id => id !== action.payload);
      
      // Set new active chat if deleted was active
      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chatOrder[0] || null;
      }
    },
    deleteAllChats: (state) => {
      state.chats = {};
      state.chatOrder = [];
      state.activeChatId = null;
    },
    clearOldChats: (state, action: PayloadAction<{ keepCount?: number }>) => {
      const keepCount = action.payload.keepCount || STORAGE_CONFIG.AUTO_CLEANUP_KEEP_COUNT;
      // Sort chats by updatedAt (most recent first)
      const sortedChatIds = state.chatOrder
        .map(id => ({ id, updatedAt: state.chats[id]?.updatedAt || 0 }))
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map(item => item.id);

      // Keep only the most recent chats
      const chatsToKeep = sortedChatIds.slice(0, keepCount);
      const chatsToDelete = sortedChatIds.slice(keepCount);

      // Delete old chats
      chatsToDelete.forEach(chatId => {
        delete state.chats[chatId];
      });

      state.chatOrder = chatsToKeep;

      // Update active chat if it was deleted
      if (state.activeChatId && !chatsToKeep.includes(state.activeChatId)) {
        state.activeChatId = chatsToKeep[0] || null;
      }
    },
    trimChatMessages: (state, action: PayloadAction<{ chatId: string; keepLast?: number }>) => {
      const { chatId, keepLast = 50 } = action.payload;
      const chat = state.chats[chatId];
      
      if (chat && chat.messages.length > keepLast) {
        chat.messages = chat.messages.slice(-keepLast);
        chat.updatedAt = Date.now();
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
      }
    },
    loadChatsFromStorage: (state) => {
        Object.values(state.chats).forEach(chat => {
            if (chat) {
              chat.state = 'ready';
            }
        });
    },
    pushChatMessage: (state, action: PayloadAction<PushChatMessage>) => {
      const { chatId, chatMessage: { message } } = action.payload;
      const chat = state.chats[chatId];
      
      if (!chat) {
        console.error(`Chat ${chatId} not found`);
        return state;
      }

      console.log(`Message ${message.id} [${message.type}] content ${JSON.stringify(message.content)}`);

      if (message.type === "progress") {
        const existingIndex = chat.messages.findIndex((m) => m.id === message.id);
        if (existingIndex !== -1) {
          chat.messages[existingIndex] = message;
        } else {
          chat.messages.push(message);
        }
        return state;
      }
      
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
        const inputTokens = (usage as UsageBlock & { input?: number }).input ?? 0;
        const outputTokens = (usage as UsageBlock & { output?: number }).output ?? 0;
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
                type ThinkingContent = { type: 'thinking'; thinking: string };
                const thinking = message.content[0] as ThinkingContent
                const existingThinking = chat.messages[existingIndex].content[0] as ThinkingContent
                existingThinking.thinking += thinking.thinking
              } 
          } else {
            chat.messages.push(message)
          }
        }
      }
      
      chat.updatedAt = Date.now();
      
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
  initializeProvider, 
  setProvider, 
  setSelectedModel,
  setTheme,
  createNewChat,
  setActiveChat,
  deleteChat,
  renameChat,
  loadChatsFromStorage,
  deleteAllChats,
  clearOldChats,
  trimChatMessages
} = userSlice.actions;
export default userSlice.reducer;