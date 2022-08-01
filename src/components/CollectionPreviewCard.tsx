import { QueryContext } from '@/hooks/useApolloQuery';
import { getFallbackImage } from '@/modules/utils/image';
import clsx from 'clsx';
import { imgOpt } from 'src/lib/utils';
import { SolIcon } from './Price';

export interface CollectionPreviewCardData {
  address: string;
  name: string;
  imageUrl: string;
  nftCount: number;
  floorPriceSol: number;
}

interface CollectionPreviewCardProps {
  context: QueryContext<CollectionPreviewCardData>;
}

interface CollectionPreviewSkeletonProps {
  background: JSX.Element;
  // preview: JSX.Element;
  name: JSX.Element;
  size: JSX.Element | boolean;
  floor: JSX.Element | boolean;
  className?: string;
}

function CollectionPreviewSkeleton(props: CollectionPreviewSkeletonProps): JSX.Element {
  return (
    <div
      className={clsx(
        ['relative', 'flex overflow-clip', 'h-full w-full', 'rounded-lg shadow-md shadow-black'],
        ['duration-300 hover:scale-[1.02]'],
        props.className
      )}
    >
      <div className="relative flex aspect-square w-full">{props.background}</div>

      {/* preview image, collection name, NFT count, and floor price section */}
      <div
        className={clsx(
          'absolute',
          'h-full w-full',
          'flex flex-col justify-end p-4',
          'pointer-events-none'
        )}
      >
        {/* <div
          className={clsx(
            'flex overflow-clip',
            'aspect-square w-[40%]',
            'rounded-md border-2 border-gray-900'
          )}
        >
          {props.preview}
        </div> */}

        <div className="flex flex-col justify-between space-y-5">
          {props.name}

          <div className="flex flex-row items-center justify-between gap-4 overflow-hidden">
            {props.size}
            {props.floor}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionPreviewLoadingCard(): JSX.Element {
  return (
    <CollectionPreviewSkeleton
      className="animate-pulse"
      background={<div className="h-full w-full bg-gray-900 bg-opacity-50" />}
      // preview={<div className="h-full w-full rounded bg-gray-800" />}
      name={<div className="h-16 w-full rounded bg-gray-800" />}
      size={<div className="h-11 w-1/2 rounded bg-gray-800" />}
      floor={<div className="h-11 w-1/2 rounded bg-gray-800" />}
    />
  );
}

export function CollectionPreviewCard(props: CollectionPreviewCardProps): JSX.Element {
  if (props.context.loading) return <CollectionPreviewLoadingCard />;

  const linkUrl: string = `/collections/${props.context.data?.address}/nfts`;
  const nftCountStr: string = (props.context.data?.nftCount ?? 0).toLocaleString();
  const imageUrl: string | undefined = imgOpt(props.context.data?.imageUrl, 600);

  return (
    <CollectionPreviewSkeleton
      background={
        <>
          <a href={linkUrl}>
            <img
              src={imageUrl}
              alt={`${props.context.data?.name}`}
              className="min-h-full min-w-full object-cover"
              // provide a fallback image in case the banner isnt found
              onError={({ currentTarget }) => {
                // null onerror to prevent looping in worst case
                currentTarget.onerror = null;
                currentTarget.src = getFallbackImage();
              }}
              onAnimationStartCapture={() => {}}
            />
          </a>

          {/* background gradient overlay */}
          <div
            className={clsx(
              'absolute',
              'h-full w-full',
              'bg-gradient-to-b from-black/50 to-gray-900/80',
              'pointer-events-none'
            )}
          />
        </>
      }
      name={
        <span className="text-2xl font-semibold text-white sm:text-lg lg:text-2xl ">
          {props.context.data?.name}
        </span>
      }
      size={
        (props.context.data?.nftCount ?? 0) > 0 && (
          <div
            className={clsx(
              [
                'flex w-1/2 justify-center py-3 px-2 text-left text-xs font-medium',
                'rounded-lg bg-black/30 backdrop-blur-sm',
              ],
              ['lg:text-sm']
            )}
          >
            <span className="text-sm">{`${nftCountStr} NFTs`}</span>
          </div>
        )
      }
      floor={
        (props.context.data?.floorPriceSol ?? 0) > 0 && (
          <div
            className={clsx(
              [
                'flex w-1/2 justify-center py-3 px-2 text-left text-xs font-medium',
                'rounded-lg bg-black/30 backdrop-blur-sm',
              ],
              ['lg:text-sm']
            )}
          >
            <span
              className="flex flex-row flex-nowrap items-center justify-start space-x-1 text-sm"
              title="floor price"
            >
              <SolIcon className="h-3 w-3" stroke="white" />{' '}
              <span>{props.context.data?.floorPriceSol}</span>
            </span>
          </div>
        )
      }
      // preview={
      //   <img
      //     src={imageUrl}
      //     alt={`${props.context.data?.name}`}
      //     className="min-h-full min-w-full object-cover"
      //     // provide a fallback image in case the image isnt found
      //     onError={({ currentTarget }) => {
      //       // null onerror to prevent looping in worst case
      //       currentTarget.onerror = null;
      //       currentTarget.src = getFallbackImage();
      //     }}
      //   />
      // }
    />
  );
}
