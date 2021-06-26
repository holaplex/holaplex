import React from 'react';
import styled from 'styled-components';
import sv from '../../constants/Styles';
import FeatherIcon from 'feather-icons-react'

////// STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div`
  height: ${props => props.small ? sv.buttonHeight/1.5 : sv.buttonHeight}px;
  background: linear-gradient(165.77deg, #D24089 8.62%, #B92D44 84.54%);
  color: ${props => props.subtle ? sv.colors.subtleText : sv.colors.buttonText};
  ${sv.flexCenter};
  ${sv.box};
  width: auto;
  padding: 0 ${props => props.small ? sv.grid*2 : sv.grid*4}px;
  margin-right: ${props => props.marginRight ? sv.grid : 0}px;
  opacity: ${props => props.disabled ? .3 : 1};
  border-radius: ${sv.radius}px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  svg {
    color: ${props => props.subtle ? sv.colors.subtleText : sv.colors.buttonText};
    stroke-width: 2px;
    margin-right: ${props => props.hasLabel ? sv.grid : 0}px;
    flex: 0 0 16px;
  }
  &:hover {
    background: linear-gradient(10.77deg, #D24089 8.62%, #B92D44 84.54%);
  }
  &:disabled {
    opacity: .5;
  }
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default function Button({
  label,
  action,
  marginRight,
  inactive,
  icon,
  linkStyle,
  subtle,
  small,
  className
}) {

  const bgColor = subtle ? sv.colors.card : sv.colors.cta
  const hoverBgColor = subtle ? sv.colors.cardLight : sv.colors.ctaHover

  const handleAction = () => {
    action && !inactive ? action() : console.log('no action yet...')
  }

  return (
    <Container
      disabled={inactive}
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
