import { WalletDependantPageProps } from '@/views/profiles/getProfileServerSideProps';
import { Unpacked } from '@/types/Unpacked';
import React, { FC, useContext, useMemo } from 'react';
import { useGetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletProfile } from './follow.utils';

interface ProfileData extends WalletDependantPageProps {
  followers: WalletProfile[] | null;
  following: WalletProfile[] | null;
  amIFollowingThisAccount: boolean | null;
  loading: boolean;
  isMe: boolean;
}

const ProfileDataContext = React.createContext<ProfileData>(null!);

// todo remove once backend is fixed
function cleanConnectionList(
  profiles?: WalletProfile[],
  options = { sort: false }
): WalletProfile[] {
  if (!profiles) return [];
  const uniqueConnections = [...new Map(profiles?.map((p) => [p.address, p])).values()];
  if (options.sort) uniqueConnections.sort(compareConnectionsForSorting);
  return uniqueConnections;
}

function compareConnectionsForSorting(a: WalletProfile, b: WalletProfile): number {
  if (a.profile?.handle && b.profile?.handle)
    return a.profile.handle.localeCompare(b.profile.handle);
  else if (a.profile?.handle && !b.profile?.handle) return -1;
  else if (!a.profile?.handle && b.profile?.handle) return 1;
  else return a.address.localeCompare(b.address);
}

export const ProfileDataProvider: FC<{
  profileData: WalletDependantPageProps;
}> = ({ children, profileData }) => {
  const wallet = useWallet();
  const myPubkey = wallet?.publicKey?.toBase58() ?? '';

  const profileFollowerOverview = useGetProfileFollowerOverviewQuery({
    variables: { pubKey: profileData.publicKey },
  });

  const { followers, following } = useMemo(() => {
    const followers =
      cleanConnectionList(
        profileFollowerOverview.data?.followers.map((f) => f.from),
        { sort: true }
      ) ?? [];

    const following =
      cleanConnectionList(
        profileFollowerOverview.data?.following.map((f) => f.to),
        { sort: true }
      ) ?? [];

    return {
      followers,
      following,
    };
  }, [profileFollowerOverview.data]);

  const amIFollowingThisAccount = followers.some((p) => p.address === myPubkey);
  const isMe = profileData.publicKey === myPubkey;
  const profileSocialAnfFollowerData: ProfileData = useMemo(
    () => ({
      ...profileData,
      followers,
      following,
      loading: profileFollowerOverview.loading,
      amIFollowingThisAccount: myPubkey ? amIFollowingThisAccount : null,
      isMe,
    }),
    [
      myPubkey,
      profileData,
      profileFollowerOverview.loading,
      followers,
      following,
      isMe,
      amIFollowingThisAccount,
    ]
  );

  return (
    <ProfileDataContext.Provider value={profileSocialAnfFollowerData}>
      {children}
    </ProfileDataContext.Provider>
  );
};

export const useProfileData = () => {
  const profileData = useContext(ProfileDataContext);
  if (!profileData) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return profileData;
};
