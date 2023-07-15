import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import TextInput from '../../../components/TextInput';
import { Typography } from '../../../components/Typography';

import Colors from '../../../types/Colors';

const FULL_WIDTH = Dimensions.get('screen').width;

export const HomeHeader = ({
  onPressSearch
}: {
  onPressSearch: () => void;
}) => {
  const [search, setSearch] = useState<string>();
  return (
    <StyledContainer>
      <Typography
        style={{}}
        title="Chats"
        color={Colors.grey}
        fontFamily="Roboto-Medium"
        size={20}
      />
      <TextInput
        editable={false}
        color={Colors.primary}
        style={{ marginTop: 1, borderRadius: 15, flexGrow: 1 }}
        width="60%"
        height="35px"
        label="Search"
        value={search}
        onChange={setSearch}
        onPress={onPressSearch}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  width: ${FULL_WIDTH}px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px 0 10px;
  gap: 20px;
  background: ${Colors.white};
`;
