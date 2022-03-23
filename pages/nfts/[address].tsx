import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useNftPageLazyQuery } from '../../src/graphql/indexerTypes';
import { always, equals, ifElse, pipe, length, find, prop } from 'ramda';
import BN from 'bn.js';
import cx from 'classnames';
import { showFirstAndLastFour } from '../../src/modules/utils/string';
import { useTwitterHandle } from '../../src/common/hooks/useTwitterHandle';
import Link from 'next/link';
// import Bugsnag from '@bugsnag/js';

const Avatar = ({ address }: { address: string }) => {
  const { data } = useTwitterHandle(null, address);
  const twitterHandle = `@${data}`;

  return (
    <div className="flex items-center">
      <div> {data ? twitterHandle : showFirstAndLastFour(address)}</div>
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
  const [queryNft, { data, loading, refetch }] = useNftPageLazyQuery();
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

  return (
    <div className="container mx-auto px-4 pb-10 text-white">
      <div className="mt-12 mb-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="mb-4 block lg:mb-0 lg:flex lg:items-center lg:justify-center ">
          <div className="mb-6 block lg:hidden">
            {loading ? (
              <div className="h-32 w-full rounded-lg bg-gray-800" />
            ) : (
              <>
                <h1 className="mb-4 text-2xl">{nft?.name}</h1>
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
                <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl">{nft?.name}</h1>
                <p className="text-lg">{nft?.description}</p>
              </>
            )}
          </div>
          <div className="mb-8 flex-1">
            <div className="label mb-1">
              {loading ? (
                <div className="h-4 w-14 rounded bg-gray-800" />
              ) : (
                ifElse(
                  pipe(length, equals(1)),
                  always('CREATOR'),
                  always('CREATORS')
                )(nft?.creators || '')
              )}
            </div>
            <ul>
              {loading ? (
                <li>
                  <div className="h-6 w-20 rounded bg-gray-800" />
                </li>
              ) : (
                nft?.creators.map(({ address }) => (
                  <li key={address}>
                    <Link href={`/profiles/${address}`}>
                      <a>
                        <Avatar address={address} />
                      </a>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div
            className={cx('mt-8 w-full rounded-lg bg-gray-800 p-6', {
              'h-44': loading,
            })}
          >
            <div
              className={cx('flex', {
                hidden: loading,
              })}
            >
              {nft?.owner?.address && (
                <div className="flex-1">
                  <div className="label mb-1">OWNER</div>
                  <Link href={`/profiles/${nft?.owner?.address}`}>
                    <a>
                      <Avatar address={nft?.owner?.address} />
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
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
                <div key={a.traitType} className="rounded border border-gray-700 p-3">
                  <p className="label uppercase">{a.traitType}</p>
                  <p className="truncate text-ellipsis" title={a.value}>
                    {a.value}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
