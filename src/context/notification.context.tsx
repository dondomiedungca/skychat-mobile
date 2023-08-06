import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';
import { UserContext } from './user.context';
import { useFindUserById, useSetUserNotification } from '../libs/useUser';
import { navigationRef } from '../libs/rootNavigation';
import { ChatPayload } from '../screens/Home/ChatHome/Room';
import { useSendChat } from '../libs/useChat';
import { io } from 'socket.io-client';

export type NotificationContextType = {
  notification?: string;
  setNotification: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const NotificationContext = React.createContext<NotificationContextType>(
  {
    notification: undefined,
    setNotification: () => {}
  }
);

interface Props {
  children: React.ReactNode;
}

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

const NotificationContextComponent: React.FC<Props> = ({ children }) => {
  const { user } = useContext(UserContext);
  const { makeRequest } = useSetUserNotification();
  const { makeRequest: sendChat } = useSendChat();
  const { makeRequest: findUserById } = useFindUserById();

  const [notification, setNotification] = useState<string>();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('receivedchat', {
        showBadge: false,
        name: 'New message arrived!',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250]
      });

      await Notifications.setNotificationCategoryAsync('receivedchat', [
        {
          buttonTitle: 'LIKE',
          identifier: 'LIKE',
          options: {
            opensAppToForeground: false
          }
        },
        {
          buttonTitle: 'REPLY',
          identifier: 'REPLY',
          options: {
            opensAppToForeground: false
          },
          textInput: {
            submitButtonTitle: 'SEND'
          }
        } as any
      ]);
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    return token;
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        let shouldShowAlert: boolean = false;
        let shouldPlaySound: boolean = false;
        if (appStateVisible === 'background') {
          shouldShowAlert = true;
          shouldPlaySound = true;
        }
        if (navigationRef.getCurrentRoute()?.name !== 'ChatHome') {
          shouldShowAlert = true;
          shouldPlaySound = true;
        }
        return {
          shouldShowAlert,
          shouldPlaySound,
          shouldSetBadge: false
        };
      }
    });
  }, [appStateVisible, navigationRef]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!!user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          makeRequest({ user_id: user.id, token });
        }
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          Notifications.dismissNotificationAsync(
            notification.request.identifier
          );
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          async (response) => {
            Notifications.dismissNotificationAsync(
              response.notification.request.identifier
            );

            const chatEntity = {
              text: response.userText,
              chat_meta: {
                user: {
                  _id: user?.id!,
                  avatar: user?.user_meta?.profile_photo
                }
              },
              created_at: new Date()
            };

            const data: ChatPayload = {
              conversation_id:
                response.notification.request.content.data.conversation_id,
              parties: [
                user.id,
                response.notification.request.content.data?.sender_id
              ].filter(Boolean),
              payload: chatEntity
            };

            sendChat(data);

            const relatedUser = await findUserById({
              user_id: response.notification.request.content.data?.sender_id
            });

            const socket = io(`${BASE_URL}/users`, {
              query: {
                user_id: user.id
              },
              forceNew: true
            });

            socket.emit('user-updatePartnerRecents', {
              relatedUser: user,
              channelUserId: relatedUser?.id,
              chat: chatEntity,
              conversation_id:
                response.notification.request.content.data.conversation_id,
              conversation_type:
                response.notification.request.content.data.converrsation_type
            });
          }
        );
    }

    return () => {
      if (!!user) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextComponent;
