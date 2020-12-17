import { combineReducers } from "redux";
import { reducer as appReducer } from "../app";

const rootReducer = combineReducers({
  appReducer,
});

export default rootReducer;
