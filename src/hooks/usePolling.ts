import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  interval: number;
  enabled: boolean;
}

export const usePolling = (callback: () => void, options: UsePollingOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (options.enabled) {
      intervalRef.current = setInterval(callback, options.interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, options.interval, options.enabled]);
};