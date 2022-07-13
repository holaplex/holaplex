import { NextRouter, useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useRef, useState } from "react";

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
    const [initialized, setInitialized] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(startActive);
    const [value, setValue] = useState<T>(defaultValue);
  
    // hack to get Next to assign the router when on the client
    let routerRef = useRef<NextRouter | undefined>();
    const nextRouter: NextRouter = useRouter();
    useEffect(() => {
      if (nextRouter) routerRef.current = nextRouter;
    }, [nextRouter]);
    const router: NextRouter | undefined = routerRef.current;

    // get the value from the URL on first load, if needed
    useEffect(() => {
      if (!initialized) {
        let queryValueString: string | undefined;
        if (router !== undefined && router.isReady) {
          // need to set initialization state after the router has loaded so server-side
          //  rendering doesnt skip this
          setInitialized(true);
          if (key in router.query) {
            if (Array.isArray(router.query[key])) {
              throw new Error(`Found multiple values for single-value param ${key}`);
            }
            queryValueString = router.query[key] as string;
          }
        }
    
        if (queryValueString != null) {
          const queryValue: T = converter(queryValueString);
          setValue(queryValue);
          setActive(true);
        }
      }
    }, [router, key, converter, initialized, setInitialized, setActive]);
    
    // set the value in the URL
    useEffect(() => {
      if (router !== undefined && router.isReady && initialized) {
        const query: ParsedUrlQuery = router.query;
        const valueIsEmpty: boolean = value == null || `${value}`.trim().length === 0;
        if (!active || valueIsEmpty) {
          if (key in query) {
            delete query[key];
            router.replace({ query });
          }
        } else {
          const newValueString: string = `${value}`;
          const existingValueString: string = `${query[key] ?? ''}`;
          if (newValueString !== existingValueString) {
            query[key] = newValueString;
            router.replace({ query });
          }
        }
      }
    }, [router, key, value, active, initialized]);
  
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