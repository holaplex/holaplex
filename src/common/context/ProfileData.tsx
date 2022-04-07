import { IProfile } from '@/modules/feed/feed.interfaces';
import { WalletDependantPageProps } from '@/modules/server-side/getProfile';
import React, { FC, useContext } from 'react';

const ProfileDataContext = React.createContext<WalletDependantPageProps>(null!);

export const ProfileDataProvider: FC<{
  profileData: WalletDependantPageProps;
}> = ({ children, profileData }) => {
  return <ProfileDataContext.Provider value={profileData}>{children}</ProfileDataContext.Provider>;
};

export const useProfileData = () => {
  const profileData = useContext(ProfileDataContext);
  if (!profileData) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return profileData;
};

export const asProfile = (input: WalletDependantPageProps): IProfile => ({
  pubkey: input.publicKey,
  handle: input.twitterHandle,
  pfp: input.profilePicture,
});
