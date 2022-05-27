import { IProfile } from '@/modules/feed/feed.interfaces';
import { WalletDependantPageProps } from '@/modules/server-side/getProfile';
import { Unpacked } from '@/types/Unpacked';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React, { FC, useContext, useMemo } from 'react';
import {
  AllConnectionsFromQuery,
  AllConnectionsToQuery,
  useAllConnectionsFromQuery,
  useAllConnectionsToQuery,
  useGetProfileFollowerOverviewQuery,
} from 'src/graphql/indexerTypes';
import { GetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes.ssr';

export type TopFollower = Unpacked<GetProfileFollowerOverviewQuery['connections']>;

interface ProfileData extends WalletDependantPageProps {
  myFollowers: null | AllConnectionsToQuery['connections'];
  profilesIFollow: null | AllConnectionsFromQuery['connections'];
}

const ProfileDataContext = React.createContext<ProfileData>(null!);

export const ProfileDataProvider: FC<{
  profileData: WalletDependantPageProps;
}> = ({ children, profileData }) => {
  const aw = useAnchorWallet();
  const myPubkey = aw?.publicKey.toBase58();
  const myFollowersList = useAllConnectionsToQuery({ variables: { to: myPubkey }, skip: !aw });

  const profilesIFollowList = useAllConnectionsFromQuery({
    variables: { from: myPubkey },
    skip: !aw,
  });

  const returnValue: ProfileData = useMemo(
    () => ({
      ...profileData,
      myFollowers: myFollowersList.data?.connections ?? null,
      profilesIFollow: profilesIFollowList.data?.connections ?? null,
    }),
    [profileData, myFollowersList.data, profilesIFollowList.data]
  );
  return <ProfileDataContext.Provider value={returnValue}>{children}</ProfileDataContext.Provider>;
};

export const useProfileData = () => {
  const profileData = useContext(ProfileDataContext);
  if (!profileData) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return profileData;
};

export const asProfile = (input: WalletDependantPageProps): IProfile => ({
  address: input.publicKey,
  handle: input.twitterHandle,
  pfp: input.profilePicture,
});
