import React, { useState } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../types/Colors';

type CustomTextInputProps = {
  color?: string;
  width?: string;
  height?: string;
  mode?: 'flat' | 'outlined';
  style?: any;
  placeholder?: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  [x: string]: any;
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  color = Colors.secondary,
  width,
  height,
  mode = 'outlined',
  style,
  placeholder,
  label,
  onChange,
  value,
  ...rest
}) => {
  const [isActive, setActive] = useState<boolean>(false);

  return (
    <>
      <StyledTextInput
        onFocus={() => setActive(!isActive)}
        onBlur={() => setActive(!isActive)}
        active={isActive}
        color={color}
        placeholder={label}
        width={width}
        height={height}
        style={style}
        value={value}
        onChangeText={onChange}
        {...rest}
      />
    </>
  );
};

export default CustomTextInput;

const StyledTextInput = styled(TextInput)<{
  color?: string;
  width?: string;
  height?: string;
  active?: boolean;
}>`
  border: ${({ color, active }) => `${active ? '2px' : '1px'} solid ${color}`}
  background: transparent;
  padding: 5px 18px;
  border-radius: 5px;
  width: ${({ width }) => width || '200px'};
  height: ${({ height }) => height || '50px'};
  color: ${Colors.secondary};
`;
