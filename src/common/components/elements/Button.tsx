// @ts-nocheck
import React from 'react';
// @ts-ignore
import {darken} from 'polished'
import sv from '@/constants/Styles';
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

const Container = styled.div<containerProps>`
  height: ${(props: containerProps) => props.small ? sv.buttonHeight/1.5 : sv.buttonHeight}px;
  background: ${(props: containerProps) => props.subtle ? sv.colors.cellDark : sv.colors.mainGradient};
  color: ${sv.colors.buttonText};
  ${sv.flexCenter};
  ${sv.box};
  width: auto;
  padding: 0 ${(props: containerProps) => props.small ? sv.grid*2 : sv.grid*4}px;
  margin-right: ${(props: containerProps) => props.marginRight ? sv.grid : 0}px;
  opacity: ${(props: containerProps) => props.disabled ? .3 : 1};
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
  &:hover {
    background: ${(props: containerProps) => props.subtle ? darken(0.1, sv.colors.cellDark) : sv.colors.mainGradientHover};
  }
  &:disabled {
    opacity: .5;
  }
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type buttonProps = {
  label: string;
  action?: Function; // marking this optional as we build out functionality
  marginRight?: boolean;
  inactive?: boolean;
  icon?: string;
  subtle?: boolean;
  small?: boolean;
  className?: string;
}

export default function Button({
  label,
  action,
  marginRight,
  inactive,
  icon,
  subtle,
  small,
  className
}: buttonProps) {

  const bgColor = subtle ? sv.colors.card : sv.colors.cta
  const hoverBgColor = subtle ? sv.colors.cardLight : sv.colors.ctaHover

  const handleAction = () => {
    action && !inactive ? action() : console.log('no action yet...')
  }

  return (
    <Container
      // @ts-ignore
      marginRight={marginRight}
      subtle={subtle}
      bgColor={bgColor}
      hoverBgColor={hoverBgColor}
      className={className}
      onClick={handleAction}
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
