import React, { FC } from 'react';
import { SearchQuery, MetadataJson, Wallet } from 'src/graphql/indexerTypes';
import { PublicKey } from '@solana/web3.js';
import { ProfileSearchItem, NFTSearchItem } from './SearchItems';
import { isPublicKey } from './SearchBar';
import { profile } from 'console';
import { useAnalytics } from '@/common/context/AnalyticsProvider';

interface SearchResultsProps {
  term?: string;
  results?: MetadataJson[];
  profileResults?: Wallet[];
  walletResult?: Wallet;
}

const SearchResultTrackAction = 'Search Result Selected';

const SearchResults: FC<SearchResultsProps> = ({ term, results, profileResults, walletResult }) => {
  const { track } = useAnalytics();

  if (results?.length === 0 && profileResults?.length === 0 && !walletResult) {
    return (
      <div className={`flex h-6 w-full items-center justify-center`}>
        <p className={`m-0 text-center text-base font-medium`}>No Results</p>
      </div>
    );
  }

  function trackSearchResultSelected(args: {
    resultType: string;
    profileAddress?: string;
    profileHandle?: string | null;
    nftName?: string;
    nftImage?: string;
    nftAddress?: string;
  }) {
    track(SearchResultTrackAction, {
      event_category: 'Search',
      event_label: args.resultType,
      term,
      termCharCount: term?.length,
      profileResultsCount: profileResults?.length || 0,
      walletResultsCount: walletResult ? 1 : 0,
      nftResultsCount: results?.length || 0,
      ...args,
    });
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
                  onClick={() =>
                    trackSearchResultSelected({
                      resultType: 'Profile',
                      profileAddress: profile.address,
                      profileHandle: profile.twitterHandle,
                    })
                  }
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
          onClick={() =>
            trackSearchResultSelected({
              resultType: 'Wallet',
              profileAddress: walletResult.address,
              profileHandle: walletResult.twitterHandle,
            })
          }
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
                  onClick={() =>
                    trackSearchResultSelected({
                      resultType: 'NFT',
                      nftName: nft.name,
                      nftImage: nft.image as string | undefined,
                      nftAddress: nft.address,
                    })
                  }
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
