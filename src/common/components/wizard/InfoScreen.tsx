import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, Input, Space, Form, FormInstance } from 'antd';
import React, { useState } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  index: number;
  form: FormInstance;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 216px;
  column-gap: 16px;
  row-gap: 16px;
  /* margin: 59px 0 83px; */
`;

const InnerContainer = styled.div`
  display: flex;
`;

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  height: 500px;
`;

const FormWrapper = styled.div`
  width: 413px;

  .ant-form-item-label {
    font-weight: 900;
  }

  .ant-form-item-control-input-content {
    input,
    textarea {
      border-radius: 4px;
    }
    input {
      height: 50px;
    }
  }
`;

// TODO: Type the props
const AttributeClearButton = (props: any) => {
  const StyledButton = styled(Button)`
    background: #1a1a1a;
    border-radius: 4px;
    width: 39px;
    height: 50px;

    img {
      opacity: 0.5;
    }
  `;
  return (
    <StyledButton {...props} noStyle={true}>
      <Image width={24} height={24} src={XCloseIcon} alt="remove-attribute" />
    </StyledButton>
  );
};

const ButtonFormItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row-reverse;
  }
`;

export default function InfoScreen({
  previousStep,
  goToStep,
  images,
  index,
  nextStep,
  form,
}: Props) {
  const { TextArea } = Input;
  const nftNumber = `nft-${index}`;

  const handleNext = () => {
    form
      .validateFields([[nftNumber, 'name']])
      .then(() => {
        nextStep!();
      })
      .catch((info) => {
        // TODO: Do we need this catch?
        console.log('Errors are', info);
      });
  };

  // TODO: Extract out?
  const AttributeRow = ({
    remove,
    fieldsLength,
    field,
  }: {
    remove: (index: number | number[]) => void;
    fieldsLength: number;
    field: FormListFieldData;
  }) => (
    <Input.Group style={{ marginBottom: 18 }}>
      <Form.Item name={[field.name, 'attrKey']}>
        <Input style={{ width: 178, marginRight: 10, borderRadius: 4 }} placeholder="e.g. Color" />
      </Form.Item>
      <Form.Item name={[field.name, 'attrVal']}>
        <Input style={{ width: 178, marginRight: 8, borderRadius: 4 }} placeholder="e.g. Green" />
      </Form.Item>
      {fieldsLength > 1 && <AttributeClearButton onClick={() => remove(field.name)} />}
    </Input.Group>
  );

  return (
    <NavContainer
      title={`Info for #${index + 1} of ${images.length}`}
      previousStep={previousStep}
      goToStep={goToStep}
    >
      <InnerContainer>
        <FormWrapper>
          <Form.Item name={`nft-${0}`}>
            <Form.Item
              name={[nftNumber, 'name']}
              label="Name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="required" />
            </Form.Item>
            <Form.Item name={[nftNumber, 'description']} label="Description">
              <TextArea placeholder="optional" autoSize={{ minRows: 3, maxRows: 8 }} />
            </Form.Item>
            <Form.Item name={[nftNumber, 'collection']} label="Collection">
              <Input placeholder="e.g. Stylish Studs (optional)" />
            </Form.Item>

            <Form.Item label="Attributes">
              <Form.List name={[nftNumber, 'attributes']} initialValue={[null]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <AttributeRow
                        key={field.key}
                        remove={remove}
                        fieldsLength={fields.length}
                        field={field}
                      />
                    ))}
                    <Button onClick={add}>Add Attribute</Button>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <ButtonFormItem style={{ marginTop: 42 }}>
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            </ButtonFormItem>
          </Form.Item>
        </FormWrapper>

        <StyledDivider type="vertical" />
        <Grid>
          {images.map((i) => (
            <Image
              width={120}
              height={120}
              src={URL.createObjectURL(i)}
              alt="test-image"
              unoptimized={true}
              key={i.name}
            />
          ))}
        </Grid>
      </InnerContainer>
    </NavContainer>
  );
}
