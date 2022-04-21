import DomainFormItem from '@/common/components/elements/DomainFormItem';
import FontSelect from '@/common/components/elements/FontSelect';
import Upload from '@/common/components/elements/Upload';
import Button from '@/components/elements/Button';
import ColorPicker from '@/components/elements/ColorPicker';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { StorefrontContext } from '@/modules/storefront';
import Loading from '@/components/elements/Loading';
import styled from 'styled-components';
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
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
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
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const { TabPane } = Tabs;

type TabKey = 'subdomain' | 'theme' | 'meta';

export default function Edit() {
  const [submitting, setSubmitting] = useState(false);
  const { track } = useAnalytics();
  const router = useRouter();
  const arweave = initArweave();
  const { setVisible } = useWalletModal();
  const ar = arweaveSDK.using(arweave);
  const { storefront, searching } = useContext(StorefrontContext);
  const [form] = Form.useForm();
  const { solana, wallet, looking } = useContext(WalletContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: storefront?.subdomain },
    { name: ['theme', 'backgroundColor'], value: storefront?.theme.backgroundColor },
    { name: ['theme', 'primaryColor'], value: storefront?.theme.primaryColor },
    { name: ['theme', 'titleFont'], value: storefront?.theme.titleFont },
    { name: ['theme', 'textFont'], value: storefront?.theme.textFont },
    { name: ['theme', 'banner'], value: [{ ...storefront?.theme.banner, status: 'done' }] },
    { name: ['theme', 'logo'], value: [{ ...storefront?.theme.logo, status: 'done' }] },
    {
      name: ['meta', 'favicon'],
      value: ifElse(
        // @ts-ignore
        pipe(prop('url'), isNil),
        () => [],
        (favicon) => [merge({ status: 'done' })(favicon)]
        // @ts-ignore
      )(storefront?.meta.favicon),
    },
    { name: ['meta', 'title'], value: storefront?.meta.title ?? '' },
    { name: ['meta', 'description'], value: storefront?.meta.description ?? '' },
    {
      name: ['integrations', 'crossmintClientId'],
      value: storefront?.integrations?.crossmintClientId ?? uuidv4(),
    },
  ]);

  useEffect(() => {
    setFields([
      { name: ['subdomain'], value: storefront?.subdomain },
      { name: ['theme', 'backgroundColor'], value: storefront?.theme.backgroundColor },
      { name: ['theme', 'primaryColor'], value: storefront?.theme.primaryColor },
      { name: ['theme', 'titleFont'], value: storefront?.theme.titleFont },
      { name: ['theme', 'textFont'], value: storefront?.theme.textFont },
      { name: ['theme', 'banner'], value: [{ ...storefront?.theme.banner, status: 'done' }] },
      { name: ['theme', 'logo'], value: [{ ...storefront?.theme.logo, status: 'done' }] },
      {
        name: ['meta', 'favicon'],
        value: ifElse(
          // @ts-ignore
          pipe(prop('url'), isNil),
          () => [],
          (favicon) => [merge({ status: 'done' })(favicon)]
          // @ts-ignore
        )(storefront?.meta.favicon),
      },
      { name: ['meta', 'title'], value: storefront?.meta.title ?? '' },
      { name: ['meta', 'description'], value: storefront?.meta.description ?? '' },
      {
        name: ['integrations', 'crossmintClientId'],
        value: storefront?.integrations?.crossmintClientId ?? uuidv4(),
      },
    ]);
  }, [storefront]);

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

  const subdomainUniqueness = validateSubdomainUniqueness(ar, wallet?.pubkey);

  const onSubmit = submitCallback({
    trackingFunction: () =>
      track('Storefront Updated', {
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
  });

  const textColor = getTextColor(values.theme.backgroundColor);
  const buttontextColor = getTextColor(values.theme.primaryColor);

  return (
    <Loading loading={searching || looking}>
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
                    <StyledUploadFormItem
                      label="Banner"
                      name={['theme', 'banner']}
                      tooltip="Sits at the top of your store, 1500px wide and 375px tall works best!"
                      rules={[{ required: false, message: 'Upload your Banner.' }]}
                    >
                      <Upload>
                        {(isEmpty(values.theme.banner) ||
                          !ifElse(
                            has('response'),
                            view(lensPath(['response', 'url'])),
                            prop('url')
                          )(values.theme.banner[0])) && <Button block>Upload Banner</Button>}
                      </Upload>
                    </StyledUploadFormItem>
                    <StyledUploadFormItem
                      label="Logo"
                      name={['theme', 'logo']}
                      rules={[{ required: true, message: 'Upload a logo.' }]}
                    >
                      <Upload>{isEmpty(values.theme.logo) && <Button block>Upload</Button>}</Upload>
                    </StyledUploadFormItem>
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
                          shizzle. Cool sapizzle velizzle, volutpat, suscipizzle quis, gravida
                          vizzle, arcu.
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
                      pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
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
              </TabPane>
            </Tabs>
            <Row justify="end">
              <Button disabled={submitting} loading={submitting} htmlType="submit">
                Update
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </Loading>
  );
}

const StyledUploadFormItem = styled(Form.Item)`
  .ant-upload-list-item-card-actions-btn {
    svg {
      fill: red;
      stroke: red;
    }
  }
  .ant-upload-list-item-info {
    &:hover {
      background-color: transparent;
    }
  }
`;
