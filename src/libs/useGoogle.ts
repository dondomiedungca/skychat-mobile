import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';

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

const ANDROID_CLIENT_ID = Constants?.expoConfig?.extra?.ANDROID_CLIENT_ID;
const EXPO_CLIENT_ID = Constants?.expoConfig?.extra?.EXPO_CLIENT_ID;
const IOS_CLIENT_ID = Constants?.expoConfig?.extra?.IOS_CLIENT_ID;

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
