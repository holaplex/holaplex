import { programs, Wallet } from '@metaplex/js';
import DomainFormItem from '@/common/components/elements/DomainFormItem';
import Button from '@/components/elements/Button';
import Upload from '@/components/elements/Upload';
import FillSpace from '@/components/elements/FillSpace';
import StepForm from '@/components/elements/StepForm';
import { initArweave } from '@/modules/arweave';
import { Marketplace } from '@/modules/marketplace';
import arweaveSDK from '@/modules/arweave/client';
import { UserOutlined } from '@ant-design/icons';
import {
  FieldData,
  Paragraph,
  reduceFieldData,
  Title,
  UploadedLogo,
  UploadedBanner,
  validateSubdomainUniqueness,
  popFile,
} from '@/modules/storefront/editor';
import { Transaction } from '@solana/web3.js';
import { WalletContext } from '@/modules/wallet';
import { NATIVE_MINT } from '@solana/spl-token';
import { Avatar, Card, Col, Form, Input, Slider, Row, Space, Typography, InputNumber } from 'antd';
import { findIndex, has, ifElse, isNil, lensPath, prop, propEq, update, view } from 'ramda';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useContext, useState, useEffect } from 'react';
import { createAuctionHouse } from '@/modules/auction-house/transactions/CreateAuctionHouse';
import { AuctionHouseAccount } from '@/modules/auction-house/AuctionHouseAccount';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const MARKETPLACE_ENABLED = process.env.NEXT_PUBLIC_MARKETPLACE_ENABLED === 'true';

const {
  metaplex: { Store, SetStoreV2, StoreConfig },
} = programs;

export async function getServerSideProps() {
  if (MARKETPLACE_ENABLED) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
}

