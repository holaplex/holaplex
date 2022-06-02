import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DiscoverPage(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/discover/nfts`);
  });

  return <></>;
}