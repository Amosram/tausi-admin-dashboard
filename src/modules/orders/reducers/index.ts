import { ordersApi } from "../api/ordersApi";

export const ordersReducer = {
  [ordersApi.reducerPath]: ordersApi.reducer,
};

export const ordersRtkQueryMiddleware = [ordersApi.middleware];
