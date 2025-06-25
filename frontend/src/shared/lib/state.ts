import { useCallback, useEffect, useState } from 'react';

/**
 * Returns a boolean value and functions to set it to true, set it to false, and toggle it.
 *
 * @param {boolean} defaultValue - the default value for the boolean
 * @return {[boolean, () => void, () => void, () => void]} an array containing the boolean value, setTrue function, setFalse function, and toggle function
 */
export function useBoolean(defaultValue: boolean = false) {
  const [isTrue, setIsTrue] = useState<boolean>(defaultValue);
  const setFalse = useCallback(() => setIsTrue(false), []);
  const setTrue = useCallback(() => setIsTrue(true), []);
  const toggle = useCallback(() => setIsTrue((isTrue) => !isTrue), []);
  return [isTrue, setTrue, setFalse, toggle] as const;
}

/**
 * If onChange defined then is controlled state and will be used outside (input) properties
 * If onChange is not defined then is uncontrolled properties and will be used insider useState. And item it's initialValue
 */
export function useUncontrolled<T>(
  item: T,
  onChange?: (item: T) => void,
): [T, (item: T) => void] {
  const controlled = !!onChange;
  const [state, setState] = useState<T>(item);
  if (controlled) {
    return [item, onChange];
  }
  return [state, setState];
}

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
