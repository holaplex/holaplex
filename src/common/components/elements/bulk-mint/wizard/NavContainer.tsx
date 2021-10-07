import { Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';
import ArrowLeft from '@/common/assets/images/arrow-left.svg';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';

const StyledLayout = styled(Layout)`
  display: flex;
  align-items: center;
  padding: 61px 142px 97px;
`;

const XClose = styled.i`
  position: absolute;
  top: 32px;
  right: 40px;
  cursor: pointer;
`;

const GoBack = styled.i`
  position: absolute;
  top: 32px;
  left: 40px;
  cursor: pointer;
`;

interface Props extends Partial<StepWizardChildProps> {
  children?: React.ReactElement | React.ReactElement[] | boolean;
  title?: string;
}

export default function NavContainer({ previousStep, goToStep, children, title }: Props) {
  return (
    <StyledLayout>
      <GoBack onClick={previousStep}>
        <Image width={24} height={24} src={ArrowLeft} alt="arrow-left" />
      </GoBack>
      <XClose onClick={() => goToStep!(1)}>
        <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
      </XClose>
      {title ? title : null}
      {children}
    </StyledLayout>
  );
}
