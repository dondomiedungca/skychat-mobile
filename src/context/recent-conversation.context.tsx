import React from 'react';
import { RecentConversation } from '../types/RecentConversation';

export type RecentConversationsType = {
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

  return (
    <RecentConversationsContext.Provider
      value={{ recent_conversations, setRecentConversations }}
    >
      {children}
    </RecentConversationsContext.Provider>
  );
};

export default RecentConversationContextComponent;
