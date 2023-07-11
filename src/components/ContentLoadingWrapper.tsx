import React from 'react';
import { Dimensions, Image, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import spinner from './../../assets/png/spinner.gif';

const FULL_WIDTH = Dimensions.get('screen').width;
const FULL_HEIGHT = Dimensions.get('screen').height;

export type ContentLoadingWrapperTypes = {
  children: React.ReactNode;
  isLoading: boolean;
};

export const ContentLoadingWrapper: React.FC<ContentLoadingWrapperTypes> = ({
  children,
  isLoading
}) => {
  return (
    <Container>
      {isLoading && (
        <Loader>
          <Image
            style={{
              width: 120,
              height: 120,
              ...(isLoading && { marginTop: -StatusBar.currentHeight! })
            }}
            source={spinner}
          />
        </Loader>
      )}
      {children}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  width: ${FULL_WIDTH}px;
  height: ${FULL_HEIGHT}px;
`;

const Loader = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  diplay: flex;
  justify-content: center;
  align-items: center;
`;
