import { FilterOption } from "@/common/components/layouts/Filters";
import { DiscoverLayout } from "@/layouts/DiscoverLayout";

enum TypeOption {
    T1, T2, T3
}

const typeOptions: FilterOption<TypeOption>[] = [
  {
    label: 'TBD 1',
    value: TypeOption.T1,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'TBD 2',
    value: TypeOption.T2,
    numberOfItems: Math.round(Math.random() * 10000),
  },
  {
    label: 'TBD 3',
    value: TypeOption.T3,
    numberOfItems: Math.round(Math.random() * 10000),
  }
];

export default function DiscoverCollectionsTab(): JSX.Element {
  return <></>;
}

DiscoverCollectionsTab.getLayout = function getLayout(): JSX.Element {
  return (
    <DiscoverLayout
      filters={[{ title: 'Type', options: typeOptions, default: TypeOption.T1, onChange: (s) => console.log(s) }]}
      content={
        <span>Collections</span>
      }
    />
  );
};
