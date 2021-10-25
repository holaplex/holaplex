import { Form, Layout } from 'antd';
import React, { ReactElement, useReducer } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/common/components/wizard/Upload';
import Verify from '@/common/components/wizard/Verify';
import InfoScreen from '@/common/components/wizard/InfoScreen';
import { useForm } from 'antd/lib/form/Form';
import Edition from '@/common/components/wizard/Edition';
import Summary from '@/common/components/wizard/Summary';

const nftStorageHolaplexEndpoint = 'https://www.holaplex.com/api/ipfs/upload';

const StyledLayout = styled(Layout)`
  width: 100%;
  overflow: hidden;
`;

// {"files":[{"uri":"https://bafkreihoddhywijzgytw7tocwilq7bnuvdbm3cu5t2wass3f7ce6whv3qm.ipfs.dweb.link","name":"image 8.png","type":"image/png"}]}

type UploadedFile = {
  name: string;
  uri: string;
  type: string;
};

interface State {
  images: Array<File>;
  uploadedFiles: Array<UploadedFile>;
}

const initialState: State = { images: [], uploadedFiles: [] };

export interface MintAction {
  type: 'SET_IMAGES' | 'DELETE_IMAGE' | 'ADD_IMAGE' | 'UPLOAD_FILES';
  payload: File[] | File | String | Array<UploadedFile>;
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
    default:
      throw new Error('No valid action for state');
  }
}

// const metadataContent = {
//   name: metadata.name,
//   symbol: metadata.symbol,
//   description: metadata.description,
//   seller_fee_basis_points: metadata.sellerFeeBasisPoints,
//   image: metadata.image,
//   animation_url: metadata.animation_url,
//   attributes: metadata.attributes,
//   external_url: metadata.external_url,
//   properties: {
//     ...metadata.properties,
//     creators: metadata.creators?.map(creator => {
//       return {
//         address: creator.address,
//         share: creator.share,
//       };
//     }),
//   },
// };

// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
export default function BulkUploadWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form] = useForm();
  const { images } = state;

  const buildMetaData = (values, uploadedFiles) => {
    // const metadata = {
    //   name: values.name,
    //   symbol: values.symbol,
    //   description: values.description,
    //   sellerFeeBasisPoints: values.seller_fee_basis_points,
    //   image: uploadedFiles[0].uri,
    //   animation_url: uploadedFiles[1].uri,
    //   attributes: values.attributes,
    //   external_url: values.external_url,
    //   properties: {
    //     ...values.properties,
    //     creators: values.creators?.map(creator => {
    //       return {
    //         address: creator.address,
    //         share: creator.share,
    //       };
    //     }),
    //   },
    // };
    // return metadata;

    // TODO: type this properly
    return values.map((v: any, i: number) => {
      console.log('DEBUG VALUE IS', values);
      const file = uploadedFiles[i]; // assuming everything is in order, should we use a key check?
      console.log('FILE IS', file);

      return {
        name: v.name,
        description: v.description,
        sellerFeeBasisPoints: 100,
        image: file.uri,
        files: [{ uri: file.uri, type: file.type }],
        attributes: v.attributes.map((a) => ({ [a.attrKey]: a.attrVal })),
        properties: {},
      };
    });
  };
  const onFinish = async (values: any) => {
    const arrayValues = Object.values(values);
    console.log('form values are', arrayValues);
    console.log('state is ', state);

    console.log('DEBUG: built meta data', buildMetaData(arrayValues, state.uploadedFiles));
    const builtMetaData = buildMetaData(arrayValues, state.uploadedFiles);

    const metaData = new File([JSON.stringify(builtMetaData)], 'metadata.json');
    const metaDataFileForm = new FormData();
    metaDataFileForm.append(`file[${metaData.name}]`, metaData, metaData.name); // TODO: how can we avoid going from form to json to form?

    // const resp = await fetch('/api/ipfs/upload', {
    //   body: metaDataFileForm,
    //   method: 'POST',
    // });
    // const json = await resp.json();

    // console.log('metadataupload response is ', json);
  };

  const clearForm = () => form.resetFields();

  return (
    <Form name="bulk-mint" form={form} onFinish={onFinish} requiredMark={false} layout="vertical">
      <StyledLayout>
        <StepWizard>
          <Upload dispatch={dispatch} />
          <Verify images={images} dispatch={dispatch} />
          {
            images.map((image, index) => (
              <InfoScreen
                images={images}
                index={index}
                key={index}
                form={form}
                clearForm={clearForm}
              />
            )) as any // Very annoying TS error here only solved by any
          }
          <Summary images={images} dispatch={dispatch} form={form} />
          {/* <Edition images={images} /> */}
        </StepWizard>
      </StyledLayout>
    </Form>
  );
}
