import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Divider, Input, Form, FormInstance, Space, InputNumber, Row, notification } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import Paragraph from 'antd/lib/typography/Paragraph';
import useOnClickOutside from 'use-onclickoutside';
import clipBoardIcon from '@/common/assets/images/clipboard.svg';
import { MintDispatch, NFTFormValue, Royalty } from 'pages/nfts/new';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  form: FormInstance;
  userKey?: string;
  dispatch: MintDispatch;
  formValues: NFTFormValue[] | null;
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

const StyledCreatorsRow = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-radius: 25px;
  background: #1a1a1a;
  width: 100%;
  height: 50px;
  padding: 0 9px;

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .ant-typography {
    margin: 0;
  }

  .clipboard-icon {
    margin-right: 6px;
    cursor: pointer;
  }
`;

// TODO: Extract to the Button component since this style is so common
export const StyledClearButton = styled(Button)`
  font-size: 14px;
  color: #b92d44;
  height: fit-content;
  margin-bottom: 1em;

  &:hover,
  &:focus {
    background: transparent;
  }
`;

// TODO: Style notification
const openNotification = () => {
  notification.open({
    message: 'Key copied to clipboard!',
  });
};

const StyledPercentageInput = styled(InputNumber)`
  margin: 0 23px 0 auto;
  font-size: 14px;
  border-radius: 4px;
  width: 70px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);

  input {
    height: 32px;
  }
`;

const CreatorsRow = ({
  creatorKey,
  amount,
  isUser = false,
  updateCreator,
}: {
  creatorKey: string;
  amount: number;
  isUser: boolean;
  updateCreator: (key: string, amount: number) => void;
}) => {
  const ref = React.useRef(null);
  const [showPercentageInput, setShowPercentageInput] = React.useState(false);
  useOnClickOutside(ref, () => setShowPercentageInput(false));
  return (
    <StyledCreatorsRow>
      <Image height={32} width={32} src="/images/creator-standin.png" alt="creator" />
      {/* TODO: Figure out how to truncate in middle of string with ellipsis instead of on the end */}
      <Paragraph
        style={{
          margin: '0 14px 0 6px',
          maxWidth: 90,
          fontSize: 14,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {creatorKey}
      </Paragraph>
      <Image
        className="clipboard-icon"
        height={20}
        width={20}
        src={clipBoardIcon}
        alt="copyToClipboard"
        onClick={() => {
          navigator.clipboard.writeText(creatorKey);
          openNotification();
        }}
      />
      {isUser && <Paragraph style={{ opacity: 0.6, marginLeft: 6, fontSize: 14 }}>(you)</Paragraph>}
      {showPercentageInput ? (
        <StyledPercentageInput
          defaultValue={amount}
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
          ref={ref}
          // controls={false} // not supported in this version of antd, upgrade?
        />
      ) : (
        <Paragraph
          onClick={() => setShowPercentageInput(true)}
          style={{ margin: '0 5px 0 auto', fontSize: 14, cursor: 'pointer' }}
        >
          {amount}%
        </Paragraph>
      )}
    </StyledCreatorsRow>
  );
};

export default function RoyaltiesCreators({
  previousStep,
  goToStep,
  images,
  dispatch,
  nextStep,
  form,
  userKey,
  formValues,
  isActive,
}: Props) {
  const [creators, setCreators] = React.useState<Array<Royalty>>([
    { creatorKey: userKey ?? '', amount: 100 },
  ]);
  const [showCreatorField, toggleCreatorField] = React.useState(false);
  // const [creatorInputVal, setCreatorInputVal] = React.useState<Royalty | null>(null);

  const applyToAll = () => {
    if (formValues) {
      const newFormValues = formValues.map((formValue) => {
        formValue.properties = { creators };
        return formValue;
      });

      console.log('setting new form values with creatirs', newFormValues);
      dispatch({ type: 'SET_FORM_VALUES', payload: [...newFormValues] });

      nextStep!();
    } else {
      throw new Error('No form values found');
    }
  };

  const updateCreator = (creatorKey: string, amount: number) => {
    const prevCreators = creators.filter((creator) => creator.creatorKey !== creatorKey);
    setCreators([...prevCreators, { creatorKey, amount }]);
  };

  const validate = () => {
    form
      .validateFields(['addCreator'])
      .then((values) => {
        setCreators([...creators, { creatorKey: values.addCreator, amount: 100 }]);
        toggleCreatorField(false);
        form.resetFields(['addCreator']);
      })
      .catch((err) => {
        console.log('err is ', err);
      });
  };

  if (!userKey) return null;

  return (
    <NavContainer title="Royalties & Creators" previousStep={previousStep} goToStep={goToStep}>
      <Row>
        <FormWrapper>
          <Form.Item name="royaltiesPercentage" label="Royalties">
            <Paragraph style={{ color: '#fff', opacity: 0.6, fontSize: 14, fontWeight: 400 }}>
              What percentage of future sales will you receive
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
            <StyledClearButton type="text" noStyle onClick={() => toggleCreatorField(true)}>
              Add Creator
            </StyledClearButton>
          </Row>
          <Row>
            {creators.map((creator) => (
              <CreatorsRow
                creatorKey={creator.creatorKey}
                amount={creator.amount}
                isUser={creator.creatorKey === userKey}
                key={creator.creatorKey}
                updateCreator={updateCreator}
              />
            ))}
          </Row>
          {showCreatorField && (
            <Row>
              {/* TODO: Extract out */}
              <Form.Item
                name="addCreator"
                style={{ width: '100%' }}
                rules={[
                  { required: true, message: 'Please enter a value' },
                  { max: 44 },
                  { min: 44, message: 'Must be at least 44 characters long' },
                ]}
              >
                <Input
                  style={{ margin: '39px 0 13px', height: 50 }}
                  placeholder="Enter creator’s public key..."
                  maxLength={44}
                  required
                  // onChange={(value) =>
                  //   setCreatorInputVal({ creatorKey: value.target.value, amount: 100 })
                  // }
                />
              </Form.Item>
              <Row>
                <Button
                  type="primary"
                  onClick={() => toggleCreatorField(false)}
                  style={{ marginRight: 13 }}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={validate}>
                  Add
                </Button>
              </Row>
            </Row>
          )}

          <Button type="primary" onClick={applyToAll}>
            Apply to All
          </Button>
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
