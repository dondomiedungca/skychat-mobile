import React from 'react';
import { User } from '../types/User';

export type ReelsUsersContextType = {
  users?: User[][];
  setUsers: React.Dispatch<React.SetStateAction<User[][]>>;
};

export const ReelsUsersContext = React.createContext<ReelsUsersContextType>({
  setUsers: () => {}
});

interface Props {
  children: React.ReactNode;
}

const ReelsUsersContextComponent: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = React.useState<User[][]>([]);

  return (
    <ReelsUsersContext.Provider value={{ users, setUsers }}>
      {children}
    </ReelsUsersContext.Provider>
  );
};

export default ReelsUsersContextComponent;
