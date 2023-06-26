import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import MainContainer from '../../../components/MainContainer';
import RoomHeader from '../../../components/RoomHeader';
import Colors from '../../../types/Colors';
import { ChatRoomStackParamList, RootParamList } from '../../navigation';

type RoomScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<ChatRoomStackParamList, 'Room'>;
};

const ChatRoom = ({ navigation, route }: RoomScreenProps) => {
  const user = route?.params?.user;

  return (
    <MainContainer header={<RoomHeader user={user} navigation={navigation} />}>
      <Container></Container>
    </MainContainer>
  );
};

const Container = styled.View`
  height: 100%;
  width: 100%;
  background: ${Colors.white};
  padding: 0 10px 0 10px;
`;

export default ChatRoom;
