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
import {
  TypeVerification,
  useValidatePhoneOrEmailCode
} from './../../libs/useUser';
import { RouteProp } from '@react-navigation/native';
import { useFetchEffect } from '../../libs/useFetchEffect';
import { Typography } from '../../components/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../context/user.context';

import VerificationVector from './../../../assets/png/verification.jpg';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type PhoneScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<AuthStackParamList, 'Verify'>;
};

export const Verify = ({ navigation, route }: PhoneScreenProps) => {
  const { onboardingData, dispatch } = useContext(OnboardContext);
  const { setUser, user } = useContext(UserContext);
  const type = route?.params?.type;

  const [origin, setOrigin] = useState<string>(onboardingData?.code);
  const [error, setError] = useState<string>();
  const originRef = useRef<any>();
  const { makeRequest, ...handleVerify } = useValidatePhoneOrEmailCode();

  const BackButton = () =>
    navigation.canGoBack() ? (
      <CustomButton
        disabled={handleVerify.isLoading}
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
        <Step></Step>
      </StepIndicatorContainer>
    );
  };

  useLayoutEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      originRef.current?.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!!user && user?.id) {
      navigation.replace('Main', { screen: 'Home' });
    }
  }, [user]);

  const handleValidate = () => {
    dispatch({ property: 'code', value: origin, type: 'BY_KEY' });
    if (
      (type == TypeVerification.PHONE
        ? onboardingData?.formatted_phone_number
        : onboardingData?.user_data.email) &&
      origin?.length === 4
    ) {
      makeRequest({
        type,
        code: origin,
        phone_number: onboardingData?.formatted_phone_number || '',
        email: onboardingData?.user_data?.email
      });
    }
  };

  useFetchEffect(handleVerify, {
    onData: async (data: any) => {
      if (!data?.is_verified) {
        setError('Code is incorrect. Please try again');
      } else {
        setError(undefined);
        if (data?.authTokens?.accessToken && data?.authTokens?.refreshToken) {
          const accessToken = data?.authTokens?.accessToken;
          const refreshToken = data?.authTokens?.refreshToken;
          await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
          await AsyncStorage.setItem('REFRESH_TOKEN', refreshToken);

          const decoded: any = await jwtDecode(accessToken);
          setUser({
            id: decoded.sub,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
            roles: decoded.roles,
            user_meta: decoded?.user_meta,
            created_at: decoded?.createdAt
          });
        } else {
          navigation.push('PersonalInfo', { type });
        }
      }
    }
  });

  return (
    <Container>
      <BackButton />
      <StepIndicator />
      <StyledImage source={VerificationVector} />
      <Pressable onPress={() => originRef.current?.focus()}>
        <Code style={{ marginBottom: 10 }}>
          <StyledTextInput
            value={origin?.[0]}
            editable={false}
            caretHidden
            keyboardType="numeric"
          />
          <StyledTextInput
            value={origin?.[1]}
            editable={false}
            caretHidden
            keyboardType="numeric"
          />
          <StyledTextInput
            value={origin?.[2]}
            editable={false}
            caretHidden
            keyboardType="numeric"
          />
          <StyledTextInput
            value={origin?.[3]}
            editable={false}
            caretHidden
            keyboardType="numeric"
          />
        </Code>
      </Pressable>
      <Typography
        title={'We sent you a verification code. Please enter here'}
        size={12}
        color={Colors.grey_light}
      />
      <CustomButton
        disabled={handleVerify.isLoading || origin?.length !== 4}
        background={
          handleVerify.isLoading || origin?.length !== 4
            ? Colors.grey_light
            : Colors.blue
        }
        textColor={Colors.white}
        style={{
          borderRadius: 5,
          width: WIDTH - 80,
          marginTop: 20,
          marginBottom: 20
        }}
        onPress={() => useMethodWrapper(handleValidate())}
        label={handleVerify?.isLoading ? 'VALIDATING ...' : 'VALIDATE'}
      />
      {!!error && (
        <Typography
          title={error}
          size={12}
          fontFamily="Roboto-Medium"
          color={Colors.error_light}
        />
      )}
      <TextInput
        style={{
          position: 'absolute',
          top: -100,
          left: -100
        }}
        onChangeText={setOrigin}
        autoFocus
        ref={originRef}
        value={origin}
        caretHidden
        keyboardType="numeric"
        maxLength={4}
      />
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

const StyledImage = styled.Image`
  width: 100%;
  height: 200px;
  aspect-ratio: 1.5/1.1;
  margin-bottom: 30px;
`;
