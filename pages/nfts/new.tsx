import { Form, Layout } from 'antd';
import React, { useContext, useReducer, useRef } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/modules/nfts/components/wizard/Upload';
import Verify from '@/modules/nfts/components/wizard/Verify';
import InfoScreen from '@/modules/nfts/components/wizard/InfoScreen';
import { useForm } from 'antd/lib/form/Form';
import Summary from '@/modules/nfts/components/wizard/Summary';
import RoyaltiesCreators from '@/modules/nfts/components/wizard/RoyaltiesCreators';
import { WalletContext, WalletProvider } from '@/modules/wallet';
import PriceSummary from '@/modules/nfts/components/wizard/PriceSummary';
import MintInProgress from '@/modules/nfts/components/wizard/MintInProgress';
import { isNil } from 'ramda';
import OffRampScreen from '@/modules/nfts/components/wizard/OffRamp';
import { Connection } from '@solana/web3.js';

export const MAX_CREATOR_LIMIT = 5;

export interface Creator {
  address: string;
  share: number;
}

const StyledLayout = styled(Layout)`
  width: 100%;
  overflow: hidden;
`;

interface UploadedFile {
  name: string;
  uri: string;
  type: string;
}

export type FormValues = { [key: string]: NFTFormValue };

export interface NFTFormValue {
  name: string;
  imageName: string;
  description: string;
  collection: string;
  attributes: Array<NFTAttribute>;
  seller_fee_basis_points: number;
  properties: { creators: Array<Creator>; maxSupply: number };
}

export interface MetadataFile {
  name: string;
  uri: string;
  type: string;
}

export type FileOrString = MetadataFile | string;

export type NFTAttribute = {
  trait_type: string;
  value: string | number;
};

export interface MetaDataContent {
  name: string;
  description: string;
  attributes?: NFTAttribute[];
  seller_fee_basis_points: number;

  properties: {
    files?: FileOrString[];
    // category: MetadataCategory;
    maxSupply: number;
    creators?: {
      address: string;
      shares: number;
    }[];
  };
}

export type MintDispatch = (action: MintAction) => void;

interface State {
  images: Array<File>;
  uploadedFiles: Array<UploadedFile>;
  formValues: NFTFormValue[] | null;
  metaData: MetaDataContent[];
  metadataFiles: MetadataFile[];
}

const initialState: State = {
  images: [],
  uploadedFiles: [],
  formValues: null,
  metaData: [],
  metadataFiles: [],
};

export interface MintAction {
  type:
    | 'SET_IMAGES'
    | 'DELETE_IMAGE'
    | 'ADD_IMAGE'
    | 'UPLOAD_FILES'
    | 'SET_FORM_VALUES'
    | 'SET_META_DATA'
    | 'SET_META_DATA_LINKS';
  payload:
    | File[]
    | File
    | String
    | Array<UploadedFile>
    | NFTFormValue[]
    | MetaDataContent[]
    | MetadataFile[];
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
      return { ...state, images: [...state.images, action.payload as File] };
    case 'UPLOAD_FILES':
      return { ...state, uploadedFiles: action.payload as Array<UploadedFile> };
    case 'SET_FORM_VALUES':
      return { ...state, formValues: action.payload as NFTFormValue[] };
    case 'SET_META_DATA':
      return { ...state, metaData: action.payload as MetaDataContent[] };
    case 'SET_META_DATA_LINKS':
      return { ...state, metadataFiles: action.payload as MetadataFile[] };
    default:
      throw new Error('No valid action for state');
  }
}

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string);

export default function BulkUploadWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form] = useForm();
  const { images } = state;
  const { connect, wallet, solana } = useContext(WalletContext);

  const [doEachRoyaltyInd, setDoEachRoyaltyInd] = React.useState(false);

  // TODO: do we even need `wallet` if we have `solana`?
  if (!wallet || !solana) {
    connect({ redirect: '/nfts/new' });
  }

  // TODO: type this and extract to helper file
  const buildMetaData = (values: any, uploadedFiles: any) => {
    // TODO: type this properly
    return values.map((v: any, i: number) => {
      const file = uploadedFiles[i]; //  we are assuming everything is in order, should we use a key check?

      return {
        name: v.name,
        description: v.description,
        symbol: '', // TODO: What do we feed this? v.symbol?
        seller_fee_basis_points: v.seller_fee_basis_points,
        image: file.uri,
        files: [{ uri: file.uri, type: file.type }],
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

  const uploadMetaData = async (files: any) => {
    const { formValues, metadataFiles } = state;
    if (!files?.length) {
      throw new Error('No files uploaded');
    }

    console.log('formValues are ', formValues);
    const builtMetaData = buildMetaData(formValues, files);

    console.log('builtMetaData', builtMetaData);

    // TODO: type this
    // Do we need to do a Promise.all here?
    const promises = builtMetaData.map(async (m: any, i: number) => {
      const metaData = new File([JSON.stringify(m)], `metadata-${i}`); // TODO: what to name this?
      const metaDataFileForm = new FormData();
      metaDataFileForm.append(`file[${metaData.name}]`, metaData, metaData.name);
      return await fetch('/api/ipfs/upload', {
        body: metaDataFileForm,
        method: 'POST',
      });
    });

    Promise.all(promises).then((responses) => {
      const jsonPromises = responses.map(async (resp: any) => await resp.json());

      Promise.all(jsonPromises).then((json) => {
        const payload = json.map((j) => j.files[0]);
        console.log('payload is ', payload);
        dispatch({ type: 'SET_META_DATA_LINKS', payload });
      });
    });

    dispatch({ type: 'SET_META_DATA', payload: builtMetaData });

    return Promise.resolve();
  };

  const clearForm = () => form.resetFields();

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    // Prevent Enter submit
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  if (!wallet || !solana) {
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
      initialValues={{ royaltiesPercentage: 10 }}
    >
      <StyledLayout>
        <StepWizard
          isHashEnabled={true}
          transitions={{
            enterLeft: undefined,
            enterRight: undefined,
            exitRight: undefined,
            exitLeft: undefined,
          }}
        >
          <Upload dispatch={dispatch} images={images} hashKey="upload" />
          <Verify images={images} dispatch={dispatch} hashKey="verify" />
          {
            images.map((image, index) => (
              <InfoScreen
                hashKey={'info-' + index}
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
            hashKey="royalties"
            userKey={wallet.pubkey}
            formValues={state.formValues}
            dispatch={dispatch}
            isFirst={true}
            setDoEachRoyaltyInd={setDoEachRoyaltyInd}
            index={0}
          />
          {doEachRoyaltyInd &&
            images
              .slice(1)
              .map((_, index) => (
                <RoyaltiesCreators
                  images={images}
                  hashKey={'royalties-' + index}
                  form={form}
                  userKey={wallet.pubkey}
                  formValues={state.formValues}
                  dispatch={dispatch}
                  key={index}
                  index={index + 1}
                />
              ))}
          <Summary
            images={images}
            hashKey="summary"
            dispatch={dispatch}
            form={form}
            formValues={state.formValues}
            uploadMetaData={uploadMetaData}
          />

          <PriceSummary images={images} connection={connection} stepName={'priceSummary'} />

          {images.map((_, index) => (
            <MintInProgress
              key={index}
              images={images}
              wallet={solana}
              connection={connection}
              metaDataFile={state.metadataFiles[index]}
              metaDataContent={state.metaData[index]}
              index={index}
            />
          ))}

          <OffRampScreen hashKey="success" images={images} clearForm={clearForm} />
        </StepWizard>
      </StyledLayout>
    </Form>
  );
}
