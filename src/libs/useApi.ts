import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsMountedRef } from './useIsMountedRef';

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

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

const createHttp = ({
  method,
  url,
  config,
  cancelator,
  payloads
}: {
  method: HTTPMethod;
  url: string;
  config: any;
  cancelator: any;
  payloads?: any;
}) => {
  switch (method) {
    case HTTPMethod.POST:
      return axios.post(url, payloads, config);
    case HTTPMethod.GET:
      return axios.get(url, {
        ...config,
        cancelToken: cancelator.source.token,
        params: payloads
      });
    default:
      return axios[method](url, payloads, config);
  }
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
      let localResponse = await createHttp({
        method,
        url,
        config: { headers },
        cancelator: {
          source
        },
        payloads: {
          ...payload
        }
      });
      response = localResponse.data;
      setData(localResponse.data);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(error);
      if ((error as any)?.response?.data?.statusCode == 403) {
        const REFRESH_TOKEN = await AsyncStorage.getItem('REFRESH_TOKEN');
        const refetch = await axios.post(
          `${BASE_URL}/token/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${REFRESH_TOKEN}`
            },
            cancelToken: source.token
          }
        );
        const recreatedAccessToken = refetch.data;
        if (recreatedAccessToken) {
          await AsyncStorage.setItem(
            'ACCESS_TOKEN',
            recreatedAccessToken.accessToken
          );
          let localResponse = await createHttp({
            method,
            url,
            config: {
              headers: {
                Authorization: `Bearer ${recreatedAccessToken.accessToken}`
              }
            },
            cancelator: {
              source
            },
            payloads: { ...payload }
          });
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
