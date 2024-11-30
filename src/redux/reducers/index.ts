import userReducer from "./userSlice";
import {ordersReducer, ordersRtkQueryMiddleware} from "@/modules/orders/reducers";
import {usersReducer, usersRtkQueryMiddleware} from "@/modules/users/reducers";
import { professionalReducer, professionalRtkQueryMiddleware } from "@/modules/applications/reducers";
import { boothsReducer, boothsRtkQueryMiddleware } from "@/modules/booths/reducers";

export const modulesReducers = {
    ...ordersReducer,
    ...usersReducer,
    ...boothsReducer,
  ...professionalReducer
};


export const rtkQueryMiddleware = [
    ...ordersRtkQueryMiddleware,
    ...usersRtkQueryMiddleware,
    ...boothsRtkQueryMiddleware,
    ...professionalRtkQueryMiddleware,
];

export const staticReducers = {
    user: userReducer,
    ...modulesReducers
};
