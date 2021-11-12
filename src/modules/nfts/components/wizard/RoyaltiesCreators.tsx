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
import XCloseIcon from '@/common/assets/images/x-close.svg';
import { MAX_CREATOR_LIMIT, MintDispatch, NFTFormValue, Creator } from 'pages/nfts/new';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';

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
  doEachRoyaltyInd?: boolean;
}

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

  .creator-row-icon {
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
  creatorAddress,
  share,
  isUser = false,
  updateCreator,
  removeCreator,
}: {
  creatorAddress: string;
  share: number;
  isUser: boolean;
  updateCreator: (address: string, share: number) => void;
  removeCreator: (address: string) => void;
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
        {creatorAddress}
      </Paragraph>
      <Image
        className="creator-row-icon"
        height={20}
        width={20}
        src={clipBoardIcon}
        alt="copyToClipboard"
        onClick={() => {
          navigator.clipboard.writeText(creatorAddress);
          openNotification();
        }}
      />
      {isUser && <Paragraph style={{ opacity: 0.6, marginLeft: 6, fontSize: 14 }}>(you)</Paragraph>}
      {showPercentageInput ? (
        <StyledPercentageInput
          defaultValue={share}
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
          ref={ref}
          onChange={(value) => updateCreator(creatorAddress, value as number)}
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
          {share.toFixed(2).replace(/[.,]00$/, '')}%
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
  doEachRoyaltyInd,
  index,
  isFirst = false,
}: Props) {
  const [creators, setCreators] = useState<Array<Creator>>([
    { address: userKey ?? '', share: 100 },
  ]);
  const [showCreatorField, toggleCreatorField] = useState(false);
  const [royaltiesInput, setRoyaltiesInput] = useState(ROYALTIES_INPUT_DEFAULT);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [editionsSelection, setEditionsSelection] = useState('one');
  const [maxSupply, setMaxSupply] = useState<number>(1);

  useEffect(() => {
    // When creators changes, sum up all the shares.
    const total = creators.reduce((totalShares, creator) => {
      return totalShares + creator.share;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [creators]);

  // TODO: DRY this up
  const applyToAll = () => {
    const zeroedRoyalties = creators.filter((creator) => creator.share === 0);

    if (totalRoyaltyShares === 0 || totalRoyaltyShares > 100 || zeroedRoyalties.length > 0) {
      setShowErrors(true);
      return;
    }

    form
      .validateFields(['royaltiesPercentage', 'numOfEditions'])
      .then(() => {
        if (setDoEachRoyaltyInd) setDoEachRoyaltyInd(false);

        if (formValues) {
          const newFormValues = formValues.map((formValue) => {
            if (!creators.length || !maxSupply || !royaltiesInput) {
              throw new Error('No creators or max supply or royalties input');
            }
            console.log('creators are', creators);
            formValue.properties = { creators, maxSupply };
            formValue.seller_fee_basis_points = royaltiesInput;
            console.log('formValue is', formValue);
            return formValue;
          });
          dispatch({ type: 'SET_FORM_VALUES', payload: [...newFormValues] });
          nextStep!();
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
        console.log('validate royalties and creators', { formValues, currentNFTFormValue, index });
        if (!creators.length || !maxSupply || !royaltiesInput) {
          throw new Error('No creators or max supply or royalties input');
        }

        currentNFTFormValue.properties = { creators, maxSupply };
        currentNFTFormValue.seller_fee_basis_points = royaltiesInput;

        const formValuesCopy = [...formValues];
        formValuesCopy[index] = { ...currentNFTFormValue };

        setRoyaltiesInput(ROYALTIES_INPUT_DEFAULT);
        form.setFieldsValue({ royaltiesPercentage: ROYALTIES_INPUT_DEFAULT });
      } else {
        throw new Error('No form values found');
      }

      nextStep!();
    });
  };

  const updateCreator = (address: string, share: number) => {
    const creatorIndex = creators.findIndex((creator) => creator.address === address);
    setCreators([
      ...creators.slice(0, creatorIndex),
      { address, share },
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
        const newShareSplit = 100 / (creators.length + 1);
        setCreators([
          ...creators.map((c) => ({ ...c, share: newShareSplit })),
          { address: values.addCreator, share: newShareSplit },
        ]);
        toggleCreatorField(false);
        form.resetFields(['addCreator']);
      })
      .catch((err) => {
        console.log('err is ', err);
      });
  };
  const removeCreator = (creatorAddress: string) => {
    const newShareSplit = 100 / (creators.length - 1) || 100;
    setCreators(
      creators
        .filter((c) => c.address !== creatorAddress)
        .map((c) => ({ ...c, share: newShareSplit }))
    );
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
                  min: 1, // Can this be 0? // we set it to 100 elsewhere, sooo?
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
          {/* Display creators */}
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
                creatorAddress={creator.address}
                share={creator.share}
                isUser={creator.address === userKey}
                key={creator.address}
                updateCreator={updateCreator}
                removeCreator={removeCreator}
              />
            ))}
          </Row>
          {/* Add creator form */}
          {showCreatorField && (
            <Row>
              <Form.Item
                name="addCreator"
                style={{ width: '100%' }}
                rules={[
                  { required: true, message: 'Please enter a value' },
                  { max: 44 },
                  // need to handle someone pasting in a string longer than 44 char. Right now the input just caps it at 44 without showing anything
                  { min: 44, message: 'Must be at least 44 characters long' },
                  {
                    message: 'All creator hashes must be unique',
                    async validator(rule, value: string) {
                      const existingCreators = creators.map((c) => c.address);
                      const indexOfDuplicate = existingCreators.findIndex((a, i) => value === a);
                      if (indexOfDuplicate !== -1) {
                        throw new Error();
                      }
                    },
                  },
                  {
                    message: 'Creator address is not valid',
                    async validator(rule, creatorAddress: string) {
                      if (creatorAddress.indexOf(' ') >= 0) {
                        // whitespace detected
                        throw new Error();
                      }
                      return true;
                      // a bit unsure about this requirement in the end
                      const base64RegEx =
                        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

                      if (!base64RegEx.test(creatorAddress)) {
                        throw new Error();
                      }
                    },
                  },
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
                          initialValue={1}
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
        <NFTPreviewGrid images={images} index={index} width={2} />
      </Row>
    </NavContainer>
  );
}
