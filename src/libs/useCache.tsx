import { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export const useCacheApp = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const cacheImages = (images: any[]) => {
    return images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
  };

  const cacheFonts = (fonts: any[]) => {
    return fonts.map((font) => Font.loadAsync(font));
  };

  const images = [
    require("./../../assets/png/logo-black.png"),
    require("./../../assets/png/logo-color.png"),
    require("./../../assets/png/logo-no-background.png"),
    require("./../../assets/png/logo-white.png"),
    require("./../../assets/png/mobile-icon.png"),
  ];

  const fonts = [
    { Roboto: require("./../../assets/fonts/Roboto/Roboto-Regular.ttf") },
    {
      "Roboto-Medium": require("./../../assets/fonts/Roboto/Roboto-Medium.ttf"),
    },
  ];

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const imageAssets = cacheImages(images);

        const fontAssets = cacheFonts(fonts);

        await Promise.all([...imageAssets, ...fontAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return { appIsReady };
};
