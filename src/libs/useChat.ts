import { HTTPMethod, useApi } from './useApi';
import { ChatPayload } from '../screens/Home/ChatHome/Room';

export const useFetchChats = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.GET,
    '/chat/fetch-chats',
    false
  );

  const fetch = async ({
    parties,
    conversation_id,
    currentLength,
    search
  }: {
    parties: string[];
    conversation_id?: string;
    currentLength: number;
    search?: string;
  }) => {
    return makeRequest?.({ conversation_id, search, currentLength, parties });
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

  const fetch = async ({ payload, conversation_id, parties }: ChatPayload) => {
    return makeRequest?.({ conversation_id, payload, parties });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};
