import { IProfile } from '@/modules/feed/feed.interfaces';
import { WalletDependantPageProps } from '@/modules/server-side/getProfile';
import React, { FC, useContext, useMemo } from 'react';
import { useGetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes';
import { ProfileInfoFragment } from 'src/graphql/indexerTypes.ssr';

export type TopFollower = {
  pubKey: string;
  profileInfo?: ProfileInfoFragment;
};

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
  const profileFollowerOverview = data!;
  

  const returnValue: ProfileData = useMemo(
    () => ({
      ...profileData,
      followers: profileFollowerOverview.from.aggregate?.count ?? 0,
      following: profileFollowerOverview.to.aggregate?.count ?? 0,
      topFollowers: profileFollowerOverview.to_brief as TopFollower[],
    }),
    [
      profileData,
      profileFollowerOverview.from.aggregate?.count,
      profileFollowerOverview.to.aggregate?.count,
      profileFollowerOverview.to_brief,
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
