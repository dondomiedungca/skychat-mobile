import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
  useMemo
} from 'react';
import styled from 'styled-components/native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Image, Keyboard } from 'react-native';
import uuid from 'react-native-uuid';
import moment from 'moment';

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
import SendIcon from './../../../../assets/icons/send_icon.png';
import SendDisableIcon from './../../../../assets/icons/send_disable_icon.png';
import ImageFileIcon from './../../../../assets/icons/image_file_icon.png';
import AttachementIcon from './../../../../assets/icons/attachment_icon.png';
import CameraIcon from './../../../../assets/icons/camera_icon.png';
import SmileIcon from './../../../../assets/icons/smile_icon.png';
import MicrophoneIcon from './../../../../assets/icons/microphone_icon.png';
import DoubleCheckIcon from './../../../../assets/icons/double_check_icon.png';

import { io } from 'socket.io-client';

type RoomScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<ChatRoomStackParamList, 'Room'>;
};

const Composer = ({
  handleSendChat
}: {
  handleSendChat: (text: string | undefined) => void;
}) => {
  const socket = useMemo(() => io('http://192.168.1.6:3000/chats'), []);
  const [chat, setChat] = useState<string>();
  const [hide, setHide] = useState<boolean>(false);
  const textInputRef = useRef<any>(null);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setHide(false);
      textInputRef.current?.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ComposerContainer>
      <TextContainer>
        <StyledTextInput
          ref={textInputRef}
          onPressIn={() => setHide(true)}
          onBlur={() => setHide(false)}
          value={chat}
          onChangeText={setChat}
          placeholder="Write a message..."
          multiline
        />
        {!hide && (
          <ActionContainer>
            <StyledTouchableOpacity>
              <Image style={{ width: 30, height: 30 }} source={SmileIcon} />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity>
              <Image style={{ width: 30, height: 30 }} source={ImageFileIcon} />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity>
              <Image style={{ width: 30, height: 30 }} source={CameraIcon} />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity>
              <Image
                style={{ width: 30, height: 30 }}
                source={AttachementIcon}
              />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity>
              <Image
                style={{ width: 30, height: 30 }}
                source={MicrophoneIcon}
              />
            </StyledTouchableOpacity>
          </ActionContainer>
        )}
      </TextContainer>

      <SendTouchableOpacity
        disabled={!chat}
        onPress={() => {
          handleSendChat(chat);
          setChat(undefined);
        }}
      >
        <Image
          style={{ width: 50, height: 50 }}
          source={chat ? SendIcon : SendDisableIcon}
        />
      </SendTouchableOpacity>
    </ComposerContainer>
  );
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

  const handleSendchat = (chat: string | undefined) => {
    const data: IMessage = {
      _id: uuid.v4() as string,
      text: chat as string,
      createdAt: new Date(),
      user: {
        _id: currentUser?.id!
      }
    };
    setMessages((prev) => [
      {
        ...data,
        user: { ...data.user, avatar: user.user_meta?.profile_photo }
      },
      ...prev
    ]);
    sendChat({
      msg: {
        ...data,
        user: { ...data.user, avatar: user.user_meta?.profile_photo }
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

  const RenderTime = (data: any) => {
    const chatMeta: IMessage = data.data.currentMessage;
    return (
      <TimeContainer>
        <Typography
          title={moment(chatMeta.createdAt).format('h:mm A')}
          size={10}
          color={
            chatMeta.user._id != currentUser?.id ? Colors.grey : Colors.white
          }
        />
        {chatMeta.user._id == currentUser?.id && (
          <Image
            style={{ width: 15, height: 15, marginLeft: 5 }}
            source={DoubleCheckIcon}
          />
        )}
      </TimeContainer>
    );
  };

  return (
    <MainContainer header={<RoomHeader user={user} navigation={navigation} />}>
      {currentUser && (
        <Container style={{ marginTop: 60, paddingBottom: 60 }}>
          <GiftedChat
            placeholder="Write a message..."
            messages={messages}
            user={{
              _id: currentUser.id
            }}
            showUserAvatar
            renderComposer={() => <></>}
            renderTime={(data) => <RenderTime data={data} />}
            keyboardShouldPersistTaps="always"
            {...((!conversation || conversation.length) &&
              !messages.length && {
                renderChatFooter: () => <EmptyChat />
              })}
          />
          <Composer handleSendChat={handleSendchat} />
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

const TextContainer = styled.View`
  flex-grow: 1;
`;

const ActionContainer = styled.View`
  min-height: 50px;
  max-height: 60px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  padding: 5px;
`;

const SendTouchableOpacity = styled.TouchableOpacity`
  margin: 0;
  padding: 0;
`;

const ComposerContainer = styled.View`
  width: 100%;
  max-height: 200px;
  margin-top: -40px;
  padding-bottom: 10px;
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.white};
`;

const StyledTextInput = styled.TextInput`
  padding: 10px 20px;
  background: ${Colors.secondary}
  border-radius: 20px;
  max-height: 100px;
`;

const TimeContainer = styled.View`
  float: right;
  diplay: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 5px;
`;

export default ChatRoom;
