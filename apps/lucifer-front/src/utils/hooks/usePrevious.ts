import { useEffect, useRef } from 'react';

// Hook
function usePrevious<T>(value: T): T | null {
  // Ref
  const previous = useRef<T | null>(null);

  // Effect
  useEffect(() => {
    previous.current = value;
  }, [value]);

  return previous.current;
}

export default usePrevious;