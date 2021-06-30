
// @ts-nocheck 
import React from 'react';
import sv from '@/constants/Styles'
import Link from 'next/link';
import styled from 'styled-components';

const StandardLink = styled.a`
  text-decoration: underline;
  color: ${props => props.invert ? sv.colors.buttonText : sv.colors.text};
`;

type LinkProps = {
  href: string,
  label: string,
  invert: boolean
}

const StyledLink = ({ href, label, invert }: LinkProps) => {
  return (
    <Link href={href} passHref>
      <StandardLink invert={invert}>{label}</StandardLink>
    </Link>
  )
}

export default StyledLink;
