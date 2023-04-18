import React from 'react';
import styled from 'styled-components/native';
import Colors from '../types/Colors';

interface TypographyProps {
  title: string;
  size: number;
  color: string;
  style?: any;
  fontFamily?: 'Roboto' | 'Roboto-Medium';
}

export const Typography: React.FC<TypographyProps> = ({
  title,
  size,
  color,
  fontFamily,
  style,
}) => {
  return (
    <StyledText style={style} size={size} color={color} fontFamily={fontFamily}>
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
