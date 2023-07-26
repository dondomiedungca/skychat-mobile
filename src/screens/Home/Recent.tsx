import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, Button } from 'react-native';

// components
import MainContainer from '../../components/MainContainer';
import { Typography } from '../../components/Typography';
import { HomeHeader } from './partials/HomeHeader';

// types and constants
import Colors from '../../types/Colors';
import { navigate } from '../../libs/rootNavigation';

const FULL_WIDTH = Dimensions.get('window').height;

export const ListPeople = () => {
  return <></>;
};

export const Recent = () => {
  return (
    <MainContainer header={<HomeHeader onPressSearch={() => {}} />}>
      <Container>
        <ConnectSection>
          <Typography
            title="Recent"
            size={15}
            color={Colors.grey_light}
            fontFamily="Roboto-Medium"
          />
          <ListPeople />
        </ConnectSection>
      </Container>
    </MainContainer>
  );
};

const Container = styled.View`
  height: 100%;
  width: ${FULL_WIDTH}px;
  background: ${Colors.white};
  padding: 0 10px 0 10px;
`;

const ConnectSection = styled.View`
  margin-top: 60px;
`;
