import React, { useState } from 'react';
import { TextInput, TouchableNativeFeedback, View } from 'react-native';
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
  onPress?: (event: any) => void;
  editable?: boolean;
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
  onPress,
  value,
  editable = true,
  ...rest
}) => {
  const [isActive, setActive] = useState<boolean>(false);

  return (
    <Container style={style} width={width} height={height}>
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
      {!!!editable && (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('#d6e6ff', true)}
        >
          <ExtraNav />
        </TouchableNativeFeedback>
      )}
    </Container>
  );
};

export default CustomTextInput;

const ExtraNav = styled.View`
  border-radius: 10px;
  height: 100%;
  width: 100%;
`;

const Container = styled.View<{
  width?: string;
  height?: string;
}>`
  position: relative;
  width: ${({ width }) => width || '200px'};
  height: ${({ height }) => height || '50px'};
`;

const StyledTextInput = styled(TextInput)<{
  color?: string;
  width?: string;
  height?: string;
  active?: boolean;
}>`
  position: absolute;
  border: ${({ color, active }) => `${active ? '2px' : '1px'} solid ${color}`}
  background: transparent;
  padding: 5px 18px;
  border-radius: 5px;
  color: ${Colors.grey};
  height: 100%;
  width: 100%;
`;
