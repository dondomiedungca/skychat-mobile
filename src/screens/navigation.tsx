import React, { useContext } from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Verify, GetStarted, StartAccount } from './Auth';
import { ChatHome } from './Home';

import { navigationRef } from '../libs/rootNavigation';
import { UserContext } from './Auth/context/UserContext';
import AccountDrawer from './Home/partials/AccountDrawer';

export type RootParamList = AppStackParamList &
  AuthStackParamList &
  HomeStackParamList &
  DrawerStackParamList;

export type AppStackParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
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

export type HomeStackParamList = {
  ChatHome: NavigatorScreenParams<DrawerStackParamList>;
};

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

const ChatHomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator defaultStatus="closed" drawerContent={AccountDrawer}>
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Account"
        component={ChatHome}
      />
    </Drawer.Navigator>
  );
};

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="ChatHome"
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen name="ChatHome" component={ChatHomeDrawerNavigator} />
    </HomeStack.Navigator>
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

const Navigation = () => {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={!!user && !!user.id ? 'Home' : 'Auth'}
      >
        <AppStack.Screen name="Auth" component={AuthNavigator} />
        <AppStack.Screen name="Home" component={HomeNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
