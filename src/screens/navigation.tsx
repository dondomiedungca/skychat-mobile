import React, { useContext } from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// screens
import { Verify, GetStarted, StartAccount } from './Auth';
import { ChatHome } from './Home';
import { Recent } from './Home/Recent';
import { Call } from './Home/Call';
import { Account } from './Home/Account';
import Room from './Home/ChatHome/Room';

// components
import { navigationRef } from '../libs/rootNavigation';
import { UserContext } from './Auth/context/UserContext';
import AccountDrawer from './Home/partials/AccountDrawer';
import BottomTabBar from '../components/BottomTabBar';

// types, constants and utils
import { User } from '../types/User';
import RoomHeader from '../components/RoomHeader';
import ChatRoom from './Home/ChatHome/Room';

export type RootParamList = AppStackParamList &
  AuthStackParamList &
  HomeStackTabParamList &
  DrawerStackParamList &
  ChatRoomStackParamList;

export type AppStackParamList = {
  Home: NavigatorScreenParams<HomeStackTabParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  ChatRoom: NavigatorScreenParams<ChatRoomStackParamList>;
};

export type DrawerStackParamList = {
  Account: undefined;
};

export type AuthStackParamList = {
  GetStarted: undefined;
  StartAccount: undefined;
  Verify: {
    email: string;
  };
};

export type ChatRoomStackParamList = {
  Room: {
    user: User;
  };
};

export type HomeStackTabParamList = {
  ChatHome: NavigatorScreenParams<DrawerStackParamList>;
  Recent: undefined;
  Call: undefined;
  Account: undefined;
};

const AppStack = createStackNavigator<AppStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const HomeStackTab = createBottomTabNavigator<HomeStackTabParamList>();
const ChatRoomstack = createStackNavigator<ChatRoomStackParamList>();
const Drawer = createDrawerNavigator<DrawerStackParamList>();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS
};

const ChatHomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator defaultStatus="closed" drawerContent={AccountDrawer}>
      <Drawer.Screen
        options={{ headerShown: false, swipeEnabled: false }}
        name="Account"
        component={ChatHome}
      />
    </Drawer.Navigator>
  );
};

const TabNavigators = () => {
  return (
    <HomeStackTab.Navigator
      tabBar={(props: any) => <BottomTabBar {...props} />}
      initialRouteName="ChatHome"
      screenOptions={{ headerShown: false }}
    >
      <HomeStackTab.Screen
        name="ChatHome"
        component={ChatHomeDrawerNavigator}
      />
      <HomeStackTab.Screen name="Recent" component={Recent} />
      <HomeStackTab.Screen name="Call" component={Call} />
      <HomeStackTab.Screen name="Account" component={Account} />
    </HomeStackTab.Navigator>
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
        <AuthStack.Screen name="Verify" component={Verify} />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

const ChatRoomNavigator = () => {
  return (
    <ChatRoomstack.Navigator>
      <ChatRoomstack.Group
        screenOptions={{ headerShown: false, ...TransitionScreenOptions }}
      >
        <ChatRoomstack.Screen name="Room" component={Room} />
      </ChatRoomstack.Group>
    </ChatRoomstack.Navigator>
  );
};

const Navigation = () => {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={!!user && !!user.id ? 'Home' : 'Auth'}
      >
        <AppStack.Screen name="Auth" component={AuthNavigator} />
        <AppStack.Screen name="Home" component={TabNavigators} />
        <AppStack.Screen name="ChatRoom" component={ChatRoomNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
