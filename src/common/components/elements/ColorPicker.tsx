// @ts-ignore
import { SketchPicker } from 'react-color';
import { Dropdown } from 'antd'
import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons'

type ColorPreviewProps = {
  color?: string;
}

const ColorPreview = styled.div<ColorPreviewProps>`
  height: 32px;
  width: 100px;
  margin: 0 16px 0 0;
  border-radius: 4px;
  background: ${props => props.color};
  border: 3px solid #fff;
`;

const ColorSelect = styled.div`
  display: flex;
  align-items: center;
`

type Props = {
  onChange?: (hex: string) => void,
  value?: string,
}

const ColorPickerField = ({ onChange, value }: Props) => {
  const handleChange = ({ hex }: { hex: string }) => {
    if (!onChange) {
      return
    }

    onChange(hex)
  }

  return (
    <Dropdown
      overlay={
        <SketchPicker
          disableAlpha
          presetColors={[]}
          color={value}
          onChange={handleChange}
        />
      }
    >
      <ColorSelect className="ant-input-affix-wrapper">
        <ColorPreview color={value} />
        <span className="ant-select-arrow">
          <DownOutlined />
        </span>
      </ColorSelect>
    </Dropdown>
  )
}

export default ColorPickerField;
