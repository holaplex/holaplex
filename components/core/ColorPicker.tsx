import {useState} from 'react';
import FeatherIcon from 'feather-icons-react'
import sv from '../../constants/Styles';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import {Label} from '../../constants/StyleComponents';

////// STYLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div`

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
  z-index: 10;
  position: absolute;
`;

const Shade = styled.div`
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type Props = {
  onChange: () => void,
  color: string,
  label: string
}

const ColorPickerField = ({ onChange, color, label }: Props) => {

  const [showPicker, setShowPicker] = useState(false)

  const handleChange = (newColor) => {
    console.log(newColor)
    onChange(newColor.hex)
  }

  return (
    <Container>
      <Field onClick={() => setShowPicker(true)}>
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
