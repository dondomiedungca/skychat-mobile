import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsMountedRef } from './useIsMountedRef';

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

export enum HTTPMethod {
  POST = 'post',
  GET = 'get',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete',
}

export type UseApiReturnProps = {
  isLoading: boolean;
  response: any;
  success: boolean;
  error: Error;
  fetch: (payload: any) => void;
};

export const useApi = (
  method: HTTPMethod,
  path: string,
  overrideURL?: boolean,
): UseApiReturnProps => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const isMounted = useIsMountedRef();

  const url = overrideURL ? path : `${BASE_URL}${path}`;
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const fetch = (payload?: any) => {
    const handleFetch = async () => {
      const ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');

      const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      };

      setLoading(true);

      axios[method](url, { ...payload, cancelToken: source }, { headers })
        .then((response) => {
          setSuccess(true);
          setResponse(response);
        })
        .catch((err) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    handleFetch();
  };

  useEffect(() => {
    if (!isMounted.current) {
      source.cancel();
    }
  }, [isMounted.current]);

  return {
    isLoading,
    response,
    success,
    error,
    fetch,
  };
};
