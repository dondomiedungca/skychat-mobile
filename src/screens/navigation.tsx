import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Verify, GetStarted, StartAccount } from "./Auth";
import { navigationRef } from "../libs/rootNavigation";
import { TransitionPresets } from "@react-navigation/stack";

export type RootParamList = AuthStackParamList;

export type AuthStackParamList = {
  GetStarted: undefined;
  StartAccount: undefined;
  Verify: {
    email: string;
  };
};

const AuthStack = createStackNavigator();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthStack.Navigator initialRouteName="GetStarted">
        <AuthStack.Group
          screenOptions={{ headerShown: false, ...TransitionScreenOptions }}
        >
          <AuthStack.Screen name="GetStarted" component={GetStarted} />
          <AuthStack.Screen name="StartAccount" component={StartAccount} />
          <AuthStack.Screen name="Verify" component={Verify} />
        </AuthStack.Group>
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
