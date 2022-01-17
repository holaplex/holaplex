import React, { useContext, useEffect } from 'react';
import {
  Modal,
  Typography,
  Upload,
  Divider,
  InputNumber,
  Input,
  Form,
  FormInstance,
  Row,
  Space,
  Col,
  Radio,
} from 'antd';
import styled from 'styled-components';
import { useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';
import { WalletContext } from '@/modules/wallet';
const { Paragraph } = Typography;
import dynamic from 'next/dynamic';
import { BulkMinter as TBulkMinter } from '@holaplex/ui';
import { Connection } from '@solana/web3.js';
import { holaSignMetadata } from '@/modules/storefront/approve-nft';
import { useRouter } from 'next/router';
import { useScrollBlock } from '@/common/hooks/useScrollBlock';
const { Dragger } = Upload;
const { Item } = Form;
const { Group } = Radio;

const BulkMinter = dynamic(() => import('@holaplex/ui').then((mod) => mod.BulkMinter), {
  ssr: false,
}) as typeof TBulkMinter;

type MintModalProps = {
  show: boolean;
  onClose: () => void;
};

const StyledModal = styled(Modal)`
  margin: 0;
  top: 0;
  padding: 0;
  min-height: 100vh;

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-content {
    width: 100vw;
    min-height: 100vh;
    overflow-y: scroll;
    margin: 0;
    top: 0;
  }

  .ant-modal-wrap {
    overflow-x: hidden;
  }
`;

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string);

const MintModal = ({ show, onClose }: MintModalProps) => {
  const { connect, solana, wallet, storefront } = useContext(WalletContext);
  const router = useRouter();
  const { track } = useAnalytics();
  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
    if (!wallet && show) {
      connect(router.pathname);
    }
  }, [wallet, connect, show, router]);

  useEffect(() => {
    if (show) {
      blockScroll();
    } else {
      allowScroll();
    }
  }, [show, blockScroll, allowScroll]);

  if (!wallet || !solana) {
    return null;
  }

  return (
    <StyledModal
      destroyOnClose
      footer={[]}
      onCancel={onClose}
      visible={show}
      width="100%"
      bodyStyle={{ height: '100%' }}
      closable={false}
      maskStyle={{ overflowX: 'hidden' }}
      wrapProps={{ style: { overflowX: 'hidden' } }}
    >
      <BulkMinter
        wallet={wallet}
        connect={connect}
        solana={solana}
        track={track}
        connection={connection}
        storefront={storefront}
        holaSignMetadata={holaSignMetadata}
        onClose={onClose}
      />
    </StyledModal>
  );
};
export default MintModal;
