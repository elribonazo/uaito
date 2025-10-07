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
  } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

import rootReducer from './rootReducer';
import { useMemo } from 'react';
import * as actions from '../actions'

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

    (store as any).__persistor = persistStore(store);

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
