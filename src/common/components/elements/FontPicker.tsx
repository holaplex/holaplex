// @ts-nocheck
import { useState } from 'react';
import FeatherIcon from 'feather-icons-react'
import sv from '@/constants/styles';
import styled from 'styled-components';

// this lib isnt compatible with ssr
import dynamic from "next/dynamic";

const FontPicker = dynamic(() => import("font-picker-react"), {
  ssr: false,
});

const Styles = styled.div`
div[id^=font-picker] {
  box-shadow: none;
}
  div[id^=font-picker] .dropdown-button {
    background: none;
    box-shadow: none;
    &:hover, &:focus {
      background: none;
    }
  }
`

const googleApiKey = 'AIzaSyC1Bti2pgemOewDX-95SkcgEvyWixFffbA';

const availableFonts = [
  "Roboto",
  "Work Sans",
  "Montserrat",
  "Source Sans Pro",
  "Merriweather",
  "Playfair Display",
  "Noto Serif",
  "Domine"
]

type Props = {
  onChange?: (event: any) => void,
  value?: string,
  pickerId: string
}

const FontPickerField = ({ onChange, value, pickerId }: Props) => {

  return (
    <Styles>
      <FontPicker
        apiKey={googleApiKey}
        variants={["regular", "700"]}
        families={availableFonts}
        pickerId={pickerId}
        activeFontFamily={value}
        onChange={(font) => { onChange(font.family) }}
      />
    </Styles>
  )
}

export default FontPickerField;
