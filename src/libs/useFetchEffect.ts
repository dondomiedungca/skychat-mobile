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
  const { isLoading, error, data, success } = propsToWatch;
  const { onSuccess, onData, onError, dependencies } = props;

  useEffect(() => {
    if (data !== null && !error && !isLoading) {
      onSuccess?.(data);
      data && onData?.(data);
    }
    if (error && !isLoading) {
      if (onError === null) return;
      onError && onError(error);
    }
  }, [isLoading, error, data, success, ...(dependencies || [])]);
};
