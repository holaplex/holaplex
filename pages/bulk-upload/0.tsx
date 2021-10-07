import { Layout } from 'antd';
import React, { useReducer } from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/common/components/elements/bulk-mint/wizard/Upload';
import Verify from '@/common/components/elements/bulk-mint/wizard/Verify';
import InfoScreen from '@/common/components/elements/bulk-mint/wizard/InfoScreen';

const StyledLayout = styled(Layout)`
  width: 100%;
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

  return (
    <StyledLayout>
      <StepWizard>
        <InfoScreen images={state.images} />
        <Upload dispatch={dispatch} />
        <Verify images={state.images} dispatch={dispatch} />
      </StepWizard>
    </StyledLayout>
  );
}
