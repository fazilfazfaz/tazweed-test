import {combineReducers} from 'redux';
import countReducer from './countReducer.js';
const allReducers= combineReducers({
  userinfo: countReducer,
});
export default allReducers;
