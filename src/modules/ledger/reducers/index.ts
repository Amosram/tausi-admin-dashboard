import { ledgersApi } from "../api/ledgersApi";


export const ledgersReducer = {
  [ledgersApi.reducerPath]: ledgersApi.reducer
};

export const ledgersRTKQueryMiddleware = [
  ledgersApi.middleware
];