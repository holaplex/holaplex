import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar, Card, Image, Row, Col } from 'antd';
import { Storefront } from '@/modules/storefront/types';
import { imgOpt } from '@/common/utils';
import { useAnalytics } from '@/common/context/AnalyticsProvider';

const PreviewCard = styled(Card)`
  .ant-card-meta-detail {
    text-align: center;
  }

  .ant-card-meta {
    margin: 40px 0 20px 0;
  }

  .ant-card-meta-title {
  }

  .ant-avatar-lg {
    position: absolute;
    top: -40px;
    left: -40px;
    margin: 0 0 0 50%;
    border: 2px solid #f4f4f4;
  }
`;

const StyledAvatar = styled(Avatar)`
  background: #222222;
`;

type StorePreviewProps = {
  storefront: Storefront;
  metadata: string[];
};

export default function StorePreview({ storefront, metadata }: StorePreviewProps) {
  const domain = `${storefront.subdomain}.holaplex.com`;

  const { track } = useAnalytics();

  return (
    <PreviewCard>
      <Card.Meta
        avatar={
          <StyledAvatar
            size="large"
            src={
              <img
                alt={storefront.meta.title + ' logo'}
                src={imgOpt(storefront.theme.logo.url, 100)}
              />
            }
          />
        }
        className=""
        title={storefront.meta.title}
        description={
          <a
            href={`https://${domain}`}
            rel="nofollow noreferrer"
            target="_blank"
            onClick={() => {
              track('Featured Storefront Selected', {
                event_category: 'Discovery',
                event_label: domain,
                storefrontDomain: domain,
              });
            }}
          >
            {domain}
          </a>
        }
      />
      {/* <div className="">
        <div className="mb-2 truncate text-xl font-medium">{storefront.meta.title}</div>
        <a
          className="text-lg text-[#ffffff73]"
          href={`https://${domain}`}
          rel="nofollow noreferrer"
          target="_blank"
          onClick={() => {
            track('Featured Storefront Selected', {
              event_category: 'Discovery',
              event_label: domain,
              storefrontDomain: domain,
            });
          }}
        >
          {domain}
        </a>
      </div> */}
      <div className="grid grid-cols-2 gap-4">
        {metadata.map((url, i) => (
          <img
            key={url + i}
            src={imgOpt(url, 600)}
            alt="featured nft image"
            className="aspect-square "
          />
        ))}
      </div>
    </PreviewCard>
  );
}
