import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, Input, Space, Form } from 'antd';
import React, { useState } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import { divide } from 'ramda';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  // dispatch: (payload: ImageAction) => void;
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

export default function InfoScreen({ previousStep, goToStep, images }: Props) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [attributeRows, setAttributeRows] = useState(5);

  const onFinish = () => {};

  const onFill = () => {};

  // TODO: Extract out?
  const AttributeRow = ({
    name,
    remove,
    fieldsLength,
  }: {
    name: number;
    remove: (index: number | number[]) => void;
    fieldsLength: number;
  }) => (
    <Input.Group style={{ marginBottom: 18 }}>
      <Input style={{ width: 178, marginRight: 10, borderRadius: 4 }} placeholder="e.g. Color" />
      <Input style={{ width: 178, marginRight: 8, borderRadius: 4 }} placeholder="e.g. Green" />
      {fieldsLength > 1 && <AttributeClearButton onClick={() => remove(name)} />}
    </Input.Group>
  );

  return (
    <NavContainer title="Info for #1 of 8" previousStep={previousStep} goToStep={goToStep}>
      <InnerContainer>
        <FormWrapper>
          <Form
            form={form}
            layout="vertical"
            name="control-hooks"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="required" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea placeholder="optional" autoSize={{ minRows: 3, maxRows: 8 }} />
            </Form.Item>
            <Form.Item name="collection" label="Collection">
              <Input placeholder="e.g. Stylish Studs (optional)" />
            </Form.Item>

            <Form.Item label="Attributes">
              <Form.List name="attributes" initialValue={[1, 2, 3, 4, 5, 6]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <AttributeRow
                        key={field.key}
                        remove={remove}
                        name={field.name}
                        fieldsLength={fields.length}
                      />
                    ))}
                    <Button onClick={add}>Add Attribute</Button>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <ButtonFormItem style={{ marginTop: 42 }}>
              <Button type="primary" onClick={onFill}>
                Next
              </Button>
            </ButtonFormItem>
          </Form>
        </FormWrapper>

        <StyledDivider type="vertical" />
        <Grid>
          {images.map((i) => (
            // <ImageContainer key={i.name}>
            <Image
              width={120}
              height={120}
              src={URL.createObjectURL(i)}
              alt="test-image"
              unoptimized={true}
              key={i.name}
            />
            // </ImageContainer>
          ))}
        </Grid>
      </InnerContainer>
    </NavContainer>
  );
}
