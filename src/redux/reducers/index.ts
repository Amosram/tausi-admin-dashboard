import userReducer from "./userSlice";
import {ordersReducer, ordersRtkQueryMiddleware} from "@/modules/orders/reducers";
import {usersReducer, usersRtkQueryMiddleware} from "@/modules/users/reducers";
import { professionalReducer, professionalRtkQueryMiddleware } from "@/modules/applications/reducers";

export const modulesReducers = {
    ...ordersReducer,
    ...usersReducer,
  ...professionalReducer
};


export const rtkQueryMiddleware = [
    ...ordersRtkQueryMiddleware,
    ...usersRtkQueryMiddleware,
    ...professionalRtkQueryMiddleware,
];

export const staticReducers = {
    user: userReducer,
    ...modulesReducers
};
