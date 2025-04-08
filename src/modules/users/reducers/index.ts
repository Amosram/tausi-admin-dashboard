import { usersApi } from "../api/usersApi";

export const usersReducer = {
  [usersApi.reducerPath]: usersApi.reducer,
};

export const usersRtkQueryMiddleware = [usersApi.middleware];
