import React, { useState, useContext } from 'react';
import sv from '@/constants/styles'
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
// @ts-ignore
import Color from 'color'
import { Card, Row, Col, Typography, Input, Space, Form } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import Button from '@/components/elements/Button'
import ColorPicker from '@/components/elements/ColorPicker'
import FontSelect from '@/common/components/elements/FontSelect'
import DomainFormItem from '@/common/components/elements/DomainFormItem'
import Upload from '@/common/components/elements/Upload'
import { stylesheet } from '@/modules/theme'
import { initArweave } from '@/modules/arweave'
import { WalletContext } from '@/modules/wallet'
import FillSpace from '@/components/elements/FillSpace'
import arweaveSDK from '@/modules/arweave/client'
import StepForm from '@/components/elements/StepForm'
import type { GoogleTracker } from '@/modules/ganalytics/types'
import InlineFormItem from '@/common/components/elements/InlineFormItem'
import { isNil, reduce, assocPath, isEmpty, findIndex, propEq, update } from 'ramda';
import HowToArModal from '@/common/components/elements/HowToArModal';

const { Text, Title, Paragraph } = Typography

const PreviewButton = styled.div<{ textColor: string }>`
  height: 52px;
  background: ${props => props.color};
  color: ${props => props.textColor};
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
  color: ${props => props.color};
  text-decoration: underline;
`;

type PrevTitleProps = {
  color: string;
  level: number;
  fontFamily: string;

}
const PrevTitle = styled(Title)`
  &.ant-typography {
    font-family: '${({ fontFamily }: PrevTitleProps) => fontFamily}', sans;
    color: ${({ color }: PrevTitleProps) => color};
  }
`

type PrevTextProps = {
  color: string;
  fontFamily: string;
}

const PrevText = styled(Text)`
&.ant-typography {
  font-family: '${({ fontFamily }: PrevTextProps) => fontFamily}', sans;
  color: ${({ color }: PrevTextProps) => color};
}
`
type PrevCardProps = {
  bgColor: string;
}

const PrevCard = styled(Card)`
&.ant-card {
  border-radius: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: ${({ bgColor }: PrevCardProps) => bgColor};
}
`

const PageCard = styled(Card)`
  margin: 70px 0 32px 0;
`

const PrevCol = styled(Col)`
  margin: 0 0 24px 0;
`

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

interface NewProps {
  track: GoogleTracker
}

