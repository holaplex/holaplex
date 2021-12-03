import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Divider, Input, Form, FormInstance, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { FormValues, MintDispatch, NFTAttribute, NFTFormValue } from 'pages/nfts/new';
import { StyledClearButton } from '@/modules/nfts/components/wizard/RoyaltiesCreators';
import Text from 'antd/lib/typography/Text';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  index: number;
  form: FormInstance;
  clearForm: () => void;
  currentImage: File;
  isLast: boolean;
  dispatch: MintDispatch;
}

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

const StyledButton = styled(Button)`
  background: #1a1a1a;
  border-radius: 4px;
  width: 39px;
  height: 50px;

  img {
    opacity: 0.5;
  }
`;

const AttributeClearButton = (props: { onClick: () => void }) => {
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
  isActive,
  clearForm,
  isLast,
  dispatch,
  currentImage,
}: Props) {
  const { TextArea } = Input;
  const nftNumber = `nft-${index}`;
  const nftNumberList = images.map((_, i) => `nft-${i}`);
  const [errorList, setErrorList] = useState<string[]>([]);
  const nftList = form.getFieldsValue(nftNumberList) as FormValues;
  const previousNFT: NFTFormValue | undefined = nftList[`nft-${index - 1}`];

  const handleNext = () => {
    setErrorList([]);
    form
      .validateFields([
        [nftNumber, 'name'],
        [nftNumber, 'attributes'],
      ])
      .then((v2: { [nftN: string]: { name: string; attributes: NFTAttribute[] } }) => {
        if (isLast) {
          const values2 = form.getFieldsValue(nftNumberList) as FormValues;

          const arrayValues = Object.values(values2).filter((v) => v !== undefined);
          dispatch({ type: 'SET_FORM_VALUES', payload: arrayValues });
        }
        nextStep!();
      })
      .catch(
        (errorInfo: {
          errorFields: {
            name: string[];
            errors: string[];
          }[];
        }) => {
          console.log('errorInfo', errorInfo);
          setErrorList(
            errorInfo.errorFields // only handle attribute errors
              .filter((ef) => ef.name.includes('attributes'))
              .map((ef) => ef?.errors)
              .flat()
          );
        }
      );
  };

  const AttributeRow = ({
    remove,
    fieldsLength,
    field,
  }: {
    remove: (index: number | number[]) => void;
    fieldsLength: number;
    field: FormListFieldData;
  }) => (
    <Input.Group style={{ marginBottom: 18, display: 'flex', flexDirection: 'row' }}>
      <Form.Item name={[field.name, 'trait_type']}>
        <Input style={{ width: 178, marginRight: 10, borderRadius: 4 }} placeholder="e.g. Color" />
      </Form.Item>
      <Form.Item name={[field.name, 'value']}>
        <Input style={{ width: 178, marginRight: 8, borderRadius: 4 }} placeholder="e.g. Green" />
      </Form.Item>
      {fieldsLength > 1 && <AttributeClearButton onClick={() => remove(field.name)} />}
    </Input.Group>
  );

  return isActive ? (
    <NavContainer
      title={`Info for #${index + 1} of ${images.length}`}
      previousStep={previousStep}
      goToStep={goToStep}
      clearForm={clearForm}
    >
      <Row>
        <FormWrapper>
          {/* <Form.Item> */}
          <Form.Item
            name={[nftNumber, 'name']}
            initialValue={images[index]?.name?.substring(0, 20) || ''}
            label="Name"
            rules={[
              { required: true, message: 'Name is required' },
              { max: 20, message: 'NFT names can not be longer than 20 charachters' },
              {
                message:
                  'The resulting Buffer length from the NFT name can not be longer than 32. Please reduce the length of the name of your NFT.',
                async validator(rule, value) {
                  if (Buffer.from(value).length > 28) {
                    throw new Error();
                  }
                },
              },
            ]}
          >
            <Input placeholder="required" autoFocus />
          </Form.Item>
          <Form.Item
            name={[nftNumber, 'description']}
            label="Description"
            initialValue={previousNFT ? previousNFT.description : ''}
          >
            <TextArea placeholder="optional" autoSize={{ minRows: 3, maxRows: 8 }} />
          </Form.Item>
          <Form.Item
            name={[nftNumber, 'collectionName']}
            label="Collection Name"
            initialValue={previousNFT ? previousNFT.collectionName : ''}
          >
            <Input placeholder="e.g., Solflare X NFT (optional)" />
          </Form.Item>
          <Form.Item
            name={[nftNumber, 'collectionFamily']}
            label="Collection Family"
            initialValue={previousNFT ? previousNFT.collectionFamily : ''}
          >
            <Input placeholder="e.g., Solflare (optional)" />
          </Form.Item>
          <Form.Item label="Attributes">
            <Form.List
              name={[nftNumber, 'attributes']}
              initialValue={
                previousNFT
                  ? previousNFT?.attributes.map((a) => ({
                      trait_type: a.trait_type,
                      value: undefined,
                    }))
                  : [{ trait_type: undefined, value: undefined }]
              }
              rules={[
                {
                  message: 'All attributes must have defined trait types',
                  async validator(rule, value: NFTAttribute[]) {
                    if (value.length === 1) return;
                    if (value.some((a, i) => !a?.trait_type)) {
                      throw new Error();
                    }
                  },
                },
                {
                  message: 'All attributes must be unique',
                  async validator(rule, value: NFTAttribute[]) {
                    const traitTypes = value.map((a) => a?.trait_type);
                    const indexOfDuplicate = traitTypes.findIndex(
                      (a, i) => traitTypes.indexOf(a) !== i
                    );
                    if (indexOfDuplicate !== -1) {
                      throw new Error();
                    }
                  },
                },
                {
                  message: 'All attributes with a trait type must have a value',
                  async validator(rule, value: NFTAttribute[]) {
                    if (value.some((a, i) => a?.trait_type && !a?.value)) {
                      throw new Error();
                    }
                  },
                },
              ]}
            >
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
                  {errorList.map((error, j) => (
                    <div key={j}>
                      <Text type="danger">{error}</Text>
                    </div>
                  ))}
                  {fields.length < 10 && (
                    <StyledClearButton onClick={() => add()} type="default" noStyle={true}>
                      Add Attribute
                    </StyledClearButton>
                  )}
                </>
              )}
            </Form.List>
          </Form.Item>
          <ButtonFormItem style={{ marginTop: 42 }}>
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          </ButtonFormItem>
          {/* </Form.Item> */}
        </FormWrapper>
        <StyledDivider type="vertical" />
        <NFTPreviewGrid images={images} index={index} width={2} />
      </Row>
    </NavContainer>
  ) : null;
}
