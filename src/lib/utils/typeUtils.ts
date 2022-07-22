import { ProfilePreviewData } from '@/components/ProfilePreviewCard';
import { User } from '@/views/alpha/feed.utils';

export function getProfilePreivewDataFromUser(user: User): ProfilePreviewData {
  return {
    address: user.address,
    nftsOwned: user.nftCounts?.owned ?? 0,
    nftsCreated: user.nftCounts?.created ?? 0,
    handle: user.profile?.handle,
    profileImageUrl: user.profile?.profileImageUrlHighres,
    bannerImageUrl: user.profile?.bannerImageUrl,
  };
}
