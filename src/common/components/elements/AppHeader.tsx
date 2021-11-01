import sv from '@/constants/styles';
import Link from 'next/link';
import styled from 'styled-components';
import { Layout, Space } from 'antd';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import SocialLinks from '@/components/elements/SocialLinks';
import { useRouter } from 'next/router';

const HeaderTitle = styled.div`
  font-size: 24px;
  line-height: 2px;
  font-weight: 900;
  margin-right: auto;
  a {
    color: ${sv.colors.buttonText};
    &:hover {
      color: ${sv.colors.buttonText};
    }
  }
`;
const { Header } = Layout;

const StyledHeader = styled(Header)`
  ${sv.flexRow};
  margin: 0 0 40px 0;
`;

const HeaderLinkWrapper = styled.div<{ active: boolean }>`
  color: ${sv.colors.buttonText};
  ${({ active }) => active && `text-decoration: underline;`}
`;

export function AppHeader() {
  const windowDimensions = useWindowDimensions();
  const router = useRouter();

  return (
    <StyledHeader>
      <HeaderTitle>
        {windowDimensions.width > 550 ? (
          <Link href="/" passHref>
            👋 Holaplex
          </Link>
        ) : (
          <Link href="/" passHref>
            👋
          </Link>
        )}
      </HeaderTitle>
      <Space size="large">
        <HeaderLinkWrapper active={router.pathname == '/nfts/new'}>
          <Link href="/nfts/new" passHref>
            Mint NFTs
          </Link>
        </HeaderLinkWrapper>
        <HeaderLinkWrapper active={router.pathname == '/storefronts'}>
          <Link href="/storefronts" passHref>
            View Stores
          </Link>
        </HeaderLinkWrapper>
        <HeaderLinkWrapper active={false}>
          <a
            href="https://docs.google.com/document/d/e/2PACX-1vSMDXh4TbZCR70AqA3O3-pRnvWVBSxE5cFM4LcprS_BHa20aRK8xFLDMwv-2YbZydWYQS1DBl2GBFNX/pub"
            target="_blank"
            rel="noreferrer"
          >
            FAQ
          </a>
        </HeaderLinkWrapper>
        {windowDimensions.width > 550 && <SocialLinks />}
      </Space>
    </StyledHeader>
  );
}
