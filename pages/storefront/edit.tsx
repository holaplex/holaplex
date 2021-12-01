import DomainFormItem from '@/common/components/elements/DomainFormItem';
import FontSelect from '@/common/components/elements/FontSelect';
import Upload from '@/common/components/elements/Upload';
import Button from '@/components/elements/Button';
import ColorPicker from '@/components/elements/ColorPicker';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { StorefrontContext } from '@/modules/storefront';
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
import { Card, Col, Form, Input, Row, Space, Tabs } from 'antd';
import { useRouter } from 'next/router';
import {
  findIndex,
  has,
  ifElse,
  isEmpty,
  isNil,
  lensPath,
  merge,
  pipe,
  prop,
  propEq,
  update,
  view,
} from 'ramda';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
const { TabPane } = Tabs;

type TabKey = 'subdomain' | 'theme' | 'meta';

export default function Edit({ track }: StorefrontEditorProps) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const arweave = initArweave();
  const ar = arweaveSDK.using(arweave);
  const [tab, setTab] = useState<TabKey>('theme');
  const { storefront } = useContext(StorefrontContext);
  const [form] = Form.useForm();
  const { solana, wallet, connect } = useContext(WalletContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: storefront?.subdomain ?? '' },
    { name: ['theme', 'backgroundColor'], value: storefront?.theme.backgroundColor ?? '#333333' },
    { name: ['theme', 'primaryColor'], value: storefront?.theme.primaryColor ?? '#F2C94C' },
    { name: ['theme', 'titleFont'], value: storefront?.theme.titleFont ?? 'Work Sans' },
    { name: ['theme', 'textFont'], value: storefront?.theme.textFont ?? 'Work Sans' },
    { name: ['theme', 'banner'], value: [{ ...storefront?.theme.banner, status: 'done' }] },
    { name: ['theme', 'logo'], value: [{ ...storefront?.theme.logo, status: 'done' }] },
    {
      name: ['meta', 'favicon'],
      value: ifElse(
        pipe(prop('url'), isNil),
        () => [],
        (favicon) => [merge({ status: 'done' })(favicon)]
      )(storefront?.meta.favicon),
    },
    { name: ['meta', 'title'], value: storefront?.meta.title ?? '' },
    { name: ['meta', 'description'], value: storefront?.meta.description ?? '' },
  ]);

  if (isNil(solana) || isNil(storefront) || isNil(wallet)) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana wallet to edit your store.</Paragraph>
            <Button type="primary" block onClick={connect}>
              Connect
            </Button>
          </Space>
        </Card>
      </Row>
    );
  }

  const values = reduceFieldData(fields);

  const subdomainUniqueness = validateSubdomainUniqueness(ar, wallet.pubkey);

  const onSubmit = submitCallback({
    track,
    router,
    solana,
    values,
    setSubmitting,
    onSuccess: (domain) =>
      toast(
        <>
          Your storefront was updated. Visit <a href={`https://${domain}`}>{domain}</a> to view the
          changes.
        </>,
        { autoClose: 60000 }
      ),
    onError: (e) =>
      toast(
        <>
          There was an issue updating your storefront. Please wait a moment and try again.
          {e && ` (${e})`}
        </>
      ),
    trackEvent: 'updated',
  });

  const textColor = getTextColor(values.theme.backgroundColor);
  const buttontextColor = getTextColor(values.theme.primaryColor);
  return (
    <Row justify="center" align="middle">
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <Form
          form={form}
          fields={fields}
          onFieldsChange={([changed], _) => {
            if (isNil(changed)) {
              return;
            }

            const current = findIndex(propEq('name', changed.name), fields);
            setFields(update(current, changed, fields));
          }}
          onFinish={onSubmit}
          layout="vertical"
          colon={false}
        >
          <Tabs defaultActiveKey="theme">
            <TabPane tab="Theme" key="theme">
              <Row justify="space-between">
                <Col sm={24} md={12} lg={12}>
                  <Title level={2}>Style your store.</Title>
                  <Form.Item
                    label="Banner"
                    name={['theme', 'banner']}
                    tooltip="Sits at the top of your store, 1500px wide and 500px tall works best!"
                    rules={[{ required: false, message: 'Upload your Banner.' }]}
                  >
                    <Upload>
                      {(isEmpty(values.theme.banner) ||
                        !ifElse(
                          has('response'),
                          view(lensPath(['response', 'url'])),
                          prop('url')
                        )(values.theme.banner[0])) && (
                        <Button block type="primary" size="middle" icon={<UploadOutlined />}>
                          Upload Banner
                        </Button>
                      )}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Logo"
                    name={['theme', 'logo']}
                    rules={[{ required: true, message: 'Upload a logo.' }]}
                  >
                    <Upload>
                      {isEmpty(values.theme.logo) && (
                        <Button block type="primary" size="middle" icon={<UploadOutlined />}>
                          Upload
                        </Button>
                      )}
                    </Upload>
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
                        Main text Lorem gizzle dolizzle go to hizzle amizzle, own yo adipiscing fo
                        shizzle. Cool sapizzle velizzle, volutpat, suscipizzle quis, gravida vizzle,
                        arcu.
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
            </TabPane>
            <TabPane tab="Subdomain" key="subdomain">
              <Title level={2}>Switch your store subdomain.</Title>
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
                <Input autoFocus suffix=".holaplex.com" />
              </DomainFormItem>
            </TabPane>
            <TabPane tab="Store info" key="metadata">
              <Title level={2}>Tell us about your store.</Title>
              <Form.Item
                label="Favicon"
                name={['meta', 'favicon']}
                rules={[{ required: true, message: 'Upload a favicon.' }]}
              >
                <Upload>
                  {isEmpty(values.meta.favicon) && (
                    <Button block type="primary" size="middle" icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  )}
                </Upload>
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
            </TabPane>
          </Tabs>
          <Row justify="end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={submitting}
              loading={submitting}
            >
              Update
            </Button>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
