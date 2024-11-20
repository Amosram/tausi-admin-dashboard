import userReducer from "./userSlice";
import { ordersApi } from "@/modules/orders/api";
import { usersApi } from "@/modules/users/api";

export const modulesReducers = {
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
}


export const rtkQueryMiddleware = [
    ordersApi.middleware,
    usersApi.middleware,
]

export const staticReducers = {
    user: userReducer,
    ...modulesReducers
};
