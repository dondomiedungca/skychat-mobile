import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { Text, View } from 'react-native';

import MainContainer from '../../../components/MainContainer';
import RoomHeader from '../../../components/RoomHeader';
import Colors from '../../../types/Colors';
import { ChatRoomStackParamList, RootParamList } from '../../navigation';

import { UserContext } from '../../Auth/context/UserContext';
import { useFetchEffect } from '../../../libs/useFetchEffect';
import { useFetchChats, useSendChat } from '../../../libs/useChat';
import Avatar from '../../../components/Avatar';
import { Typography } from '../../../components/Typography';
import { Chat } from '../../../types/Chat';

type RoomScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<ChatRoomStackParamList, 'Room'>;
};

const ChatRoom = ({ navigation, route }: RoomScreenProps) => {
  const user = route?.params?.user;
  const conversation = user?.conversations;
  const { user: currentUser } = useContext(UserContext);
  const { makeRequest: fetchChats, ...handleFetchChats } = useFetchChats();
  const { makeRequest: sendChat, ...handleSendChat } = useSendChat();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchChats({
        conversation_id: conversation?.[0]?.id,
        page: 1,
        parties: [user.id, currentUser?.id]
      });
    }
  }, []);

  useFetchEffect(handleFetchChats, {
    onData: (data: Chat[]) => {
      setMessages(data.map((data) => data.chat_meta));
    }
  });

  const handleSendchat = (msg: IMessage[]) => {
    const message = msg[0];
    setMessages((prev) => [
      {
        ...message,
        user: { ...message.user, avatar: user.user_meta?.profile_photo }
      },
      ...prev
    ]);
    sendChat({
      msg: {
        ...message,
        user: { ...message.user, avatar: user.user_meta?.profile_photo }
      },
      conversation_id: conversation?.[0]?.id,
      parties: [user.id, currentUser?.id].filter(Boolean)
    });
  };

  const EmptyChat = useCallback(() => {
    return (
      <EmptyContainer>
        <Avatar
          source={user.user_meta?.profile_photo}
          size={100}
          showActive={false}
        />
        <Typography
          style={{ width: 300, marginTop: 20, textAlign: 'center' }}
          title={`You and ${user?.firstName} ${user?.lastName} doesn't have any conversation.`}
          size={15}
          numberOfLines={5}
          color={Colors.grey_light}
          fontFamily="Roboto-Bold"
        />
        <Typography
          style={{ width: 300, marginTop: 5, textAlign: 'center' }}
          title={`Start chatting now to automatically create chat shortcuts.`}
          size={12}
          numberOfLines={5}
          color={Colors.blue}
          fontFamily="Roboto-Bold"
        />
      </EmptyContainer>
    );
  }, []);

  return (
    <MainContainer
      disableTouchableFeedback={true}
      header={<RoomHeader user={user} navigation={navigation} />}
    >
      {currentUser && (
        <Container style={{ marginTop: 60, paddingBottom: 60 }}>
          <GiftedChat
            placeholder="Write a message..."
            messages={messages}
            onSend={(msg) => {
              handleSendchat(msg);
            }}
            user={{
              _id: currentUser.id
            }}
            showUserAvatar
            keyboardShouldPersistTaps="always"
            {...((!conversation || conversation.length) &&
              !messages.length && {
                renderChatFooter: () => <EmptyChat />
              })}
          />
        </Container>
      )}
    </MainContainer>
  );
};

const Container = styled.View`
  height: 100%;
  width: 100%;
  background: ${Colors.white};
  padding: 0 10px 0 10px;
`;

const EmptyContainer = styled.View`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 60px;
  background: ${Colors.white};
  height: 100%;
  width: 100%;
`;

export default ChatRoom;
