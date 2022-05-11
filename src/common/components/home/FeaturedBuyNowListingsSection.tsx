import { VFC } from 'react';
import { NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { gql, useQuery } from '@apollo/client';
import { HomeSection, HomeSectionCarousel } from 'pages/home-v2-wip';

// TODO replace hardcoded list with gql query result
const featuredListings: {address: string, marketplace: string}[] = [
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
];


const FeaturedBuyNowListingsSection: VFC = () => {
  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>What&apos;s Hot</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://google.com">
          Discover All
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={2} cols={3}>
          {featuredListings.map((s) => (
            <HomeSectionCarousel.Item key={s.address}>
              <div className="p-2">
                <NFTCardDataWrapper address={s.address} marketplace={s.marketplace}/>
              </div>
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};


const GET_NFT_DATA = gql`
query NFTCardQuery($subdomain: String!, $address: String!) {
  nft(address: $address) {
    name
    description
    image
    creators {
      share
    }
    offers {
      price
    }
    owner {
      address
    }
    listings {
      auctionHouse
      address
    }
    purchases {
      price
    }
    address
  }
  marketplace(subdomain: $subdomain) {
    auctionHouse {
      sellerFeeBasisPoints
      address
      stats {
        floor
        average
      }
      auctionHouseTreasury
      authority
    }
    auctionHouseAddress
    configAddress
    ownerAddress
    subdomain
    storeAddress
  }
}
`;


// TODO the NFTCard needs to correctly show Buy Now option (as in https://github.com/holaplex/marketplace/blob/dev/src/components/NftCard/NftCard.tsx)
const NFTCardDataWrapper: VFC<{address: string, marketplace: string}> = ({address, marketplace}) => {
  const {
    data,
    loading,
    refetch,
  } = useQuery(GET_NFT_DATA, {
    fetchPolicy: 'network-only',
    variables: {
      subdomain: marketplace,
      address: address
    },
  });
  return <NFTCard nft={data?.nft} marketplace={data?.marketplace} refetch={refetch} loading={loading} />
}

export default FeaturedBuyNowListingsSection;