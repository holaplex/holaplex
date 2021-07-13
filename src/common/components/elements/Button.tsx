// @ts-nocheck
import React from 'react';
// @ts-ignore
import {darken} from 'polished'
import sv from '@/constants/styles';
import styled from 'styled-components';
//@ts-ignore
import FeatherIcon from 'feather-icons-react'

////// STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
type containerProps = {
  hasLabel: string;
  icon: string;
  subtle: boolean;
  small: boolean;
  className: string;
  disabled?: boolean;
  marginRight: boolean;
}

const Container = styled.button<containerProps>`
  border: none;
  height: ${(props: containerProps) => props.small ? sv.buttonHeight/1.5 : sv.buttonHeight}px;
  background: ${(props: containerProps) => props.subtle ? sv.colors.cellDark : sv.colors.mainGradient};
  color: ${sv.colors.buttonText};
  ${sv.flexCenter};
  ${sv.box};
  width: auto;
  font: ${sv.bodyText};
  padding: 0 ${(props: containerProps) => props.small ? sv.grid*2 : sv.grid*4}px;
  margin-right: ${(props: containerProps) => props.marginRight ? sv.grid : 0}px;
  border-radius: ${sv.radius}px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  svg {
    color: ${(props: containerProps) => props.subtle ? sv.colors.subtleText : sv.colors.buttonText};
    stroke-width: 2px;
    margin-right: ${(props: containerProps) => props.hasLabel ? sv.grid : 0}px;
    flex: 0 0 16px;
  }
  &:focus {
    border: none;
    outline: none;
  }
  &:hover {
    background: ${(props: containerProps) => props.subtle ? darken(0.1, sv.colors.cellDark) : sv.colors.mainGradientHover};
  }
  &:disabled {
    background: ${sv.colors.mainGradentDisabled};
  }
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type buttonProps = {
  label?: string;
  onClick?: Function; // marking this optional as we build out functionality
  marginRight?: boolean;
  inactive?: boolean;
  icon?: string;
  subtle?: boolean;
  small?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  marginRight,
  disabled,
  icon,
  subtle,
  small,
  className
}: buttonProps) {

  const bgColor = subtle ? sv.colors.card : sv.colors.cta
  const hoverBgColor = subtle ? sv.colors.cardLight : sv.colors.ctaHover

  return (
    <Container
      // @ts-ignore
      marginRight={marginRight}
      subtle={subtle}
      bgColor={bgColor}
      hoverBgColor={hoverBgColor}
      className={className}
      disabled={disabled}
      onClick={disabled ? null : onClick}
      hasLabel={label}
      small={small}
    >
      {icon &&
        <FeatherIcon icon={icon} />
      }
      {label}
    </Container>
  );
}
