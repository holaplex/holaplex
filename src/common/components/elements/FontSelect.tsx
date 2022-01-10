import React, { KeyboardEvent, PureComponent, ReactElement } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const availableFonts = [
  'Inter',
  'Roboto',
  'Work Sans',
  'Montserrat',
  'Urbanist',
  'Source Sans Pro',
  'Merriweather',
  'Playfair Display',
  'Noto Serif',
  'Domine',
];

interface Props {
  value?: string;
  onChange?: (font: any) => void;
}

const StyledSelect = styled(Select)<Props>`
  .ant-select-selection-item {
    font-family: '${({ value }) => value}', sans;
  }
`;
function getFontId(fontFamily: string): string {
  return fontFamily.replace(/\s+/g, '-').toLowerCase();
}

const FontSelect = (props: Props) => {
  const { value, onChange } = props;

  return (
    <StyledSelect value={value} onChange={onChange} size="large">
      {availableFonts.map((font): React.ReactElement => {
        const fontId = getFontId(font);
        return (
          <Option key={fontId} value={font} className={`font-family-${fontId}`}>
            {font}
          </Option>
        );
      })}
    </StyledSelect>
  );
};

export default FontSelect;
