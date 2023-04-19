import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';

import { Verify, GetStarted, StartAccount } from './Auth';
import { ChatHome } from './Home';

import { navigationRef } from '../libs/rootNavigation';
import { UserContext } from './Auth/context/UserContext';

export type RootParamList = AuthStackParamList & HomeStackParamList;

export type AuthStackParamList = {
  GetStarted: undefined;
  StartAccount: undefined;
  Verify: {
    email: string;
  };
};

export type HomeStackParamList = {
  ChatHome: undefined;
};

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="ChatHome" component={ChatHome} />
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
        initialRouteName={!!user ? 'Home' : 'GetStarted'}
      >
        <AppStack.Screen name="Auth" component={AuthNavigator} />
        <AppStack.Screen name="Home" component={HomeNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
