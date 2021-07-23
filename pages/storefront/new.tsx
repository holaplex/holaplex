import React, { useState, useContext } from 'react';
import sv from '@/constants/styles'
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
// @ts-ignore
import Color from 'color'
import { Card, Row, Col, Typography, Input, Space, Form, FormItemProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import Button from '@/components/elements/Button'
import ColorPicker from '@/components/elements/ColorPicker'
import FontSelect from '@/common/components/elements/FontSelect'
import Upload from '@/common/components/elements/Upload'
import { stylesheet } from '@/modules/theme'
import { initArweave } from '@/modules/arweave'
import { WalletContext } from '@/modules/wallet'
import FillSpace from '@/components/elements/FillSpace'
import arweaveSDK from '@/modules/arweave/client'
import StepForm from '@/components/elements/StepForm'
import { isNil, reduce, assocPath, isEmpty, findIndex, propEq, update } from 'ramda';

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

const DomainFormItem = styled(Form.Item)`
  text-align: right;
  font-size: 24px;
  .ant-input {
    font-size: 24px;
    border-radius: 0px;
  }
  .ant-input-suffix {
    margin: 0;
    color: rgb(102, 102, 102);
  }
  .ant-form-item-explain {
    text-align: left;
  }
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

interface InlineFormItemProps extends FormItemProps {
  noBackground?: boolean;
}
const InlineFormItem = styled(Form.Item)<InlineFormItemProps>`
  &.ant-form-item {
    background: ${({ noBackground }) => noBackground ? "none" : "#e0e0e0"};
    border-radius: 12px;
    padding: 0 0 0 15px;
  }

  .ant-form-item-label {
    text-align: left;
  }

  .ant-form-item-control-input-content, .ant-form-item-explain {
    text-align: right;
  }
`
interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const PrevCol = styled(Col)`
  margin: 0 0 24px 0;
`

export default function New() {
  const router = useRouter()
  const arweave = initArweave()
  const [form] = Form.useForm()
  const { solana } = useContext(WalletContext)
  const [fields, setFields] = useState<FieldData[]>([
    { name: ['subdomain'], value: '' },
    { name: ['pubkey'], value: '' },
    { name: ['theme', 'backgroundColor'], value: '#333333' },
    { name: ['theme', 'primaryColor'], value: '#F2C94C' },
    { name: ['theme', 'titleFont'], value: 'Work Sans' },
    { name: ['theme', 'textFont'], value: 'Work Sans' },
    { name: ['theme', 'logo'], value: [] },
  ]);

  if (isNil(solana)) {
    return
  }

  const values = reduce((acc: any, item: FieldData) => {
    return assocPath(item.name as string[], item.value, acc)
  }, {}, fields)

  const subdomainUniqueness = async (_: any, subdomain: any) => {
    const storefront = await arweaveSDK.search(arweave).storefront("holaplex:metadata:subdomain", subdomain || "")

    if (isNil(storefront)) {
      return Promise.resolve(subdomain)
    }

    return Promise.reject("The subdomain is already in use. Please pick another.")
  }

  const onSubmit = async () => {
    const { theme, subdomain } = values;

    const logo = theme.logo[0].response
    const css = stylesheet({ ...theme, logo })

    const transaction = await arweave.createTransaction({ data: css })

    toast(() => (<>Your storefront theme is being uploaded to Arweave.</>))

    transaction.addTag("Content-Type", "text/css")
    transaction.addTag("solana:pubkey", solana.publicKey.toString())
    transaction.addTag("holaplex:metadata:subdomain", subdomain)
    transaction.addTag("holaplex:theme:logo:url", logo.url)
    transaction.addTag("holaplex:theme:logo:name", logo.name)
    transaction.addTag("holaplex:theme:logo:type", logo.type)
    transaction.addTag("holaplex:theme:color:primary", theme.primaryColor)
    transaction.addTag("holaplex:theme:color:background", theme.backgroundColor)
    transaction.addTag("holaplex:theme:font:title", theme.titleFont)
    transaction.addTag("holaplex:theme:font:text", theme.textFont)

    await arweave.transactions.sign(transaction)

    await arweave.transactions.post(transaction)

    toast(() => (<>Your storefront is ready. Visit <a href={`https://${subdomain}.holaplex.com`}>{subdomain}.holaplex.com</a> to finish setting up your storefront.</>), { autoClose: 60000 })

    router.push("/")
  }

  const textColor = new Color(values.theme.backgroundColor).isDark() ? sv.colors.buttonText : sv.colors.text
  const buttontextColor = new Color(values.theme.primaryColor).isDark() ? sv.colors.buttonText : sv.colors.text

  return (
    <Row justify="center" align="middle">
      <Col xs={21} lg={18} xl={14}  xxl={10}>
        <Card>
          <StepForm
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
                      { required: true, message: "Enter a subdomain." },
                      { validator: subdomainUniqueness }
                    ]}
                  >
                    <Input autoFocus suffix=".holaplex.com" />
                  </DomainFormItem>
                </Col>
              </FillSpace>
            </Row>
            <Row justify="space-between">
              <Col sm={24} md={12} lg={12}>
                <Title level={2}>Customize your store.</Title>
                <Text>Choose a logo, colors, and fonts to fit your store’s brand.</Text>
                <InlineFormItem
                  noBackground
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  label="Logo"
                  name={["theme", "logo"]}
                  rules={[
                    { required: true, message: "Upload a logo." }
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
          </StepForm>
        </Card>
      </Col>
    </Row>
  )
}
