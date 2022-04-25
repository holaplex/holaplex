import DomainFormItem from '@/common/components/elements/DomainFormItem';
import FontSelect from '@/common/components/elements/FontSelect';
import Upload from '@/common/components/elements/Upload';
import Button from '@/components/elements/Button';
import ColorPicker from '@/components/elements/ColorPicker';
import FillSpace from '@/components/elements/FillSpace';
import StepForm from '@/components/elements/StepForm';
import { StorefrontContext } from '@/modules/storefront';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import Loading from '@/common/components/elements/Loading';
import {
  FieldData,
  getTextColor,
  Paragraph,
  PrevCard,
  PrevCol,
  PreviewButton,
  PreviewLink,
  PrevText,
  PrevTitle,
  reduceFieldData,
  submitCallback,
  Title,
  UploadedLogo,
  UploadedBanner,
  validateSubdomainUniqueness,
} from '@/modules/storefront/editor';
import { WalletContext } from '@/modules/wallet';
import { Card, Col, Form, Input, Row, Space } from 'antd';
import { useRouter } from 'next/router';
import {
  findIndex,
  has,
  ifElse,
  isEmpty,
  isNil,
  lensPath,
  prop,
  propEq,
  update,
  view,
} from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { v4 as uuidv4 } from 'uuid';

