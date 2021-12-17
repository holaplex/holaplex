import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import {
  Divider,
  Input,
  Form,
  FormInstance,
  Space,
  InputNumber,
  Row,
  Radio,
  Col,
  Modal,
} from 'antd';
import { toast } from 'react-toastify';
import Paragraph from 'antd/lib/typography/Paragraph';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import useOnClickOutside from 'use-onclickoutside';
import clipBoardIcon from '@/common/assets/images/clipboard.svg';
import { MAX_CREATOR_LIMIT, MintDispatch, NFTFormValue, Creator, FormValues } from 'pages/nfts/new';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';
import CommunityFundInfo from '@/common/components/presentational/CommunityFundInfo';
import { isNil } from 'ramda';

const ROYALTIES_INPUT_DEFAULT = 1000;
const MAX_SUPPLY_ONE_OF_ONE = 0;

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  form: FormInstance;
  userKey?: string;
  dispatch: MintDispatch;
  formValues: NFTFormValue[] | null;
  isFirst?: boolean;
  index: number;
  setDoEachRoyaltyInd: React.Dispatch<React.SetStateAction<boolean>>;
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

  &:focus {
    background: transparent;
    color: #b92d44;
  }
  &:hover {
    background: transparent;
    color: white;
  }
`;

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

const LightText = styled(Paragraph)`
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(143.77deg, #d24089 8.62%, #b92d44 84.54%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledCloseIcon = styled.svg`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 100%;
  &:hover {
    background: gray;
  }
`;

const RemoveCreatorIcon = (props: { onClick: () => void }) => (
  <StyledCloseIcon
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    onClick={props.onClick}
  >
    <path
      d="M18 6L6 18"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </StyledCloseIcon>
);

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
  const ref = useRef(null);
  const [showPercentageInput, setShowPercentageInput] = useState(false);
  useOnClickOutside(ref, () => setShowPercentageInput(false));
  const isHolaplex = creatorAddress === process.env.NEXT_PUBLIC_HOLAPLEX_HOLDER_PUBKEY;

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <StyledCreatorsRow>
      {isHolaplex ? (
        <Image height={32} width={32} src="/images/hola-logo.svg" alt="holaplex-logo" />
      ) : (
        <Image height={32} width={32} src="/images/creator-standin.png" alt="creator" />
      )}
      <Paragraph
        style={{
          margin: '0 14px 0 6px',
          maxWidth: 200,
          fontSize: 14,
        }}
      >
        {isHolaplex
          ? 'Hola Community Fund'
          : creatorAddress.slice(0, 4) + '...' + creatorAddress.slice(creatorAddress.length - 4)}
      </Paragraph>
      {!isHolaplex && (
        <Image
          className="creator-row-icon"
          height={20}
          width={20}
          src={clipBoardIcon}
          alt="copyToClipboard"
          onClick={() => {
            navigator.clipboard.writeText(creatorAddress);
            toast('Address copied to clipboard!');
          }}
        />
      )}
      {isUser && <Paragraph style={{ opacity: 0.6, marginLeft: 6, fontSize: 14 }}>(you)</Paragraph>}
      <span style={{ marginLeft: 'auto' }}></span>
      {isHolaplex && (
        <LightText onClick={() => setIsModalVisible(true)} style={{ marginRight: 5 }}>
          Learn more
        </LightText>
      )}
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
          onClick={() => !isHolaplex && setShowPercentageInput(true)}
          style={{ marginRight: 5, fontSize: 14, cursor: isHolaplex ? '' : 'pointer' }}
        >
          {share.toFixed(2).replace(/[.,]00$/, '')}%
        </Paragraph>
      )}
      {isHolaplex ? (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <path
              d="M6.33333 3.66663H1.66667C1.29848 3.66663 1 3.9651 1 4.33329V6.66663C1 7.03482 1.29848 7.33329 1.66667 7.33329H6.33333C6.70152 7.33329 7 7.03482 7 6.66663V4.33329C7 3.9651 6.70152 3.66663 6.33333 3.66663Z"
              fill="white"
            />
            <path
              d="M2.33333 3.66663V2.33329C2.33333 1.89127 2.50893 1.46734 2.82149 1.15478C3.13405 0.842221 3.55797 0.666626 4 0.666626C4.44203 0.666626 4.86595 0.842221 5.17851 1.15478C5.49107 1.46734 5.66667 1.89127 5.66667 2.33329V3.66663"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      ) : (
        <RemoveCreatorIcon onClick={() => removeCreator(creatorAddress)} />
      )}
      {isHolaplex && (
        <Modal
          width={668}
          visible={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
          closeIcon={
            <StyledCloseIcon viewBox="0 0 24 24">
              <path
                d="M18 6L6 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </StyledCloseIcon>
          }
          footer={null}
          bodyStyle={{
            borderRadius: '10px',
            background: '#1a1a1a',
            padding: '114px 67px 47px 67px',
          }}
        >
          <CommunityFundInfo />
        </Modal>
      )}
    </StyledCreatorsRow>
  );
};

if (!process.env.NEXT_PUBLIC_HOLAPLEX_HOLDER_PUBKEY) {
  throw new Error('NEXT_PUBLIC_HOLAPLEX_HOLDER_PUBKEY is not defined');
}

export const HOLAPLEX_CREATOR_OBJECT = Object.freeze({
  address: process.env.NEXT_PUBLIC_HOLAPLEX_HOLDER_PUBKEY ?? '',
  share: 2,
});

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
  const nftList = form.getFieldsValue(images.map((_, i) => `nft-${i}`)) as FormValues;
  const previousNFT: NFTFormValue | undefined = nftList[`nft-${index - 1}`];

  const [creators, setCreators] = useState<Array<Creator>>(
    previousNFT ? previousNFT.properties.creators : [{ address: userKey ?? '', share: 98 }]
  );
  const [showCreatorField, toggleCreatorField] = useState(false);
  const [royaltiesBasisPoints, setRoyaltiesBasisPoints] = useState(
    previousNFT ? previousNFT.seller_fee_basis_points : ROYALTIES_INPUT_DEFAULT
  );
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [editionsSelection, setEditionsSelection] = useState('one');
  const [maxSupply, setMaxSupply] = useState<number>(MAX_SUPPLY_ONE_OF_ONE);
  const royaltiesPercentage = royaltiesBasisPoints / 100;
  const royaltiesRef = useRef(royaltiesBasisPoints);

  useEffect(() => {
    if (formValues) {
      const currentNFTFormValue = formValues[index];
      if (currentNFTFormValue && currentNFTFormValue.seller_fee_basis_points) {
        form.setFieldsValue({
          royaltiesPercentage: currentNFTFormValue.seller_fee_basis_points / 100,
        });
        setRoyaltiesBasisPoints(currentNFTFormValue.seller_fee_basis_points);
      }
    } else {
      form.setFieldsValue({ royaltiesPercentage: royaltiesRef.current / 100 });
      setRoyaltiesBasisPoints(royaltiesRef.current);
    }
  }, [formValues, form, index]);

  useEffect(() => {
    // When creators changes, sum up all the shares.
    const total = creators.reduce((totalShares, creator) => {
      return totalShares + creator.share;
    }, 0);

    setShowErrors(false);
    if (total !== 98 || creators.filter((creator) => creator.share === 0).length > 0) {
      setShowErrors(true);
    }

    setTotalRoyaltiesShare(total);
  }, [creators]);

  // TODO: DRY this up
  const applyToAll = () => {
    if (showErrors) return;

    const zeroedRoyalties = creators.filter((creator) => creator.share === 0);

    if (totalRoyaltyShares === 0 || totalRoyaltyShares > 98 || zeroedRoyalties.length > 0) {
      setShowErrors(true);
      return;
    }

    // TODO: Refactor not to use useState with formValues
    form
      .validateFields(['royaltiesPercentage', 'numOfEditions'])
      .then(() => {
        setDoEachRoyaltyInd(false);

        if (formValues) {
          const newFormValues = formValues.map((formValue) => {
            if (!creators.length || isNil(maxSupply) || !royaltiesBasisPoints) {
              throw new Error('No creators, maxSupply, or royalties input');
            }
            formValue.properties = { creators, maxSupply };
            formValue.seller_fee_basis_points = royaltiesBasisPoints;
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

  const next = () => {
    if (showErrors) return;
    form.validateFields(['royaltiesPercentage']).then(() => {
      if (formValues) {
        const currentNFTFormValue = formValues[index];

        if (!creators.length || isNil(maxSupply) || !royaltiesBasisPoints) {
          throw new Error('No creators, maxSupply, or royalties input');
        }

        currentNFTFormValue.properties = { creators, maxSupply };
        currentNFTFormValue.seller_fee_basis_points = royaltiesBasisPoints;

        const formValuesCopy = [...formValues];
        formValuesCopy[index] = { ...currentNFTFormValue };
      } else {
        throw new Error('No form values found');
      }

      nextStep!();
    });
  };

  const updateCreator = (address: string, share: number) => {
    const creatorIndex = creators.findIndex((creator) => creator.address === address);
    const creatorsAfterUpdate = [
      ...creators.slice(0, creatorIndex),
      { address, share },
      ...creators.slice(creatorIndex + 1),
    ];
    setCreators(creatorsAfterUpdate);
  };

  const addCreator = () => {
    form
      .validateFields(['addCreator'])
      .then((values) => {
        if (creators.length >= MAX_CREATOR_LIMIT) {
          throw new Error('Max level of creators reached');
        }
        const newShareSplit = 98 / (creators.length + 1);

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
    setShowErrors(false);
  };

  const removeCreator = (creatorAddress: string) => {
    const newShareSplit = 98 / (creators.length - 1);

    setCreators([
      ...creators
        .filter((c) => c.address !== creatorAddress)
        .map((c) => ({ ...c, share: newShareSplit })),
    ]);
    setShowErrors(false);
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
              initialValue={royaltiesPercentage}
            >
              <InputNumber<number>
                min={1}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => parseInt(value?.replace('%', '') ?? '0')}
                style={{ borderRadius: 4, minWidth: 103 }}
                onChange={(val: number) => setRoyaltiesBasisPoints(val * 100)}
              />
            </Form.Item>
          </Form.Item>
          {/* Display creators */}
          {creators.length < MAX_CREATOR_LIMIT && (
            <Row justify="space-between" align="middle">
              <Paragraph style={{ fontWeight: 900 }}>Creators split</Paragraph>
              <StyledClearButton type="text" noStyle onClick={() => toggleCreatorField(true)}>
                Add Creator
              </StyledClearButton>
            </Row>
          )}
          <Row>
            <CreatorsRow
              creatorAddress={HOLAPLEX_CREATOR_OBJECT.address}
              share={HOLAPLEX_CREATOR_OBJECT.share}
              isUser={false}
              updateCreator={updateCreator}
              removeCreator={removeCreator}
            />
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
                  {
                    message: 'You can only add 4 creators',
                    async validator(rule, value: string) {
                      if (creators.length === MAX_CREATOR_LIMIT) {
                        throw new Error();
                      }
                    },
                  },
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
                {/* Add a Reset button here? To reset percentages to equal split? */}
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
                    setMaxSupply(MAX_SUPPLY_ONE_OF_ONE);
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
                    setDoEachRoyaltyInd(true);
                    next();
                  }}
                >
                  Do each individually
                </StyledClearButton>
              )}

              <Button type="primary" onClick={isFirst ? applyToAll : next}>
                {isFirst && images.length > 1 ? 'Apply to All' : 'Next'}
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
