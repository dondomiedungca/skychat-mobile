import Constants from 'expo-constants';
import React, { useContext, useLayoutEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { User } from '../types/User';
import { UsersConversations } from '../types/UsersConversations';
import { UserContext } from './user.context';

export type ReelsUsersContextType = {
  socket?: any;
  users?: User[][];
  setUsers: React.Dispatch<React.SetStateAction<User[][]>>;
};

export const ReelsUsersContext = React.createContext<ReelsUsersContextType>({
  setUsers: () => {}
});

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;
interface Props {
  children: React.ReactNode;
}

interface UpdatePartnerReels {
  fromUser: User;
  targetUser: User;
  data: {
    targetUserJunction: UsersConversations;
    currentUserJunction: UsersConversations;
  };
}

const ReelsUsersContextComponent: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = React.useState<User[][]>([]);

  const { user: currentUser } = useContext(UserContext);
  /**
   * * This is the initialization of incoming updates of
   * * your recent conversations
   */
  const socket = useMemo(() => {
    return io(`${BASE_URL}/users`, {
      query: {
        user_id: currentUser?.id || undefined
      }
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
    socket.on('user-updatePartnerReels', (data: UpdatePartnerReels) => {
      let targetUser: User | undefined = undefined;
      let firstIndex: number = 0;
      let secondIndex: number = 0;

      for (let index = 0; index < users!.length; index++) {
        const element = users![index];
        firstIndex = index;
        secondIndex = element.findIndex((u) => u.id == data.fromUser.id);
        if (secondIndex !== -1) {
          targetUser = users![firstIndex][secondIndex];
          break;
        }
      }

      if (!!targetUser) {
        const copy = [...users!];
        copy[firstIndex][secondIndex] = {
          ...copy[firstIndex][secondIndex],
          users_conversations: [data.data.currentUserJunction]
        };
        setUsers(copy);
      }
    });

    return () => {
      socket.off('user-updatePartnerReels');
    };
  }, [socket, users]);

  return (
    <ReelsUsersContext.Provider value={{ users, setUsers, socket }}>
      {children}
    </ReelsUsersContext.Provider>
  );
};

export default ReelsUsersContextComponent;
