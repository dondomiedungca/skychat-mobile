import { useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';

// hooks and context
import { HTTPMethod, UseApiReturnProps, useApi } from './useApi';
import { UserContext } from '../context/user.context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnBoardingData } from '../context/onboarding-context';

export enum TypeVerification {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE'
}

export const useSigninWithGoogle = (): UseApiReturnProps => {
  const { setUser } = useContext(UserContext);
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/signin-with-google',
    false
  );

  const fetch = (token: string) => {
    const params = {
      token
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
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          email: decoded.email,
          roles: decoded.roles,
          user_meta: decoded?.user_meta,
          created_at: decoded?.createdAt
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
    makeRequest: fetch
  };
};

export const useValidateAccessToken = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/token/validate-access-token',
    false
  );

  const fetch = async () => {
    return makeRequest?.();
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useGetPaginatedUsers = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.GET,
    '/users/get-users/except-me',
    false
  );

  const fetch = async ({ page, search }: { page: number; search?: string }) => {
    return makeRequest?.({ page, search });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useLogout = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/handle-logout',
    false
  );

  const fetch = async ({ refreshToken }: { refreshToken: string }) => {
    return makeRequest?.({ refreshToken });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useLoginWithPhone = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/signin-with-phone',
    false
  );

  const fetch = async ({ phone_number }: { phone_number: string }) => {
    return makeRequest?.({ phone_number });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useValidatePhoneOrEmailCode = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/verified-code',
    false
  );

  const fetch = async ({
    phone_number,
    email,
    code,
    type
  }: {
    phone_number?: string;
    email?: string;
    code: string;
    type: TypeVerification;
  }) => {
    return makeRequest?.({ phone_number, code, email, type });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useCompleteOnboarding = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/complete-onboarding',
    false
  );

  const fetch = async (data: OnBoardingData) => {
    return makeRequest?.(data);
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useCheckEmailIfExists = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/check-email-if-exists',
    false
  );

  const fetch = async (data: { email: string }) => {
    return makeRequest?.(data);
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useCustomLogin = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/authenticate',
    false
  );

  const fetch = async (data: { email: string; password: string }) => {
    return makeRequest?.(data);
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useSetUserNotification = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/set-notification',
    false
  );

  const fetch = async (data: { user_id: string; token: string }) => {
    return makeRequest?.(data);
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useFindUserById = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/users/find-by-id',
    false
  );

  const fetch = async (data: { user_id: string }) => {
    return makeRequest?.(data);
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};
