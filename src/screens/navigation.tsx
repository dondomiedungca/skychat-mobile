import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Verify, GetStarted, StartAccount } from "./Auth";

const AuthStack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <AuthStack.Navigator initialRouteName="GetStarted">
        <AuthStack.Screen
          name="GetStarted"
          component={GetStarted}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen name="StartAccount" component={StartAccount} />
        <AuthStack.Screen name="Verify" component={Verify} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
