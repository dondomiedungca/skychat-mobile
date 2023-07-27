import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import Colors from '../../../../types/Colors';
import styled from 'styled-components/native';

const WIDTH = Dimensions.get('window').width;

const RecentLoader = memo(() => {
  return (
    <Container>
      {[...Array(10)].map((_, i) => (
        <LoaderContainer key={i}>
          <ContentLoader
            foregroundColor={Colors.white_semi_dark}
            backgroundColor={Colors.white_light_dark}
            speed={0.8}
          >
            <Circle cx="22" cy="30" r="20" />
            <Rect x="52" y="15" rx="4" ry="4" width="150" height="14" />
            <Rect x="52" y="35" rx="3" ry="3" width="200" height="11" />
          </ContentLoader>
        </LoaderContainer>
      ))}
    </Container>
  );
});

export default RecentLoader;

const Container = styled.ScrollView`
  margin-top: 10px;
  width: ${WIDTH}px;
`;

const LoaderContainer = styled.View`
  padding-top: 7px;
  height: 70px;
  width: ${WIDTH}px;
`;
