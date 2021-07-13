import React, {useState, useRef, useEffect} from 'react'
// @ts-ignore
import FeatherIcon from 'feather-icons-react'
import styled from 'styled-components';
import sv from '@/constants/styles';
import Button from './Button';
import {Text} from '@/components/elements/StyledComponents';

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

type LabelProps = {
  highlight?: boolean;
}

const Label = styled.div<LabelProps>`
  ${sv.label};
  color: ${props => props.highlight ? sv.colors.cta : sv.colors.subtleText};
  flex: 1;
  margin-right: ${sv.grid}px;
`;

const Input = styled.input`
  display: none;
`;



// COMPONENT ##########################################################

type FilePickerProps = {
  onChange: (e: any) => any,
  label: string,
  className?: string,
  disabled?: boolean,
  value: any,
}

export default function FilePickerWithLabel({
  onChange,
  label,
  className,
  disabled,
  value,
}: FilePickerProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    e.preventDefault()
    onChange(e.target.files[0])
  }

  const handleClick = (e: any) => {
    e.preventDefault()

    if (inputRef.current === null) {
      return
    }

    inputRef.current.click()
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
          <Text>{value.name}</Text>
          <ClearIcon icon="x" onClick={() => clearFile()} />
        </FileInfo>
      }
      <Input
        type="file"
        ref={inputRef}
        disabled={disabled}
        onChange={handleInputChange}
      />
    </Container>
  )

}
