import React from 'react'

type WizardFormStepProps = {
  children: JSX.Element,
  validate?: (val: any) => any,
  pristine?: boolean,
}

const WizardFormStep = ({ children }: WizardFormStepProps) => children;

export default WizardFormStep
