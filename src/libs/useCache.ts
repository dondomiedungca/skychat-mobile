import { useState, useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

// hooks and context
import { useValidateAccessToken } from './useUser';
import { UserContext } from '../screens/Auth/context/UserContext';

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export const useCacheApp = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { setUser } = useContext(UserContext);
  const { makeRequest } = useValidateAccessToken();

  const cacheImages = (images: any[]) => {
    return images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
  };

  const cacheFonts = (fonts: any[]) => {
    return fonts.map((font) => Font.loadAsync(font));
  };

  const validateAccesstoken = async () => {
    const accessToken = await AsyncStorage.getItem('ACCESS_TOKEN');
    if (!!accessToken) {
      const response = await makeRequest();
      if (
        !response?.hasOwnProperty('error') &&
        !response?.hasOwnProperty('statusCode')
      ) {
        setUser({
          id: response?.id,
          firstName: response?.firstName,
          lastName: response?.lastName,
          email: response?.email,
          roles: response?.roles,
          user_meta: response?.user_meta,
          created_at: response?.created_at
        });
      }
    }
  };

  const images = [
    require('./../../assets/png/logo-black.png'),
    require('./../../assets/png/logo-color.png'),
    require('./../../assets/png/logo-no-background.png'),
    require('./../../assets/png/logo-white.png'),
    require('./../../assets/png/adaptive-icon.png'),
    require('./../../assets/png/icon.png')
  ];

  const fonts = [
    { Roboto: require('./../../assets/fonts/Roboto/Roboto-Regular.ttf') },
    {
      'Roboto-Medium': require('./../../assets/fonts/Roboto/Roboto-Medium.ttf')
    },
    {
      'Roboto-Thin': require('./../../assets/fonts/Roboto/Roboto-Thin.ttf')
    },
    {
      'Roboto-Light': require('./../../assets/fonts/Roboto/Roboto-Light.ttf')
    },
    {
      'Roboto-Bold': require('./../../assets/fonts/Roboto/Roboto-Bold.ttf')
    }
  ];

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const imageAssets = cacheImages(images);

        const fontAssets = cacheFonts(fonts);

        await Promise.all([
          ...imageAssets,
          ...fontAssets,
          validateAccesstoken()
        ]);
      } catch (e) {
      } finally {
        setAppIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return { appIsReady };
};
