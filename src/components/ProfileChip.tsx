import { getPFPFromPublicKey } from '@/modules/utils/image';
import { User } from '@/views/alpha/feed.utils';
import { ProfileHandle } from '@/views/alpha/FeedCard';
import clsx from 'clsx';
import Link from 'next/link';

export function ProfileChip(props: { user: User }) {
  return (
    <span className="flex flex-shrink-0 items-center rounded-full py-3 pl-2 pr-4 text-base font-medium shadow-2xl shadow-black">
      <Link href={'/profiles/' + props.user.address + '/nfts'} passHref>
        <a target="_blank" className="mr-4">
          <img
            className={clsx('rounded-full', 'h-8 w-8 flex-shrink-0')}
            src={
              props.user?.profile?.profileImageUrlLowres || getPFPFromPublicKey(props.user.address)
            }
            alt={'profile picture for ' + props.user.profile?.handle || props.user.address}
          />
        </a>
      </Link>
      <ProfileHandle user={props.user} />
    </span>
  );
}
