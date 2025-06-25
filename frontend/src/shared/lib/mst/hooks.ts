import { useEffect, useState } from 'react';

/**
 * Просто надстройка над обычным useState с очисткой значений при размонтировании
 */
export function useMstError() {
  const [error, setError] = useState<any>();
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);
  return [error, setError];
}
