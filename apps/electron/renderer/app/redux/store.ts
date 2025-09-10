import { Store } from "redux";
import { thunk } from "redux-thunk";
import { configureStore } from '@reduxjs/toolkit';
// import { bindActionCreators } from "redux";
// import { useMemo } from "react";
import { throttle } from 'lodash';
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

import rootReducer from "./rootReducer";
import { initialState, UserState } from "./userSlice";

const stateKey = `::REDUX_STATE_UAITO_${process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : 'DEVELOP'}::`
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(stateKey);
    if (serializedState === null) {
      return undefined;
    }
    const loaded:RootState = JSON.parse(serializedState);
    return {
      user: {
        ...loaded.user,
        chats:loaded.user.chats.map((chat) => ({...chat, state: 'ready' as const}))
      }
    }
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateKey, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState() || { user: initialState },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(require('redux-immutable-state-invariant').default(), thunk),
});

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

export type RootState = {user: UserState};
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> =
    useSelector;

export const useMountedApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const dispatchedActions = useMemo(
  //     () => bindActionCreators(actions, dispatch),
  //     [dispatch]
  // );
  const user = useAppSelector((state) => state.user);
  return {
    dispatch,
      ...{
        user
      },
      //...dispatchedActions,
  };
};


export const wrapper: Store = store;