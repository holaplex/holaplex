import React, {useRef, useState } from 'react'
// @ts-ignore
import FeatherIcon from 'feather-icons-react'
import styled from 'styled-components'
import { isNil } from 'ramda'
import sv from '@/constants/styles'
import Button from './Button'
import {Text} from '@/components/elements/StyledComponents'
import { initArweave } from '@/modules/arweave'
import { toast } from 'react-toastify'

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
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (e: any) => {
    toast("Uploading your file to Arweave.", { autoClose: 3000 })

    const arweave = initArweave()
    const file = e.target.files[0]

    if(isNil(file)) {
      return
    }

    setUploading(true)

    const { api } = arweave.getConfig()

    const data = await file.arrayBuffer()
    const transaction = await arweave.createTransaction({ data })

    transaction.addTag("Content-Type", file.type)
    transaction.addTag("File-Name", file.name)

    await arweave.transactions.sign(transaction)

    await arweave.transactions.post(transaction)

    const url = `${api.protocol}://${api.host}:${api.port}/${transaction.id}`

    toast("Your file was uploaded to Arweave.")

    onChange({ name: file.name, type: file.type, url })

    setUploading(false)

    e.target.value = null
  }

  const handleClick = (e: any) => {
    e.preventDefault()

    if (inputRef.current === null) {
      return
    }

    inputRef.current.click()
  }

  const clearFile = () => {
    onChange({})
  }

  return (
    <Container
      className={className}
    >
      <Label>{label}</Label>
      {!value.url && <Button small disabled={uploading} icon="upload" onClick={handleClick} />}
      {value.url &&
        <FileInfo>
          <Text>{value.name}</Text>
          <ClearIcon icon="x" onClick={clearFile} />
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
