import { combineReducers } from "redux";
import { web3Reducer } from "./slices/wallet3Connect/web3ConnectSlice";
import { modelReducer } from "./slices/helperSlices/modelSlice";

const parentReducer = combineReducers({
  web3Connect: web3Reducer,
  model: modelReducer,
});

export default parentReducer;
