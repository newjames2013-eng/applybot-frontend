import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(fetcher, deps = [], { pollInterval = 0, skip = false } = {}) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError]     = useState(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
    if (pollInterval > 0) {
      const id = setInterval(fetch, pollInterval);
      return () => clearInterval(id);
    }
  }, [fetch, pollInterval]);

  useEffect(() => () => { mountedRef.current = false; }, []);

  return { data, loading, error, refetch: fetch };
}

export function useMutation(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { mutate, loading, error, data };
}
