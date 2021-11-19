import { Layout, PageHeader } from 'antd';
import React from 'react';
import styled from 'styled-components';
import ArrowLeft from '@/common/assets/images/arrow-left.svg';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import { StyledClearButton } from './RoyaltiesCreators';

const Header = styled(PageHeader)`
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 65px;
  text-align: center;
  color: #fff;
  padding-top: 10px;
`;

const StyledLayout = styled(Layout)`
  display: flex;
  align-items: center;
  padding: 0 142px 97px;
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

const AltClearTextLink = StyledClearButton;

interface Props extends Partial<StepWizardChildProps> {
  children?: React.ReactElement | React.ReactElement[] | boolean;
  title?: string;
  clearForm?: () => void;
  altClearText?: string;
  showNavigation?: boolean;
}

export default function NavContainer({
  previousStep,
  goToStep,
  children,
  title,
  clearForm,
  altClearText,
  showNavigation = true,
}: Props) {
  return (
    <StyledLayout>
      {showNavigation && previousStep && (
        <GoBack onClick={previousStep}>
          <Image width={24} height={24} src={ArrowLeft} alt="arrow-left" />
        </GoBack>
      )}

      {showNavigation && (
        <XClose
          onClick={() => {
            if (
              altClearText ||
              window.confirm('Are you sure you want cancel? This will reset all of your progress.')
            ) {
              clearForm && clearForm();
              goToStep!(1);
            }
          }}
          style={{ fontStyle: 'normal' }}
        >
          {altClearText ? (
            <AltClearTextLink noStyle type="text">
              {altClearText}
            </AltClearTextLink>
          ) : (
            <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
          )}
        </XClose>
      )}

      {title && <Header>{title}</Header>}
      {children}
    </StyledLayout>
  );
}
