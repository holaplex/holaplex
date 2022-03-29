import { Listing } from '@/modules/indexer';

export const SolIcon = (props: { className?: string; stroke?: string }) => (
  <svg
    className={props.className}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="7.5" stroke={props.stroke || '#707070'} />
    <circle cx="8" cy="8" r="3.5" stroke={props.stroke || '#707070'} />
  </svg>
);

const Price = (props: { listing: Listing; price: number }) => {
  return (
    <div className="flex items-center">
      <SolIcon className="mr-[5px] h-4 w-4 text-gray-300" />

      <span
        className={`text-base font-semibold ${
          props.listing.totalUncancelledBids || !props.listing.endsAt
            ? 'text-white'
            : 'text-gray-300'
        }`}
      >
        {props.price}
      </span>
    </div>
  );
};

export default Price;
