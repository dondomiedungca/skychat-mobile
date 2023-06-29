import { HTTPMethod, useApi } from './useApi';

export const useFetchConversations = () => {
  const { isLoading, data, success, error, makeRequest } = useApi(
    HTTPMethod.POST,
    '/conversation/fetch-conversations',
    false
  );

  const fetch = async ({
    parties,
    type,
    page,
    search
  }: {
    parties: string[];
    type: string;
    page: number;
    search?: string;
  }) => {
    return makeRequest?.({ parties, type, search, page });
  };

  return {
    isLoading,
    data,
    success,
    error,
    makeRequest: fetch
  };
};
