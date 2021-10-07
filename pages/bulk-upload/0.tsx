import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Space } from 'antd';
import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/common/components/elements/bulk-mint/wizard/Upload';
import Verify from '@/common/components/elements/bulk-mint/wizard/Verify';

const StyledLayout = styled(Layout)`
  width: 100%;
`;

const initialState = { images: [] };

interface State {
  images: Array<File>;
}

export interface ImageAction {
  type: 'SET_IMAGES' | 'DELETE_IMAGE' | 'ADD_IMAGE';
  payload: any; // TODO: Type this
}

function reducer(state: State, action: ImageAction) {
  switch (action.type) {
    case 'SET_IMAGES':
      return { images: action.payload };
    case 'DELETE_IMAGE':
      return { images: state.images.filter((i) => i.name !== action.payload) };
    case 'ADD_IMAGE':
    // TODO: Implement
    default:
      throw new Error('No valid action for images state');
  }
}
// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
export default function BulkUploadWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StyledLayout>
      <StepWizard>
        <Upload dispatch={dispatch} />
        <Verify images={state.images} dispatch={dispatch} />
      </StepWizard>
    </StyledLayout>
  );
}
