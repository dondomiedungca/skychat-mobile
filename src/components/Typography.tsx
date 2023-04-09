import React from "react";
import styled from "styled-components/native";
import Colors from "../types/Colors";

interface TypographyProps {
  title: string;
  size: number;
  color: string;
  style?: any;
}

export const Typography: React.FC<TypographyProps> = ({
  title,
  size,
  color,
  style,
}) => {
  return (
    <StyledText size={size} color={color} style={style}>
      {title}
    </StyledText>
  );
};

const StyledText = styled.Text<Pick<TypographyProps, "size" | "color">>`
  font-family: Roboto;
  font-size: ${({ size }) => size || 14}px;
  color: ${({ color }) => color || Colors.white};
`;
