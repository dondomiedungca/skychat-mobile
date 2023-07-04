import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect,
  useEffect
} from 'react';
import styled from 'styled-components/native';
import { IMessage } from 'react-native-gifted-chat';
import { Animated, Image, Keyboard } from 'react-native';
import uuid from 'react-native-uuid';
import moment from 'moment';
import { io } from 'socket.io-client';
import Constants from 'expo-constants';

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
import { Conversation } from '../../../types/Conversation';
import _ from 'lodash';

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

type RoomScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<ChatRoomStackParamList, 'Room'>;
};

interface IMessageAsSection {
  title: string;
  data: IMessage[];
}

const Composer = ({
  handleSend
}: {
  handleSend: (text: string | undefined) => void;
}) => {
  const [chat, setChat] = useState<string>();
  const [hide, setHide] = useState<boolean>(false);
  const textInputRef = useRef<any>(null);

  useLayoutEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setHide(false);
      textInputRef.current?.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  return (
    <ComposerContainer>
      <TextContainer>
        <StyledTextInput
          onFocus={() => setHide(true)}
          ref={textInputRef}
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
          handleSend(chat);
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
  const { user: currentUser } = useContext(UserContext);
  const { makeRequest: fetchChats, ...handleFetchChats } = useFetchChats();
  const { makeRequest: sendChat, ...handleSendChat } = useSendChat();
  const [conversation_id, setConversationId] = useState<string | undefined>(
    user?.users_conversations?.[0]?.conversation?.id
  );
  const [messages, setMessages] = useState<IMessageAsSection[]>([]);

  const socket = useMemo(() => {
    // listen for newly created conversation entity, this is useful for joining room
    // if conversation was changed from undefined to entity, update the socket connection for passing the hash as room
    return io(`${BASE_URL}/chats`, {
      query: {
        conversation_id
      }
    });
  }, [conversation_id]);

  const updateMessages = useCallback(
    (payload: any) => {
      const msg: IMessage = payload.msg;
      const keyDate = moment(msg.createdAt).format('MMMM DD, YYYY');
      let copy = [...messages];
      const sectionIndex = copy.findIndex((section) => {
        return (section.title as string) == (keyDate as string);
      });

      if (sectionIndex == -1) {
        copy = [{ title: keyDate, data: [msg] }, ...copy];
      } else {
        copy[sectionIndex].data = [msg, ...copy[sectionIndex].data];
      }

      setMessages(copy);
    },
    [messages]
  );

  useLayoutEffect(() => {
    if (currentUser) {
      fetchChats({
        conversation_id: conversation_id,
        page: 1,
        parties: [user.id, currentUser?.id]
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    socket.on('receiveChat', (payload) => {
      updateMessages(payload);
    });

    return () => {
      socket.off('receiveChat');
    };
  }, [messages]);

  useFetchEffect(handleFetchChats, {
    onData: (data: Chat[]) => {
      const finalData = _(data).groupBy((v) =>
        moment(v.chat_meta.createdAt).format('MMMM DD, YYYY')
      );
      const sections = Object.keys(finalData.toJSON()).map((key) => ({
        title: key,
        data: finalData.get(key).map((chat: Chat) => chat.chat_meta)
      }));

      setMessages(sections);
    }
  });

  useFetchEffect(handleSendChat, {
    onData: (data: Conversation) => {
      setConversationId(data.id);
    }
  });

  const handleSend = useCallback((chat: string | undefined) => {
    const data: IMessage = {
      _id: uuid.v4() as string,
      text: chat as string,
      createdAt: new Date(),
      user: {
        _id: currentUser?.id!
      }
    };
    const msg = {
      msg: {
        ...data,
        user: { ...data.user, avatar: user.user_meta?.profile_photo }
      },
      conversation_id,
      parties: [user.id, currentUser?.id].filter(Boolean)
    };
    updateMessages({
      msg: {
        ...data,
        user: { ...data.user, avatar: user.user_meta?.profile_photo }
      }
    });
    if (conversation_id) {
      socket.emit('sendChat', {
        msg,
        conversation_id
      });
    }
    sendChat(msg);
  }, []);

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

  const Item = useCallback(({ section }: { section: IMessageAsSection }) => {
    return (
      <>
        {section.data.length &&
          section.data.map((message: IMessage) => (
            <WholeMessageContainer
              key={message._id}
              style={{
                justifyContent:
                  message.user._id == currentUser?.id
                    ? 'flex-end'
                    : 'flex-start'
              }}
            >
              <Bubble isYours={message.user._id == currentUser?.id}>
                <Typography
                  title={message.text}
                  size={14}
                  color={
                    message.user._id == currentUser?.id
                      ? Colors.white
                      : Colors.grey
                  }
                />
                <TimeContainer>
                  <Typography
                    title={moment(message.createdAt).format('h:mm A')}
                    size={10}
                    color={
                      message.user._id != currentUser?.id
                        ? Colors.grey
                        : Colors.white
                    }
                  />
                  {message.user._id == currentUser?.id && (
                    <Image
                      style={{ width: 15, height: 15, marginLeft: 5 }}
                      source={DoubleCheckIcon}
                    />
                  )}
                </TimeContainer>
              </Bubble>
            </WholeMessageContainer>
          ))}
        <WholeMessageContainer style={{ justifyContent: 'center' }}>
          <Typography title={section.title} size={12} color={Colors.grey} />
        </WholeMessageContainer>
      </>
    );
  }, []);

  return (
    <MainContainer
      disableTouchableFeedback
      header={<RoomHeader user={user} navigation={navigation} />}
    >
      <Container>
        {messages.length ? (
          <StyledFlatList
            data={messages}
            renderItem={({ item }: { item: any }) => <Item section={item} />}
            keyExtractor={(item: any) => item.title}
            showsVerticalScrollIndicator={false}
            inverted
          />
        ) : (
          <EmptyChat />
        )}
        <Composer handleSend={handleSend} />
      </Container>
    </MainContainer>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  width: 100%;
  background: ${Colors.white};
  padding: 60px 10px 0 10px;
`;

const EmptyContainer = styled.View`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 60px;
  left: 10px;
  background: ${Colors.white};
  height: 100%;
  width: 100%;
`;

const TextContainer = styled.View`
  width: 100px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ActionContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-top: 5px;
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
  align-items: center;
`;

const StyledFlatList = styled.FlatList`
  flex-grow: 0;
`;

const WholeMessageContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
`;

const Bubble = styled.View<{ isYours?: boolean }>`
  border-radius: 10px;
  padding: 10px;
  max-width: 50%;
  min-width: 100px;
  background: ${({ isYours }) => (isYours ? Colors.primary : Colors.away)};
  ${({ isYours }) => {
    return isYours
      ? 'border-bottom-right-radius: 0;'
      : 'border-bottom-left-radius: 0;';
  }}
`;

export default ChatRoom;
