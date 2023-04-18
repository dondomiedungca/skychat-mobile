import { useEffect } from 'react';
import { UseApiReturnProps } from './useApi';

type FetchEffectProps<Data> = {
  onSuccess?: (data?: Data) => void;
  onData?: (data: Data) => void;
  onError?: ((error: Error) => void) | null;
  dependencies?: any[];
};

export const useFetchEffect = <Data>(
  propsToWatch: UseApiReturnProps,
  props: FetchEffectProps<Data>,
) => {
  const { isLoading, error, response, success } = propsToWatch;
  const { onSuccess, onData, onError, dependencies } = props;

  useEffect(() => {
    if (response !== null && !error && !isLoading) {
      onSuccess?.(response);
      response && onData?.(response);
    }
    if (error && !isLoading) {
      if (onError === null) return;
      onError && onError(error);
    }
  }, [isLoading, error, response, success, ...(dependencies || [])]);
};
