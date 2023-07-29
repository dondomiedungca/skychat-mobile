import React, { memo } from 'react';
import ContentLoader, { Circle, Code, Rect } from 'react-content-loader/native';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../../../types/Colors';

const HEIGHT = Dimensions.get('window').height;

const RoomLoader = memo(() => {
  return (
    <Container>
      <ContentLoader
        foregroundColor={Colors.white_semi_dark}
        backgroundColor={Colors.white_light_dark}
        speed={0.8}
      >
        <Circle cx="15" cy="135" r="15" />
        <Rect x="40" y="110" rx="10" ry="10" width={150} height={50}></Rect>
        {[...Array(100)].map((_, i) => (
          <Rect
            key={i}
            x="40"
            y={110 + (i + 1) * 60}
            rx="10"
            ry="10"
            width={150}
            height={50}
          ></Rect>
        ))}
      </ContentLoader>
    </Container>
  );
});

export default RoomLoader;

const Container = styled.View`
  padding-top: 60px;
  width: 100%;
  height: ${HEIGHT}px;
`;
