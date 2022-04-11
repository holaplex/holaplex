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
    margin: 40px 0 20px;
  }

  .ant-avatar-lg {
    position: absolute;
    top: -40px;
    left: -40px;
    margin: 0 0 0 50%;
    border: 2px solid #f4f4f4;
  }
`;

const Metadata = styled(Col)`
  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
  .ant-image {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
      {/* <Row justify="space-between">
        {metadata.map((url, i) => (
          <Metadata span={11} key={url + i}>
            <img src={imgOpt(url, 600)} alt="featured nft image" className="aspect-square " />
          </Metadata>
        ))}
      </Row> */}
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