export default function New({ track }: NewProps) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const arweave = initArweave()
  const [form] = Form.useForm()
  const {
    solana,
    arweaveRoadblockVisible
  } = useContext(WalletContext)
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: '' },
    { name: ['pubkey'], value: '' },
    { name: ['theme', 'backgroundColor'], value: '#333333' },
    { name: ['theme', 'primaryColor'], value: '#F2C94C' },
    { name: ['theme', 'titleFont'], value: 'Work Sans' },
    { name: ['theme', 'textFont'], value: 'Work Sans' },
    { name: ['theme', 'logo'], value: [] },
    { name: ['meta', 'favicon'], value: [] },
    { name: ['meta', 'title'], value: '' },
    { name: ['meta', 'description'], value: '' }
  ]);

  if (isNil(solana)) {
    return
  }

  const values = reduce((acc: any, item: FieldData) => {
    return assocPath(item.name as string[], item.value, acc)
  }, {}, fields)

  const subdomainUniqueness = async (_: any, subdomain: any) => {
    const storefront = await arweaveSDK.using(arweave).storefront.find("holaplex:metadata:subdomain", subdomain || "")

    if (isNil(storefront)) {
      return Promise.resolve(subdomain)
    }

    return Promise.reject("The subdomain is already in use. Please pick another.")
  }

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      const { theme, subdomain, meta } = values;

      const logo = theme.logo[0].response
      const favicon = meta.favicon[0].response

      const css = stylesheet({ ...theme, logo })

      await arweaveSDK.using(arweave).storefront.upsert(
        {
          pubkey: solana.publicKey.toString(),
          subdomain,
          theme: { ...theme, logo },
          meta: { ...meta, favicon }
        },
        css
      )

      toast(() => (<>Your storefront is ready. Visit <a href={`https://${subdomain}.holaplex.com`}>{subdomain}.holaplex.com</a> to finish setting up your storefront.</>), { autoClose: 60000 })

      router.push("/")
        .then(() => {
          track('storefront', 'created')
          setSubmitting(false)
        })
    } catch (e) {
      setSubmitting(false)
      toast.error(() => (<>There was an issue creating your storefront. Please wait a moment and try again.</>))

    }
  }

  const textColor = new Color(values.theme.backgroundColor).isDark() ? sv.colors.buttonText : sv.colors.text
  const buttontextColor = new Color(values.theme.primaryColor).isDark() ? sv.colors.buttonText : sv.colors.text

  return (
    <Row justify="center" align="middle">
      <HowToArModal 
        isModalVisible={arweaveRoadblockVisible}
        />
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <PageCard>
          <StepForm
            submitting={submitting}
            form={form}
            size="large"
            fields={fields}
            onFieldsChange={([changed], _) => {
              if (isNil(changed)) {
                return
              }

              const current = findIndex(propEq('name', changed.name), fields)
              setFields(update(current, changed, fields));
            }}
            onFinish={onSubmit}
            layout="horizontal"
            colon={false}
          >
            <Row>
              <FillSpace direction="vertical" size="large">
                <Col>
                  <Title level={2}>Let&apos;s start with your sub-domain.</Title>
                  <Paragraph>This is the address that people will use to get to your store.</Paragraph>
                </Col>
                <Col flex={1}>
                  <DomainFormItem
                    name="subdomain"
                    rules={[
                      { required: true, pattern: /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/, message: "The subdomain entered is not valid." },
                      { required: true, validator: subdomainUniqueness },
                    ]}
                  >
                    <Input autoFocus suffix=".holaplex.com" />
                  </DomainFormItem>
                </Col>
              </FillSpace>
            </Row>
            <Row justify="space-between">
              <Col sm={24} md={12} lg={12}>
                <Title level={2}>Next, theme your store.</Title>
                <Paragraph>Choose a logo, colors, and fonts to fit your store’s brand.</Paragraph>
                <InlineFormItem
                  noBackground
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  label="Logo"
                  name={["theme", "logo"]}
                  rules={[
                    { required: true, message: "Upload a logo." },
                  ]}
                >
                  <Upload>
                    {isEmpty(values.theme.logo) && (
                      <Button block type="primary" size="middle" icon={<UploadOutlined />} >Upload</Button>
                    )}
                  </Upload>
                </InlineFormItem>
                <InlineFormItem
                  name={["theme", "backgroundColor"]}
                  label="Background"
                  labelCol={{ xs: 10 }}
                  wrapperCol={{ xs: 14 }}
                >
                  <ColorPicker />
                </InlineFormItem>
                <InlineFormItem
                  name={["theme", "primaryColor"]}
                  label="Buttons &amp; Links"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                >
                  <ColorPicker />
                </InlineFormItem>
                <InlineFormItem
                  name={["theme", "titleFont"]}
                  label="Title Font"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                >
                  <FontSelect />
                </InlineFormItem>
                <InlineFormItem
                  name={["theme", "textFont"]}
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
                    {values.theme.logo[0] && values.theme.logo[0].status === "done" && (
                      <UploadedLogo src={values.theme.logo[0].response.url} />
                    )}
                    <PrevTitle level={2} color={textColor} fontFamily={values.theme.titleFont}>Big Title</PrevTitle>
                    <PrevTitle level={3} color={textColor} fontFamily={values.theme.titleFont}>Little Title</PrevTitle>
                    <PrevText color={textColor} fontFamily={values.theme.textFont}>Main text Lorem gizzle dolizzle go to hizzle amizzle, own yo adipiscing fo shizzle. Cool sapizzle velizzle, volutpat, suscipizzle quis, gravida vizzle, arcu.</PrevText>
                    <PreviewLink
                      color={values.theme.primaryColor}

                    >
                      Link to things
                    </PreviewLink>
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
            <Row justify="space-between">
              <Col xs={24}>
                <Title level={2}>Finally, set page meta data.</Title>
                <Paragraph>Upload a favicon and set other page meta data. This information will display on social platforms, such as Twitter and Facebook, when links to the store are shared.</Paragraph>
                <InlineFormItem
                  noBackground
                  labelCol={{ xs: 8, md: 6, xxl: 4 }}
                  wrapperCol={{ xs: 16, md: 18, xxl: 20 }}
                  label="Favicon"
                  name={["meta", "favicon"]}
                  rules={[
                    { required: true, message: "Upload a favicon." }
                  ]}
                >
                  <Upload>
                    {isEmpty(values.meta.favicon) && (
                      <Button block type="primary" size="middle" icon={<UploadOutlined />} >Upload</Button>
                    )}
                  </Upload>
                </InlineFormItem>
                <InlineFormItem
                  name={["meta", "title"]}
                  rules={[
                    { required: true, message: "Please enter a page title." }
                  ]}
                  label="Page Title"
                  labelCol={{ xs: 8, md: 6, xxl: 4 }}
                  wrapperCol={{ xs: 16, md: 18, xxl: 20 }}
                >
                  <Input autoFocus />
                </InlineFormItem>
                <InlineFormItem
                  name={["meta", "description"]}
                  label="Page Description"
                  rules={[
                    { required: true, message: "Please enter a page description." }
                  ]}
                  labelCol={{ xs: 8, md: 6, xxl: 4 }}
                  wrapperCol={{ xs: 16, md: 18, xxl: 20 }}
                >
                  <Input.TextArea />
                </InlineFormItem>
              </Col>
            </Row>
          </StepForm>
        </PageCard>
      </Col>
    </Row>
  )
}
