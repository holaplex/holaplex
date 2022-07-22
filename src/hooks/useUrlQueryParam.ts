import { NextRouter, useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UseUrlQueryParamData<T> {
  /**
   * current value of the parameter
   */
  value: T;

  /**
   * whether the parameter is currently active. Inactive parameters keep their value and can
   * be set but are not shown in the URL.
   */
  active: boolean;

  /**
   * sets the value
   */
  set: (value: T) => void;

  /**
   * sets and activates the value, if needed
   */
  setAndActivate: (value: T) => void;

  /**
   * sets the active state of the value. Inactive parameters keep their value and can be set
   * but are not shown in the URL.
   */
  setActive: (active: boolean) => void;
}

/**
 * This hook gives simplified accessors for a single query parameter in the URL, including
 * being able to hide/deactivate the parameter without losing its value.
 *
 * @param key key of the parameter in the URL query
 * @param defaultValue starting/fallback value the parameter should take if it is not set in the URL
 * @param startActive if false, the parameter will not be set in the URL intially; defaults to true
 * @param converter function to convert from the string value of the parameter in the URL to whatever type you wish to use
 * @returns parameter value, active state, and setters
 */
export function useUrlQueryParam<T = string>(
  key: string,
  defaultValue: T,
  startActive: boolean = true,
  converter: (value: string) => T = defaultConverter
): UseUrlQueryParamData<T> {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(startActive);
  const [value, setValue] = useState<T>(defaultValue);
  const [valueIsFromUrl, setValueIsFromUrl] = useState<boolean>(false);
  const id = useMemo(() => Math.round(Math.random() * 10000), []);

  // hack to get Next to assign the router when on the client
  let routerRef = useRef<NextRouter | undefined>();
  const nextRouter: NextRouter = useRouter();
  useEffect(() => {
    if (nextRouter) routerRef.current = nextRouter;
  }, [nextRouter]);
  const router: NextRouter | undefined = routerRef.current;

  const setValueAndSource: (newValue: T, fromUrl: boolean) => void = useCallback(
    (newValue, fromUrl) => {
      setValue(newValue);
      setValueIsFromUrl(fromUrl);
    },
    [setValue, setValueIsFromUrl]
  );

  const setValueCallback: (newValue: T) => void = useCallback(
    (newValue) => {
      // I dont know why I need to set this to true instead of false, but there you go
      setValueAndSource(newValue, true);
      if (router && router.isReady) setValueInUrl(router, key, newValue, active);
    },
    [router, key, active, setValueAndSource]
  );

  const setActiveCallback: (newActive: boolean) => void = useCallback(
    (newActive) => {
      setActive(newActive);
      if (router && router.isReady) setValueInUrl(router, key, value, newActive);
    },
    [router, key, value, setActive]
  );

  useEffect(() => {
    let proposedNewValue: T | null = value;
    const queryValue: T | null = router ? getValueFromUrl(router, key, converter) : null;

    if (initialized && active && queryValue == null && value != null && router) {
      setValueInUrl(router, key, value, active);
    }

    // TODO for some reason, setting a param as inactive doesnt always remove it from the URL...
    if (initialized) {
      // if the value was changed in the URL (e.g. by another hook using the router) then we need
      //  to update the value stored here to reflect that
      if (queryValue !== value) {
        if (!valueIsFromUrl && active && queryValue != null) {
          proposedNewValue = queryValue;
          setValueAndSource(queryValue, true);
        }
      }
    } else if (router && router.isReady) {
      setInitialized(true);
      if (queryValue != null) {
        // on the initial load we want to take the value from the URL if it's available, regardless of
        //  other settings
        proposedNewValue = queryValue;
        setValueAndSource(queryValue, true);
        setActive(true);
      } else {
        // otherwise, we should set the URL value to the default value
        setValueIsFromUrl(false);
        setValueInUrl(router, key, value, active);
      }
    }
  }, [
    router,
    key,
    converter,
    setActive,
    active,
    value,
    valueIsFromUrl,
    initialized,
    setInitialized,
    getValueFromUrl,
    setValueInUrl,
  ]);

  return {
    value: value,
    active: active,
    set: setValueCallback,
    setAndActivate: (value: T) => {
      setActive(true);
      setValueCallback(value);
    },
    setActive: setActiveCallback,
  };
}

function getValueFromUrl<T>(
  router: NextRouter,
  key: string,
  converter: (v: string) => T
): T | null {
  let result: T | null = null;
  if (router.isReady) {
    // need to set initialization state after the router has loaded so server-side
    //  rendering doesnt skip this
    if (key in router.query) {
      if (Array.isArray(router.query[key])) {
        throw new Error(`Found multiple values for single-value param ${key}`);
      }
      let queryValueString: string | undefined = router.query[key] as string;
      if (queryValueString) result = converter(queryValueString);
    }
  }
  return result;
}

function setValueInUrl<T>(router: NextRouter, key: string, value: T | null, active: boolean): void {
  if (router.isReady) {
    const query: ParsedUrlQuery = router.query;
    const valueString: string = `${value}`;
    const valueIsEmpty: boolean = value == null || valueString.trim().length === 0;
    if (!active || valueIsEmpty) {
      if (key in query) {
        delete query[key];
        router.replace({ query });
      }
    } else {
      query[key] = valueString;
      router.replace({ query });
    }
  }
}

// need to use an unchanging default converter because an inline default
//  is recreated on every re-evaluation of the hook
function defaultConverter<T>(v: string): T {
  return v as unknown as T;
}
