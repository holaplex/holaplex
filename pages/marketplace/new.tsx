import { programs } from '@metaplex/js';
import DomainFormItem from '@/common/components/elements/DomainFormItem';
import { WhiteRoundedButton } from '@/components/elements/Button';
import Upload from '@/components/elements/Upload';
import FillSpace from '@/components/elements/FillSpace';
import StepForm from '@/components/elements/StepForm';
import { initArweave } from '@/modules/arweave';
import { Marketplace } from '@/modules/marketplace';
import arweaveSDK from '@/modules/arweave/client';
import MarketplaceSDK from '@/modules/marketplace/client';
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
import { Avatar, Card, Col, Form, Input, Row, Space, Typography, InputNumber } from 'antd';
import { findIndex, has, ifElse, isNil, lensPath, prop, propEq, update, view } from 'ramda';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useContext, useState } from 'react';
import { createAuctionHouse } from '@/modules/auction-house/transactions/CreateAuctionHouse';
import { AuctionHouseAccount } from '@/modules/auction-house/AuctionHouseAccount';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useWallet } from '@solana/wallet-adapter-react';

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
  const [pendingAddress, setPendingAddress] = useState<string>();
  const ar = arweaveSDK.using(arweave);
  const [form] = Form.useForm();
  const { connect } = useContext(WalletContext);
  const {
    wallet: userWallet,
    publicKey,
    connected,
    signAllTransactions,
    signMessage,
    signTransaction,
    connect: connectUserWallet,
  } = useWallet();
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

  if (
    isNil(userWallet) ||
    isNil(userWallet.adapter) ||
    !connected ||
    userWallet.readyState === 'Unsupported'
  ) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana wallet to create a marketplace.</Paragraph>
            <WhiteRoundedButton type="primary" onClick={() => connect()}>
              Connect
            </WhiteRoundedButton>
          </Space>
        </Card>
      </Row>
    );
  }

  const values = reduceFieldData(fields);

  const subdomainUniqueness = validateSubdomainUniqueness(ar, publicKey?.toString());
  const onSubmit = async (): Promise<void> => {
    const { theme, meta, subdomain, creators, sellerFeeBasisPoints } = values;

    setSubmitting(true);

    const logo = popFile(theme.logo[0]);
    const banner = popFile(theme.banner[0]);
    const domain = `${subdomain}.holaplex.market`;

    const [auctionHousPubkey] = await AuctionHouseAccount.getAuctionHouse(publicKey, NATIVE_MINT);

    const input = {
      meta,
      theme: {
        logo,
        banner,
      },
      subdomain,
      address: {
        owner: publicKey?.toString(),
        auctionHouse: auctionHousPubkey.toBase58(),
      },
      creators: creators.map(({ address }: any) => address),
    } as Marketplace;

    const { txt } = await MarketplaceSDK.uploadManifest(input, solana);

    const auctionHouseCreateInstruction = await createAuctionHouse({
      connection,
      wallet: solana,
      sellerFeeBasisPoints,
    });
    const storePubkey = publicKey ? await Store.getPDA(publicKey?.toString()) : undefined;

    const storeConfigPubkey = await StoreConfig.getPDA(storePubkey);
    const createStoreV2Instruction = new SetStoreV2(
      {
        feePayer: publicKey?.toString(),
      },
      {
        admin: publicKey?.toString(),
        store: storePubkey,
        config: storeConfigPubkey,
        isPublic: false,
        settingsUri: `https://arweave.net/${txt}`,
      }
    );

    const transaction = new Transaction();

    transaction.add(auctionHouseCreateInstruction).add(createStoreV2Instruction);

    transaction.feePayer = publicKey || undefined;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    const signedTransaction = await signTransaction(transaction);

    const txtID = await connection.sendRawTransaction(signedTransaction.serialize());

    await connection.confirmTransaction(txtID);

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

  const creators = (
    <Col xs={24}>
      <Title level={2}>Add creators</Title>
      <Paragraph>Choose the creators you want to feature on your market</Paragraph>
      <Form.List name="creators">
        {(fields, { add, remove }) => (
          <>
            <Space direction="vertical" size="middle">
              {fields.map(({ key, name, ...restField }, idx) => (
                <Space key={key} direction="horizontal" size="middle">
                  <Avatar size={36} icon={<UserOutlined />} />
                  <Typography.Text>{values.creators[idx].address}</Typography.Text>
                  <WhiteRoundedButton onClick={() => remove(idx)}>Remove</WhiteRoundedButton>
                </Space>
              ))}
            </Space>
            <Input
              autoFocus
              type="text"
              onChange={(e) => setPendingAddress(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();

                add({ address: pendingAddress });

                setPendingAddress(undefined);
              }}
              value={pendingAddress}
              placeholder="SOL wallet address..."
            />
          </>
        )}
      </Form.List>
    </Col>
  );

  console.log(fields);

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
          <Row>{creators}</Row>
        </StepForm>
      </Col>
    </Row>
  );
}
