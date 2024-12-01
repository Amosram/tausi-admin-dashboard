import userReducer from "./userSlice";
import {ordersReducer, ordersRtkQueryMiddleware} from "@/modules/orders/reducers";
import {usersReducer, usersRtkQueryMiddleware} from "@/modules/users/reducers";
import { professionalReducer, professionalRtkQueryMiddleware } from "@/modules/applications/reducers";
import { boothsReducer, boothsRtkQueryMiddleware } from "@/modules/booths/reducers";
import { ledgersReducer, ledgersRTKQueryMiddleware } from "@/modules/ledger/reducers";

export const modulesReducers = {
  ...ordersReducer,
  ...usersReducer,
  ...boothsReducer,
  ...professionalReducer,
  ...ledgersReducer,
};


export const rtkQueryMiddleware = [
  ...ordersRtkQueryMiddleware,
  ...usersRtkQueryMiddleware,
  ...boothsRtkQueryMiddleware,
  ...professionalRtkQueryMiddleware,
  ...ledgersRTKQueryMiddleware,
];

export const staticReducers = {
  user: userReducer,
  ...modulesReducers
};
