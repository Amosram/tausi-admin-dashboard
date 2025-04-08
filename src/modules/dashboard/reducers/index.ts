import { dashboardApi } from "../api/dashboardApi";


export const dashboardReducer = {
  [dashboardApi.reducerPath]: dashboardApi.reducer
};

export const dashboardRtkQueryMiddleware = [
  dashboardApi.middleware
];