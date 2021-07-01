import {useState} from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react'
import sv from '@/constants/Styles';
// @ts-ignore
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import {Label} from '@/constants/StyleComponents';

////// STYLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div`
  cursor: pointer;
`;

const Field = styled.div`
  ${sv.inputField};
`;

const ColorPreview = styled.div`
  height: ${sv.grid*4}px;
  width: ${sv.grid*16}px;
  border-radius: ${sv.grid*.5}px;
  background: ${props => props.color};
  margin-left: auto;
  border: 3px solid #fff;
`;

const DropdownIcon = styled(FeatherIcon)`
  margin-left: ${sv.grid*2}px;
  color: ${sv.colors.subtleText};
`;

const Picker = styled(SketchPicker)`
  z-index: 11;
  position: absolute;
`;

const Shade = styled.div`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type Props = {
  onChange: (hex: string) => void,
  color: string,
  label: string
}

const ColorPickerField = ({ onChange, color, label }: Props) => {

  const [showPicker, setShowPicker] = useState(false)

  const handleChange = (newColor: { hex: string }) => {
    onChange(newColor.hex)
  }

  return (
    <Container>
      <Field onClick={() => setShowPicker(true)}>
        {/* @ts-ignore */}
        <Label noMargin>{label}</Label>
        <ColorPreview color={color} />
        <DropdownIcon size={20} icon="chevron-down" />
      </Field>
      {showPicker && <>
        <Shade onClick={() => setShowPicker(false)} />
        <Picker
          disableAlpha
          presetColors={[]}
          color={color}
          onChange={handleChange}
        />
      </>}
    </Container>
  )
}

export default ColorPickerField;
