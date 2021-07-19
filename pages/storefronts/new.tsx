import React from 'react';
import sv from '@/constants/styles'
import styled from 'styled-components';
import {
  RoundedContainer,
  Text,
  H2,
  H4,
} from '@/components/elements/StyledComponents'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Field, FormSpy } from 'react-final-form'
import { Storefront } from '@/modules/storefront/types'
import WizardForm from '@/components/elements/WizardForm'
import TextInput from '@/components/elements/TextInput'
import FileInput from '@/components/elements/FilePickerWithLabel'
import ColorPicker from '@/components/elements/ColorPicker'
import FontPicker from '@/components/elements/FontPicker'
import WizardFormStep from '@/components/elements/WizardFormStep'
import { isDarkColor } from '@/utils/index'
import { stylesheet } from '@/modules/theme'
import { AuthProvider } from '@/modules/auth'
import { initArweave } from '@/modules/arweave'
import { Solana } from '@/modules/solana/types'
import arweaveSDK from '@/modules/arweave/client'
import Loading from '@/components/elements/Loading'

const Content = styled.div`
  flex: 1;
  ${sv.flexCenter};
  overflow: hidden;
  padding-bottom: 16px;
`;

const NameField = styled(TextInput)`
  margin-top: ${sv.appPadding}px;
`;

const SubTitle = styled(Text)`
  margin-bottom: ${sv.appPadding}px;
`;

const Fields = styled.div`
  flex: 1;
`;

const FieldBlock = styled.div`
  margin-bottom: ${sv.grid * 2}px;
`;

const PreviewItem = styled.div`
  margin-bottom: ${sv.grid * 4}px;
`;

const Container = styled.div`
  ${sv.flexRow};
`;

const Preview = styled.div<{ bgColor: string }>`
  flex: 1;
  align-self: stretch;
  ${sv.flexColumn};
  justify-content: center;
  padding: ${sv.appPadding}px;
  margin-left: ${sv.appPadding}px;
  background: ${props => props.bgColor};
  border-radius: 12px;
  ${sv.box};
`;

