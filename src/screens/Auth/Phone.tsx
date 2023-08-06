import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useState } from 'react';
import { Dimensions, Image, Linking, Text } from 'react-native';
import styled from 'styled-components/native';
import { CustomButton } from '../../components/Buttons';
import Colors from '../../types/Colors';
import { RootParamList } from '../navigation';
import useMethodWrapper from '../../libs/useWrapper';
import { OnboardContext } from '../../context/onboarding-context';
import { TypeVerification, useLoginWithPhone } from './../../libs/useUser';
import { useFetchEffect } from '../../libs/useFetchEffect';
import PhoneContactVector from './../../../assets/png/phone_number_vector.jpg';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type PhoneScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
};

const Phone = ({ navigation }: PhoneScreenProps) => {
  const { onboardingData, dispatch } = useContext(OnboardContext);
  const [country, setCountry] = useState<any>('PH');
  const { makeRequest, ...handleLoginWithPhone } = useLoginWithPhone();

  const [value, setValue] = useState<any>(onboardingData?.phone_number);
  const [formattedValue, setFormattedValue] = useState<any>(
    onboardingData?.formatted_phone_number
  );

  useFetchEffect(handleLoginWithPhone, {
    onSuccess: (success) => {
      if (success) {
        navigation.push('Verify', { type: TypeVerification.PHONE });
      }
    }
  });

  const BackButton = () =>
    navigation.canGoBack() ? (
      <CustomButton
        disabled={handleLoginWithPhone.isLoading}
        style={{ padding: 10, position: 'absolute', top: 0, left: 0 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  const StepIndicator = () => {
    return (
      <StepIndicatorContainer>
        <Step active></Step>
        <Step></Step>
        <Step></Step>
      </StepIndicatorContainer>
    );
  };

  const onSubmitPhone = useCallback(async () => {
    if (value && formattedValue) {
      dispatch({ property: 'phone_number', value, type: 'BY_KEY' });
      dispatch({
        property: 'formatted_phone_number',
        value: formattedValue,
        type: 'BY_KEY'
      });
    }
    if (
      formattedValue?.length ||
      onboardingData?.formatted_phone_number?.length
    ) {
      makeRequest({
        phone_number: formattedValue || onboardingData?.formatted_phone_number
      });
    }
  }, [value, formattedValue, onboardingData]);

  return (
    <Container>
      <BackButton />
      <StepIndicator />
      <StyledImage source={PhoneContactVector} />

      <CustomButton
        disabled={handleLoginWithPhone.isLoading}
        background={
          handleLoginWithPhone.isLoading ? Colors.grey_light : Colors.blue
        }
        textColor={Colors.white}
        style={{
          borderRadius: 5,
          width: WIDTH - 80,
          marginTop: 30
        }}
        onPress={() => useMethodWrapper(onSubmitPhone)}
        label={handleLoginWithPhone?.isLoading ? 'SUBMITTING ...' : 'SUBMIT'}
      />
    </Container>
  );
};

export default Phone;

const Container = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  background: ${Colors.white};
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
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

const StyledImage = styled(Image)`
  width: 100%;
  height: 200px;
  aspect-ratio: 1.5/1.1;
  margin-bottom: 30px;
`;
