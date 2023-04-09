import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import Colors from "../types/Colors";

const hex2rgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

interface CustomButtonProps {
  mode?: "outlined" | "contained";
  textColor?: string;
  label: string;
  onPress: () => void;
  background?: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  style?: any;
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
}) => {
  const { r, g, b } = hex2rgb(background || Colors.primary);

  return (
    <View
      style={{
        borderRadius: 5,
        overflow: "hidden",
        ...style,
      }}
    >
      <StyledPressable
        mode={mode}
        background={background}
        onPress={onPress}
        android_ripple={{
          color:
            mode === "outlined"
              ? `rgba(${r}, ${g}, ${b}, .5)`
              : `rgba(0, 0, 0, .5)`,
          borderless: false,
        }}
      >
        <TextContainer>
          <StyledText textColor={textColor}>{iconLeft}</StyledText>
          <StyledText textColor={textColor}>{label}</StyledText>
          <StyledText textColor={textColor}>{iconRight}</StyledText>
        </TextContainer>
      </StyledPressable>
    </View>
  );
};

const StyledPressable = styled.Pressable<{
  background?: string;
  mode?: "outlined" | "contained";
}>`
    background: ${({ background }) =>
      background ? background : Colors.primary}
    padding: 8px 12px;
    border-radius: 5px;
    ${({ mode, background }) =>
      mode === "outlined" && {
        borderWidth: 1,
        borderColor: background ? background : Colors.primary,
        background: "transparent",
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
