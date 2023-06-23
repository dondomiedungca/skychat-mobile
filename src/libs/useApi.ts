import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsMountedRef } from './useIsMountedRef';

// const BASE_URL = Constants?.expoConfig?.extra?.API_URL;
const BASE_URL = 'http://192.168.1.9:3000'; // if you are in development mode, use your device (your PC) ip

export enum HTTPMethod {
  POST = 'post',
  GET = 'get',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete'
}

export type UseApiReturnProps = {
  isLoading: boolean;
  data: any;
  success: boolean;
  error: Error | undefined;
  makeRequest?: (payload?: any) => any;
};

export type HttpError = {
  error: string;
  message: string;
  statusCode: number;
};

export const useApi = (
  method: HTTPMethod,
  path: string,
  overrideURL?: boolean
): UseApiReturnProps => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const isMounted = useIsMountedRef();

  const url = overrideURL ? path : `${BASE_URL}${path}`;
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const fetch = async (payload?: any): Promise<AxiosResponse | HttpError> => {
    let response;
    const ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    };
    try {
      setLoading(true);
      setError(false);
      setSuccess(false);
      let localResponse = await axios[method](
        url,
        { ...payload, cancelToken: source },
        { headers }
      );
      response = localResponse.data;
      setData(localResponse.data);
      setSuccess(true);
    } catch (error) {
      setError(error);
      if ((error as any)?.response?.data?.statusCode == 403) {
        const REFRESH_TOKEN = await AsyncStorage.getItem('REFRESH_TOKEN');
        const refetch = await axios.post(
          `${BASE_URL}/token/refresh-token`,
          {
            cancelToken: source
          },
          {
            headers: {
              Authorization: `Bearer ${REFRESH_TOKEN}`
            }
          }
        );
        const recreatedAccessToken = refetch.data;
        if (recreatedAccessToken) {
          await AsyncStorage.setItem(
            'ACCESS_TOKEN',
            recreatedAccessToken.accessToken
          );
          let localResponse = await axios[method](
            url,
            { ...payload, cancelToken: source },
            {
              headers: {
                Authorization: `Bearer ${recreatedAccessToken.accessToken}`
              }
            }
          );
          response = localResponse.data;
        } else {
          response = {
            ...(error as any)?.response?.data,
            error: new Error('Forbidden error')
          };
        }
      }
    } finally {
      setLoading(false);
    }
    return response;
  };

  useEffect(() => {
    if (!isMounted.current) {
      source.cancel();
    }
  }, [isMounted.current]);

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};
