import { useState } from 'react';
// inspired by https://usehooks.com/useLocalStorage/

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    throwOnLocalStorageError?: boolean;
  }
) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error('Failed to parse local storage for ' + key, error);
      if (options?.throwOnLocalStorageError) {
        throw new Error('Failed to parse local storage for' + key + '. Check console.');
      }
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log('Failed to write to local storage for', key, error);
      if (options?.throwOnLocalStorageError) {
        throw new Error('Failed to write to local storage for' + key + '. Check console.');
      }
    }
  };

  return [storedValue, setValue] as const;
}
