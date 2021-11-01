import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Divider, Form, FormInstance, Space, Row } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';

import { Radio } from 'antd';

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
  max-height: 500px;
`;

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  height: 500px;
  margin: 0 46px;
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

const ButtonFormItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row-reverse;
  }
`;

export default function RoyaltiesCreators({
  previousStep,
  goToStep,
  images,
  nextStep,
  form,
}: Props) {
  const handleNext = () => {
    nextStep!();
  };

  return (
    <NavContainer title="Fees" previousStep={previousStep} goToStep={goToStep}>
      <Row>
        <FormWrapper>
          <Form.Item name="edition">
            <Form.Item rules={[{ required: true }]}>
              <Radio.Group buttonStyle="outline">
                <Space direction="vertical">
                  <Radio value="one">One of One</Radio>
                  <Radio value="limited">Limited Edition</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Button>Do each individually</Button>
            <ButtonFormItem style={{ marginTop: 42 }}>
              <Button type="primary" onClick={handleNext}>
                Apply to All
              </Button>
            </ButtonFormItem>
          </Form.Item>
        </FormWrapper>

        <StyledDivider type="vertical" />
        <Grid>
          {images.map((image) => (
            <Image
              width={100}
              height={100}
              src={URL.createObjectURL(image)}
              alt={image.name}
              unoptimized={true}
              key={image.name}
            />
          ))}
        </Grid>
      </Row>
    </NavContainer>
  );
}
