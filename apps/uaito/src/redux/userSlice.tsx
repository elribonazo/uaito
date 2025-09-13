import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { getApiKey, streamMessage } from '@/actions';
import type { Session } from 'next-auth';
import { LLMProvider } from '@uaito/sdk';
import type { DeltaBlock, ErrorBlock, ImageBlock, Message, TextBlock, ToolBlock, UsageBlock } from '@uaito/sdk';

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
export interface ChatState {
  error: SerializedError | null,
  id: string | null,
  name: string | null,
  messages: MessageState[],
  state: 'streaming' | 'ready',
  usage: {
    apiKey: string|null,
    input: number,
    output: number
  },
  provider: LLMProvider | null;
  selectedModel: string | null;
  isFetchingUsageToken: boolean;
  hasFetchedUsageToken: boolean;
  downloadProgress: number | null;
}

export const initialState: ChatState = {
  error: null,
  id: null,
  name: null,
  messages: [],
  state: 'ready',
  usage: {
    apiKey: null,
    input: 0,
    output: 0
  },
  provider: null,
  selectedModel: null,
  isFetchingUsageToken:false,
  hasFetchedUsageToken: false,
  downloadProgress: null,
};

export interface PushChatMessage {
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
        const savedProvider = localStorage.getItem('uaito-selected-provider') as LLMProvider;
        if (savedProvider && Object.values(LLMProvider).includes(savedProvider)) {
          state.provider = savedProvider;
        } else {
          state.provider = LLMProvider.Anthropic;
        }
      }
    },
    setDownloadProgress: (state, action: PayloadAction<number | null>) => {
      state.downloadProgress = action.payload;
    },
    pushChatMessage: (state, action: PayloadAction<PushChatMessage>) => {
      const { chatMessage: { message } } = action.payload;
      if (message.type === "error") {
        debugger;
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
        state.usage.input +=( message.content[0] as any).input ?? 0;
        state.usage.output +=( message.content[0] as any).output ?? 0;
      } else if (message.type === "delta"){
        const [usageBlock] = message.content.filter((block) => block.type === "usage");
        const deltaBlocks = message.content.filter((block) => block.type === "delta");
        if (usageBlock) {
          state.usage.input += usageBlock.input ?? 0;
          state.usage.output += usageBlock.output ?? 0;
        }

        state.messages.push({
          ...message,
          content: deltaBlocks
        })
      } else {
        const existingIndex = state.messages.findIndex((m) =>  message.id === m.id);
        if (existingIndex < 0) {
          state.messages.push(message)
        } else if (existingIndex > 0) {
          if (state.messages[existingIndex]?.chunk ) {
              if (state.messages[existingIndex]?.content[0].type === "text") {
                state.messages[existingIndex].content[0].text += (message.content[0] as TextBlock).text
              } else if (state.messages[existingIndex]?.content[0].type === "thinking") {
                state.messages[existingIndex].content[0].thinking += (message.content[0] as any).thinking
              } 
          } else {
            state.messages.push(message)
          }
        }
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
      .addCase(streamMessage.pending, (state) => {
        state.state = "streaming"
        state.error = null;
      })
    builder
      .addCase(streamMessage.fulfilled, (state) => {
        state.state = "ready"
        state.error = null;
      })
    builder
      .addCase(streamMessage.rejected, (state, action) => {
        state.state = "ready"
        state.error = action.error
      })
  },
});

export const { pushChatMessage, setDownloadProgress, initializeProvider, setProvider, setSelectedModel } = userSlice.actions;
export default userSlice.reducer;