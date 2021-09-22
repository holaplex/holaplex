import DomainFormItem from '@/common/components/elements/DomainFormItem';
import FontSelect from '@/common/components/elements/FontSelect';
import InlineFormItem from '@/common/components/elements/InlineFormItem';
import Upload from '@/common/components/elements/Upload';
import Button from '@/components/elements/Button';
import ColorPicker from '@/components/elements/ColorPicker';
import HowToArModal from '@/components/elements/HowToArModal';
import sv from '@/constants/styles';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import type { GoogleTracker } from '@/modules/ganalytics/types';
import { StorefrontContext } from '@/modules/storefront';
import { stylesheet } from '@/modules/theme';
import { WalletContext } from '@/modules/wallet';
import { UploadOutlined } from '@ant-design/icons';
import { Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import Color from 'color';
import { useRouter } from 'next/router';
import {
  assocPath,
  findIndex,
  has,
  ifElse,
  isEmpty,
  isNil,
  lensPath,
  merge,
  not,
  pipe,
  prop,
  propEq,
  reduce,
  update,
  view,
  when,
} from 'ramda';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const { Text, Title, Paragraph } = Typography;

const PreviewButton = styled.div<{ textColor: string }>`
  height: 52px;
  background: ${(props) => props.color};
  color: ${(props) => props.textColor};
  width: fit-content;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  font-weight: 700;
`;

const UploadedLogo = styled.img`
  height: 48px;
  width: 48px;
`;

const PreviewLink = styled.div`
  color: ${(props) => props.color};
  text-decoration: underline;
`;

type PrevTitleProps = {
  color: string;
  level: number;
  fontFamily: string;
};
const PrevTitle = styled(Title)`
  &.ant-typography {
    font-family: '${({ fontFamily }: PrevTitleProps) => fontFamily}', sans;
    color: ${({ color }: PrevTitleProps) => color};
  }
`;

type PrevTextProps = {
  color: string;
  fontFamily: string;
};

const PrevText = styled(Text)`
  &.ant-typography {
    font-family: '${({ fontFamily }: PrevTextProps) => fontFamily}', sans;
    color: ${({ color }: PrevTextProps) => color};
  }
`;
type PrevCardProps = {
  bgColor: string;
};

const PrevCard = styled(Card)`
  &.ant-card {
    border-radius: 12px;
    height: 100%;
    display: flex;
    align-items: center;
    background-color: ${({ bgColor }: PrevCardProps) => bgColor};
  }
`;

const PrevCol = styled(Col)`
  margin: 0 0 24px 0;
`;

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const popFile = when<any, any>(has('response'), prop('response'));

interface StorefrontEditProps {
  track: GoogleTracker;
}

type TabKey = 'subdomain' | 'theme' | 'meta';

export default function Edit({ track }: StorefrontEditProps) {
  const [submitting, setSubmitting] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  // we check for arweave at the last possible moment,
  // assuming they do until we check.
  const router = useRouter();
  const arweave = initArweave();
  const ar = arweaveSDK.using(arweave);
  const [tab, setTab] = useState<TabKey>('theme');
  const { storefront } = useContext(StorefrontContext);
  const [form] = Form.useForm();
  const { solana, wallet, arweaveWalletAddress, connect } = useContext(WalletContext);
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: storefront?.subdomain ?? '' },
    { name: ['theme', 'backgroundColor'], value: storefront?.theme.backgroundColor ?? '#333333' },
    { name: ['theme', 'primaryColor'], value: storefront?.theme.primaryColor ?? '#F2C94C' },
    { name: ['theme', 'titleFont'], value: storefront?.theme.titleFont ?? 'Work Sans' },
    { name: ['theme', 'textFont'], value: storefront?.theme.textFont ?? 'Work Sans' },
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

  if (isNil(solana) || isNil(storefront) || isNil(wallet) || isNil(arweaveWalletAddress)) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Paragraph>Connect your Solana and ARConnect wallets to edit your store.</Paragraph>
            <Button type="primary" block onClick={connect}>
              Connect
            </Button>
          </Space>
        </Card>
      </Row>
    );
  }

  const values = reduce(
    (acc: any, item: FieldData) => {
      return assocPath(item.name as string[], item.value, acc);
    },
    {},
    fields
  );

  const subdomainUniqueness = async (_: any, subdomain: any) => {
    const storefront = await ar.storefront.find('holaplex:metadata:subdomain', subdomain || '');

    if (isNil(storefront) || storefront.pubkey === wallet.pubkey) {
      return Promise.resolve(subdomain);
    }

    return Promise.reject('The subdomain is already in use. Please pick another.');
  };

  const hasArweaveFunds = async (_: any, [file]: any) => {
    if (isNil(file) || file.url) {
      return Promise.resolve();
    }

    const canAfford =
      arweaveWalletAddress && (await ar.wallet.canAfford(arweaveWalletAddress, file.size));
    if (canAfford) {
      return Promise.resolve();
    }

    setShowARModal(true);

    return Promise.reject(new Error('Not enough AR funds to cover the upload fee.'));
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);

      const { theme, meta, subdomain } = values;
      const domain = `${subdomain}.holaplex.com`;

      const logo = popFile(theme.logo[0]);
      const favicon = popFile(meta.favicon[0]);

      const css = stylesheet({ ...theme, logo });

      if (
        isNil(arweaveWalletAddress) ||
        not(ar.wallet.canAfford(arweaveWalletAddress, Buffer.byteLength(css, 'utf8')))
      ) {
        setSubmitting(false);
        setShowARModal(true);

        return Promise.reject();
      }

      await arweaveSDK.using(arweave).storefront.upsert(
        {
          ...storefront,
          subdomain,
          theme: { ...theme, logo },
          meta: { ...meta, favicon },
        },
        css
      );

      toast(
        () => (
          <>
            Your storefront was updated. Visit <a href={`https://${domain}`}>{domain}</a> to view
            the changes.
          </>
        ),
        { autoClose: 60000 }
      );

      router.push('/').then(() => {
        track('storefront', 'updated');

        setSubmitting(false);
      });
    } catch {
      setSubmitting(false);
      toast.error(() => (
        <>There was an issue updating your storefront. Please wait a moment and try again.</>
      ));
    }
  };

  const textColor = new Color(values.theme.backgroundColor).isDark()
    ? sv.colors.buttonText
    : sv.colors.text;
  const buttontextColor = new Color(values.theme.primaryColor).isDark()
    ? sv.colors.buttonText
    : sv.colors.text;

  const subdomain = (
    <>
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
    </>
  );

  const theme = (
    <Row justify="space-between">
      <Col sm={24} md={12} lg={12}>
        <Title level={2}>Style your store.</Title>
        <InlineFormItem
          noBackground
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          label="Logo"
          name={['theme', 'logo']}
          rules={[
            { required: true, message: 'Upload a logo.' },
            { required: true, validator: hasArweaveFunds },
          ]}
        >
          <Upload>
            {isEmpty(values.theme.logo) && (
              <Button block type="primary" size="middle" icon={<UploadOutlined />}>
                Upload
              </Button>
            )}
          </Upload>
        </InlineFormItem>
        <InlineFormItem
          name={['theme', 'backgroundColor']}
          label="Background"
          labelCol={{ xs: 10 }}
          wrapperCol={{ xs: 14 }}
        >
          <ColorPicker />
        </InlineFormItem>
        <InlineFormItem
          name={['theme', 'primaryColor']}
          label="Buttons &amp; Links"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <ColorPicker />
        </InlineFormItem>
        <InlineFormItem
          name={['theme', 'titleFont']}
          label="Title Font"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <FontSelect />
        </InlineFormItem>
        <InlineFormItem
          name={['theme', 'textFont']}
          label="Main Text Font"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <FontSelect />
        </InlineFormItem>
      </Col>
      <PrevCol sm={24} md={11} lg={10}>
        <PrevCard bgColor={values.theme.backgroundColor}>
          <Space direction="vertical">
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
      <Title level={2}>Change page meta data.</Title>
      <InlineFormItem
        noBackground
        labelCol={{ xs: 8 }}
        wrapperCol={{ xs: 16 }}
        label="Favicon"
        name={['meta', 'favicon']}
        rules={[
          { required: true, message: 'Upload a favicon.' },
          { required: true, validator: hasArweaveFunds },
        ]}
      >
        <Upload>
          {isEmpty(values.meta.favicon) && (
            <Button block type="primary" size="middle" icon={<UploadOutlined />}>
              Upload
            </Button>
          )}
        </Upload>
      </InlineFormItem>
      <InlineFormItem
        name={['meta', 'title']}
        rules={[{ required: true, message: 'Please enter a page title.' }]}
        label="Page Title"
        labelCol={{ xs: 8 }}
        wrapperCol={{ xs: 16 }}
      >
        <Input autoFocus />
      </InlineFormItem>
      <InlineFormItem
        name={['meta', 'description']}
        label="Page Description"
        rules={[{ required: true, message: 'Please enter a page description.' }]}
        labelCol={{ xs: 8 }}
        wrapperCol={{ xs: 16 }}
      >
        <Input.TextArea />
      </InlineFormItem>
    </>
  );

  const tabs = { theme, subdomain, meta };
  return (
    <Row justify="center" align="middle">
      <HowToArModal show={showARModal} onCancel={() => setShowARModal(false)} />
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <Card
          activeTabKey={tab}
          onTabChange={async (key) => {
            try {
              await form.validateFields();

              setTab(key as TabKey);
            } catch {}
          }}
          tabList={[
            { key: 'theme', tab: 'Theme' },
            { key: 'subdomain', tab: 'Subdomain' },
            { key: 'meta', tab: 'Page Meta Data' },
          ]}
        >
          <Form
            form={form}
            size="large"
            fields={fields}
            onFieldsChange={([changed], _) => {
              if (isNil(changed)) {
                return;
              }

              const current = findIndex(propEq('name', changed.name), fields);
              setFields(update(current, changed, fields));
            }}
            onFinish={onSubmit}
            layout="horizontal"
            colon={false}
          >
            {tabs[tab]}
            <Row justify="end">
              <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
                Update
              </Button>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
