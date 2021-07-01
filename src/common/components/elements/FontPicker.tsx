// @ts-nocheck
import {useState} from 'react';
import FeatherIcon from 'feather-icons-react'
import sv from '@/constants/Styles';
import styled from 'styled-components';
import { Label } from '@/constants/StyleComponents';

// this lib isnt compatible with ssr
import dynamic from "next/dynamic";

const FontPicker = dynamic(() => import("font-picker-react"), {
    ssr: false,
});
////// STYLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div`
  ${sv.inputField};
  position: relative;
  #font-picker-title, #font-picker-body {
    position: absolute;
    background: none;
    box-shadow: none;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .dropdown-button {
      position: absolute;
      height: 100%;
      opacity: 0;
    }
    .font-list {
      top: 100%;
      border-radius: 8px;
    }
  }
`;

const FontName = styled.div`
  margin-left: auto;
`;

const DropdownIcon = styled(FeatherIcon)`
  margin-left: ${sv.grid*2}px;
  color: ${sv.colors.subtleText};
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const googleApiKey = 'AIzaSyC1Bti2pgemOewDX-95SkcgEvyWixFffbA';

const availableFonts = [
  "Roboto",
  "Work sans",
  "Montserrat",
  "Source Sans Pro",
  "Merriweather",
  "Playfair Display",
  "Noto Serif",
  "Domine"
]

type Props = {
  onChange: () => void,
  font: string,
  label: string,
  pickerId: string
}

const FontPickerField = ({ onChange, font, label, pickerId }: Props) => {

  return (
    <Container>
      <Label noMargin>{label}</Label>
      <FontName className={`apply-font-${pickerId}`}>{font}</FontName>
      <DropdownIcon size={20} icon="chevron-down" />
      <FontPicker
				apiKey={googleApiKey}
        variants={["regular", "700"]}
        families={availableFonts}
        pickerId={pickerId}
				activeFontFamily={font}
				onChange={onChange}
			/>
    </Container>
  )
}

export default FontPickerField;
