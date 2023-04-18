import { HTTPMethod, UseApiReturnProps, useApi } from './useApi';

export const useSigninWithGoogle = (): UseApiReturnProps => {
  const {
    isLoading,
    response,
    success,
    error,
    fetch: mutate,
  } = useApi(HTTPMethod.POST, '/users/signin-with-google', false);

  const fetch = (token: string) => {
    const params = {
      token,
    };
    mutate(params);
  };

  return {
    isLoading,
    response,
    success,
    error,
    fetch,
  };
};
