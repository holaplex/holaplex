import DiscoverLayout, { FilterOption } from "./shared";

const options: FilterOption[] = [
    {
        label: "All",
        value: "all",
        numberOfItems: Math.round(Math.random()*10000)
    },
    {
        label: "Buy now",
        value: "buy-now",
        numberOfItems: Math.round(Math.random()*10000)
    },
    {
        label: "Active offers",
        value: "active-offers",
        numberOfItems: Math.round(Math.random()*10000)
    },
    {
        label: "Live auctions",
        value: "live-auctions",
    },
]

export default function DiscoverNFTsPage(): JSX.Element {
    return (
        <DiscoverLayout>
            <DiscoverLayout.FiltersSection>
                <DiscoverLayout.FiltersSection.Filter title="Type" options={options} onChange={s => console.log(s)}/>
                <DiscoverLayout.FiltersSection.Filter title="Type2" options={options} onChange={s => console.log(s)}/>
            </DiscoverLayout.FiltersSection>
        </DiscoverLayout>
    );
}