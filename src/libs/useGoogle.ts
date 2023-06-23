import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, IOS_CLIENT_ID } from '@env';

// hooks
import { useSigninWithGoogle } from './useUser';
import { UseApiReturnProps } from './useApi';

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export const useGoogleAuth = (): UseApiReturnProps & {
  promptAsync: () => void;
} => {
  const [token, setToken] = useState<string | undefined>('');
  const { makeRequest, ...handleSigninGoogle } = useSigninWithGoogle();

  const [, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID
  });

  useEffect(() => {
    if (!token) return;
    makeRequest?.(token);
  }, [token]);

  useEffect(() => {
    if (response?.type === 'success') {
      setToken(response?.authentication?.accessToken);
    }
  }, [response]);

  return {
    promptAsync,
    makeRequest,
    ...handleSigninGoogle
  };
};
