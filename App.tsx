import React from "react";
import styled from "styled-components/native";

// hooks
import { useCacheApp } from "./src/libs/useCache";

//components
import SplashScreenComponent from "./src/components/SplashScreen";
import Navigation from "./src/screens/navigation";

const App = () => {
  const { appIsReady } = useCacheApp();

  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <SafeAreaViewContainer>
      <Navigation />
    </SafeAreaViewContainer>
  );
};

const SafeAreaViewContainer = styled.SafeAreaView`
  height: 100%;
`;

export default function Main() {
  return <App />;
}
