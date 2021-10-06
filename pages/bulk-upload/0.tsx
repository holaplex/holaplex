import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import StepWizard from 'react-step-wizard';
import Upload from '@/common/components/elements/bulk-mint/wizard/Upload';
import Verify from '@/common/components/elements/bulk-mint/wizard/Verify';

const StyledLayout = styled(Layout)`
  width: 100%;
`;

// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
// Wizardize as well
export default function BulkUploadWizard() {
  return (
    <StyledLayout>
      <StepWizard>
        <Upload />
        <Verify />
      </StepWizard>
    </StyledLayout>
  );
}
