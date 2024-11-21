import userReducer from "./userSlice";
import {ordersReducer, ordersRtkQueryMiddleware} from "@/modules/orders/reducers";
import {usersReducer, usersRtkQueryMiddleware} from "@/modules/users/reducers";

export const modulesReducers = {
    ...ordersReducer,
    ...usersReducer
}


export const rtkQueryMiddleware = [
    ...ordersRtkQueryMiddleware,
    ...usersRtkQueryMiddleware
]

export const staticReducers = {
    user: userReducer,
    ...modulesReducers
};
