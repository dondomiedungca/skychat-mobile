import React, { useContext } from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Verify, GetStarted, StartAccount } from './Auth';
import { ChatHome } from './Home';

import { navigationRef } from '../libs/rootNavigation';
import { UserContext } from './Auth/context/UserContext';
import AccountDrawer from './Home/partials/AccountDrawer';
import BottomTabBar from '../components/BottomTabBar';
import { Recent } from './Home/Recent';
import { Call } from './Home/Call';
import { Account } from './Home/Account';

export type RootParamList = AppStackParamList &
  AuthStackParamList &
  HomeStackTabParamList &
  DrawerStackParamList;

export type AppStackParamList = {
  Home: NavigatorScreenParams<HomeStackTabParamList>;
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

export type HomeStackTabParamList = {
  ChatHome: NavigatorScreenParams<DrawerStackParamList>;
  Recent: undefined;
  Call: undefined;
  Account: undefined;
};

const AppStack = createStackNavigator<AppStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const HomeStackTab = createBottomTabNavigator<HomeStackTabParamList>();
const Drawer = createDrawerNavigator<DrawerStackParamList>();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS
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

const TabNavigators = () => {
  return (
    <HomeStackTab.Navigator
      tabBar={(props: any) => <BottomTabBar {...props} />}
      initialRouteName="ChatHome"
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
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
