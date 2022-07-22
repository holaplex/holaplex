import { ProfilePopover } from './ProfilePopover';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { useConnectedWalletProfile } from 'src/views/_global/ConnectedWalletProfileProvider';
import Popover from './Popover';

export const ProfileImage = () => {
  const { connectedProfile } = useConnectedWalletProfile();

  const { publicKey } = useWallet();

  const profilePictureUrl: string =
    connectedProfile?.profile?.profileImageUrlHighres ?? getPFPFromPublicKey(publicKey);

  return (
    <>
      <Popover content={<ProfilePopover />}>
        <div className="flex items-center justify-center overflow-hidden rounded-full shadow-lg shadow-black ring-4 ring-gray-900 transition-transform  hover:scale-125">
          <img width={44} height={44} src={profilePictureUrl} className={` `} alt="Profile Image" />
        </div>
      </Popover>
    </>
  );
};
