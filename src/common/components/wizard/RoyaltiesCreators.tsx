import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, Input, Form, FormInstance, Space, InputNumber, Row } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import Paragraph from 'antd/lib/typography/Paragraph';

interface Royalty {
  creatorKey: string;
  amount: number;
}

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  form: FormInstance;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 16px;
  grid-template-rows: 100px 100px 100px 100px 100px;
`;

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  height: 580px;
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

const CreatorRow = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-radius: 25px;
  background: #1a1a1a;
  width: 100%;
  height: 50px;
  padding: 0 9px;

  .ant-typography {
    margin: 0;
  }
`;

// TODO: Extract to the Button component since this style is so common
const StyledAddCrtrBtn = styled(Button)`
  font-size: 14px;
  color: #b92d44;
  height: fit-content;
  margin-bottom: 1em;

  &:hover,
  &:focus {
    background: transparent;
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
    <NavContainer title="Royalties & Creators" previousStep={previousStep} goToStep={goToStep}>
      <Row>
        <FormWrapper>
          <Form.Item
            name="royaltiesPercentage"
            label="Royalties"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Paragraph style={{ color: '#fff', opacity: 0.6, fontSize: 14, fontWeight: 400 }}>
              What percentage of future sales will you recieve
            </Paragraph>
            <InputNumber<number>
              defaultValue={10}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
              style={{ borderRadius: 4, minWidth: 103 }}
            />
          </Form.Item>
          <Row justify="space-between" align="middle">
            <Paragraph style={{ fontWeight: 900 }}>Creators & royalty split</Paragraph>
            <StyledAddCrtrBtn type="text" noStyle>
              Add Creator
            </StyledAddCrtrBtn>
          </Row>
          <Row>
            <CreatorRow>
              <Image height={32} width={32} src="/images/creator-standin.png" alt="creator" />
              <Paragraph style={{ marginLeft: 14 }}>14g3...5m42</Paragraph>
              100%
            </CreatorRow>
          </Row>

          <Button type="primary">Apply to All</Button>
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
