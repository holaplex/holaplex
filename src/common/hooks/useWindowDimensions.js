import { useState, useMemo, useLayoutEffect } from "react";

function getWindowDimensions() {
  let dimensions = { width: 0, height: 0 };
  if (typeof window !== "undefined") {
    dimensions.width = window.innerWidth;
    dimensions.height = window.innerHeight;
  }
  return dimensions;
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(() =>
    getWindowDimensions()
  );

  useLayoutEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    // Call handlerResize once to initialize `windowDimensions`.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => windowDimensions, [windowDimensions]);
}
