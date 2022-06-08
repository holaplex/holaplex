import { NextRouter } from "next/router";

export function routerQueryParamToEnumValue<T>(
  router: NextRouter,
  key: string,
  type: T
): T[keyof T] | undefined {
  let result: string | undefined;
  if (router.query[key] !== undefined) {
    if (Array.isArray(router.query[key]))
      throw new Error(`Found multiple values for single-value param ${key}`);
    else result = router.query[key] as string;
  }
  return result === undefined ? undefined : type[result as keyof T];
}