// @ts-nocheck 
import React from 'react';
import styled from 'styled-components';
import sv from '../../constants/Styles';
import Image from 'next/image'

////// STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const Container = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size/2}px;
  overflow: hidden;
  background: ${sv.colors.cellHover};
  color: ${sv.colors.subtleText};
  box-shadow: 0 0 3px rgba(0,0,0,.4);
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Initials = styled.div<{ fontSize: number }>`
  width: 100%;
  height: 100%;
  font-size: ${props => props.fontSize}px;
  font-weight: 700;
  padding-top: 1px;
  ${sv.box};
  ${sv.flexCenter};
`;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type Props = {
  image?: string,
  name?: string,
  avatarSize?: number,
  className?: string
}

export default function Avatar({image, name, avatarSize, className}: Props) {

  const size = avatarSize ? avatarSize : 24;
  const fontSize = avatarSize ? avatarSize*.5 : 14;

  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  // @ts-ignore
  let initials = (name && [...name.matchAll(rgx)]) || [];

  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();

  return (
    <Container className={className} size={size}>
      {image &&
        <Image src={image} alt="" />
      }
      {!image &&
        <Initials fontSize={fontSize}>
          {initials}
        </Initials>
      }
    </Container>
  );
}
