import { ProfilePreviewData } from '../../types/types';
import { User } from '../../views/alpha/feed.utils';

export function getProfilePreivewDataFromUser(user: User): ProfilePreviewData {
  return {
    address: user.address,
    profile: {
      handle: user.profile?.handle,
      profileImageUrlHighres: user.profile?.profileImageUrlHighres,
      bannerImageUrl: user.profile?.bannerImageUrl,
    },
    nftCounts: {
      owned: user.nftCounts?.owned,
      created: user.nftCounts?.created,
    },
  };
}
