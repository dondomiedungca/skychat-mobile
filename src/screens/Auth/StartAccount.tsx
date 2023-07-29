import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image } from 'react-native';

// components
import MainContainer from '../../components/MainContainer';
import { CustomButton, CustomButtonV2 } from '../../components/Buttons';
import { Typography } from '../../components/Typography';

// assets
import Logo from './../../../assets/png/logo-no-background.png';
import Phone from './../../../assets/icons/phone.png';
import Google from './../../../assets/icons/google.png';
import Colors from '../../types/Colors';
import { RootParamList } from '../navigation';
import TextInput from '../../components/TextInput';
import useMethodWrapper from '../../libs/useWrapper';

// hooks and context
import { useGoogleAuth } from './../../libs/useGoogle';
import { UserContext } from '../../context/user.context';

type StartAccountScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
};

export const StartAccount: React.FC<StartAccountScreenProps> = ({
  navigation
}) => {
  const [email, setEmail] = useState<string>('');
  const { user } = useContext(UserContext);
  const { promptAsync, ...handleGoogleAuth } = useGoogleAuth();

  const Header = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  useEffect(() => {
    if (!!user && user?.id) {
      navigation.replace('Main', { screen: 'Home' });
    }
  }, [user]);

  return (
    <MainContainer header={<Header />} isLoading={handleGoogleAuth.isLoading}>
      <Container>
        <LogoImage source={Logo} />
        <Typography
          style={{ marginTop: 35 }}
          title="Get started with your account"
          color={Colors.grey}
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
            textColor={Colors.grey}
            style={{ borderRadius: 5 }}
            backgroundColor={Colors.white_light_dark}
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
            textColor={Colors.grey}
            style={{ borderRadius: 5, marginTop: 20 }}
            backgroundColor={Colors.white_light_dark}
            mode="elevated"
            onPress={() => useMethodWrapper(navigation.push('Phone'))}
          >
            Continue with Phone
          </CustomButtonV2>
        </SocialContainer>
        <CustomAccountContainer>
          <Typography
            style={{ marginTop: 10 }}
            title="OR"
            color={Colors.grey}
            fontFamily="Roboto-Medium"
            size={15}
          />
          <TextInput
            color={Colors.primary}
            style={{ marginTop: 5 }}
            width="100%"
            height="45px"
            label="Email"
            value={email}
            onChange={setEmail}
            editable={true}
          />
          <CustomButtonV2
            width="100%"
            textColor={Colors.white}
            style={{ borderRadius: 5, marginTop: 20 }}
            backgroundColor={Colors.primary}
            mode="contained"
            onPress={() => {}}
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
