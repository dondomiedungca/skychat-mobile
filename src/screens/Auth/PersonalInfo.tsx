import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { Dimensions, Keyboard, Pressable, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { CustomButton } from '../../components/Buttons';
import Colors from '../../types/Colors';
import { AuthStackParamList, RootParamList } from '../navigation';
import useMethodWrapper from '../../libs/useWrapper';
import { OnboardContext } from '../../context/onboarding-context';
import { useValidatePhoneOrEmailCode } from './../../libs/useUser';
import { RouteProp } from '@react-navigation/native';
import { useFetchEffect } from '../../libs/useFetchEffect';
import { Typography } from '../../components/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../context/user.context';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type PhoneScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<AuthStackParamList, 'PersonalInfo'>;
};

export const PersonalInfo = ({ navigation, route }: PhoneScreenProps) => {
  const { onboardingData, dispatch } = useContext(OnboardContext);

  const BackButton = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10, position: 'absolute', top: 0, left: 0 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  const StepIndicator = () => {
    return (
      <StepIndicatorContainer>
        <Step active></Step>
        <Step active></Step>
        <Step active></Step>
      </StepIndicatorContainer>
    );
  };

  return (
    <Container>
      <BackButton />
      <StepIndicator />
    </Container>
  );
};

const Container = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  background: ${Colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const Code = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const StepIndicatorContainer = styled.View`
  width: 200px;
  height: 50px;
  position: absolute;
  right: 10px;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
`;

const Step = styled.View<{ active?: boolean }>`
  border-radius: 3px;
  background: ${({ active }) =>
    active ? Colors.primary : Colors.white_semi_dark};
  width: 30px;
  height: 5px;
`;

const StyledTextInput = styled.TextInput`
  border-radius: 5px;
  padding-left: 15px;
  padding-right: 15px;
  width: 40px;
  height: 40px;
  border: 2px solid ${Colors.primary};
  color: ${Colors.grey};
`;
