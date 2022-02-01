import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function New() {
  const router = useRouter();

  useEffect(() => {
    router.push('/?action=mint');
  });

  return null;
}
