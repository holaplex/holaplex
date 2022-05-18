import { programs, Wallet } from '@metaplex/js';
import DomainFormItem from '@/common/components/elements/DomainFormItem';
import Button from '@/components/elements/Button';
import Upload from '@/components/elements/Upload';
import FillSpace from '@/components/elements/FillSpace';
import StepForm from '@/components/elements/StepForm';
import { initArweave } from '@/modules/arweave';
import { Marketplace } from '@/modules/marketplace';
import arweaveSDK from '@/modules/arweave/client';
import {
  FieldData,
  Paragraph,
  reduceFieldData,
  Title,
  validateSubdomainUniqueness,
  popFile,
  UploadedBanner,
} from '@/modules/storefront/editor';
import ipfsSDK from '@/modules/ipfs/client';
import { Transaction } from '@solana/web3.js';
import { WalletContext } from '@/modules/wallet';
import { NATIVE_MINT } from '@solana/spl-token';
import { Card, Col, Form, Input, Row, Space, InputNumber, Typography } from 'antd';
import { findIndex, has, ifElse, isEmpty, isNil, lensPath, prop, propEq, update, view, pipe, not } from 'ramda';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useContext, useState } from 'react';
import { createAuctionHouse } from '@/modules/auction-house';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { AuctionHouseProgram } from '@holaplex/mpl-auction-house';
import Image from 'next/image';

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
  const [pendingAddress, setPendingAddress] = useState<string>();
  const { setVisible } = useWalletModal();
  const { solana, wallet, looking } = useContext(WalletContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: '' },
    { name: ['address', 'owner'], value: '' },
    { name: ['theme', 'logo'], value: [] },
    { name: ['theme', 'banner'], value: [] },
    { name: ['meta', 'name'], value: '' },
    { name: ['meta', 'description'], value: '' },
    { name: ['sellerFeeBasisPoints'], value: 10000 },
    { name: ['creators'], value: [] }
  ]);

  if (isNil(solana) || isNil(wallet)) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana wallet to create your marketplace.</Paragraph>
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
    const { theme, meta, subdomain, sellerFeeBasisPoints, creators } = values;

    setSubmitting(true);

    const logo = popFile(theme.logo[0]);
    const banner = popFile(theme.banner[0]);
    const domain = `${subdomain}.holaplex.market`;

    try {
      const [auctionHousPubkey] = await AuctionHouseProgram.findAuctionHouseAddress(
        solana.publicKey,
        NATIVE_MINT
      );
      const storePubkey = await Store.getPDA(solana.publicKey);
      const storeConfigPubkey = await StoreConfig.getPDA(storePubkey);

      const input = {
        meta,
        theme: {
          logo,
          banner,
        },
        creators,
        subdomain,
        address: {
          owner: wallet.pubkey,
          auctionHouse: auctionHousPubkey.toBase58(),
          store: storePubkey.toBase58(),
          storeConfig: storeConfigPubkey.toBase58(),
        },
      } as Marketplace;

      const settings = new File([JSON.stringify(input)], 'storefront_settings');

      const { uri } = await ipfsSDK.uploadFile(settings);
      if (isNil(uri)){
        toast("There was a problem uploding store settings, please refresh the page and try again.", { autoClose: 60000, type: 'error' });
        return
      }
      const auctionHouseCreateInstruction = await createAuctionHouse({
        wallet: solana as Wallet,
        sellerFeeBasisPoints,
      });

      const setStorefrontV2Instructions = new SetStoreV2(
        {
          feePayer: solana.publicKey,
        },
        {
          admin: solana.publicKey,
          store: storePubkey,
          config: storeConfigPubkey,
          isPublic: false,
          settingsUri: uri,
        }
      );

      const transaction = new Transaction();

      transaction
        .add(auctionHouseCreateInstruction)
        .add(setStorefrontV2Instructions);

      transaction.feePayer = solana.publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

      const signedTransaction = await solana.signTransaction(transaction);

      const txtId = await connection.sendRawTransaction(signedTransaction.serialize());

      if (txtId) await connection.confirmTransaction(txtId);

      router.push('/');

      toast(
        <>
          Your marketplace is ready. Visit <a href={`https://${domain}`}>{domain}</a>.
        </>,
        { autoClose: 60000 }
      );
    } catch (e: any) {
      toast(e.message, { autoClose: 60000, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row justify="center" align="middle">
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <StepForm
          className="marketplace-form"
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
              <h2 className="text-3xl font-black">Let&apos;s start with your domain</h2>
              <div className="mb-4 opacity-70">
                This is the address that people will use to get to your marketplace.
              </div>

              <div className="mb-8">
                <DomainFormItem
                  name="subdomain"
                  rules={[
                    {
                      required: true,
                      pattern: /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
                      message: 'The subdomain entered is not valid.',
                    },
                    {
                      required: true,
                      validator: subdomainUniqueness,
                    },
                  ]}
                >
                  <Input autoFocus suffix=".holaplex.market" />
                </DomainFormItem>
              </div>
            </FillSpace>
          </Row>
          <Row>
            <Col span={24}>
              <h2 className="text-3xl font-black mb-7">Customize your marketplace</h2>

              <Form.Item
                label="Hero Banner"
                tooltip="Placed at the top of the marketplace."
                name={['theme', 'banner']}
                rules={[{ required: true, message: 'Upload a Hero Image' }]}
              >
                <Upload dragger className="h-[1000px]">
                  <div className="flex h-[8rem] flex-col justify-center">
                    <span className="mb-2 material-icons">add_circle_outline</span>
                    <p className="">Upload banner image (required)</p>
                    <p className="">1500px x 375px JPEG, PNG or GIF - max file size 2mb</p>
                  </div>
                </Upload>
              </Form.Item>
              {values.theme.banner[0] && values.theme.banner[0].status === 'done' && (
                <div className="mb-8">
                  <div className="mb-2 text-sm">Banner preview:</div>
                  <UploadedBanner
                    src={ifElse(
                      has('response'),
                      view(lensPath(['response', 'url'])),
                      prop('url')
                    )(values.theme.banner[0])}
                  />
                </div>
              )}

              <Form.Item
                label="Logo"
                name={['theme', 'logo']}
                rules={[{ required: true, message: 'Upload a logo.' }]}
              >
                <Upload dragger>
                  <div className="flex h-[8rem] flex-col justify-center">
                    <span className="mb-2 material-icons">add_circle_outline</span>
                    <p className="ant-upload-text">Upload logo image</p>
                    <p className="ant-upload-hint">
                      225px x 225px JPEG, PNG or GIF - max file size 1mb
                    </p>
                  </div>
                </Upload>
              </Form.Item>
              {values.theme.logo[0] && values.theme.logo[0].status === 'done' && (
                <div className="mb-8">
                  <div className="mb-2 text-sm">Logo preview:</div>
                  <img
                    src={ifElse(
                      has('response'),
                      view(lensPath(['response', 'url'])),
                      prop('url')
                    )(values.theme.logo[0])}
                    width="72"
                    height="72"
                    alt="uploaded logo"
                  />
                </div>
              )}
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
                rules={[
                  { required: true, message: 'Please enter a description for the marketplace.' },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item name={['sellerFeeBasisPoints']} label="Seller Fee Basis Points">
                <InputNumber<number> min={0} max={100000} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Title level={2}>Add creators</Title>
              <Paragraph>Choose the creators you want to feature on your market</Paragraph>
              <Form.List
                name="creators"
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (isEmpty(value)) {
                        return Promise.reject("At least 1 creator is required");
                      }
                    }
                  }
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    <Space direction="vertical" size="middle" className="w-full">
                      {fields.map(({ key, name, ...restField }, idx) => (
                        <Space key={key} direction="horizontal" size="middle" className="flex justify-between w-full mb-4">
                          <Typography.Text>{values.creators[idx].address}</Typography.Text>
                          <Button size="small" onClick={() => remove(idx)}>Remove</Button>
                        </Space>
                      ))}
                    </Space>
                    <Form.Item
                      label="Find creator by wallet address"
                      className="ant-form-item-with-help ant-form-item-has-error"
                    >
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
                      <div className="ant-form-item-explain ant-form-item-explain-connected">
                        <div role="alert" className="ant-form-item-explain-error">
                          {form.getFieldError(['creators'])}
                        </div>
                      </div>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
        </StepForm>
      </Col>
    </Row>
  );
}
