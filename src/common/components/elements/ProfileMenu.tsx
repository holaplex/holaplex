import { FC } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import { Menu, Row, Space } from 'antd';
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

// const StyledLink = styled(Link)`
//   &:not(:last-child) {
//     margin-bottom: 8px;
//   }
// `;

// const ProfileLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
//   const router = useRouter();

//   return (
//     <StyledLink href={href} passHref>
//       <a>
//         <LinkContent isActive={router.asPath === href}>
//           <Space size={8}>{children}</Space>
//         </LinkContent>
//       </a>
//     </StyledLink>
//   );
// };

interface Props {
  wallet: string;
}

export const ProfileMenu: FC<Props> = ({ wallet }) => {
  return (
    <StyledMenu
      // onClick={handleListedClick}
      selectedKeys={['activity']}
      mode="horizontal"
      style={{ marginBottom: 16 }}
    >
      <StyledMenuItem key="activity">
        <Link href={`/profiles/${wallet}`} passHref>
          <StyledAnchor>
            <FeatherIcon height={16} width={16} icon="trending-up" />
            Activity
            {/* <p>Activity</p> */}
          </StyledAnchor>
        </Link>
      </StyledMenuItem>
      <StyledMenuItem key="nfts">
        <Link href={`/profiles/${wallet}/nfts`} passHref>
          <StyledAnchor>
            <FeatherIcon height={16} width={16} icon="image" />
            NFTs
            {/* <p>NFTs</p> */}
          </StyledAnchor>
        </Link>
      </StyledMenuItem>
    </StyledMenu>
  );
};

const StyledAnchor = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 16px;
    width: 16px;
    height: 16px;
  }
`;

const StyledMenu = styled(Menu)`
  background: #171717;
  border-bottom: 2px solid #262626;
`;

const StyledMenuItem = styled(Menu.Item)`
  width: 156px;
  padding: 16px !important;

  &:not(.ant-menu-item-selected) {
    a {
      color: #a8a8a8;
    }
  }

  &::after {
    right: 0 !important;
    left: 0 !important;
    bottom: -1px !important;
  }
`;
