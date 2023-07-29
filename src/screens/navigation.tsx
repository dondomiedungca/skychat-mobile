import React, { useCallback, useContext } from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// screens
import { Verify, GetStarted, StartAccount } from './Auth';
import { ChatHome } from './Home';
import { Recent } from './Home/Recent';
import { Account } from './Home/Account';
import ChatRoom from './Home/ChatHome/Room';

// components
import { navigationRef } from '../libs/rootNavigation';
import { UserContext } from '../context/user.context';

// types, constants and utils
import { User } from '../types/User';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import Colors from '../types/Colors';
import CallRoom from './Home/Call/CallRoom';
import { CallType } from '../types/Call';
import PromptCall from './Home/Call/PromptCall';
import Phone from './Auth/Phone';
import { TypeVerification } from '../libs/useUser';
import { PersonalInfo } from './Auth/PersonalInfo';

export type RootParamList = AppStackParamList &
  AuthStackParamList &
  HomeStackTabParamList &
  ChatStackParamList &
  CallStackParamList;

export type AppStackParamList = {
  Main: NavigatorScreenParams<HomeStackTabParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: NavigatorScreenParams<ChatStackParamList>;
  Call: NavigatorScreenParams<CallStackParamList>;
};

export type AuthStackParamList = {
  GetStarted: undefined;
  StartAccount: undefined;
  Phone: undefined;
  Verify: {
    type: TypeVerification;
  };
  PersonalInfo: undefined;
};

export type ChatStackParamList = {
  ChatHome: undefined;
  Room: {
    user: User;
  };
};

export type CallStackParamList = {
  CallRoom: {
    user?: User;
    roomId?: string;
    offer?: string;
    type: CallType;
  };
  PromptCall: {
    caller: User;
    roomId: string;
    offer: any;
  };
};

export type HomeStackTabParamList = {
  Home: undefined;
  Recent: undefined;
  RecentCall?: undefined;
  Account: undefined;
};

const AppStack = createStackNavigator<AppStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const ChatStack = createStackNavigator<ChatStackParamList>();
const CallStack = createStackNavigator<CallStackParamList>();
const StackTab = createBottomTabNavigator<HomeStackTabParamList>();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS
};

const TabNavigators = () => {
  return (
    <StackTab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <StackTab.Screen
        name="Home"
        component={ChatNavigator}
        options={(_) => ({
          tabBarStyle: (() => {
            if (
              navigationRef.isReady() &&
              navigationRef.getCurrentRoute()?.name === 'Room'
            ) {
              return { display: 'none' };
            }
            return {};
          })(),
          tabBarIcon: useCallback(
            (params: any) => (
              <Ionicons
                name="chatbubbles"
                size={24}
                color={params.focused ? Colors.blue : Colors.grey_light}
              />
            ),
            []
          )
        })}
      />
      <StackTab.Screen
        name="Recent"
        component={Recent}
        options={{
          tabBarIcon: useCallback(
            (params: any) => (
              <FontAwesome5
                name="history"
                size={21}
                color={params.focused ? Colors.blue : Colors.grey_light}
              />
            ),
            []
          )
        }}
      />
      <StackTab.Screen
        name="RecentCall"
        component={Account}
        options={{
          tabBarIcon: useCallback(
            (params: any) => (
              <MaterialIcons
                name="video-call"
                size={29}
                color={params.focused ? Colors.blue : Colors.grey_light}
              />
            ),
            []
          )
        }}
      />
      <StackTab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: useCallback(
            (params: any) => (
              <MaterialCommunityIcons
                name="account-box"
                size={24}
                color={params.focused ? Colors.blue : Colors.grey_light}
              />
            ),
            []
          )
        }}
      />
    </StackTab.Navigator>
  );
};

const ChatNavigator = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Group
        screenOptions={{ headerShown: false, ...TransitionScreenOptions }}
      >
        <ChatStack.Screen name="ChatHome" component={ChatHome} />
        <ChatStack.Screen name="Room" component={ChatRoom} />
      </ChatStack.Group>
    </ChatStack.Navigator>
  );
};

const CallNavigator = () => {
  return (
    <CallStack.Navigator>
      <CallStack.Group
        screenOptions={{ headerShown: false, ...TransitionScreenOptions }}
      >
        <CallStack.Screen name="CallRoom" component={CallRoom} />
        <CallStack.Screen name="PromptCall" component={PromptCall} />
      </CallStack.Group>
    </CallStack.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Group
        screenOptions={{ headerShown: false, ...TransitionScreenOptions }}
      >
        <AuthStack.Screen name="GetStarted" component={GetStarted} />
        <AuthStack.Screen name="StartAccount" component={StartAccount} />
        <AuthStack.Screen name="Phone" component={Phone} />
        <AuthStack.Screen name="Verify" component={Verify} />
        <AuthStack.Screen name="PersonalInfo" component={PersonalInfo} />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

const Navigation = () => {
  const { user } = useContext(UserContext);
  const themeColor = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    }
  };

  return (
    <NavigationContainer ref={navigationRef} theme={themeColor}>
      <AppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={!!user && !!user.id ? 'Main' : 'Auth'}
      >
        <AppStack.Screen name="Auth" component={AuthNavigator} />
        <AppStack.Screen name="Main" component={TabNavigators} />
        <AppStack.Screen name="Chat" component={ChatNavigator} />
        <AppStack.Screen name="Call" component={CallNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
