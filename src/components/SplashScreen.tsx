import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

import Colors from './../types/Colors';
import Logo from './../../assets/png/logo-no-background.png';

const SplashScreen = () => {
  return (
    <Container>
      <LogoContainer source={Logo} />
      <ActivityIndicator color={Colors.secondary} size={30} animating />
    </Container>
  );
};

const Container = styled.View`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.white};
`;

const LogoContainer = styled.Image`
  width: 200px;
  height: 200px;
  resize-mode: contain;
`;

export default SplashScreen;
