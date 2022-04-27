import WhoToFollowList from '@/common/components/feed/WhoToFollowList';
import { SmallFooter } from '@/common/components/home/Footer';
import React from 'react';

export default function WhoToFollowPage() {
  return (
    <div className="container mx-auto space-y-10 divide-y-2">
      <WhoToFollowList />

      <SmallFooter />
    </div>
  );
}
