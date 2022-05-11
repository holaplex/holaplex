import React, { FC } from 'react';
import { MetadataSearchQuery, BasicSearchQuery } from 'src/graphql/indexerTypes';
import { PublicKey } from '@solana/web3.js';
import { ProfileSearchItem, NFTSearchItem } from './SearchItems';
import { isPublicKey } from './SearchBar';

interface SearchResultsProps {
  results: MetadataSearchQuery;
  profileResults?: BasicSearchQuery;
}

const SearchResults: FC<SearchResultsProps> = ({ results, profileResults }) => {
  if (
    results.metadataJsons.length === 0 &&
    profileResults?.nfts.length !== 0 &&
    !isPublicKey(profileResults?.wallet.address)
  ) {
    return (
      <div className={`flex h-6 w-full items-center justify-center`}>
        <p className={`m-0 text-center text-base font-medium`}>No Results</p>
      </div>
    );
  }
  return (
    <>
      {profileResults?.nfts.length !== 0 && isPublicKey(profileResults?.wallet.address) && (
        <>
          <h6 className={`text-base font-medium text-gray-300`}>Profiles</h6>
          <ProfileSearchItem
            address={profileResults?.wallet?.address}
            handle={profileResults?.wallet?.profile?.handle}
          />
        </>
      )}

      <h6 className={`text-base font-medium text-gray-300`}>NFTs</h6>
      {profileResults?.nfts?.map((nft) => (
        <>
          {nft.address && nft.image && nft.name && (
            <NFTSearchItem
              key={nft.address}
              address={nft.address}
              image={nft.image}
              name={nft.name}
            />
          )}
        </>
      ))}
      {results?.metadataJsons?.map((nft) => (
        <>
          {nft.address && nft.image && nft.name && (
            <NFTSearchItem
              key={nft.address}
              address={nft.address}
              image={nft.image}
              name={nft.name}
            />
          )}
        </>
      ))}
    </>
  );
};

export default SearchResults;
