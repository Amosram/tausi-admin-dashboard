import userReducer from "./userSlice";
import { ordersApi } from "@/modules/orders/api";

export const modulesReducers = {
    [ordersApi.reducerPath]: ordersApi.reducer,
}


export const rtkQueryMiddleware = [
    ordersApi.middleware,
]

export const staticReducers = {
    user: userReducer,
    ...modulesReducers
};
