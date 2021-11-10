import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import {
  Divider,
  Input,
  Form,
  FormInstance,
  Space,
  InputNumber,
  Row,
  notification,
  Radio,
  Col,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import Paragraph from 'antd/lib/typography/Paragraph';
import useOnClickOutside from 'use-onclickoutside';
import clipBoardIcon from '@/common/assets/images/clipboard.svg';
import { MAX_CREATOR_LIMIT, MintDispatch, NFTFormValue, Royalty } from 'pages/nfts/new';

const ROYALTIES_INPUT_DEFAULT = 10;

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  form: FormInstance;
  userKey?: string;
  dispatch: MintDispatch;
  formValues: NFTFormValue[] | null;
  isFirst?: boolean;
  index: number;
  setDoEachRoyaltyInd?: React.Dispatch<React.SetStateAction<boolean>>;
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

// Extract these out since they are global styles for Radio that can't be controlled by less vars
const StyledRadio = styled(Radio)`
  display: flex;
  align-items: center;
  .ant-radio {
    margin-bottom: 8px;
    color: transparent;
    &:hover {
      color: transparent;
    }
  }

  .ant-radio-checked {
    border-color: transparent;

    &:hover {
      color: transparent;
    }
  }

  .ant-radio-input,
  .ant-radio-inner {
    border-color: transparent;
    color: transparent;

    &:hover {
      border-color: transparent;
    }

    &:focus,
    &:focus-visible {
      outline: transparent;
    }
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
          onChange={(value) => updateCreator(creatorKey, value as number)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowPercentageInput(false);
            }
          }}
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
  setDoEachRoyaltyInd,
  index,
  isFirst = false,
}: Props) {
  // TODO: Test purposes only, please remove before prod
  userKey = 'ZiG1cukk0SRU5eIi3O4kVqSz2hKfsB9LOFaMXtvF5Oep';
  const [creators, setCreators] = useState<Array<Royalty>>([
    { creatorKey: userKey ?? '', amount: 100 },
  ]);
  const [showCreatorField, toggleCreatorField] = useState(false);
  const [royaltiesInput, setRoyaltiesInput] = useState(ROYALTIES_INPUT_DEFAULT);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [editionsSelection, setEditionsSelection] = useState('one');
  const [maxSupply, setMaxSupply] = useState<number>(1);

  useEffect(() => {
    // When creators changes, sum up all the amounts.
    const total = creators.reduce((totalShares, creator) => {
      return totalShares + creator.amount;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [creators]);

  // TODO: DRY this up
  const applyToAll = () => {
    const zeroedRoyalties = creators.filter((creator) => creator.amount === 0);

    if (totalRoyaltyShares === 0 || totalRoyaltyShares > 100 || zeroedRoyalties.length > 0) {
      setShowErrors(true);
      return;
    }

    form
      .validateFields(['royaltiesPercentage', 'numOfEditions'])
      .then(() => {
        if (setDoEachRoyaltyInd) setDoEachRoyaltyInd(false);

        if (formValues) {
          //   const newFormValues = formValues.map((formValue) => {
          //     console.log('creators are', creators);
          //     formValue.properties = { creators, maxSupply };
          //     formValue.seller_fee_basis_points = royaltiesInput;
          //     console.log('formValue is', formValue);
          //     return formValue;
          //   });
          //   dispatch({ type: 'SET_FORM_VALUES', payload: [...newFormValues] });
          //   nextStep!();
        } else {
          throw new Error('No form values found');
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // TODO: DRY this up
  const next = () => {
    form.validateFields(['royaltiesPercentage']).then(() => {
      if (formValues) {
        const currentNFTFormValue = formValues[index];
        currentNFTFormValue.properties = { creators, maxSupply };
        currentNFTFormValue.seller_fee_basis_points = royaltiesInput;

        const restOfValues = formValues.filter((_, i) => i !== index);

        dispatch({
          type: 'SET_FORM_VALUES',
          payload: [...restOfValues, { ...currentNFTFormValue }],
        });
        setRoyaltiesInput(ROYALTIES_INPUT_DEFAULT);
        form.setFieldsValue({ royaltiesPercentage: ROYALTIES_INPUT_DEFAULT });
      } else {
        throw new Error('No form values found');
      }

      nextStep!();
    });
  };

  const updateCreator = (creatorKey: string, amount: number) => {
    const creatorIndex = creators.findIndex((creator) => creator.creatorKey === creatorKey);
    setCreators([
      ...creators.slice(0, creatorIndex),
      { creatorKey, amount },
      ...creators.slice(creatorIndex + 1),
    ]);
  };

  const addCreator = () => {
    form
      .validateFields(['addCreator'])
      .then((values) => {
        if (creators.length >= MAX_CREATOR_LIMIT) {
          throw new Error('Max level of creators reached');
        }
        setCreators([...creators, { creatorKey: values.addCreator, amount: 0 }]);
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
          <Form.Item label="Royalties">
            <Paragraph style={{ color: '#fff', opacity: 0.6, fontSize: 14, fontWeight: 400 }}>
              What percentage of future sales will you receive
            </Paragraph>
            <Form.Item
              name="royaltiesPercentage"
              rules={[
                { required: true, message: 'Required' },
                {
                  type: 'number',
                  min: 1, // Can this be 0?
                  max: 100,
                  message: 'Percentage must be between 1 and 100',
                },
              ]}
              // initialValue={royaltiesInput}
            >
              <InputNumber<number>
                min={1}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
                style={{ borderRadius: 4, minWidth: 103 }}
                onChange={(val: number) => setRoyaltiesInput(val)}
              />
            </Form.Item>
          </Form.Item>
          {creators.length < MAX_CREATOR_LIMIT && (
            <Row justify="space-between" align="middle">
              <Paragraph style={{ fontWeight: 900 }}>Creators & royalty split</Paragraph>
              <StyledClearButton type="text" noStyle onClick={() => toggleCreatorField(true)}>
                Add Creator
              </StyledClearButton>
            </Row>
          )}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addCreator();
                  }}
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
                <Button type="primary" onClick={addCreator}>
                  Add
                </Button>
              </Row>
            </Row>
          )}
          {showErrors && (
            <Row style={{ marginTop: 7 }}>
              <Paragraph style={{ color: 'red', fontSize: 14 }}>
                Percentages must equal up to 100 and not be 0
              </Paragraph>
            </Row>
          )}

          <Row>
            <Paragraph style={{ fontWeight: 900, marginTop: 62 }}>Editions</Paragraph>
          </Row>

          <Row>
            <Form.Item rules={[{ required: true }]}>
              <Radio.Group
                buttonStyle="outline"
                onChange={({ target: { value } }) => {
                  setEditionsSelection(value);
                  if (value === 'one') {
                    setMaxSupply(1);
                  }
                }}
                value={editionsSelection}
              >
                <Space direction="vertical">
                  <Col>
                    <StyledRadio value="one" style={{ fontWeight: 900 }} autoFocus>
                      One of One
                    </StyledRadio>
                    <Paragraph style={{ fontSize: 14, opacity: 0.6 }}>
                      This is a single one of a kind NFT.
                    </Paragraph>
                  </Col>
                  <Col>
                    <StyledRadio value="limited" style={{ fontWeight: 900 }}>
                      Limited Edition
                    </StyledRadio>
                    <Paragraph style={{ fontSize: 14, opacity: 0.6 }}>
                      A fixed number of identical NFT will be minted.
                    </Paragraph>
                  </Col>
                </Space>
                {/* TODO: Set as required and validate */}
                {editionsSelection === 'limited' && (
                  <Form.Item name="numberOfEditions">
                    <Row>
                      <Col>
                        <Paragraph style={{ fontSize: 12 }}>Number of editions</Paragraph>
                        <Form.Item
                          name="numOfEditions"
                          rules={
                            editionsSelection === 'limited'
                              ? [
                                  {
                                    required: true,
                                    message: 'Required',
                                  },
                                  {
                                    type: 'number',
                                    min: 1,
                                    max: 100,
                                    message: 'Must be between 1 and 100',
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber<number>
                            min={1}
                            max={100}
                            placeholder="1-100"
                            onChange={(n) => setMaxSupply(n)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                )}
              </Radio.Group>
            </Form.Item>
          </Row>

          <Row justify="end">
            <Space>
              {images.length > 1 && isFirst && (
                <StyledClearButton
                  type="text"
                  noStyle
                  onClick={() => {
                    if (setDoEachRoyaltyInd) setDoEachRoyaltyInd(true);
                    next();
                  }}
                >
                  Do each individually
                </StyledClearButton>
              )}

              <Button type="primary" onClick={isFirst ? applyToAll : next}>
                {isFirst ? 'Apply to All' : 'Next'}
              </Button>
            </Space>
          </Row>
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
