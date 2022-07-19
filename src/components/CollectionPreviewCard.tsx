import { QueryContext } from '@/hooks/useApolloQuery';
import { getFallbackImage } from '@/modules/utils/image';
import classNames from 'classnames';
import { imgOpt } from 'src/lib/utils';

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
  preview: JSX.Element;
  name: JSX.Element;
  size: JSX.Element | boolean;
  floor: JSX.Element | boolean;
}

function CollectionPreviewSkeleton(props: CollectionPreviewSkeletonProps): JSX.Element {
  return (
    <div
      className={classNames(
        ['relative', 'flex overflow-clip', 'h-full w-full', 'rounded-lg shadow-md shadow-black'],
        ['duration-300 hover:scale-[1.02]']
      )}
    >
      <div className="relative flex aspect-[306/440] w-full">{props.background}</div>

      {/* preview image, collection name, NFT count, and floor price section */}
      <div
        className={classNames(
          'absolute',
          'h-full w-full',
          'flex flex-col justify-between p-4',
          'pointer-events-none'
        )}
      >
        <div
          className={classNames(
            'flex overflow-clip',
            'aspect-square w-[40%]',
            'rounded-md border-2 border-gray-900'
          )}
        >
          {props.preview}
        </div>

        <div className="flex flex-col justify-between space-y-4">
          {props.name}

          <div className="flex flex-row items-center justify-between overflow-hidden">
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
      background={<div className="w-full h-full bg-black bg-opacity-50" />}
      preview={<div className="w-full h-full animate-pulse bg-gray-900 rounded" />}
      name={<div className="w-full h-16 animate-pulse bg-gray-900 rounded" />}
      size={<div className="w-[35%] h-8 animate-pulse bg-gray-900 rounded" />}
      floor={<div className="w-[35%] h-8 animate-pulse bg-gray-900 rounded" />}
    />
  );
}

export function CollectionPreviewCard(props: CollectionPreviewCardProps): JSX.Element {
  if (props.context.loading) return <CollectionPreviewLoadingCard />;

  const linkUrl: string = `/collections/${props.context.data?.address}`;
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
            className={classNames(
              'absolute',
              'h-full w-full',
              'bg-gradient-to-b from-black/50 to-gray-900/80',
              'pointer-events-none'
            )}
          />
        </>
      }
      preview={
        <img
          src={imageUrl}
          alt={`${props.context.data?.name}`}
          className="min-h-full min-w-full object-cover"
          // provide a fallback image in case the image isnt found
          onError={({ currentTarget }) => {
            // null onerror to prevent looping in worst case
            currentTarget.onerror = null;
            currentTarget.src = getFallbackImage();
          }}
        />
      }
      name={
        <span className="text-2xl font-semibold text-white lg:text-3xl">
          {props.context.data?.name}
        </span>
      }
      size={
        (props.context.data?.nftCount ?? 0) > 0 && (
          <span
            className={classNames(
              ['p-2 text-left text-xs font-medium', 'rounded bg-gray-900/50 backdrop-blur-sm'],
              ['lg:text-sm']
            )}
          >{`Collection of ${nftCountStr}`}</span>
        )
      }
      floor={
        (props.context.data?.floorPriceSol ?? 0) > 0 && (
          <div
            className={classNames(
              ['p-2 text-left text-xs font-medium', 'rounded bg-gray-900/50 backdrop-blur-sm'],
              ['lg:text-sm']
            )}
          >
            <span className="mr-1 lg:mr-3">Floor: {props.context.data?.floorPriceSol} SOL</span>
          </div>
        )
      }
    />
  );
}
