 
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { ACCESS_TOKEN_STORAGE_KEY, API_URL } from './constants';

export const axiosBaseQuery = (
  { baseUrl, isAuthorizedApi }: { baseUrl?: string, isAuthorizedApi?: boolean } = { baseUrl: API_URL, isAuthorizedApi: false }
): BaseQueryFn<
  {
    url: string
    method?: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
  },
  unknown,
  unknown
> => async ({
  url, method, data, params, headers
}) => {
  if (!baseUrl) {
    baseUrl = API_URL;
  }

  const axiosParams: AxiosRequestConfig = {
    url: baseUrl + url,
    method,
    data,
    params,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      ...headers
    }
  };

  if (isAuthorizedApi) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (accessToken) {
      axiosParams.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  try {
    const result = await axios(axiosParams);
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message
      }
    };
  }
};
