import { WalletDependantPageProps } from '@/views/profiles/getProfileServerSideProps';
import React, { FC, ReactNode, useContext, useMemo } from 'react';
import { TwitterProfile, useGetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletProfile } from './follow.utils';

interface ProfileData extends WalletDependantPageProps {
  followers: WalletProfile[] | null;
  following: WalletProfile[] | null;
  amIFollowingThisAccount: boolean | null;
  loading: boolean;
  isMe: boolean;
  collectedBy: TwitterProfile[] | null;
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

export function ProfileDataProvider(props: {
  children: ReactNode;
  profileData: WalletDependantPageProps;
}) {
  const wallet = useWallet();
  const myPubkey = wallet?.publicKey?.toBase58() ?? '';

  const profileFollowerOverview = useGetProfileFollowerOverviewQuery({
    variables: { pubKey: props.profileData.publicKey },
  });

  const { followers, following, collectedBy, loading } = useMemo(() => {
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

    // get created nfts
    const collectedBy =
      profileFollowerOverview.data?.nftsCreated.reduce((collectedByOwners, nft, idx) => {
        // map into owners
        const ownerPubkey = nft.owner?.profile?.walletAddress;
        if (
          ownerPubkey &&
          // exclude self
          ownerPubkey !== props.profileData.publicKey &&
          // make unique
          !collectedByOwners.find((o) => o.walletAddress === ownerPubkey)
        ) {
          collectedByOwners?.push(nft.owner?.profile as TwitterProfile);
        }

        return collectedByOwners;
      }, [] as TwitterProfile[]) || [];

    return {
      followers,
      following,
      loading: profileFollowerOverview.loading,
      collectedBy,
    };
  }, [profileFollowerOverview]);

  const amIFollowingThisAccount = followers.some((p) => p.address === myPubkey);
  const isMe = props.profileData.publicKey === myPubkey;
  const profileSocialAnfFollowerData: ProfileData = useMemo(() => {
    return {
      ...props.profileData,
      followers,
      following,
      loading,
      amIFollowingThisAccount: myPubkey ? amIFollowingThisAccount : null,
      isMe,
      collectedBy,
    };
  }, [
    myPubkey,
    followers,
    following,
    collectedBy,
    isMe,
    amIFollowingThisAccount,
    loading,
    props.profileData,
  ]);

  return (
    <ProfileDataContext.Provider value={profileSocialAnfFollowerData}>
      {props.children}
    </ProfileDataContext.Provider>
  );
}

export const useProfileData = () => {
  const profileData = useContext(ProfileDataContext);
  if (!profileData) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return profileData;
};
