import React from 'react'

type WizardFormStepProps = {
  children: React.ReactElement<any, any>
}

const WizardFormStep: React.FunctionComponent<WizardFormStepProps> = ({ children }) => children;

export default WizardFormStep