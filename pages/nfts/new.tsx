import { Form, Layout } from 'antd';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/modules/nfts/components/wizard/Upload';
import Verify from '@/modules/nfts/components/wizard/Verify';
import InfoScreen from '@/modules/nfts/components/wizard/InfoScreen';
import { useForm } from 'antd/lib/form/Form';
import Summary from '@/modules/nfts/components/wizard/Summary';
import RoyaltiesCreators, {
  HOLAPLEX_CREATOR_OBJECT,
} from '@/modules/nfts/components/wizard/RoyaltiesCreators';
import { WalletContext } from '@/modules/wallet';
import PriceSummary from '@/modules/nfts/components/wizard/PriceSummary';
import MintInProgress from '@/modules/nfts/components/wizard/MintInProgress';
import { isNil } from 'ramda';
import OffRampScreen from '@/modules/nfts/components/wizard/OffRamp';
import { Connection } from '@solana/web3.js';

export const MAX_CREATOR_LIMIT = 4;

export interface Creator {
  address: string;
  share: number;
}

const StyledLayout = styled(Layout)`
  width: 100%;
  overflow: hidden;
`;

export interface UploadedFilePin {
  name: string;
  uri: string;
  type: string;
}

export type FormValues = { [key: string]: NFTFormValue };

export interface NFTFormValue {
  name: string;
  imageName: string;
  description: string;
  collectionName: string;
  collectionFamily: string;
  attributes: Array<NFTAttribute>;
  seller_fee_basis_points: number;
  properties: { creators: Array<Creator>; maxSupply: number };
}

export type FileOrString = UploadedFilePin | string;

export type NFTAttribute = {
  trait_type: string;
  value: string | number;
};

export enum MintStatus {
  FAILED,
  SUCCESS,
}

export interface Collection {
  name: string;
  family: string;
}

export interface NFTValue {
  name: string;
  description: string;
  attributes?: NFTAttribute[];
  collection?: Collection;
  seller_fee_basis_points: number;
  mintStatus?: MintStatus;

  properties: {
    files?: FileOrString[];
    maxSupply: number;
    creators?: Creator[];
  };
}

export type MintDispatch = (action: MintAction) => void;

interface State {
  images: Array<File>;
  uploadedFiles: Array<UploadedFilePin>;
  formValues: NFTFormValue[] | null;
  nftValues: NFTValue[];
}

export interface MintAction {
  type:
    | 'SET_IMAGES'
    | 'DELETE_IMAGE'
    | 'ADD_IMAGE'
    | 'UPLOAD_FILES'
    | 'SET_FORM_VALUES'
    | 'SET_NFT_VALUES';
  payload: File[] | File | String | Array<UploadedFilePin> | NFTFormValue[] | NFTValue[];
}

const initialState = (): State => {
  return {
    images: [],
    uploadedFiles: [],
    formValues: null,
    nftValues: [],
  };
};

function getFinalFileWithUpdatedName(file: File, numberOfDuplicates: number) {
  const fileNameParts = file.name.split('.');
  const extension = fileNameParts.pop();
  const finalName = fileNameParts.join('.') + '_' + numberOfDuplicates + '.' + extension;
  return new File([file], finalName, { type: file.type });
}

function reducer(state: State, action: MintAction) {
  switch (action.type) {
    case 'SET_IMAGES':
      return { ...state, images: action.payload as File[] };
    case 'DELETE_IMAGE':
      return {
        ...state,
        images: state.images.filter((i) => i.name !== (action.payload as String)),
      };
    case 'ADD_IMAGE':
      const file = action.payload as File;
      const numberOfDuplicates = state.images.filter((i) => i.name === file.name).length;

      return state.images.length < 10
        ? {
            ...state,
            images: [
              ...state.images,
              numberOfDuplicates > 0 ? getFinalFileWithUpdatedName(file, numberOfDuplicates) : file,
            ],
          }
        : state;
    case 'UPLOAD_FILES':
      return { ...state, uploadedFiles: action.payload as Array<UploadedFilePin> };
    case 'SET_FORM_VALUES':
      return { ...state, formValues: action.payload as NFTFormValue[] };
    case 'SET_NFT_VALUES':
      return { ...state, nftValues: action.payload as NFTValue[] };
    default:
      throw new Error('No valid action for state');
  }
}

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string);

