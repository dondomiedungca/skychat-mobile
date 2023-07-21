import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo
} from 'react';
import { io } from 'socket.io-client';
import Constants from 'expo-constants';
import { Chat } from '../types/Chat';
import { RecentConversation } from '../types/RecentConversation';
import { User } from '../types/User';
import { UserContext } from './user.context';
import { navigationRef } from '../libs/rootNavigation';
import { UsersConversations } from '../types/UsersConversations';
import { Conversation } from '../types/Conversation';
import { useUpdateUnread } from '../libs/useChat';

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

export type RecentConversationsType = {
  socket?: any;
  updateUnreadOnRoomOpening?: (user: User, conversation_id: string) => void;
  recent_conversations?: RecentConversation[];
  setRecentConversations: React.Dispatch<
    React.SetStateAction<RecentConversation[] | undefined>
  >;
};

export const RecentConversationsContext =
  React.createContext<RecentConversationsType>({
    setRecentConversations: () => {}
  });

interface Props {
  children: React.ReactNode;
}

interface UpdateOwnRecents {
  relatedUser: User;
  channelUserId: string;
  chat: Chat;
  conversation_id: string;
  conversation_type: string;
  users_conversations: UsersConversations;
}

const RecentConversationContextComponent: React.FC<Props> = ({ children }) => {
  const [recent_conversations, setRecentConversations] = React.useState<
    RecentConversation[] | undefined
  >();
  const { user: currentUser } = useContext(UserContext);
  const { makeRequest: fetchUpdateUnread } = useUpdateUnread();

  /**
   * * This is the initialization of incoming updates of
   * * your recent conversations
   */
  const socket = useMemo(() => {
    return io(`${BASE_URL}/users`, {
      query: {
        user_id: currentUser?.id || undefined
      },
      forceNew: true
    });
  }, [currentUser]);

  useLayoutEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  /**
   * * Listener for the updates of reels of users
   */
  useLayoutEffect(() => {
    /**
     * * Listener for the updates of reels of current users
     */
    socket.on('user-updateOwnRecents', (data: UpdateOwnRecents) => {
      const conversationIndex = recent_conversations!.findIndex(
        (rc) => rc.conversation_id === data.conversation_id
      );
      if (conversationIndex !== -1) {
        const copy = [...(recent_conversations || [])];

        const newConv = {
          ...copy[conversationIndex],
          lastUser: data.relatedUser.id,
          lastDateTime: data.chat.created_at!,
          lastMessage: data.chat.text
        };
        copy.splice(conversationIndex, 1);
        setRecentConversations([newConv, ...copy]);
      } else {
        setRecentConversations([
          {
            user_first_name: data.relatedUser.first_name,
            user_last_name: data.relatedUser.last_name,
            lastUser: data.relatedUser.id,
            lastMessage: data.chat.text,
            unread: 0,
            lastDateTime: data.chat.created_at!,
            conversation_id: data.conversation_id,
            conversation_type: data.conversation_type,
            user_user_meta: {
              profile_photo: data.relatedUser.user_meta?.profile_photo!,
              activity: data.relatedUser.user_meta?.activity
            },
            user_partner: data.relatedUser,
            users_conversations: [data.users_conversations]
          },
          ...(recent_conversations || [])
        ]);
      }
    });
    /**
     * * Listener for the updates of reels of users made by the other user or partnerr
     */
    socket.on('user-updatePartnerRecents', (data: UpdateOwnRecents) => {
      if (navigationRef.isReady()) {
        const conversationIndex = recent_conversations!.findIndex(
          (rc) => rc.conversation_id === data.conversation_id
        );
        const currentRouteName = navigationRef.getCurrentRoute()?.name;
        const userIdInRoom = (navigationRef.getCurrentRoute()?.params as any)
          ?.user?.id;

        /**
         * If the partner is also inside the room
         */
        if (
          currentRouteName === 'Room' &&
          userIdInRoom == data.relatedUser.id
        ) {
          fetchUpdateUnread({
            user_id: data.relatedUser.id,
            conversation_id:
              recent_conversations![conversationIndex].conversation_id
          });
        }

        if (conversationIndex !== -1) {
          const copy = [...(recent_conversations || [])];

          const newConv = {
            ...copy[conversationIndex],
            lastUser: data.relatedUser.id,
            lastDateTime: data.chat.created_at!,
            lastMessage: data.chat.text,
            unread:
              currentRouteName === 'Room' && userIdInRoom == data.relatedUser.id
                ? 0
                : Number(copy[conversationIndex].unread) + 1
          };
          copy.splice(conversationIndex, 1);
          setRecentConversations([newConv, ...copy]);
        } else {
          setRecentConversations([
            {
              user_first_name: data.relatedUser.first_name,
              user_last_name: data.relatedUser.last_name,
              lastUser: data.relatedUser.id,
              lastMessage: data.chat.text,
              unread: 1,
              lastDateTime: data.chat.created_at!,
              conversation_id: data.conversation_id,
              conversation_type: data.conversation_type,
              user_user_meta: {
                profile_photo: data.relatedUser.user_meta?.profile_photo!,
                activity: data.relatedUser.user_meta?.activity
              },
              user_partner: data.relatedUser,
              users_conversations: [data.users_conversations]
            },
            ...(recent_conversations || [])
          ]);
        }
      }
    });

    return () => {
      socket.off('user-updateOwnRecents');
      socket.off('user-updatePartnerRecents');
    };
  }, [socket, recent_conversations, navigationRef.current?.isReady()]);

  const updateUnreadOnRoomOpening = useCallback(
    (user: User, conversation_id: string) => {
      const recent_conversation_index = recent_conversations?.findIndex(
        (rc) => {
          if (rc.hasOwnProperty('user_partner')) {
            return (
              rc.conversation_id === conversation_id &&
              rc.user_partner?.id === user.id
            );
          } else {
            return (
              rc.conversation_id === conversation_id &&
              (rc as any).user_id === user.id
            );
          }
        }
      );

      if (recent_conversation_index !== -1) {
        const copy = [...(recent_conversations || [])];

        copy[recent_conversation_index!].unread = 0;
        setRecentConversations(copy);
        fetchUpdateUnread({ user_id: user.id, conversation_id });
      }
    },
    [recent_conversations]
  );

  return (
    <RecentConversationsContext.Provider
      value={{
        recent_conversations,
        socket,
        setRecentConversations,
        updateUnreadOnRoomOpening
      }}
    >
      {children}
    </RecentConversationsContext.Provider>
  );
};

export default RecentConversationContextComponent;
