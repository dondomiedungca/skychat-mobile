import { AntDesign } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { CustomButton } from '../../components/Buttons';

import Colors from '../../types/Colors';
import { AuthStackParamList, RootParamList } from '../navigation';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type CreditsScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<AuthStackParamList, 'Credits'>;
};

const Credits = ({ navigation }: CreditsScreenProps) => {
  const BackButton = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10, position: 'absolute', top: 0, left: 0 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  return (
    <Container>
      <BackButton />
    </Container>
  );
};

export default Credits;

const Container = styled.View`
  flex: 1;
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  background: ${Colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`;
