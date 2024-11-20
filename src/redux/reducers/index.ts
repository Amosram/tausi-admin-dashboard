import userReducer from "./userSlice";
import ordersReducer from './ordersSlice';
import { professionalReducer, professionalRtkQueryMiddleware } from "@/modules/applications/reducers";

export const modulesReducers = {
  ...professionalReducer
};


export const rtkQueryMiddleware = [
  ...professionalRtkQueryMiddleware,
];

export const staticReducers = {
  user: userReducer,
  orders: ordersReducer,
  ...modulesReducers
};
