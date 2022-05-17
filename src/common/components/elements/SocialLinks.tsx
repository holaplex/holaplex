import React from 'react';
import styled from 'styled-components';
import sv from '@/constants/styles';
import Image from 'next/image';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import DiscordLogo from '@/assets/images/discord-logo.svg';
import MediumLogo from '@/assets/images/medium-logo.svg';

import { useAnalytics } from '@/common/context/AnalyticsProvider';

type SocialNetworkProvider = 'Twitter' | 'Medium' | 'Github' | 'Discord' | 'YouTube';

const socialProviders: {
  id: SocialNetworkProvider;
  href: string;
  svg: React.SVGProps<SVGSVGElement>;
}[] = [
  {
    id: 'Twitter',
    href: 'https://twitter.com/holaplex',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          fill="currentColor"
          d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
        />
      </svg>
    ),
  },
  {
    id: 'Discord',
    href: 'https://discord.com/invite/holaplex',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          fill="currentColor"
          d="M10.076 11c.6 0 1.086.45 1.075 1 0 .55-.474 1-1.075 1C9.486 13 9 12.55 9 12s.475-1 1.076-1zm3.848 0c.601 0 1.076.45 1.076 1s-.475 1-1.076 1c-.59 0-1.075-.45-1.075-1s.474-1 1.075-1zm4.967-9C20.054 2 21 2.966 21 4.163V23l-2.211-1.995-1.245-1.176-1.317-1.25.546 1.943H5.109C3.946 20.522 3 19.556 3 18.359V4.163C3 2.966 3.946 2 5.109 2H18.89zm-3.97 13.713c2.273-.073 3.148-1.596 3.148-1.596 0-3.381-1.482-6.122-1.482-6.122-1.48-1.133-2.89-1.102-2.89-1.102l-.144.168c1.749.546 2.561 1.334 2.561 1.334a8.263 8.263 0 0 0-3.096-1.008 8.527 8.527 0 0 0-2.077.02c-.062 0-.114.011-.175.021-.36.032-1.235.168-2.335.662-.38.178-.607.305-.607.305s.854-.83 2.705-1.376l-.103-.126s-1.409-.031-2.89 1.103c0 0-1.481 2.74-1.481 6.121 0 0 .864 1.522 3.137 1.596 0 0 .38-.472.69-.871-1.307-.4-1.8-1.24-1.8-1.24s.102.074.287.179c.01.01.02.021.041.031.031.022.062.032.093.053.257.147.514.262.75.357.422.168.926.336 1.513.452a7.06 7.06 0 0 0 2.664.01 6.666 6.666 0 0 0 1.491-.451c.36-.137.761-.337 1.183-.62 0 0-.514.861-1.862 1.25.309.399.68.85.68.85z"
        />
      </svg>
    ),
  },
  {
    id: 'Github',
    href: 'https://github.com/holaplex',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  {
    id: 'YouTube',
    href: 'https://www.youtube.com/channel/UCHcdpZiDj7LiBifxetVH29Q',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          fill="currentColor"
          d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"
        />
      </svg>
    ),
  },
  {
    id: 'Medium',
    href: 'https://medium.com/holaplex',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
        <path
          id="medium"
          d="M17.52669,16.21674a6.75084,6.75084,0,1,1-6.75057-6.79713,6.7739,6.7739,0,0,1,6.75057,6.79713m7.40561,0c0,3.53343-1.51121,6.399-3.3754,6.399s-3.3754-2.86554-3.3754-6.399,1.511-6.399,3.37517-6.399,3.3754,2.86463,3.3754,6.399m3.02931,0c0,3.16509-.53142,5.73247-1.18714,5.73247s-1.18691-2.5667-1.18691-5.73247.53142-5.73247,1.18691-5.73247,1.18714,2.56647,1.18714,5.73247"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const SocialLinks = () => {
  const { track } = useAnalytics();

  const trackSocialLink = (network: SocialNetworkProvider) =>
    track('Social link Click', {
      event_category: 'Misc',
      event_label: network,
      socialNetwork: network,
    });

  return (
    <div className="flex flex-wrap items-center space-x-6 text-gray-300">
      {socialProviders.map((provider) => (
        <a
          key={provider.id}
          href={provider.href}
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
          onClick={() => trackSocialLink(provider.id)}
        >
          {provider.svg}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
