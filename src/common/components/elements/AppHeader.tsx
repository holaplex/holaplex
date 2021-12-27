import sv from '@/constants/styles';
import Link from 'next/link';
import styled from 'styled-components';
import { Layout, Space } from 'antd';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import SocialLinks from '@/components/elements/SocialLinks';
import { useRouter } from 'next/router';
import { WalletContext } from '@/modules/wallet';
import { useContext } from 'react';

const HeaderTitle = styled.div`
  font-size: 24px;
  line-height: 2px;
  font-weight: 900;
  margin-right: 2rem;
  flex-grow: 1;
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
  margin: 5px 5px 40px;
  padding: 1.25rem;
`;

const HeaderLinkWrapper = styled.div<{ active: boolean }>`
  color: ${sv.colors.buttonText};
  ${({ active }) => active && `text-decoration: underline;`}
`;

export function AppHeader() {
  const windowDimensions = useWindowDimensions();
  const router = useRouter();
  const { connect } = useContext(WalletContext);

  return (
    <StyledHeader>
      <HeaderTitle>
        {windowDimensions.width > 550 ? (
          <Link href="/">
            <a>
              👋&nbsp;&nbsp;Holaplex
            </a>
          </Link>
        ) : (
          <Link href="/">
            <a>
              👋
            </a>
          </Link>
        )}
      </HeaderTitle>
      <Space size="large">
        {windowDimensions.width >= 778 && (
          <HeaderLinkWrapper
            key="edit"
            onClick={() => connect()}
            active={router.pathname == '/storefront/edit'}
          >
            <Link href="/storefront/edit" passHref>
              <a>
                Edit store
              </a>
            </Link>
          </HeaderLinkWrapper>
        )}

        <HeaderLinkWrapper key="nft-new" active={router.pathname == '/nfts/new'}>
          <Link href="/nfts/new" passHref>
            <a>
              Mint&nbsp;NFTs
            </a>
          </Link>
        </HeaderLinkWrapper>
        <HeaderLinkWrapper key="about" active={router.pathname == '/about'}>
          <Link href="/about" passHref>
            <a>
              About
            </a>
          </Link>
        </HeaderLinkWrapper>
        <HeaderLinkWrapper key="faq" active={false}>
          <a href="https://holaplex-support.zendesk.com/hc/en-us" target="_blank" rel="noreferrer">
            FAQ
          </a>
        </HeaderLinkWrapper>
        {/* {windowDimensions.width > 700 && <SocialLinks />} */}
      </Space>
    </StyledHeader>
  );
}
