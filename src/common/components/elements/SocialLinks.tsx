import React from 'react';
import styled from 'styled-components';
import sv from '@/constants/styles';
import Image from 'next/image';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import DiscordLogo from '@/assets/images/discord-logo.svg';
import MediumLogo from '@/assets/images/medium-logo.svg';

import { useAnalytics } from '@/common/context/AnalyticsProvider';

const Container = styled.div`
  ${sv.flexRow};
  gap: 2rem;
  margin-left: 6px;
  flex-wrap: wrap;
`;

const SocialLink = styled.a`
  display: block;
  ${sv.flexCenter};
  color: ${sv.colors.buttonText};
  opacity: 0.5;
  transition: opacity 0.2s ease;
  &:hover {
    /* color: ${sv.colors.cta}; */
    opacity: 1;
  }
  transform: scale(1);
`;

const SocialLinks = () => {
  const { track } = useAnalytics();

  function trackSocialLink(network: 'Twitter' | 'Medium' | 'Github' | 'Discord' | 'YouTube') {
    track('Social link Click', {
      event_category: 'Misc',
      event_label: network,
      socialNetwork: network,
    });
  }

  return (
    <Container>
      <SocialLink
        href="https://twitter.com/holaplex"
        target="_blank"
        rel="noreferrer"
        onClick={() => trackSocialLink('Twitter')}
      >
        <FeatherIcon icon="twitter" />
      </SocialLink>
      {/* <SocialLink
        href="https://www.facebook.com/Holaplex-110107494681247/"
        target="_blank"
        rel="noreferrer"
      >
        <FeatherIcon icon="facebook" />
      </SocialLink>
      <SocialLink href="https://www.instagram.com/holaplex.nft/" target="_blank" rel="noreferrer">
        <FeatherIcon icon="instagram" />
      </SocialLink> */}
      <SocialLink
        href="https://discord.com/invite/holaplex"
        target="_blank"
        rel="noreferrer"
        onClick={() => trackSocialLink('Discord')}
      >
        <Image width={24} height={24} src={DiscordLogo} alt="discord" />
      </SocialLink>
      <SocialLink
        href="https://github.com/holaplex"
        target="_blank"
        rel="noreferrer"
        onClick={() => trackSocialLink('Github')}
      >
        <FeatherIcon icon="github" />
      </SocialLink>
      <SocialLink
        href="https://www.youtube.com/channel/UCHcdpZiDj7LiBifxetVH29Q"
        target="_blank"
        rel="noreferrer"
        onClick={() => trackSocialLink('YouTube')}
      >
        <FeatherIcon icon="youtube" />
      </SocialLink>
      <SocialLink
        href=" https://medium.com/holaplex"
        target="_blank"
        rel="noreferrer"
        onClick={() => trackSocialLink('Medium')}
      >
        <Image width={24} height={24} src={MediumLogo} alt="medium blog" />
      </SocialLink>
    </Container>
  );
};

export default SocialLinks;
