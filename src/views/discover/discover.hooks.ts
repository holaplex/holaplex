import { NextRouter, useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useRef, useState } from 'react';

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
  converter: (value: string) => T = (v) => v as unknown as T
): UseUrlQueryParamData<T> {
  const [active, setActive] = useState<boolean>(startActive);
  const [value, setValue] = useState<T>(defaultValue);

  // hack to get Next to assign the router when on the client
  let routerRef = useRef<NextRouter | undefined>();
  const nextRouter: NextRouter = useRouter();
  useEffect(() => {
    if (nextRouter) routerRef.current = nextRouter;
  }, [nextRouter]);
  const router: NextRouter | undefined = routerRef.current;

  // set the value in the URL
  useEffect(() => {
    if (router !== undefined) {
      const query: ParsedUrlQuery = router.query;
      if (!active || value === undefined || value === null) {
        if (key in query) {
          delete query[key];
          router.replace({ query });
        }
      } else {
        const newValueString: string = `${value}`;
        if (newValueString !== query[key]) {
          query[key] = newValueString;
          router.replace({ query });
        }
      }
    }
  }, [router, key, value, active]);

  // get the value from the URL
  useEffect(() => {
    let queryValueString: string | undefined;
    if (router !== undefined) {
      if (router.query[key] !== undefined) {
        if (Array.isArray(router.query[key])) {
          throw new Error(`Found multiple values for single-value param ${key}`);
        }
        queryValueString = router.query[key] as string;
      }
    }

    if (queryValueString !== undefined) {
      const queryValue: T = converter(queryValueString);
      if (queryValue !== value) {
        setValue(queryValue);
      }
    }
  }, [router, key, value, converter]);

  return {
    value: value,
    active: active,
    set: setValue,
    setAndActivate: (value: T) => {
      setValue(value);
      setActive(true);
    },
    setActive: setActive,
  };
}
