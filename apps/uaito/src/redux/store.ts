import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';
import { bindActionCreators } from "redux";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    createTransform,
  } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TypedUseSelectorHook } from "react-redux";
import { useSelector, useDispatch } from "react-redux";

import rootReducer from './rootReducer';
import { useMemo } from 'react';
import * as actions from '../actions'
import type { ChatState } from './userSlice';
import { STORAGE_CONFIG } from '../config/storage';

// Transform to limit what gets persisted from chat state
const chatTransform = createTransform(
    // Transform state on save
    (inboundState: ChatState) => {
        // Only keep the last N messages per chat to prevent quota issues
        const MAX_MESSAGES_PER_CHAT = STORAGE_CONFIG.MAX_MESSAGES_PER_CHAT;
        const MAX_CHATS = STORAGE_CONFIG.MAX_CHATS;
        
        const transformedChats = { ...inboundState.chats };
        
        // Sort chat IDs by updatedAt (most recent first)
        const sortedChatIds = Object.keys(transformedChats).sort((a, b) => {
            return (transformedChats[b]?.updatedAt || 0) - (transformedChats[a]?.updatedAt || 0);
        });

        // Only keep the most recent chats
        const chatsToKeep = sortedChatIds.slice(0, MAX_CHATS);
        const filteredChats: typeof transformedChats = {};

        chatsToKeep.forEach(chatId => {
            const chat = transformedChats[chatId];
            if (chat) {
                // Only keep the last N messages
                const recentMessages = chat.messages.slice(-MAX_MESSAGES_PER_CHAT);
                filteredChats[chatId] = {
                    ...chat,
                    messages: recentMessages,
                    state: 'ready' as const, // Always reset to ready on persist
                };
            }
        });

        return {
            ...inboundState,
            chats: filteredChats,
            chatOrder: chatsToKeep,
            // Don't persist download progress
            downloadProgress: null,
            // Reset streaming states
            error: null,
        };
    },
    // Transform state on rehydrate
    (outboundState: ChatState) => {
        // Ensure all chats are in ready state on load
        if (outboundState?.chats) {
            const chats = { ...outboundState.chats };
            Object.keys(chats).forEach(chatId => {
                if (chats[chatId]) {
                    chats[chatId].state = 'ready';
                }
            });
            return {
                ...outboundState,
                chats,
                error: null,
                downloadProgress: null,
            };
        }
        return outboundState;
    },
    { whitelist: ['user'] }
);

const makeStore = () => {
    const isServer = typeof window === 'undefined';

    if (isServer) {
        return configureStore({
            reducer: rootReducer,
            devTools: process.env.NODE_ENV !== 'production',
        });
    } 
    
    const persistConfig = {
        key: 'uaito-root',
        storage,
        whitelist: ['user'],
        transforms: [chatTransform],
        // Add throttle to reduce write frequency
        throttle: STORAGE_CONFIG.PERSIST_THROTTLE,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
        devTools: process.env.NODE_ENV !== 'production',
    });

    // Add error handling for persist operations
    const persistor = persistStore(store, null, () => {
        console.log('Redux persist rehydration complete');
    });

    // Handle quota exceeded errors
    const originalSetItem = storage.setItem;
    storage.setItem = async (key: string, value: string) => {
        try {
            await originalSetItem.call(storage, key, value);
        } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded. Clearing old data...');
                // Clear the storage and try again with fresh data
                await storage.removeItem(key);
                // Optionally notify the user
                console.warn('Chat history has been cleared due to storage limitations');
            } else {
                throw error;
            }
        }
    };

    // Store persistor on the store instance
    type StoreWithPersistor = typeof store & { __persistor: typeof persistor };
    (store as StoreWithPersistor).__persistor = persistor;

    return store;
};

export const wrapper = createWrapper(makeStore);
export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
export const useAppSelector: TypedUseSelectorHook<RootState> =
    useSelector;

export const useMountedApp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dispatchedActions = useMemo(
        () => bindActionCreators(actions, dispatch),
        [dispatch]
    );
    const state = useAppSelector((state) => state.user);
    return {
        dispatch,
        ...{
            user: state
        },
        ...dispatchedActions,
    };
};
