import { FilterOption } from "@/common/components/layouts/Filters";
import { DiscoverLayout } from "@/layouts/DiscoverLayout";

enum TypeOption {
    ALL, CREATORS, COLLECTORS
}

const options: FilterOption<TypeOption>[] = [
  {
    label: 'All',
    value: TypeOption.ALL,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'Creators',
    value: TypeOption.CREATORS,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'Collectors',
    value: TypeOption.COLLECTORS,
    numberOfItems: Math.round(Math.random() * 10000),
  }
];

export default function DiscoverProfilesTab(): JSX.Element {
  return <></>;
}

DiscoverProfilesTab.getLayout = function getLayout(): JSX.Element {
  return (
    <DiscoverLayout
      filters={[{ title: 'Type', options: options, default: TypeOption.ALL, onChange: (s) => console.log(s) }]}
      content={
        <span>Collections</span>
      }
    />
  );
};
