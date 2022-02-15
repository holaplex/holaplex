import React from 'react';
import styled from 'styled-components';
import sv from '@/constants/styles';
import Image from 'next/image';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import DiscordLogo from '@/assets/images/discord-logo.svg';
import customData from '../../../../customData';

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
      {customData.twitterUrl && (
        <SocialLink href={customData.twitterUrl} target="_blank" rel="noreferrer">
          <FeatherIcon icon="twitter" />
        </SocialLink>
      )}
      {customData.instagramUrl && (
        <SocialLink href={customData.instagramUrl} target="_blank" rel="noreferrer">
          <FeatherIcon icon="instagram" />
        </SocialLink>
      )}
      {customData.instagramUrl && (
        <SocialLink href={customData.discordUrl} target="_blank" rel="noreferrer">
          <Image width={24} height={24} src={DiscordLogo} alt="discord" />
        </SocialLink>
      )}
    </Container>
  );
};

export default SocialLinks;
