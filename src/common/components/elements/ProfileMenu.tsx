import { FC } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import { Row, Space } from 'antd';
import styled from 'styled-components';

const LinkContent = styled(Row)<{ isActive: boolean }>`
  ${({ isActive }) => isActive && 'background: #262626;'}
  border-radius: 8px;
  height: 48px;
  padding: 12px;
  font-size: 16px;

  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
`;

const StyledLink = styled(Link)`
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const ProfileLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const router = useRouter();

  return (
    <StyledLink href={href} passHref>
      <a>
        <LinkContent isActive={router.asPath === href}>
          <Space size={8}>{children}</Space>
        </LinkContent>
      </a>
    </StyledLink>
  );
};

interface Props {
  wallet: string;
}

export const ProfileMenu: FC<Props> = ({ wallet }) => {
  return (
    <div style={{ marginTop: 40 }}>
      <ProfileLink href={`/profiles/${wallet}`}>
        <FeatherIcon height={16} width={16} icon="trending-up" />
        <span>Activity</span>
      </ProfileLink>
      <ProfileLink href={`/profiles/${wallet}/nfts`}>
        <FeatherIcon height={16} width={16} icon="image" />
        <span>NFTs</span>
      </ProfileLink>
    </div>
  );
};
