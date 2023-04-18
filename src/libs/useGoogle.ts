import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, IOS_CLIENT_ID } from '@env';

// hooks
import { useSigninWithGoogle } from './useUser';

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

export const useGoogleAuth = () => {
  const [token, setToken] = useState<string | undefined>('');
  const { fetch } = useSigninWithGoogle();

  const [, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
  });

  useEffect(() => {
    try {
      if (!token) throw { message: 'No access token provided' };
      fetch(token);

      // const response = await fetch(
      //   'https://www.googleapis.com/userinfo/v2/me',
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );

      // const user = await response.json();
      // onSuccess && onSuccess(user);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    if (response?.type === 'success') {
      setToken(response?.authentication?.accessToken);
    }
  }, [response]);

  return {
    promptAsync,
  };
};
