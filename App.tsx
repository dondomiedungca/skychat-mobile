import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppRegistry } from 'react-native';

// hooks
import { useCacheApp } from './src/libs/useCache';

//components
import SplashScreenComponent from './src/components/SplashScreen';
import Navigation from './src/screens/navigation';
import UserContextComponent from './src/screens/Auth/context/UserContext';

const App = () => {
  const { appIsReady } = useCacheApp();

  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaViewContainer>
        <PaperProvider>
          <Navigation />
        </PaperProvider>
      </SafeAreaViewContainer>
    </SafeAreaProvider>
  );
};

const SafeAreaViewContainer = styled.SafeAreaView`
  height: 100%;
`;

export default function Main() {
  return (
    <UserContextComponent>
      <App />
    </UserContextComponent>
  );
}

AppRegistry.registerComponent('Skychat', () => Main);
