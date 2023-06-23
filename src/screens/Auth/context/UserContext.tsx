import React from 'react';
import { User } from '../../../types/User';

export type UserContextType = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const UserContext = React.createContext<UserContextType>({
  setUser: () => {}
});

interface Props {
  children: React.ReactNode;
}

const UserContextComponent: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | undefined>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextComponent;
