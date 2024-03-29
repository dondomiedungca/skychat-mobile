import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppRegistry } from 'react-native';

// hooks
import { useCacheApp } from './src/libs/useCache';

//components
import SplashScreenComponent from './src/components/SplashScreen';
import Navigation from './src/screens/navigation';
import UserContextComponent from './src/context/user.context';
import RecentConversationContextComponent from './src/context/recent-conversation.context';
import ReelsUsersContextComponent from './src/context/reels-of-users.context';
import CallListenerContextComponent from './src/context/call-listener.context';
import OnBoardContextComponent from './src/context/onboarding-context';
import NotificationContextComponent from './src/context/notification.context';

const App = () => {
  const { appIsReady } = useCacheApp();

  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default function Main() {
  return (
    <OnBoardContextComponent>
      <UserContextComponent>
        <ReelsUsersContextComponent>
          <RecentConversationContextComponent>
            <CallListenerContextComponent>
              <NotificationContextComponent>
                <App />
              </NotificationContextComponent>
            </CallListenerContextComponent>
          </RecentConversationContextComponent>
        </ReelsUsersContextComponent>
      </UserContextComponent>
    </OnBoardContextComponent>
  );
}

AppRegistry.registerComponent('Skychat', () => Main);
