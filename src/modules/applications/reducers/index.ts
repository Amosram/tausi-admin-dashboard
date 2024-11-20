import { professionalApi } from "../api/professionalApi";

export const professionalReducer = {
  [professionalApi.reducerPath]: professionalApi.reducer
};

export const professionalRtkQueryMiddleware = [
  professionalApi.middleware
];