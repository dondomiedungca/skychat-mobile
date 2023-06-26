import React from 'react';
import styled from 'styled-components/native';
import Colors from '../types/Colors';

interface TypographyProps {
  title: string;
  size: number;
  color: string;
  style?: any;
  fontFamily?:
    | 'Roboto'
    | 'Roboto-Medium'
    | 'Roboto-Bold'
    | 'Roboto-Thin'
    | 'Roboto-Light';
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  title,
  size,
  color,
  fontFamily,
  style,
  numberOfLines = 2
}) => {
  return (
    <StyledText
      style={style}
      size={size}
      color={color}
      fontFamily={fontFamily}
      numberOfLines={numberOfLines}
    >
      {title}
    </StyledText>
  );
};

const StyledText = styled.Text<
  Pick<TypographyProps, 'size' | 'color' | 'fontFamily'>
>`
  font-family: ${({ fontFamily }) => fontFamily || 'Roboto'};
  font-size: ${({ size }) => size || 14}px;
  color: ${({ color }) => color || Colors.white};
`;
