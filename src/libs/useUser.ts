import { useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';

// hooks and context
import { HTTPMethod, UseApiReturnProps, useApi } from './useApi';
import { UserContext } from '../screens/Auth/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSigninWithGoogle = (): UseApiReturnProps => {
  const { setUser } = useContext(UserContext);
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/signin-with-google',
    false,
  );

  const fetch = (token: string) => {
    const params = {
      token,
    };
    makeRequest?.(params);
  };

  useEffect(() => {
    if (!!data && data?.accessToken && data?.refreshToken) {
      const handleDecode = async () => {
        // save the new access token
        await AsyncStorage.setItem('ACCESS_TOKEN', data.accessToken);
        await AsyncStorage.setItem('REFRESH_TOKEN', data.refreshToken);

        const decoded: any = await jwtDecode(data.accessToken);
        setUser({
          id: decoded.sub,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          roles: decoded.roles,
          ...(decoded?.picture && { picture: decoded?.picture }),
        });
      };

      handleDecode();
    }
  }, [data]);

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch,
  };
};

export const useValidateAccessToken = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/token/validate-access-token',
    false,
  );

  const fetch = async () => {
    return makeRequest?.();
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch,
  };
};