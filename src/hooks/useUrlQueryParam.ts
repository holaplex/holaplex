import { NextRouter, useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface UseUrlQueryParamData<T> {
  /**
   * current value of the parameter
   */
  value: T | null;

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
  const [value, setValue] = useState<T | null>(defaultValue);
  const [valueIsFromUrl, setValueIsFromUrl] = useState<boolean>(true);
  const id = useMemo(() => Math.round(Math.random() * 10000), []);

  //TODO still getting flip/flopping when I switch the filter between the 3 types :'(
  // Problems:
  //  1. What to do when the value gets set from another spot that is also using the router? i.e. resolving
  //    conflict between the value being set from outside this instance of this hook.
  //  2. How to handle the value coming from the URL initially versus the default value initially.
  //  3. How to handle the value being set with the setter, and then updating the URL.

  // hack to get Next to assign the router when on the client
  let routerRef = useRef<NextRouter | undefined>();
  const nextRouter: NextRouter = useRouter();
  useEffect(() => {
    if (nextRouter) routerRef.current = nextRouter;
  }, [nextRouter]);
  const router: NextRouter | undefined = routerRef.current;

  useEffect(() => {
    const queryValue: T | null = router ? getValueFromUrl(router, key, converter) : null;
    
    const logs: string[] = [];
    logs.push(`${id}`);

    if (initialized) {
      logs.push('update');
      if (queryValue !== value) {
        // if the value was changed in the URL (e.g. by another hook using the router) then we need
        //  to update the value stored here to reflect that
        if (!valueIsFromUrl) {
          logs.push('from url');
          setValue(queryValue);
          setValueIsFromUrl(true);
          setActive(queryValue != null);
        } else if (router && router.isReady) {
          logs.push('from setter');
          // otherwise, the value was set using the setter and we should update the value in the URL
          setValueIsFromUrl(false);
          setValueInUrl(router, key, value, active);
        } else logs.push('not ready');
      } else logs.push('no change');
    } else if (router && router.isReady) {
      logs.push('initializing');
      setInitialized(true);
      if (queryValue != null) {
        logs.push('from url');
        // on the initial load we want to take the value from the URL if it's available, regardless of
        //  other settings
        setValue(queryValue);
        setValueIsFromUrl(true);
        setActive(true);
      } else if (value != null && active && router) {
        logs.push('from value');
        // otherwise, we should set the URL value to the default value
        setValueIsFromUrl(false);
        setValueInUrl(router, key, value, active);
      } else logs.push('no change');
    } else logs.push('not ready');

    logs.push(`${value}|${valueIsFromUrl ? 'T' : 'F'}${active ? 'T' : 'F'}${initialized ? 'T' : 'F'}`);
    if (key === 'type') console.log(logs[0], ...logs.slice(1).map(log => ['>', log]).flat());
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
    set: setValue,
    setAndActivate: (value: T) => {
      setValue(value);
      setActive(true);
    },
    setActive: setActive,
  };
}

function logstuff(
  msg: string,
  id: number,
  key: string,
  value: any,
  fromUrl: boolean,
  active: boolean,
  initialized: boolean
): string {
  return `${id} ${msg}: ${value}|${fromUrl ? 'T' : 'F'}|${active ? 'T' : 'F'}|${
    initialized ? 'T' : 'F'
  }`;
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
