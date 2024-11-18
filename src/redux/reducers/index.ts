import userReducer from "./userSlice";
import ordersReducer from './ordersSlice';

export const modulesReducers = {
}


export const rtkQueryMiddleware = [

]

export const staticReducers = {
    user: userReducer,
    orders: ordersReducer,
    ...modulesReducers
};
