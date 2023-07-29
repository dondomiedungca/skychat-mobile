import React from 'react';
import styled from 'styled-components/native';
import Colors from '../types/Colors';
import { Button } from 'react-native-paper';

const hex2rgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

interface CustomButtonProps {
  mode?: 'outlined' | 'contained';
  textColor?: string;
  label?: string | React.ReactNode;
  onPress: () => void;
  background?: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  style?: any;
  isCircle?: boolean;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  mode,
  textColor,
  label,
  onPress,
  background,
  iconRight,
  iconLeft,
  style,
  isCircle,
  disabled
}) => {
  const { r, g, b } = hex2rgb(background || Colors.primary);

  return (
    <ButtonContainer
      style={{
        borderRadius: isCircle ? 100 : 5,
        ...style
      }}
    >
      <StyledPressable
        disabled={disabled}
        isCircle={isCircle}
        style={{ borderRadius: isCircle ? 100 : 5 }}
        mode={mode}
        background={background}
        onPress={onPress}
        android_ripple={{
          color:
            mode === 'outlined'
              ? `rgba(${r}, ${g}, ${b}, .5)`
              : `rgba(0, 0, 0, .5)`,
          borderless: false
        }}
      >
        <TextContainer>
          <StyledText textColor={textColor}>{iconLeft}</StyledText>
          <StyledText textColor={textColor}>{label}</StyledText>
          <StyledText textColor={textColor}>{iconRight}</StyledText>
        </TextContainer>
      </StyledPressable>
    </ButtonContainer>
  );
};

type CustomButtonV2Props = {
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  width?: string;
  height?: string;
  children: any;
  icon?: (() => React.ReactNode) | string;
  textColor?: string;
  style?: any;
  backgroundColor?: string;
  disabled?: boolean;
  onPress?: () => void;
  [x: string]: any;
};

export const CustomButtonV2: React.FC<CustomButtonV2Props> = ({
  mode = 'elevated',
  width,
  height,
  children,
  icon,
  textColor,
  style,
  backgroundColor,
  onPress,
  ...rest
}) => {
  return (
    <StyledCustomButtonV2
      mode={mode}
      width={width}
      height={height}
      icon={icon}
      textColor={textColor}
      compact
      style={style}
      buttonColor={backgroundColor}
      onPress={onPress}
      {...rest}
    >
      {children}
    </StyledCustomButtonV2>
  );
};

const StyledPressable = styled.Pressable<{
  background?: string;
  mode?: 'outlined' | 'contained';
  isCircle?: boolean;
}>`
    background: ${({ background }) =>
      background ? background : Colors.primary}
    padding: ${({ isCircle }) => (isCircle ? '8px' : '8px 12px')};
    ${({ mode, background }) =>
      mode === 'outlined' && {
        borderWidth: 1,
        borderColor: background ? background : Colors.primary,
        background: 'transparent'
      }}
`;

const StyledText = styled.Text<{ textColor?: string }>`
  color: ${({ textColor }) => textColor || Colors.white};
  font-family: Roboto-Medium;
  font-size: 12px;
`;

const TextContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonContainer = styled.View`
  overflow: hidden;
`;

const StyledCustomButtonV2 = styled(Button)<{
  width?: string;
  height?: string;
}>`
  width: ${({ width }) => width || '200px'};
  height: ${({ height }) => height || 'auto'};
`;
