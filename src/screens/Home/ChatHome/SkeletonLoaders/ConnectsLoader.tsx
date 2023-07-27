import React from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

import styled from 'styled-components/native';
import Colors from '../../../../types/Colors';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const CONNECTS_HEIGHT = HEIGHT * 0.3;

const ConnectsLoader = () => {
  return (
    <Container>
      <ContentLoader
        foregroundColor={Colors.white_semi_dark}
        backgroundColor={Colors.white_light_dark}
        speed={0.8}
      >
        <Rect
          x="0"
          y="0"
          rx="10"
          ry="10"
          width={WIDTH / 2 - 10}
          height={CONNECTS_HEIGHT / 3}
        ></Rect>
        <Rect
          x="0"
          y={CONNECTS_HEIGHT / 3 + 8}
          rx="10"
          ry="10"
          width={WIDTH / 2 - 10}
          height={CONNECTS_HEIGHT / 3}
        />
        <Rect
          x={WIDTH / 2}
          y="0"
          rx="10"
          ry="10"
          width={WIDTH / 2 - 10}
          height={CONNECTS_HEIGHT / 3}
        ></Rect>
        <Rect
          x={WIDTH / 2}
          y={CONNECTS_HEIGHT / 3 + 8}
          rx="10"
          ry="10"
          width={WIDTH / 2 - 10}
          height={CONNECTS_HEIGHT / 3}
        />
      </ContentLoader>
    </Container>
  );
};

export default ConnectsLoader;

const Container = styled.View`
  width: ${WIDTH}px;
  height: ${(CONNECTS_HEIGHT / 3) * 2 + 21}px;
`;
