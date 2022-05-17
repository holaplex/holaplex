import { IProfile } from '@/modules/feed/feed.interfaces';
import { WalletDependantPageProps } from '@/modules/server-side/getProfile';
import { Unpacked } from '@/types/Unpacked';
import React, { FC, useContext, useMemo } from 'react';
import { GetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes.ssr';

export type TopFollower = Unpacked<GetProfileFollowerOverviewQuery['connections']>;

interface ProfileData extends WalletDependantPageProps {}

const ProfileDataContext = React.createContext<ProfileData>(null!);

export const ProfileDataProvider: FC<{
  profileData: WalletDependantPageProps;
}> = ({ children, profileData }) => {
  const returnValue: ProfileData = useMemo(() => profileData, [profileData]);
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
