import userReducer from "./userSlice";
import appearanceReducer from "./appearanceSlice";
import {ordersReducer, ordersRtkQueryMiddleware} from "@/modules/orders/reducers";
import {usersReducer, usersRtkQueryMiddleware} from "@/modules/users/reducers";
import { professionalReducer, professionalRtkQueryMiddleware } from "@/modules/applications/reducers";
import { boothsReducer, boothsRtkQueryMiddleware } from "@/modules/booths/reducers";
import { ledgersReducer, ledgersRTKQueryMiddleware } from "@/modules/ledger/reducers";
import { dashboardReducer, dashboardRtkQueryMiddleware } from "@/modules/dashboard/reducers";

export const modulesReducers = {
  ...ordersReducer,
  ...usersReducer,
  ...boothsReducer,
  ...professionalReducer,
  ...ledgersReducer,
  ...dashboardReducer
};


export const rtkQueryMiddleware = [
  ...ordersRtkQueryMiddleware,
  ...usersRtkQueryMiddleware,
  ...boothsRtkQueryMiddleware,
  ...professionalRtkQueryMiddleware,
  ...ledgersRTKQueryMiddleware,
  ...dashboardRtkQueryMiddleware
];

export const staticReducers = {
  user: userReducer,
  appearance: appearanceReducer,
  ...modulesReducers
};
