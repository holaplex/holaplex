import { RefObject, useEffect } from 'react';

export const useOutsideAlerter = (ref: RefObject<Node>, callback: VoidFunction) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref?.current && !ref?.current?.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, ref]);
};
