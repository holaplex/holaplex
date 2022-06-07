import { NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DiscoverPage(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.replace('/discover/nfts');
  });

  return <></>;
}


export function routerQueryParamToSingleValue<T>(
  router: NextRouter,
  key: string,
  converter: (value: string) => T
): T | undefined {
  let result: string | undefined;
  if (router.query[key] !== undefined) {
    if (Array.isArray(router.query[key]))
      throw new Error(`Found multiple values for single-value param ${key}`);
    else result = router.query[key] as string;
  }
  return result === undefined ? undefined : converter(result);
}