const PreviewButton = styled.div<{ textColor: string }>`
  height: ${sv.buttonHeight}px;
  background: ${props => props.color};
  color: ${props => props.textColor};
  width: fit-content;
  padding: 0 ${sv.grid * 3}px;
  ${sv.flexCenter};
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

type NewStorefrontProps = {
  solana: Solana;
  arweaveWallet: any;
}

export default function New({ arweaveWallet, solana }: NewStorefrontProps) {
  const router = useRouter()
  const arweave = initArweave()

  const subdomainUniqueness = async ({ subdomain }: Storefront) => {
    const response = await arweaveSDK.query(arweave, arweaveSDK.queries.transactionBySubdomain, { subdomain: (subdomain || "") })

    if (response.data.transactions.edges.length === 0) {
      return {}
    }

    return { subdomain: "That domain is already taken. Enter a different name." }
  }

  const validateTheme = ({ theme: { logo } }: Storefront) => {
    if (!logo.url) {
      return { logo: "A logo is required." }
    }
  }

  const onSubmit = async ({ subdomain, theme }: Storefront) => {
    const css = stylesheet(theme)

    const transaction = await arweave.createTransaction({ data: css })

    toast(() => (<>Your storefront theme is ready to be uploaded to Arweave.</>))

    transaction.addTag("Content-Type", "text/css")
    transaction.addTag("solana:pubkey", window.solana.publicKey.toString())
    transaction.addTag("holaplex:metadata:subdomain", subdomain)
    transaction.addTag("holaplex:theme:logo:url", theme.logo.url)
    transaction.addTag("holaplex:theme:logo:name", theme.logo.name)
    transaction.addTag("holaplex:theme:logo:type", theme.logo.type)
    transaction.addTag("holaplex:theme:color:primary", theme.primaryColor)
    transaction.addTag("holaplex:theme:color:background", theme.backgroundColor)
    transaction.addTag("holaplex:theme:font:title", theme.titleFont)
    transaction.addTag("holaplex:theme:font:text", theme.textFont)

    await arweave.transactions.sign(transaction)

    await arweave.transactions.post(transaction)

    toast(() => (<>Your storefront theme was uploaded to Arweave. Visit <a href={`https://${subdomain}.holaplex.com`}>{subdomain}.holaplex.com</a> to finish setting up your storefront.</>), { autoClose: 60000 })

    router.push("/")
  }

  const initialValues = {
    theme: {
      backgroundColor: '#333333',
      primaryColor: '#F2C94C',
      titleFont: 'Work Sans',
      textFont: 'Work Sans',
      logo: {},
    },
    subdomain: "",
    pubkey: ""
  }

  return (
    <AuthProvider solana={solana} arweaveWallet={arweaveWallet}>
      {({ authenticating }) => (
      <Loading loading={authenticating}>
        <Content>
          <RoundedContainer>
            <WizardForm
              onSubmit={onSubmit}
              initialValues={initialValues}
            >
              <WizardFormStep validate={subdomainUniqueness}>
                <>
                  <H2>Let&apos;s start with your sub-domain.</H2>
                  <Text>This is the address that people will use to get to your store.</Text>
                  <Field
                    name="subdomain"
                    render={({ input, meta}) => <NameField {...input} meta={meta} autoFocus rootDomain=".holaplex.com" />}
                    autoFocus
                  />
                </>
              </WizardFormStep>
              <WizardFormStep validate={validateTheme}>
                <Container>
                  <Fields>
                    <H2>Customize your store.</H2>
                    <SubTitle>Choose a logo, colors, and fonts to fit your store’s brand.</SubTitle>
                    <FieldBlock>
                      <Field<FileList> name="theme.logo">
                        {({ input: { value, onChange, ...input } }) => (
                          <FileInput
                            label="Logo"
                            value={value}
                            onChange={onChange}
                            {...input}
                          />
                        )}
                      </Field>
                    </FieldBlock>
                    <FieldBlock>
                      <Field
                        name="theme.backgroundColor"
                        render={props => <ColorPicker {...props.input} label="Background" />}
                      />
                    </FieldBlock>
                    <FieldBlock>
                      <Field
                        name="theme.primaryColor"
                        render={props => <ColorPicker {...props.input} label="Buttons &amp; Links" />}
                      />
                    </FieldBlock>
                    <FieldBlock>
                      <Field
                        name="theme.titleFont"
                        render={props => <FontPicker {...props.input} label="Title Font" pickerId="title" />}
                      />
                    </FieldBlock>
                    <FieldBlock>
                      <Field
                        name="theme.textFont"
                        render={props => <FontPicker {...props.input} label="Main Text Font" pickerId="body" />}
                      />
                    </FieldBlock>
                  </Fields>
                  {/* @ts-ignore */}
                  <FormSpy>
                    {(props) => {
                      const { values: { theme: { backgroundColor, primaryColor, logo } } } = props
                      const textColor = isDarkColor(backgroundColor) ? sv.colors.buttonText : sv.colors.text
                      const buttontextColor = isDarkColor(primaryColor) ? sv.colors.buttonText : sv.colors.text

                      return (
                        <Preview bgColor={backgroundColor}>
                          {logo.url && (
                            <PreviewItem>
                              <UploadedLogo src={logo.url} />
                            </PreviewItem>
                          )}
                          <PreviewItem>
                            <H2 className="apply-font-title" color={textColor}>Big Title</H2>
                          </PreviewItem>
                          <PreviewItem>
                            <H4 className="apply-font-title" color={textColor}>Little Title</H4>
                          </PreviewItem>
                          <PreviewItem>
                            <Text className="apply-font-body" color={textColor}>Main text Lorem gizzle dolizzle go to hizzle amizzle, own yo adipiscing fo shizzle. Cool sapizzle velizzle, volutpat, suscipizzle quis, gravida vizzle, arcu.</Text>
                          </PreviewItem>
                          <PreviewItem>
                            <PreviewLink
                              className="apply-font-body"
                              color={primaryColor}
                            >
                              Link to things
                            </PreviewLink>
                          </PreviewItem>
                          <PreviewItem>
                            <PreviewButton
                              className="apply-font-body"
                              color={primaryColor}
                              textColor={buttontextColor}
                            >
                              Button
                            </PreviewButton>
                          </PreviewItem>
                        </Preview>
                      )
                    }}
                  </FormSpy>
                </Container>
              </WizardFormStep>
              <WizardFormStep pristine={false}>
                <>
                  <H2>Almost done!</H2>
                  <Text>The final step is to save your storefront to arweave.</Text>
                </>
              </WizardFormStep>
            </WizardForm>
          </RoundedContainer>
        </Content>
      </Loading>
      )}
    </AuthProvider>
  )
}