export default function New() {
  const [submitting, setSubmitting] = useState(false);
  const { track } = useAnalytics();
  const router = useRouter();
  const arweave = initArweave();
  const ar = arweaveSDK.using(arweave);
  const [form] = Form.useForm();
  const { solana, wallet, looking } = useContext(WalletContext);
  const { setVisible } = useWalletModal();
  const { storefront, searching } = useContext(StorefrontContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: '' },
    { name: ['pubkey'], value: '' },
    { name: ['theme', 'backgroundColor'], value: '#333333' },
    { name: ['theme', 'primaryColor'], value: '#F2C94C' },
    { name: ['theme', 'titleFont'], value: 'Work Sans' },
    { name: ['theme', 'textFont'], value: 'Work Sans' },
    { name: ['theme', 'logo'], value: [] },
    { name: ['theme', 'banner'], value: [] },
    { name: ['meta', 'favicon'], value: [] },
    { name: ['meta', 'title'], value: '' },
    { name: ['meta', 'description'], value: '' },
    { name: ['integrations', 'crossmintClientId'], value: uuidv4() },
  ]);

  useEffect(() => {
    if (storefront) {
      router.push('/storefront/edit');
    }
  }, [storefront, wallet, router]);

  if (isNil(solana) || isNil(wallet)) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana wallet to create a store.</Paragraph>
            <Button loading={solana?.connecting} block onClick={() => setVisible(true)}>
              Connect
            </Button>
          </Space>
        </Card>
      </Row>
    );
  }

  const values = reduceFieldData(fields);

  const subdomainUniqueness = validateSubdomainUniqueness(ar);

  const onSubmit = submitCallback({
    trackingFunction: () =>
      track('Storefront Created', {
        event_category: 'Storefront',
        event_label: wallet?.pubkey,
      }),
    router,
    solana,
    values,
    setSubmitting,
    onSuccess: (domain) =>
      toast(
        <>
          Your storefront is ready. Visit <a href={`https://${domain}`}>{domain}</a> to finish
          setting up your storefront.
        </>,
        { autoClose: 60000 }
      ),
    onError: (e) =>
      toast(
        <>
          There was an issue creating your storefront. Please wait a moment and try again.
          {e && ` (${e})`}
        </>
      ),
  });

  const textColor = getTextColor(values.theme.backgroundColor);
  const buttontextColor = getTextColor(values.theme.primaryColor);

  const subdomain = (
    <>
      <Col>
        <Title level={2}>Let&apos;s start with your sub-domain.</Title>
        <Paragraph>This is the address that people will use to get to your store.</Paragraph>
      </Col>
      <Col flex={1}>
        <DomainFormItem
          name="subdomain"
          rules={[
            {
              required: true,
              pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
              message: 'The subdomain entered is not valid.',
            },
            { required: true, validator: subdomainUniqueness },
          ]}
        >
          <Input autoFocus suffix=".holaplex.com" />
        </DomainFormItem>
      </Col>
    </>
  );

  const theme = (
    <Row justify="space-between">
      <Col sm={24} md={12} lg={12}>
        <Title level={2}>Next, theme your store.</Title>
        <Paragraph>Choose a images, colors, and fonts to fit your store’s brand.</Paragraph>
        <Form.Item
          label="Hero Banner"
          tooltip="Sits at the top of your store, 375px wide and 500px tall works best!"
          name={['theme', 'banner']}
          rules={[{ required: false, message: 'Upload a Hero Image' }]}
        >
          <Upload>{isEmpty(values.theme.banner) && <Button>Upload Banner</Button>}</Upload>
        </Form.Item>
        <Form.Item
          label="Logo"
          name={['theme', 'logo']}
          rules={[{ required: true, message: 'Upload a logo.' }]}
        >
          <Upload>{isEmpty(values.theme.logo) && <Button>Upload Logo</Button>}</Upload>
        </Form.Item>
        <Form.Item name={['theme', 'backgroundColor']} label="Background">
          <ColorPicker />
        </Form.Item>
        <Form.Item name={['theme', 'primaryColor']} label="Buttons &amp; Links">
          <ColorPicker />
        </Form.Item>
        <Form.Item name={['theme', 'titleFont']} label="Title Font">
          <FontSelect />
        </Form.Item>
        <Form.Item name={['theme', 'textFont']} label="Main Text Font">
          <FontSelect />
        </Form.Item>
      </Col>
      <PrevCol sm={24} md={11} lg={10}>
        <PrevCard bgColor={values.theme.backgroundColor}>
          <Space direction="vertical">
            {values.theme.banner[0] && values.theme.banner[0].status === 'done' && (
              <UploadedBanner
                src={ifElse(
                  has('response'),
                  view(lensPath(['response', 'url'])),
                  prop('url')
                )(values.theme.banner[0])}
              />
            )}
            {values.theme.logo[0] && values.theme.logo[0].status === 'done' && (
              <UploadedLogo
                src={ifElse(
                  has('response'),
                  view(lensPath(['response', 'url'])),
                  prop('url')
                )(values.theme.logo[0])}
              />
            )}
            <PrevTitle level={2} color={textColor} fontFamily={values.theme.titleFont}>
              Big Title
            </PrevTitle>
            <PrevTitle level={3} color={textColor} fontFamily={values.theme.titleFont}>
              Little Title
            </PrevTitle>
            <PrevText color={textColor} fontFamily={values.theme.textFont}>
              Main text Lorem gizzle dolizzle go to hizzle amizzle, own yo adipiscing fo shizzle.
              Cool sapizzle velizzle, volutpat, suscipizzle quis, gravida vizzle, arcu.
            </PrevText>
            <PreviewLink color={values.theme.primaryColor}>Link to things</PreviewLink>
            <PreviewButton
              className="apply-font-body"
              color={values.theme.primaryColor}
              textColor={buttontextColor}
            >
              Button
            </PreviewButton>
          </Space>
        </PrevCard>
      </PrevCol>
    </Row>
  );

  const meta = (
    <>
      <Title level={2}>Finally, set page meta data.</Title>
      <Paragraph>
        Upload a favicon and set other page meta data. This information will display on social
        platforms, such as Twitter and Facebook, when links to the store are shared.
      </Paragraph>
      <Form.Item
        label="Favicon"
        name={['meta', 'favicon']}
        rules={[{ required: true, message: 'Upload a favicon.' }]}
      >
        <Upload>{isEmpty(values.meta.favicon) && <Button>Upload</Button>}</Upload>
      </Form.Item>
      <Form.Item
        name={['meta', 'title']}
        rules={[{ required: true, message: 'Please enter a page title.' }]}
        label="Page Title"
      >
        <Input autoFocus />
      </Form.Item>
      <Form.Item
        name={['meta', 'description']}
        label="Page Description"
        rules={[{ required: true, message: 'Please enter a page description.' }]}
      >
        <Input.TextArea />
      </Form.Item>
    </>
  );

  return (
    <Loading loading={searching || looking}>
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
            <Row justify="space-between">{theme}</Row>
            <Row justify="space-between">
              <Col xs={24}>{meta}</Col>
            </Row>
          </StepForm>
        </Col>
      </Row>
    </Loading>
  );
}
