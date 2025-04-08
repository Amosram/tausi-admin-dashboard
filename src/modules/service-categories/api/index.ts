import { serviceCategoryApi } from './service-category';

export const serviceCategoryReducers = {
  [serviceCategoryApi.reducerPath]: serviceCategoryApi.reducer,
};

export const serviceCategoryRtkMiddleware = [
  serviceCategoryApi.middleware,
];