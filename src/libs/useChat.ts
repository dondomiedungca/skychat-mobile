import { IMessage } from 'react-native-gifted-chat';
import { HTTPMethod, useApi } from './useApi';

export const useFetchChats = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.GET,
    '/chat/fetch-chats',
    false
  );

  const fetch = async ({
    parties,
    conversation_id,
    page,
    search
  }: {
    parties: string[];
    conversation_id?: string;
    page: number;
    search?: string;
  }) => {
    return makeRequest?.({ conversation_id, search, page, parties });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};

export const useSendChat = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/chat',
    false
  );

  const fetch = async ({
    msg,
    conversation_id,
    parties
  }: {
    conversation_id?: string;
    msg: IMessage;
    parties: (string | undefined)[];
  }) => {
    return makeRequest?.({ conversation_id, msg, parties });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};
