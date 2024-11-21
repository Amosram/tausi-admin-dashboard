import { usersApi } from "../api/useraApi";

export const usersReducer = {
  [usersApi.reducerPath]: usersApi.reducer,
};

export const usersRtkQueryMiddleware = [usersApi.middleware];
