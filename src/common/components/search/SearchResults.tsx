import React, { FC } from 'react';
import { SearchQuery, MetadataJson, Wallet } from 'src/graphql/indexerTypes';
import { PublicKey } from '@solana/web3.js';
import { ProfileSearchItem, NFTSearchItem } from './SearchItems';
import { isPublicKey } from './SearchBar';
import { profile } from 'console';

interface SearchResultsProps {
  results: MetadataJson[];
  profileResults?: Wallet[];
  walletResult?: Wallet;
}

const SearchResults: FC<SearchResultsProps> = ({ results, profileResults, walletResult }) => {
  if (results?.length === 0 && profileResults?.length === 0 && !walletResult) {
    return (
      <div className={`flex h-6 w-full items-center justify-center`}>
        <p className={`m-0 text-center text-base font-medium`}>No Results</p>
      </div>
    );
  }
  return (
    <>
      {profileResults && profileResults?.length > 0 && (
        <>
          <h6 className={`text-base font-medium text-gray-300`}>Profiles</h6>
          {profileResults?.map((profile) => (
            <>
              {profile?.address && (
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
      {walletResult && isPublicKey(walletResult.address) && (
        <ProfileSearchItem 
          address={walletResult?.address}
          handle={walletResult?.twitterHandle}
          profileImage={walletResult?.profile?.profileImageUrl}
        />
      )}
      {results && results.length > 0 && (
        <>
          <h6 className={`text-base font-medium text-gray-300`}>NFTs</h6>
          {results?.map((nft) => (
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
