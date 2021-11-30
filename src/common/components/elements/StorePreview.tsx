import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar, Card, Image, Row, Col } from 'antd';
import { Storefront } from '@/modules/storefront/types';

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
    border: 2px solid white;
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

  return (
    <PreviewCard>
      <Card.Meta
        avatar={
          <StyledAvatar
            size="large"
            src={<Image preview={false} src={storefront.theme.logo.url} />}
          />
        }
        title={storefront.meta.title}
        description={
          <a href={`https://${domain}`} rel="nofollow noreferrer" target="_blank">
            {domain}
          </a>
        }
      />
      <Row justify="space-between">
        {metadata.map((url) => (
          <Metadata span={11} key={url}>
            <Image src={url} />
          </Metadata>
        ))}
      </Row>
    </PreviewCard>
  );
}
