import React, {useState, useRef, useEffect} from 'react'
import FeatherIcon from 'feather-icons-react'
import styled from 'styled-components';
import sv from '@/constants/Styles';
import Button from './Button';
import {Text} from '@/constants/StyleComponents';

// STYLE ##########################################################

const Container = styled.div`
  width: 100%;
  ${sv.inputField};
`;

const FileInfo = styled.div`
  ${sv.flexRow};
  margin-left: auto;
`;

const ClearIcon = styled(FeatherIcon)`
  margin-left: ${sv.grid*2}px;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

const Label = styled.div`
  ${sv.label};
  color: ${props => props.highlight ? sv.colors.cta : sv.colors.subtleText};
  flex: 1;
  margin-right: ${sv.grid}px;
`;

const Input = styled.input`
  display: none;
`;



// COMPONENT ##########################################################

export default function FilePickerWithLabel({
  onChange,
  label,
  className,
  disabled,
  value,
}) {

  const inputField = useRef(null);

  const handleInputChange = (e) => {
    e.preventDefault()
    onChange(e.target.files[0])
  }

  const handleClick = (e) => {
    e.preventDefault()
    inputField.current.click()
  }

  const clearFile = () => {
    onChange(undefined)
  }
  return (
    <Container
      className={className}
    >
      <Label>{label}</Label>
      {!value && <Button small icon="upload" onClick={handleClick} />}
      {value &&
        <FileInfo>
          <Text noMargin>{value.name}</Text>
          <ClearIcon icon="x" onClick={() => clearFile()} />
        </FileInfo>
      }
      <Input
        type="file"
        ref={inputField}
        disabled={disabled}
        onChange={handleInputChange}
      />
    </Container>
  )

}
