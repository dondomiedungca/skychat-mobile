import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// components
import MainContainer from '../../components/MainContainer';
import { CustomButton } from '../../components/Buttons';
import { Typography } from '../../components/Typography';

// assets
import Logo from './../../../assets/png/logo-no-background.png';
import Colors from '../../types/Colors';

// hooks and refs
import { navigate } from '../../libs/rootNavigation';
import { useGoogleAuth } from '../../libs/useGoogle';
import { UserContext } from '../../context/user.context';
import { RootParamList } from '../navigation';
import { useFetchEffect } from '../../libs/useFetchEffect';
import useMethodWrapper from '../../libs/useWrapper';

type HangoutScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
};

export const GetStarted: React.FC<HangoutScreenProps> = ({ navigation }) => {
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

  useFetchEffect(handleGoogleAuth, {
    onData: (data) => {
      if (!!data && !handleGoogleAuth.isLoading && !!user) {
        navigation.replace('Main', { screen: 'Home' });
      }
    },
    dependencies: [user]
  });

  return (
    <MainContainer>
      <Container>
        <LogoImage source={Logo} />
        <CustomButton
          style={{ marginTop: 30, width: 170 }}
          label="GET STARTED"
          onPress={() => navigate('StartAccount')}
          textColor={Colors.white}
          iconRight={
            <AntDesign name="arrowright" size={20} color={Colors.white} />
          }
        />
        <CustomButton
          mode="outlined"
          style={{ marginTop: 10, width: 170, marginBottom: 10 }}
          label="CREDIT SECTION"
          onPress={() => {
            useMethodWrapper(navigate('Credits'));
          }}
          textColor={Colors.primary}
        />
        <Typography
          style={{ marginTop: 40 }}
          title="POWERED BY DONDOMAIN"
          color={Colors.grey_light}
          size={12}
        />
        <Typography
          title={`Copyright © ${new Date().getFullYear()} All Rights Reserved`}
          color={Colors.grey_light}
          size={10}
        />
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
  height: 170px;
  resize-mode: contain;
`;
