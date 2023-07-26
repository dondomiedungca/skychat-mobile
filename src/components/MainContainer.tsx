import React from 'react';
import {
  Keyboard,
  Dimensions,
  StatusBar,
  ViewStyle,
  StyleProp
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Colors from '../types/Colors';
import { ContentLoadingWrapper } from './ContentLoadingWrapper';

interface Props {
  header?: React.ReactNode;
  children: React.ReactNode;
  hiddenStatusBar?: boolean;
  isLoading?: boolean;
  disableTouchableFeedback?: boolean;
  withBottomTabSpace?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height - 100;

const MainContainer: React.FC<Props> = ({
  children,
  header,
  isLoading = false,
  hiddenStatusBar = false,
  disableTouchableFeedback = false,
  withBottomTabSpace = false,
  style
}) => {
  const insets = useSafeAreaInsets();

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      {!disableTouchableFeedback && (
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          accessible={false}
        >
          <StyledContainer
            withBottomTabSpace={withBottomTabSpace}
            style={style}
          >
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={isLoading ? 'rgba(0,0,0,0.7)' : 'white'}
              hidden={hiddenStatusBar}
            />
            {header && <HeaderStyled>{header}</HeaderStyled>}
            {children}
          </StyledContainer>
        </TouchableWithoutFeedback>
      )}
      {disableTouchableFeedback && (
        <StyledContainer withBottomTabSpace={withBottomTabSpace} style={style}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={isLoading ? 'rgba(0,0,0,0.7)' : 'white'}
            hidden={hiddenStatusBar}
          />
          {header && <HeaderStyled>{header}</HeaderStyled>}
          {children}
        </StyledContainer>
      )}
    </ContentLoadingWrapper>
  );
};

export default MainContainer;

const HeaderStyled = styled.View`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
`;

const StyledContainer = styled.View<{
  withBottomTabSpace?: boolean;
  style?: any;
}>`
  width: ${FULL_WIDTH}px;
  height: 100%;
  background: ${Colors.white};
  ${({ withBottomTabSpace }) =>
    withBottomTabSpace ? 'padding-bottom: 70px;' : ''}
`;
