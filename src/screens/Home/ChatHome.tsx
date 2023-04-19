import React from 'react';
import styled from 'styled-components/native';

// components
import MainContainer from '../../components/MainContainer';
import { HomeHeader } from './partials/HomeHeader';

// types and constants
import Colors from '../../types/Colors';

export const ChatHome = () => {
  return (
    <MainContainer header={<HomeHeader />}>
      <Container></Container>
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
