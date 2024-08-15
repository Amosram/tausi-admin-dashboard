import userReducer from "./userSlice";

export const modulesReducers = {
}


export const rtkQueryMiddleware = [

]

export const staticReducers = {
    user: userReducer,
    ...modulesReducers
};
