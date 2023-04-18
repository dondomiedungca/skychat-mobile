import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

interface Props {
  header?: React.ReactNode;
  children: React.ReactNode;
}

const MainContainer: React.FC<Props> = ({ children, header }) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View
        style={{
          overflow: 'hidden',
          backgroundColor: 'white',
          marginTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {header && <HeaderStyled>{header}</HeaderStyled>}
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MainContainer;

const HeaderStyled = styled.View`
  position: absolute;
  z-index: 10;
  top: 0;
`;