export default function New() {
  const router = useRouter();
  const { connection } = useConnection();
  const [submitting, setSubmitting] = useState(false);
  const arweave = initArweave();
  const ar = arweaveSDK.using(arweave);
  const [form] = Form.useForm();
  const { setVisible } = useWalletModal();
  const { solana, wallet, looking } = useContext(WalletContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: '' },
    { name: ['address', 'owner'], value: '' },
    { name: ['theme', 'logo'], value: [] },
    { name: ['theme', 'banner'], value: [] },
    { name: ['meta', 'name'], value: '' },
    { name: ['meta', 'description'], value: '' },
    { name: ['creators'], value: [] },
    { name: ['sellerFeeBasisPoints'], value: 10000 },
  ]);

  if (isNil(solana) || isNil(wallet)) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana wallet to edit your store.</Paragraph>
            <Button loading={solana?.connecting || looking} block onClick={() => setVisible(true)}>
              Connect
            </Button>
          </Space>
        </Card>
      </Row>
    );
  }

  const values = reduceFieldData(fields);

  const subdomainUniqueness = validateSubdomainUniqueness(ar, wallet.pubkey);
  const onSubmit = async (): Promise<void> => {
    if (isNil(solana) || isNil(solana.signTransaction) || isNil(solana.publicKey)) {
      return;
    }
    const { theme, meta, subdomain, sellerFeeBasisPoints } = values;

    setSubmitting(true);

    const logo = popFile(theme.logo[0]);
    const banner = popFile(theme.banner[0]);
    const domain = `${subdomain}.holaplex.market`;

    const [auctionHousPubkey] = await AuctionHouseAccount.getAuctionHouse(
      solana.publicKey,
      NATIVE_MINT
    );

    const input = {
      meta,
      theme: {
        logo,
        banner,
      },
      subdomain,
      address: {
        owner: wallet.pubkey,
        auctionHouse: auctionHousPubkey.toBase58(),
      },
    } as Marketplace;

    const auctionHouseCreateInstruction = await createAuctionHouse({
      connection,
      wallet: solana as Wallet,
      sellerFeeBasisPoints,
    });
    const storePubkey = await Store.getPDA(solana.publicKey);

    const storeConfigPubkey = await StoreConfig.getPDA(storePubkey);
    const createStoreV2Instruction = new SetStoreV2(
      {
        feePayer: solana.publicKey,
      },
      {
        admin: solana.publicKey,
        store: storePubkey,
        config: storeConfigPubkey,
        isPublic: false,
        settingsUri: `https://ipfs.blah.com`,
      }
    );

    const transaction = new Transaction();

    if (auctionHouseCreateInstruction && createStoreV2Instruction) {
      transaction.add(auctionHouseCreateInstruction).add(createStoreV2Instruction);
    }

    transaction.feePayer = solana.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await solana.signTransaction(transaction);

    const txtId = signedTransaction
      ? await connection.sendRawTransaction(signedTransaction.serialize())
      : undefined;

    if (txtId) await connection.confirmTransaction(txtId);

    router.push('/');

    toast(
      <>
        Your marketplace is ready. Visit <a href={`https://${domain}`}>{domain}</a>.
      </>,
      { autoClose: 60000 }
    );

    setSubmitting(false);
  };

  const subdomain = (
    <div>
      <div className="main-heading">Let&apos;s start with your domain</div>
      <div className="margin-top-4 margin-bottom-8 slightly-transparent">
        This is the address that people will use to get to your marketplace.
      </div>

      <div className="margin-bottom-8">
        <DomainFormItem
          name="subdomain"
          rules={[
            {
              required: true,
              pattern: /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
              message: 'The subdomain entered is not valid.',
            },
            { required: true, validator: subdomainUniqueness },
          ]}
        >
          <Input autoFocus suffix=".holaplex.market" />
        </DomainFormItem>
      </div>
    </div>
  );

  const details = (
    <Col span={24}>
      <Title level={2}>Customize your marketplace</Title>
      {values.theme.banner[0] && values.theme.banner[0].status === 'done' && (
        <UploadedBanner
          src={ifElse(
            has('response'),
            view(lensPath(['response', 'url'])),
            prop('url')
          )(values.theme.banner[0])}
        />
      )}
      <Form.Item
        label="Hero Banner"
        tooltip="Sits at the top of your marketplace, 1500px wide and 500px tall works best!"
        name={['theme', 'banner']}
        rules={[{ required: true, message: 'Upload a Hero Image' }]}
      >
        <Upload dragger>
          <>
            <p className="ant-upload-text">Upload banner image</p>
            <p className="ant-upload-hint">1500px x 375px JPEG, PNG or GIF - max file size 2mb</p>
          </>
        </Upload>
      </Form.Item>
      {values.theme.logo[0] && values.theme.logo[0].status === 'done' && (
        <UploadedLogo
          src={ifElse(
            has('response'),
            view(lensPath(['response', 'url'])),
            prop('url')
          )(values.theme.logo[0])}
        />
      )}
      <Form.Item
        label="Logo"
        name={['theme', 'logo']}
        rules={[{ required: true, message: 'Upload a logo.' }]}
      >
        <Upload dragger>
          <>
            <p className="ant-upload-text">Upload logo image</p>
            <p className="ant-upload-hint">225px x 225px JPEG, PNG or GIF - max file size 1mb</p>
          </>
        </Upload>
      </Form.Item>
      <Form.Item
        name={['meta', 'name']}
        rules={[{ required: true, message: 'Please enter a name for the marketplace.' }]}
        label="Marketplace Name"
      >
        <Input autoFocus />
      </Form.Item>
      <Form.Item
        name={['meta', 'description']}
        label="Marketplace Description"
        rules={[{ required: true, message: 'Please enter a description for the marketplace.' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name={['sellerFeeBasisPoints']} label="Seller Fee Basis Points">
        <InputNumber<number> min={0} max={100000} />
      </Form.Item>
    </Col>
  );

  return (
    <Row justify="center" align="middle">
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <StepForm
          submitting={submitting}
          form={form}
          layout="vertical"
          fields={fields}
          onFieldsChange={([changed], _) => {
            if (isNil(changed)) {
              return;
            }
            const current = findIndex(propEq('name', changed.name), fields);

            setFields(update(current, changed, fields));
          }}
          onFinish={onSubmit}
          colon={false}
        >
          <Row>
            <FillSpace direction="vertical" size="large">
              {subdomain}
            </FillSpace>
          </Row>
          <Row>{details}</Row>
        </StepForm>
      </Col>
    </Row>
  );
}
