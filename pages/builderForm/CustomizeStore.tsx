// @ts-nocheck
import {useState} from 'react';
import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from '../../components/core/Button';
import Link from '../../components/core/Link';
import FilePickerWithLabel from '../../components/core/FilePickerWithLabel';
import ColorPicker from '../../components/core/ColorPicker';
import FontPicker from '../../components/core/FontPicker';
import {isDarkColor} from '../../lib/services/utils';
import {
  Text,
  H2,
  H4,
  Label,
  RoundedContainer,
  Actions
} from '../../constants/StyleComponents';

////// STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled(RoundedContainer)`
  ${sv.flexRow};
`;

const SubTitle = styled(Text)`
  margin-bottom: ${sv.appPadding}px;
`;

const Form = styled.div`
  flex: 1;
`;

const Field = styled.div`
  margin-bottom: ${sv.grid*2}px;
`;

const PreviewItem = styled.div`
  margin-bottom: ${sv.grid*4}px;
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
  padding: 0 ${sv.grid*3}px;
  ${sv.flexCenter};
  border-radius: 8px;
  font-weight: 700;
`;

const PreviewLink = styled.div`
  color: ${props => props.color};
  text-decoration: underline;
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type Props = {
  nextAction: () => void,
  backAction: () => void,
}

const CustomizeStore = ({nextAction, backAction}: Props) => {

  const [logo, setLogo] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState('#333333')
  const [primaryColor, setPrimaryColor] = useState('#F2C94C')
  const [titleFont, setTitleFont] = useState('Work Sans')
  const [textFont, settextFont] = useState('Work Sans')

  const textColor = isDarkColor(backgroundColor) ? sv.colors.buttonText : sv.colors.text
  const buttontextColor = isDarkColor(primaryColor) ? sv.colors.buttonText : sv.colors.text

  return (
    <Container>
      <Form>
        <H2>Customize your store.</H2>
        <SubTitle>Choose a logo, colors, and fonts to fit your store’s brand.</SubTitle>
        <Field>
          {/* @ts-ignore */}
          <FilePickerWithLabel
            label={logo ? 'logo' : 'Upload logo (transparent .png or .svg)'}
            file={logo}
            onChange={(val) => setLogo(val)}
            clearFile={() => setLogo(null)}
          />
        </Field>
        <Field>
          <ColorPicker
            label="Background color"
            color={backgroundColor}
            onChange={(newColor) => setBackgroundColor(newColor)}
          />
        </Field>
        <Field>
          <ColorPicker
            label="Primary color (buttons & links)"
            color={primaryColor}
            onChange={(newColor) => setPrimaryColor(newColor)}
          />
        </Field>
        <Field>
          <FontPicker
            label="Title Font"
            pickerId="title"
            font={titleFont}
          />
        </Field>
        <Field>
          <FontPicker
            label="Main Text Font"
            pickerId="body"
            font={textFont}
          />
        </Field>
        <Actions>
          <Button
            label="Back"
            subtle
            marginRight
            action={backAction}
          />
          <Button
            label="Next"
            action={nextAction}
          />
        </Actions>
      </Form>
      {/* @ts-ignore */}
      <Preview bgColor={backgroundColor}>
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
    </Container>
  )
}

export default CustomizeStore;
