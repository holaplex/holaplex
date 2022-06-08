import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { getSdk } from 'src/graphql/indexerTypes.ssr';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import { getBannerFromPublicKey, getPFPFromPublicKey } from '../utils/image';

export const getPublicKey = (input: string) => {
  try {
    return new PublicKey(input);
  } catch (error) {
    return null;
  }
};

/**
 * Checks if a given input wallet is an escrow,
 * meaning it is a controlled PDA from a marketplace program.
 */
export const isPDA = (input: string) => {
  const publicKey = getPublicKey(input);
  if (publicKey) {
    return !PublicKey.isOnCurve(publicKey.toBytes());
  } else {
    return false;
  }
};

const isTwitterUsername = (input: string) => {
  return input.length <= 15 && input.match(/^[a-zA-Z0-9_]+$/);
};

export interface WalletDependantPageProps {
  publicKey: string;
  twitterHandle: string | null;
  profilePicture: string;
  banner: string;
}

export const getProfileServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (
  ctx
) => {
  // Keeping this out of apollo since this isn't modified in-app.
  const { getProfileInfoFromPubKey, getProfileInfoFromTwitterHandle } =
    getSdk(graphqlRequestClient);

  const input = ctx.params?.publicKey;

  if (typeof input !== 'string') {
    return { notFound: true };
  }

  let publicKey = getPublicKey(input);

  let profileInfo: {
    walletAddress?: string | null;
    handle: string;
    profileImageUrl: string;
    bannerImageUrl: string;
  } | null = null;
  if (publicKey) {
    const result = await getProfileInfoFromPubKey({ pubKey: publicKey.toBase58() });
    if (result?.wallet?.profile) {
      profileInfo = {
        walletAddress: publicKey.toBase58(),
        handle: result.wallet.profile.handle,
        profileImageUrl: result.wallet.profile.profileImageUrlLowres,
        bannerImageUrl: result.wallet.profile.bannerImageUrl,
      };
    }
  } else if (isTwitterUsername(input)) {
    const result = await getProfileInfoFromTwitterHandle({ handle: input });
    profileInfo = result?.profile ?? null;
    if (profileInfo?.walletAddress) {
      publicKey = getPublicKey(profileInfo.walletAddress);
    }
  } /* It's not a pubkey or a twitter profile. */ else {
    return { notFound: true };
  }

  if (!profileInfo && !publicKey) {
    // Pubkey must be present at this point, can continue if there's no profile info but pubKey.
    return { notFound: true };
  }

  // Disabling SSR Pre-Fetch for UX purposes.
  // const apolloClient = initializeApollo();
  // await apolloClient.query({
  //   query: GetProfileFollowerOverviewDocument,
  //   variables: { pubKey: publicKey!.toBase58() },
  // });

  const profileServerSideProps = {
    publicKey: publicKey!.toBase58(),
    twitterHandle: profileInfo?.handle ?? null,
    profilePicture:
      profileInfo?.profileImageUrl?.replace('_normal', '') ?? getPFPFromPublicKey(publicKey!),
    banner: profileInfo?.bannerImageUrl ?? getBannerFromPublicKey(publicKey!),
  };

  return {
    props: {
      ...profileServerSideProps,
    },
  };
};
