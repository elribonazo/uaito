import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';
import { bindActionCreators } from "redux";

import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

import rootReducer from './rootReducer';
import { useMemo } from 'react';
import * as actions from '../actions'

const makeStore = () => configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

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
