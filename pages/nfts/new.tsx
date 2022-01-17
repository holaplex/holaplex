import React, { useContext, useEffect } from 'react';
import { WalletContext } from '@/modules/wallet';
import { Connection } from '@solana/web3.js';
import { useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';
import { holaSignMetadata } from '@/modules/storefront/approve-nft';
import dynamic from 'next/dynamic';
import { BulkMinter as TBulkMinter } from '@holaplex/ui';
import Form, { useForm } from 'antd/lib/form/Form';
import StepWizard from 'react-step-wizard';
import styled from 'styled-components';
import { Layout } from 'antd';
import { DraggerProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Upload from '@/modules/nfts/components/wizard/Upload';

const BulkMinter = dynamic(() => import('@holaplex/ui').then((mod) => mod.BulkMinter), {
  ssr: false,
}) as typeof TBulkMinter;

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string);

const StyledLayout = styled(Layout)`
  width: 100%;
  overflow: hidden;
`;
export default function NFTSNew() {
  const { connect, solana, wallet, storefront } = useContext(WalletContext);
  const [form] = useForm();

  const { track } = useAnalytics();

  useEffect(() => {
    if (!wallet) {
      connect('/nfts/new');
    }
  }, [wallet, connect]);

  if (!wallet || !solana) {
    return null;
  }

  return (
    <>
      <Form
        name="bulk-mint"
        form={form}
        // onFinish={onFinish}
        // requiredMark={false}
        layout="vertical"
        // onKeyDown={handleKeyDown}
      >
        <StyledLayout>
          <StepWizard
            isHashEnabled={false} // I don't think this will work unless we take the upload part out of the wizard and generate all steps based on the uploaded images
            isLazyMount={true}
            transitions={{
              enterLeft: undefined,
              enterRight: undefined,
              exitRight: undefined,
              exitLeft: undefined,
            }}
          >
            {/* <Upload dispatch={() => {}} files={[]} hashKey="upload" clearForm={() => {}} /> */}
          </StepWizard>
        </StyledLayout>
      </Form>
    </>
  );
}
