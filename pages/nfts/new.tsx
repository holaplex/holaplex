import { Form, Layout } from 'antd';
import React, { useContext, useReducer, useRef } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/common/components/wizard/Upload';
import Verify from '@/common/components/wizard/Verify';
import InfoScreen from '@/common/components/wizard/InfoScreen';
import { useForm } from 'antd/lib/form/Form';
import Summary from '@/common/components/wizard/Summary';
import RoyaltiesCreators from '@/common/components/wizard/RoyaltiesCreators';
import { WalletContext, WalletProvider } from '@/modules/wallet';

const nftStorageHolaplexEndpoint = '/api/ipfs/upload';

export interface Royalty {
  creatorKey: string;
  amount: number;
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

export type NFTFormAttribute = { attrKey: string; attrVal: string };

export type FormValues = { [key: string]: NFTFormValue };

export interface NFTFormValue {
  name: string;
  imageName: string;
  description: string;
  collection: string;
  attributes: Array<NFTFormAttribute>;
  properties: { creators: Array<Royalty> };
}

interface MetaDataLink {
  name: string;
  uri: string;
  type: string;
}

interface MetaDataContent {
  properties: {
    creators: Array<Royalty>;
  };
}

export type MintDispatch = (action: MintAction) => void;

interface State {
  images: Array<File>;
  uploadedFiles: Array<UploadedFile>;
  formValues: NFTFormValue[] | null;
  metaData: MetaDataContent[] | null;
  metaDataLinks: MetaDataLink[];
}

const initialState: State = {
  images: [],
  uploadedFiles: [],
  formValues: null,
  metaData: [],
  metaDataLinks: [],
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
    | MetaDataLink[];
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
      return { ...state, metaDataLinks: action.payload as MetaDataLink[] };
    default:
      throw new Error('No valid action for state');
  }
}

// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
export default function BulkUploadWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form] = useForm();
  const { images } = state;
  const { connect, wallet } = useContext(WalletContext);

  if (!wallet) {
    connect({ redirect: '/nfts/new' });
  }

  // TODO: type this
  const buildMetaData = (values: any, uploadedFiles: any) => {
    // TODO: type this properly
    return values.map((v: any, i: number) => {
      console.log('attempt to find file with index of ', i);
      console.log('values are ', values);
      console.log('uploaded files are ', uploadedFiles);
      const file = uploadedFiles[i]; //  we are assuming everything is in order, should we use a key check?
      console.log('FILE IS', file);

      return {
        name: v.name,
        description: v.description,
        sellerFeeBasisPoints: 100,
        image: file.uri,
        files: [{ uri: file.uri, type: file.type }],
        attributes: v.attributes.map((a: NFTFormAttribute) => ({ [a.attrKey]: a.attrVal })),
        properties: {},
      };
    });
  };
  const onFinish = (values: FormValues) => {
    const arrayValues = Object.values(values);
    dispatch({ type: 'SET_FORM_VALUES', payload: arrayValues });
  };

  const uploadMetaData = (files: any) => {
    const { formValues, metaDataLinks } = state;
    if (!files?.length) {
      throw new Error('No files uploaded');
    }

    const builtMetaData = buildMetaData(state.formValues, files);

    console.log('builtMetaData', builtMetaData);

    // TODO: type this
    // Do we need to do a Promise.all here?
    builtMetaData.forEach(async (m: any, i: number) => {
      const metaData = new File([JSON.stringify(m)], `metadata-${i}`); // TODO: what to name this?
      const metaDataFileForm = new FormData();
      metaDataFileForm.append(`file[${metaData.name}]`, metaData, metaData.name);
      const resp = await fetch('/api/ipfs/upload', {
        body: metaDataFileForm,
        method: 'POST',
      });
      const json = await resp.json();
      console.log('metadataupload response is ' + i, json);

      console.log('metaupload links prev are ', metaDataLinks);
      dispatch({ type: 'SET_META_DATA_LINKS', payload: [...metaDataLinks, json.files[0]] });
    });
  };

  // const onStepChange = (stats: any) => {
  //   console.log('step change', stats);
  // };

  const clearForm = () => form.resetFields();

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    // Prevent Enter submit
    if (e.key === 'Enter') {
      e.preventDefault();
    }
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
          transitions={{
            enterLeft: undefined,
            enterRight: undefined,
            exitRight: undefined,
            exitLeft: undefined,
          }}
        >
          <Upload dispatch={dispatch} />

          <Verify images={images} dispatch={dispatch} />
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
            userKey={wallet?.pubkey}
            formValues={state.formValues}
            dispatch={dispatch}
          />
          <Summary
            images={images}
            dispatch={dispatch}
            form={form}
            formValues={state.formValues}
            uploadMetaData={uploadMetaData}
          />
          {/* <Edition images={images} /> */}
        </StepWizard>
      </StyledLayout>
    </Form>
  );
}
