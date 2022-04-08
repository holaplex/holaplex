import { IProfile } from '@/modules/feed/feed.interfaces';
import { WalletDependantPageProps } from '@/modules/server-side/getProfile';
import { Unpacked } from '@/types/Unpacked';
import React, { FC, useContext, useMemo } from 'react';
import { useGetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes';
import { GetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes.ssr';

export type TopFollower = Unpacked<GetProfileFollowerOverviewQuery['connections']>;

interface ProfileData extends WalletDependantPageProps {
  followers: number;
  following: number;
  topFollowers: TopFollower[];
}

const ProfileDataContext = React.createContext<ProfileData>(null!);

export const ProfileDataProvider: FC<{
  profileData: WalletDependantPageProps;
}> = ({ children, profileData }) => {
  const { data } = useGetProfileFollowerOverviewQuery({
    variables: {
      pubKey: profileData.publicKey,
    },
  }); // At the beginning loading is not true, because of SSR preloading. ;)
  console.log({data})
  const profileFollowerOverview = data!;

  const returnValue: ProfileData = useMemo(
    () => ({
      ...profileData,
      followers: profileFollowerOverview.wallet?.connectionCounts?.toCount ?? 0,
      following: profileFollowerOverview.wallet?.connectionCounts?.fromCount ?? 0,
      topFollowers: profileFollowerOverview.connections,
    }),
    [
      profileData,
      profileFollowerOverview.connections,
      profileFollowerOverview.wallet?.connectionCounts?.fromCount,
      profileFollowerOverview.wallet?.connectionCounts?.toCount,
    ]
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

export const asProfile = (input: ProfileData): IProfile => ({
  pubkey: input.publicKey,
  handle: input.twitterHandle,
  pfp: input.profilePicture,
  followers: input.followers,
  following: input.following,
  topFollowers: input.topFollowers,
});
