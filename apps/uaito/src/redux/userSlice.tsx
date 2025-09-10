import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { getApiKey, streamMessage } from '@/actions';
import StripePricingTable from '@/components/PricingTable';
import { Session } from 'next-auth';
import { DeltaBlock, ErrorBlock, ImageBlock, Message, TextBlock, ToolBlock, UsageBlock } from '@uaito/sdk';

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
    preview?: any
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
  isFetchingUsageToken: boolean;
  hasFetchedUsageToken: boolean;
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
  isFetchingUsageToken:false,
  hasFetchedUsageToken: false
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
    pushChatMessage: (state, action: PayloadAction<PushChatMessage>) => {
      const { chatMessage: { message }, session } = action.payload;
      if (message.type === "error") {
        toast(
          <div>
            <p>{message.content[0].type === "error" ?
            message.content[0].message :
            'An unexpected error ocurred'} </p>
            <StripePricingTable 
            pricingTableId={'prctbl_1Po5DTLPQsMrIxE72WzZJGj7'} 
            publishableKey='pk_test_51PgOgiLPQsMrIxE7dwh1dZnInmccnXXJ8hVisXOOf79RN4tPO1c4zV3onsCt0b6j2pqZQ4qVwv10iahAClBnTvrr00MSUAVpY2'
            />
            </div>,
          { position: 'bottom-right', })
        return state
      }
      if (message.type === "usage" && message.content[0].type === "usage") {
        state.usage.input = message.content[0].input ?? 0;
        state.usage.output = message.content[0].output ?? 0;
      } else {
        const existingIndex = state.messages.findIndex((m) =>  message.id === m.id);
        if (existingIndex < 0) {
          state.messages.push(message)
        } else if (existingIndex > 0) {
          if (state.messages[existingIndex]?.chunk &&
            state.messages[existingIndex]?.content[0].type === "text") {
            state.messages[existingIndex].content[0].text += (message.content[0] as TextBlock).text
          } else {
            state.messages.push(message)
          }
        }
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getApiKey.pending, (state, action) => {
      state.error = null,
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
        state.state = "streaming"
        state.error = null;
      })
    builder
      .addCase(streamMessage.fulfilled, (state, action: PayloadAction<null>) => {
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

export const { pushChatMessage } = userSlice.actions;
export default userSlice.reducer;