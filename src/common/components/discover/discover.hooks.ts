import { NextRouter, useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useRef, useState } from 'react';

interface UseUrlQueryParamData<T> {
  value: T;
  active: boolean;
  set: (value: T) => void;
  setAndActivate: (value: T) => void;
  setActive: (active: boolean) => void;
}

//TODO document
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
