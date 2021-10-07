import NavContainer from '@/common/components/elements/bulk-mint/wizard/NavContainer';
import React from 'react';
import { StepWizardChildProps } from 'react-step-wizard';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  // dispatch: (payload: ImageAction) => void;
}

export default function InfoScreen({ previousStep, goToStep, images }: Props) {
  return (
    <NavContainer title="testing" previousStep={previousStep} goToStep={goToStep}>
      hello
    </NavContainer>
  );
}
