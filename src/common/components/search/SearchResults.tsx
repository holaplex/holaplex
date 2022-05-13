import React, { FC } from 'react';
import { MetadataSearchQuery, ProfileSearchQuery } from 'src/graphql/indexerTypes';
import { PublicKey } from '@solana/web3.js';
import { ProfileSearchItem, NFTSearchItem } from './SearchItems';
import { isPublicKey } from './SearchBar';
import { profile } from 'console';

interface SearchResultsProps {
  results: MetadataSearchQuery;
  profileResults?: ProfileSearchQuery;
}

const SearchResults: FC<SearchResultsProps> = ({ results, profileResults }) => {
  if (results.metadataJsons.length === 0 && profileResults?.profiles.length === 0) {
    return (
      <div className={`flex h-6 w-full items-center justify-center`}>
        <p className={`m-0 text-center text-base font-medium`}>No Results</p>
      </div>
    );
  }
  return (
    <>
      {profileResults?.profiles && profileResults?.profiles?.length > 0 && (
        <>
          <h6 className={`text-base font-medium text-gray-300`}>Profiles</h6>
          {profileResults?.profiles?.map((profile) => (
            <>
              {profile.address && (
                <ProfileSearchItem
                  address={profile?.address}
                  handle={profile?.twitterHandle}
                  profileImage={profile?.profile?.profileImageUrl}
                />
              )}
            </>
          ))}
        </>
      )}
      {results.metadataJsons && results.metadataJsons.length > 0 && (
        <>
          <h6 className={`text-base font-medium text-gray-300`}>NFTs</h6>
          {results?.metadataJsons?.map((nft) => (
            <>
              {nft.address && nft.image && nft.name && (
                <NFTSearchItem
                  creatorHandle={nft.creatorTwitterHandle}
                  creatorAddress={nft.creatorAddress}
                  key={nft.address}
                  address={nft.address}
                  image={nft.image}
                  name={nft.name}
                />
              )}
            </>
          ))}
        </>
      )}
    </>
  );
};

export default SearchResults;
