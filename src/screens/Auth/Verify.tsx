import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { AuthStackParamList, RootParamList } from '../navigation';
import { RouteProp } from '@react-navigation/native';

type VerifyProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<AuthStackParamList, 'Verify'>;
};

export const Verify = ({ route, navigation }: VerifyProps) => {
  return <Text>{route.params.email}</Text>;
};
