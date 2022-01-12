import DomainFormItem from '@/common/components/elements/DomainFormItem';
import FontSelect from '@/common/components/elements/FontSelect';
import Upload from '@/common/components/elements/Upload';
import Button from '@/components/elements/Button';
import ColorPicker from '@/components/elements/ColorPicker';
import FillSpace from '@/components/elements/FillSpace';
import StepForm from '@/components/elements/StepForm';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';
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
  StorefrontEditorProps,
  submitCallback,
  Title,
  UploadedLogo,
  UploadedBanner,
  validateSubdomainUniqueness,
} from '@/modules/storefront/editor';
import { WalletContext } from '@/modules/wallet';
import { UploadOutlined } from '@ant-design/icons';
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
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

export default function New() {
  const [submitting, setSubmitting] = useState(false);
  const { track } = useAnalytics();
  const router = useRouter();
  const arweave = initArweave();
  const ar = arweaveSDK.using(arweave);
  const [form] = Form.useForm();
  const { solana, wallet, connect } = useContext(WalletContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['hostname'], value: '' },
    { name: ['pubkey'], value: '' },
    { name: ['theme', 'logo'], value: [] },
    { name: ['theme', 'banner'], value: [] },
    { name: ['meta', 'name'], value: '' },
    { name: ['meta', 'description'], value: '' },
  ]);

  if (isNil(solana) || isNil(wallet)) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana wallet to create a marketplace.</Paragraph>
            <Button type="primary" block onClick={connect}>
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
    track,
    router,
    solana,
    values,
    setSubmitting,
    onSuccess: (domain) =>
      toast(
        <>
          Your marketplace is ready. Visit <a href={`https://${domain}`}>{domain}</a> to finish
          setting up your marketplace.
        </>,
        { autoClose: 60000 }
      ),
    onError: (e) =>
      toast(
        <>
          There was an issue creating your marketplace. Please wait a moment and try again.
          {e && ` (${e})`}
        </>
      ),
    trackEvent: 'Marketplace Created',
  });


  const subdomain = (
    <>
      <Col>
        <Title level={2}>Let&apos;s start with your sub-domain.</Title>
        <Paragraph>This is the address that people will use to get to your marketplace.</Paragraph>
      </Col>
      <Col flex={1}>
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
      </Col>
    </>
  );

  const theme = (
    <Row justify="space-between">
      <Col sm={24}>
        <Title level={2}>Next, configure your marketplace.</Title>
        <Paragraph>Choose a logo, banner, and description to fit your marketplace's brand.</Paragraph>
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
          rules={[{ required: false, message: 'Upload a Hero Image' }]}
        >
          <Upload>
            {isEmpty(values.theme.banner) && (
              <Button block type="primary" size="middle" icon={<UploadOutlined />}>
                Upload Banner
              </Button>
            )}
          </Upload>
        </Form.Item>
        <UploadedLogo
                src={ifElse(
                  has('response'),
                  view(lensPath(['response', 'url'])),
                  prop('url')
                )(values.theme.logo[0])}
              />
            
        <Form.Item
          label="Logo"
          name={['theme', 'logo']}
          rules={[{ required: true, message: 'Upload a logo.' }]}
        >
          <Upload>
            {isEmpty(values.theme.logo) && (
              <Button block type="primary" size="middle" icon={<UploadOutlined />}>
                Upload Logo
              </Button>
            )}
          </Upload>
        </Form.Item>
      </Col>
    </Row>
  );

  const meta = (
    <>
      <Title level={2}>Finally, set marketplace title and description.</Title>
      <Paragraph>
        This needs descriptive text. There should be something here explaining what the DAO owner should be inputing into the fields because details are important.
      </Paragraph>

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
    </>
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
          <Row justify="space-between">{theme}</Row>
          <Row justify="space-between">
            <Col xs={24}>{meta}</Col>
          </Row>
        </StepForm>
      </Col>
    </Row>
  );
}
