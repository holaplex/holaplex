import React, { useEffect, useState } from 'react';
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
import { Field, Form } from 'react-final-form'
import { Storefront } from '@/modules/storefront/types'
import FileInput from '@/components/elements/FilePickerWithLabel'
import ColorPicker from '@/components/elements/ColorPicker'
import FontPicker from '@/components/elements/FontPicker'
import HandWaving from '@/components/elements/HandWaving'
import { isDarkColor } from '@/utils/index'
import { Wallet } from '@/modules/wallet/types'
import { stylesheet, base64EncodeFile } from '@/modules/theme'
import walletSDK from '@/modules/wallet/client'
import { initArweave } from '@/modules/arweave'

const Content = styled.div`
  flex: 1;
  ${sv.flexCenter};
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

export default function New() {
  const router = useRouter()
  const arweave = initArweave()
  const [loading, setLoading] = useState(true)

  const validateTheme = ({ theme: { logo } }: Storefront) => {
    if (!logo) {
      return { logo: "A logo is required." }
    }
  }

  const onSubmit = async ({ subdomain, theme }: Storefront) => {
    const logo = await base64EncodeFile(theme.logo)
    const data = await stylesheet({ ...theme, logo })

    toast("Your storefront theme was generated.", { autoClose: 5000 })

    const transaction = await arweave.createTransaction({ data })

    toast("Your Arweave theme transaction was created.", { autoClose: 5000 })

    transaction.addTag("Content-Type", "text/css")
    transaction.addTag("holaplex:metadata:subdomain", subdomain)
    transaction.addTag("solana:pubkey", window.solana.publicKey.toString())
    transaction.addTag("holaplex:theme:color:primary", theme.primaryColor)
    transaction.addTag("holaplex:theme:color:background", theme.backgroundColor)
    transaction.addTag("holaplex:theme:font:title", theme.titleFont)
    transaction.addTag("holaplex:theme:font:text", theme.textFont)

    await arweave.transactions.sign(transaction)

    toast("The transaction was successfully signed by your wallet.", { autoClose: 5000 })

    await arweave.transactions.post(transaction)

    toast(() => (<>Your updated storefront theme was accepted by Arweave. Visit <a href={`https://${subdomain}.holaplex.com`}>{subdomain}.holaplex.com</a> for the updated storefront.</>), { autoClose: 60000 })

    router.push("/")
  }

  useEffect(() => {
    if (process.browser) {
      window.solana.connect({ onlyIfTrusted: true })
      .then(() => walletSDK.find(window.solana.publicKey.toString()))
      .then((wallet: Wallet) => {
        if (wallet && wallet.approved) {
          return window.arweaveWallet.getActivePublicKey()
        }
      })
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        router.push("/")
      });
    }
  }, [])

  const initialValues = {
    theme: {
      backgroundColor: '#333333',
      primaryColor: '#F2C94C',
      titleFont: 'Work Sans',
      textFont: 'Work Sans',
    },
    subdomain: "",
    pubkey: ""
  }

  return (
    <Content>
      {loading ? (
        <HandWaving />
      ) : (
        <RoundedContainer>
          <Container>
            <Form
              initialValues={initialValues}
              onSubmit={onSubmit}
              validate={validateTheme}
            >
              {({ handleSubmit, values }) => {

                const { theme: { backgroundColor, primaryColor, logo } } = values
                const textColor = isDarkColor(backgroundColor) ? sv.colors.buttonText : sv.colors.text
                const buttontextColor = isDarkColor(primaryColor) ? sv.colors.buttonText : sv.colors.text

                return (
                  <form onSubmit={handleSubmit}>
                    <Fields>
                      <H2>Edit your store.</H2>
                      <SubTitle>Choose a different logo, colors, and fonts for your store.</SubTitle>
                      <FieldBlock>
                        <Field<FileList> name="theme.logo">
                          {({ input: { value, onChange, ...input } }) => (
                            <FileInput
                              label="Upload Logo (Transparent .Png Or .Svg)"
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
                    <Preview bgColor={backgroundColor}>
                      {logo &&
                        <PreviewItem>
                          <UploadedLogo src={logo && URL.createObjectURL(logo)} />
                        </PreviewItem>
                      }
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
                  </form>
                )
              }}
            </Form>
          </Container>
        </RoundedContainer>
      )}
    </Content>
  )
}
