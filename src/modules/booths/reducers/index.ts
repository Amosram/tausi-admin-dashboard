import { boothsApi } from "../api/boothsApi";

export const boothsReducer = {
  [boothsApi.reducerPath]: boothsApi.reducer,
};

export const boothsRtkQueryMiddleware = [boothsApi.middleware];
