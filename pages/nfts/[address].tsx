import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import {
  NftPageQuery,
  useNftPageLazyQuery,
  useWalletProfileLazyQuery,
} from '../../src/graphql/indexerTypes';
import cx from 'classnames';
import { showFirstAndLastFour } from '../../src/modules/utils/string';
import { useTwitterHandle } from '../../src/common/hooks/useTwitterHandle';
import Link from 'next/link';
import Custom404 from '../404';
import { getPFPFromPublicKey } from '../../src/modules/utils/image';
import Image from 'next/image';
import Accordion from '../../src/common/components/elements/Accordion';
import MoreDropdown from '../../src/common/components/elements/MoreDropdown';

// import Bugsnag from '@bugsnag/js';

const OverlappingCircles = ({
  creators,
}: {
  creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
}) => {
  return (
    <div className="relative">
      {creators.map(({ address }, i) => (
        // <li key={address} className={cx('absolute', `left-[10px] hover:z-10`)}>
        <li key={address} className={cx('absolute', `left-[${i * 10}px] hover:z-10`)}>
          <Link href={`/profiles/${address}`}>
            <a>
              <HoverAvatar address={address} />
            </a>
          </Link>
        </li>
      ))}
    </div>
  );
};

const HoverAvatar = ({ address }: { address: string }) => {
  const { data: twitterHandle } = useTwitterHandle(null, address);
  const [queryWalletProfile, { data }] = useWalletProfileLazyQuery();

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {}, [twitterHandle]);
  const profilePictureUrl = data?.profile?.profileImageUrlHighres || null;
  return (
    <Image
      width={24}
      height={24}
      src={profilePictureUrl ?? getPFPFromPublicKey(address)}
      alt="Profile Picture"
      className=" rounded-full"
    />
  );
};

const Avatar = ({ address }: { address: string }) => {
  const { data: twitterHandle } = useTwitterHandle(null, address);
  console.log('twitterHandle', twitterHandle);
  const [queryWalletProfile, { data }] = useWalletProfileLazyQuery();

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {}, [twitterHandle]);
  const profilePictureUrl = data?.profile?.profileImageUrlHighres || null;

  return (
    <div className="flex items-center">
      <Image
        width={24}
        height={24}
        src={profilePictureUrl ?? getPFPFromPublicKey(address)}
        alt="Profile Picture"
        className=" rounded-full"
      />
      <div className="ml-2 text-base">
        {twitterHandle ? `@${twitterHandle}` : showFirstAndLastFour(address)}
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context?.params?.address ?? '',
    },
  };
};

export default function NftByAddress({ address }: { address: string }) {
  const [queryNft, { data, loading, called }] = useNftPageLazyQuery();
  const nft = data?.nft;
  // const isOwner = equals(data?.nft.owner.address, publicKey?.toBase58()) || null;

  useEffect(() => {
    if (!address) return;

    try {
      queryNft({
        variables: {
          address,
        },
      });
    } catch (error: any) {
      console.error(error);
      // Bugsnag.notify(error);
    }
  }, [address, queryNft]);

  if (called && !data?.nft && !loading) {
    return <Custom404 />;
  }

  return (
    <div className="container mx-auto px-4 pb-10 text-white">
      <div className="mt-12 mb-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="mb-4 block lg:mb-0 lg:flex lg:items-center lg:justify-center ">
          <div className="mb-6 block lg:hidden">
            {loading ? (
              <div className="h-32 w-full rounded-lg bg-gray-800" />
            ) : (
              <>
                <div>
                  <h1 className="mb-4 text-2xl">{nft?.name}</h1>
                  {/* <FeatherIcon icon="more-horizontal" /> */}
                </div>

                <p className="text-lg">{nft?.description}</p>
              </>
            )}
          </div>
          {loading ? (
            <div className="aspect-square w-full rounded-lg border-none bg-gray-800" />
          ) : (
            <img
              src={nft?.image}
              className="block h-auto max-h-[606px] w-full rounded-lg border-none object-cover shadow"
              alt=""
            />
          )}
        </div>
        <div>
          <div className="mb-8 hidden lg:block">
            {loading ? (
              <div className="h-32 w-full rounded-lg bg-gray-800" />
            ) : (
              <>
                <div className="flex justify-between">
                  <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl">{nft?.name}</h1>
                  <MoreDropdown address={nft?.address || ''} />
                </div>

                <p className="text-lg">{nft?.description}</p>
              </>
            )}
          </div>
          <div className="mb-8 flex flex-1 flex-row justify-between">
            <div>
              <div className="label mb-1 text-gray-500">
                {loading ? <div className="h-4 w-14 rounded bg-gray-800" /> : 'Created by'}
              </div>
              <ul>
                {loading ? (
                  <li>
                    <div className="h-6 w-20 rounded bg-gray-800" />
                  </li>
                ) : nft?.creators.length === 1 ? (
                  <Link href={`/profiles/${nft?.creators[0].address}`}>
                    <a>
                      <Avatar address={nft?.creators[0].address} />
                    </a>
                  </Link>
                ) : (
                  <OverlappingCircles creators={nft?.creators || []} />
                )}
              </ul>
            </div>

            <div
              className={cx('flex', {
                hidden: loading,
              })}
            >
              <div className="flex flex-1 flex-col">
                <div className="label mb-1 self-end text-gray-500">Owned by</div>
                {nft?.owner?.address && (
                  <Link href={`/profiles/${nft?.owner?.address}`}>
                    <a>
                      <Avatar address={nft?.owner?.address} />
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {nft?.attributes && (
            <Accordion title="Attributes">
              <div className="mt-8 grid grid-cols-2 gap-6">
                {loading ? (
                  <>
                    <div className="h-16 rounded bg-gray-800" />
                    <div className="h-16 rounded bg-gray-800" />
                    <div className="h-16 rounded bg-gray-800" />
                    <div className="h-16 rounded bg-gray-800" />
                  </>
                ) : (
                  nft?.attributes.map((a) => (
                    <div
                      key={a.traitType}
                      className="max-h-[300px] rounded border border-gray-700 p-6"
                    >
                      <p className="label uppercase text-gray-500">{a.traitType}</p>
                      <p className="truncate text-ellipsis" title={a.value}>
                        {a.value}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
