import { useEffect, useState } from 'react';

const useFocused = () => {
  const [focused, setFocused] = useState(document.activeElement);

  const handleFocusIn = (e: any) => {
    setFocused(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return focused;
};

export default useFocused;
