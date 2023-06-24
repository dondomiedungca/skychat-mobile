import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Avatar as ModuleAvatar } from 'react-native-paper';

import TextInput from '../../../components/TextInput';
import { Typography } from '../../../components/Typography';

import Colors from '../../../types/Colors';
import { UserContext } from '../../Auth/context/UserContext';
import { useDrawer } from '../../../libs/rootNavigation';

const FULL_WIDTH = Dimensions.get('screen').width;

export const Avatar = () => {
  const { user } = useContext(UserContext);
  const drawer = useDrawer();

  return !!user?.user_meta ? (
    <TouchableOpacity onPress={() => drawer.openDrawer()}>
      <ModuleAvatar.Image
        size={35}
        source={{ uri: user.user_meta?.profile_photo }}
      />
    </TouchableOpacity>
  ) : (
    <ModuleAvatar.Text size={35} label="XD" />
  );
};

export const HomeHeader = () => {
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
      />
      <Avatar />
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
`;
