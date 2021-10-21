import { Form, Layout } from 'antd';
import React, { ReactElement, useReducer } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/common/components/wizard/Upload';
import Verify from '@/common/components/wizard/Verify';
import InfoScreen from '@/common/components/wizard/InfoScreen';
import { useForm } from 'antd/lib/form/Form';
import Edition from '@/common/components/wizard/Edition';

const StyledLayout = styled(Layout)`
  width: 100%;
  overflow: hidden;
`;

interface State {
  images: Array<File>;
}

const initialState: State = { images: [] };

export interface ImageAction {
  type: 'SET_IMAGES' | 'DELETE_IMAGE' | 'ADD_IMAGE';
  payload: File[] | File | String;
}

function reducer(state: State, action: ImageAction) {
  switch (action.type) {
    case 'SET_IMAGES':
      return { images: action.payload as File[] };
    case 'DELETE_IMAGE':
      return {
        images: state.images.filter((i) => i.name !== (action.payload as String)),
      };
    case 'ADD_IMAGE':
      return { images: [...state.images, action.payload as File] };
    default:
      throw new Error('No valid action for images state');
  }
}

// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
export default function BulkUploadWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form] = useForm();

  const onFinish = (values: any) => {
    console.log('form values are', values);
  };

  const clearForm = () => form.resetFields();

  return (
    <Form name="bulk-mint" form={form} onFinish={onFinish} requiredMark={false} layout="vertical">
      <StyledLayout>
        <StepWizard>
          <Upload dispatch={dispatch} />
          <Verify images={state.images} dispatch={dispatch} />
          {
            state.images.map((image, index) => (
              <InfoScreen
                images={state.images}
                index={index}
                key={index}
                form={form}
                clearForm={clearForm}
              />
            )) as any // Very annoying TS error here only solved by any
          }
          {/* <Edition images={state.images} /> */}
        </StepWizard>
      </StyledLayout>
    </Form>
  );
}
