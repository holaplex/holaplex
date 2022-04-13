import { GetServerSideProps } from 'next';
import { PublicKey, Connection } from '@solana/web3.js';
import { getPublicKeyFromTwitterHandle, getTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { getSdk } from 'src/graphql/indexerTypes.ssr';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import { getBannerFromPublicKey, getPFPFromPublicKey } from '../utils/image';
import { initializeApollo } from 'src/graphql/apollo';
import { GetProfileFollowerOverviewDocument } from 'src/graphql/indexerTypes';

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

/**
 * @deprecated Do not use, this uses the old GPA queries, use getPropsForWalletOrUsername instead.
 * Kept for reference.
 */
export const getPropsForWalletOrUsernameDeprecated: GetServerSideProps<
  WalletDependantPageProps
> = async (ctx) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT!, 'confirmed');
  const { walletProfile } = getSdk(graphqlRequestClient);
  const input = ctx.params?.publicKey;
  if (typeof input !== 'string') {
    return { notFound: true };
  }

  let publicKey = getPublicKey(input);
  let twitterHandle: string | null = null;
  let banner: string | null = null;
  let profilePicture: string | null = null;

  if (publicKey) {
    twitterHandle = (await getTwitterHandle(publicKey.toBase58(), connection)) ?? null;
  } else if (isTwitterUsername(input)) {
    twitterHandle = input;
    publicKey = (await getPublicKeyFromTwitterHandle(input, connection)) ?? null;
  }

  if (!publicKey) {
    return { notFound: true };
  }

  if (twitterHandle) {
    const results = await walletProfile({
      handle: twitterHandle,
    });
    profilePicture = results.profile?.profileImageUrlHighres.replace('_normal', '') ?? null;
    banner = results.profile?.bannerImageUrl ?? null;
  }

  if (!profilePicture) {
    profilePicture = getPFPFromPublicKey(publicKey);
  }
  if (!banner) {
    banner = getBannerFromPublicKey(publicKey);
  }

  return {
    props: {
      /* Encoding as string just in case something weird happens in the transfer */
      publicKey: publicKey.toBase58(),
      twitterHandle,
      profilePicture,
      banner,
    },
  };
};

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
    profileInfo = result?.wallet?.profile ?? null;
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
