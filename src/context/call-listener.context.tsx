import Constants from 'expo-constants';
import React, { useContext, useLayoutEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { navigate, navigationRef } from '../libs/rootNavigation';
import { UserContext } from './user.context';

export type CallListenerContextType = {
  socket?: any;
};

export const CallListenerContext = React.createContext<CallListenerContextType>(
  {
    socket: undefined
  }
);

const BASE_URL = Constants?.expoConfig?.extra?.API_URL;
interface Props {
  children: React.ReactNode;
}

const CallListenerContextComponent: React.FC<Props> = ({ children }) => {
  const { user: currentUser } = useContext(UserContext);
  const socket = useMemo(() => {
    return io(`${BASE_URL}/call`, {
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

  useLayoutEffect(() => {
    socket.on('call-handleOffer', (data) => {
      if (navigationRef.isReady()) {
        /**
         * Redirect for prompt
         */
        navigate('Call', {
          screen: 'PromptCall',
          params: {
            caller: data.caller,
            roomId: data.roomId,
            offer: data.offer
          }
        });
      }
    });

    socket.on('call-manualEnd', (data) => {
      if (navigationRef.isReady()) {
        if (
          navigationRef?.getCurrentRoute()?.name === 'PromptCall' &&
          navigationRef?.canGoBack()
        ) {
          navigationRef?.goBack();
        }
      }
    });

    return () => {
      socket.off('call-handleOffer');
      socket.off('call-manualEnd');
    };
  }, [socket, navigationRef.current?.isReady()]);

  return (
    <CallListenerContext.Provider value={{ socket }}>
      {children}
    </CallListenerContext.Provider>
  );
};

export default CallListenerContextComponent;
