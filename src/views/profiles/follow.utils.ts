import { TwitterProfile } from 'src/graphql/indexerTypes';
import { GetProfileFollowerOverviewQuery } from 'src/graphql/indexerTypes.ssr';

export type WalletProfile = GetProfileFollowerOverviewQuery['followers'][0]['from'];

/**
 * Compares two following (users) alphabetically by wallet or handle, giving priority to twitter handles over wallets
 * @param a first follower
 * @param b second followers
 * @returns string comparison (where applicable)
 */
export function compareTwitterProfilesForSorting(a: TwitterProfile, b: TwitterProfile): number {
  if (a.handle && b.handle) return a.handle.localeCompare(b.handle);
  else if (a.handle && !b.handle) return -1;
  else if (!a.handle && b.handle) return 1;
  else if (a.walletAddress && b.walletAddress)
    return a.walletAddress.localeCompare(b.walletAddress);
  else if (a.walletAddress && !b.walletAddress) return -1;
  else if (!a.walletAddress && b.walletAddress) return 1;
  else return 0;
}
