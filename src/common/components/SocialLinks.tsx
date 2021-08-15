import React from 'react'
import styled from 'styled-components'
import sv from '@/constants/styles'
import Image from 'next/image'
import FeatherIcon from 'feather-icons-react'
import DiscordLogo from '@/assets/images/discord-logo.svg'

const SocialLink = styled.a`
  margin-left: ${sv.grid*2}px;
  color: ${sv.colors.buttonText};
  opacity: .5;
  transition: opacity .2s ease;
  &:hover {
    color: ${sv.colors.buttonText};
    opacity: 1;
  }
`;

const SocialLinks = () => {

  return (
    <>
      <SocialLink href="https://www.facebook.com/Holaplex-110107494681247/" target="_blank">
        <FeatherIcon icon="facebook" />
      </SocialLink>
      <SocialLink href="https://www.instagram.com/holaplex.nft/" target="_blank">
        <FeatherIcon icon="instagram" />
      </SocialLink>
      <SocialLink href="https://twitter.com/holaplex" target="_blank">
        <FeatherIcon icon="twitter" />
      </SocialLink>
      <SocialLink href="https://discord.com/invite/TEu7Qx5ux3" target="_blank">
        <Image width={24} height={24} src={DiscordLogo} />
      </SocialLink>
    </>

  )
}

export default SocialLinks
