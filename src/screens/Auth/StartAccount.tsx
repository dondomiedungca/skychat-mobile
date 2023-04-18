import React, { useState } from 'react';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, ScrollView, Dimensions } from 'react-native';

// components
import MainContainer from '../../components/MainContainer';
import { CustomButton, CustomButtonV2 } from '../../components/Buttons';
import { Typography } from '../../components/Typography';

// assets
import Logo from './../../../assets/png/logo-no-background.png';
import Phone from './../../../assets/icons/phone.png';
import Google from './../../../assets/icons/google.png';
import Colors from '../../types/Colors';
import { AuthStackParamList } from '../navigation';
import TextInput from '../../components/TextInput';
import useMethodWrapper from '../../libs/useWrapper';

// hooks
import { GoogleUser, useGoogleAuth } from './../../libs/useGoogle';

type HangoutScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'StartAccount'>;
};

export const StartAccount: React.FC<HangoutScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const { promptAsync } = useGoogleAuth();

  const Header = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  return (
    <MainContainer header={<Header />}>
      <Container>
        <LogoImage source={Logo} />
        <Typography
          style={{ marginTop: 35 }}
          title="Get started with your account"
          color={Colors.secondary}
          fontFamily="Roboto-Medium"
          size={18}
        />
        <SocialContainer style={{ marginTop: 20 }}>
          <CustomButtonV2
            width="100%"
            icon={() => (
              <Image
                style={{ height: 25, resizeMode: 'contain' }}
                source={Google}
              />
            )}
            textColor={Colors.secondary}
            style={{ borderRadius: 5 }}
            backgroundColor={Colors.white}
            mode="elevated"
            onPress={() => useMethodWrapper(promptAsync())}
          >
            Continue with Google
          </CustomButtonV2>
          <CustomButtonV2
            width="100%"
            icon={() => (
              <Image
                style={{ height: 25, resizeMode: 'contain' }}
                source={Phone}
              />
            )}
            textColor={Colors.secondary}
            style={{ borderRadius: 5, marginTop: 20 }}
            backgroundColor={Colors.white}
            mode="elevated"
            onPress={() => useMethodWrapper(console.log('Pressed'))}
          >
            Continue with Phone
          </CustomButtonV2>
        </SocialContainer>
        <CustomAccountContainer>
          <Typography
            style={{ marginTop: 25 }}
            title="OR"
            color={Colors.secondary}
            fontFamily="Roboto-Medium"
            size={15}
          />
          <TextInput
            color={Colors.primary}
            style={{ marginTop: 1 }}
            width="100%"
            label="Email"
            value={email}
            onChange={setEmail}
          />
          <CustomButtonV2
            width="100%"
            textColor={Colors.white}
            style={{ borderRadius: 5, marginTop: 20 }}
            backgroundColor={Colors.primary}
            mode="contained"
            onPress={() => console.log('Pressed')}
          >
            SUBMIT
          </CustomButtonV2>
        </CustomAccountContainer>
      </Container>
    </MainContainer>
  );
};

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: ${Colors.white};
`;

const LogoImage = styled.Image`
  height: 120px;
  resize-mode: contain;
`;

const SocialContainer = styled.View`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomAccountContainer = styled.View`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
