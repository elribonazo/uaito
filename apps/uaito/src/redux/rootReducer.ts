import { combineReducers } from 'redux';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here as needed
});

export default rootReducer;