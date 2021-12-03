import React from 'react';
import styled from 'styled-components';
import sv from '@/constants/styles';
import Image from 'next/image';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import DiscordLogo from '@/assets/images/discord-logo.svg';

const Container = styled.div`
  ${sv.flexRow};
`;

const SocialLink = styled.a`
  display: block;
  ${sv.flexCenter};
  margin-left: ${sv.grid * 2}px;
  color: ${sv.colors.buttonText};
  opacity: 0.5;
  transition: opacity 0.2s ease;
  &:hover {
    color: ${sv.colors.cta};
    opacity: 1;
  }
`;

const SocialLinks = () => {
  return (
    <Container>
      <SocialLink href="https://twitter.com/holaplex" target="_blank" rel="noreferrer">
        <FeatherIcon icon="twitter" />
      </SocialLink>
      <SocialLink
        href="https://www.facebook.com/Holaplex-110107494681247/"
        target="_blank"
        rel="noreferrer"
      >
        <FeatherIcon icon="facebook" />
      </SocialLink>
      <SocialLink href="https://www.instagram.com/holaplex.nft/" target="_blank" rel="noreferrer">
        <FeatherIcon icon="instagram" />
      </SocialLink>
      <SocialLink href="https://github.com/holaplex" target="_blank" rel="noreferrer">
        <FeatherIcon icon="github" />
      </SocialLink>
      <SocialLink href="https://discord.com/invite/TEu7Qx5ux3" target="_blank" rel="noreferrer">
        <Image width={24} height={24} src={DiscordLogo} alt="discord" />
      </SocialLink>
    </Container>
  );
};

export default SocialLinks;