export default function BulkUploadWizard() {
  const [state, dispatch] = useReducer(reducer, initialState());
  const [form] = useForm();
  const { connect, solana, wallet, storefront } = useContext(WalletContext);

  const { images, formValues } = state;

  const [doEachRoyaltyInd, setDoEachRoyaltyInd] = useState(false);

  useEffect(() => {
    if (!wallet) {
      connect('/nfts/new');
    }
  }, [wallet, connect]);

  const transformFormVals = (values: NFTFormValue[], filePins: UploadedFilePin[]): NFTValue[] => {
    return values.map((v, i: number) => {
      const filePin = filePins[i];
      return {
        name: v.name,
        description: v.description,
        symbol: '',
        collection: {
          name: v.collectionName,
          family: v.collectionFamily,
        },
        seller_fee_basis_points: v.seller_fee_basis_points,
        image: filePin.uri,
        files: [{ uri: filePin.uri, type: filePin.type }],
        attributes: v.attributes.reduce((result: Array<NFTAttribute>, a: NFTAttribute) => {
          if (!isNil(a?.trait_type)) {
            result.push({ trait_type: a.trait_type, value: a.value });
          }
          return result;
        }, []),
        properties: v.properties,
      };
    });
  };

  const onFinish = (values: FormValues) => {
    const arrayValues = Object.values(values);
    dispatch({ type: 'SET_FORM_VALUES', payload: arrayValues });
  };

  const setNFTValues = (filePins: UploadedFilePin[]) => {
    if (!filePins?.length || !formValues?.length) {
      throw new Error('Either filePins or formValues are not set');
    }

    const nftVals = transformFormVals(formValues, filePins);

    dispatch({ type: 'SET_NFT_VALUES', payload: nftVals });
  };

  const uploadMetaData = async (nftValue: NFTValue) => {
    const creators = nftValue.properties.creators as Creator[];
    const creatorArrayWithHolaplexLast = [...creators, HOLAPLEX_CREATOR_OBJECT];

    const nftWithHolaplexAsLastCreator: NFTValue = {
      ...nftValue,
      properties: {
        ...nftValue.properties,
        creators: creatorArrayWithHolaplexLast,
      },
    };

    const metaData = new File([JSON.stringify(nftWithHolaplexAsLastCreator)], 'metadata');
    const metaDataFileForm = new FormData();
    metaDataFileForm.append(`file[${metaData.name}]`, metaData, metaData.name);
    const resp = await fetch('/api/ipfs/upload', {
      body: metaDataFileForm,
      method: 'POST',
    });

    const json = await resp.json(); // TODO: Type this

    const payload: UploadedFilePin = json.files[0];

    return Promise.resolve(payload);
  };

  const updateNFTValue = (value: NFTValue, index: number) => {
    const nftValues = [...state.nftValues];
    nftValues[index] = value;
    dispatch({ type: 'SET_NFT_VALUES', payload: nftValues });
  };

  const clearForm = () => {
    dispatch({ type: 'SET_IMAGES', payload: [] });
    form.resetFields();
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    // Prevent Enter submit
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  if (!solana || !wallet) {
    return null;
  }

  return (
    <Form
      name="bulk-mint"
      form={form}
      onFinish={onFinish}
      requiredMark={false}
      layout="vertical"
      onKeyDown={handleKeyDown}
    >
      <StyledLayout>
        <StepWizard
          isHashEnabled={false} // I don't think this will work unless we take the upload part out of the wizzard and generate all steps based on the uploaded images
          isLazyMount={true}
          transitions={{
            enterLeft: undefined,
            enterRight: undefined,
            exitRight: undefined,
            exitLeft: undefined,
          }}
        >
          <Upload dispatch={dispatch} images={images} hashKey="upload" />
          <Verify images={images} dispatch={dispatch} clearForm={clearForm} hashKey="verify" />
          {
            images.map((image, index) => (
              <InfoScreen
                images={images}
                index={index}
                currentImage={image}
                key={index}
                form={form}
                clearForm={clearForm}
                isLast={index === images.length - 1}
                dispatch={dispatch}
              />
            )) as any // Very annoying TS error here only solved by any
          }
          <RoyaltiesCreators
            images={images}
            form={form}
            userKey={wallet.pubkey}
            formValues={state.formValues}
            dispatch={dispatch}
            isFirst={true}
            setDoEachRoyaltyInd={setDoEachRoyaltyInd}
            doEachRoyaltyInd={doEachRoyaltyInd}
            index={0}
          />
          {doEachRoyaltyInd &&
            images
              .slice(1)
              .map((_, index) => (
                <RoyaltiesCreators
                  images={images}
                  form={form}
                  userKey={wallet.pubkey}
                  formValues={state.formValues}
                  dispatch={dispatch}
                  key={index + 1}
                  index={index + 1}
                  setDoEachRoyaltyInd={setDoEachRoyaltyInd}
                  doEachRoyaltyInd={doEachRoyaltyInd}
                />
              ))}
          <Summary
            images={images}
            hashKey="summary"
            dispatch={dispatch}
            form={form}
            formValues={state.formValues}
            setNFTValues={setNFTValues}
          />
          <PriceSummary images={images} connection={connection} hashKey="priceSummary" />
          {images.map((_, index) => (
            <MintInProgress
              key={index}
              images={images}
              wallet={solana}
              connection={connection}
              uploadMetaData={uploadMetaData}
              nftValues={state.nftValues}
              updateNFTValue={updateNFTValue}
              index={index}
              hashKey="mint"
            />
          ))}

          <OffRampScreen
            hashKey="success"
            images={images}
            clearForm={clearForm}
            nftValues={state.nftValues}
            storefront={storefront}
          />
        </StepWizard>
      </StyledLayout>
    </Form>
  );
}
