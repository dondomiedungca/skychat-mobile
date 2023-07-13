import Constants from 'expo-constants';
import React, { useContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { RecentConversation } from '../types/RecentConversation';
import { UserContext } from './user.context';

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

export type RecentConversationsType = {
  socket?: any;
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

const RecentConversationContextComponent: React.FC<Props> = ({ children }) => {
  const [recent_conversations, setRecentConversations] = React.useState<
    RecentConversation[] | undefined
  >();

  const { user: currentUser } = useContext(UserContext);

  /**
   * * This is the initialization of incoming updates of
   * * your recent conversations
   */
  const socket = useMemo(() => {
    return io(`${BASE_URL}`, {
      query: {
        user_id: currentUser?.id || undefined
      }
    });
  }, [currentUser]);

  /**
   * * Listener for recent conversations updates
   */
  useEffect(() => {}, [socket]);

  return (
    <RecentConversationsContext.Provider
      value={{ recent_conversations, socket, setRecentConversations }}
    >
      {children}
    </RecentConversationsContext.Provider>
  );
};

export default RecentConversationContextComponent;
