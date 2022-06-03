import { FilterOption } from "@/common/components/layouts/Filters";
import { DiscoverLayout } from "@/layouts/DiscoverLayout";

enum TypeOption {
    ALL, BUY_NOW, ACTIVE_OFFERS, LIVE_AUCTIONS
}

const options: FilterOption<TypeOption>[] = [
  {
    label: 'All',
    value: TypeOption.ALL,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'Buy now',
    value: TypeOption.BUY_NOW,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'Active offers',
    value: TypeOption.ACTIVE_OFFERS,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'Live auctions',
    value: TypeOption.LIVE_AUCTIONS,
  },
];

export default function DiscoverNFTsTab(): JSX.Element {
  return <></>;
}

DiscoverNFTsTab.getLayout = function getLayout(): JSX.Element {
  return (
    <DiscoverLayout
      filters={[{ title: 'Type', options: options, default: TypeOption.ALL, onChange: (s) => console.log(s) }]}
      content={
        <span>NFTs</span>
      }
    />
  );
};
