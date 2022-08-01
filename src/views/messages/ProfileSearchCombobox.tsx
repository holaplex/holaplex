import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import { shortenAddress } from '@/modules/utils/string';
import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useProfileSearchLazyQuery } from 'src/graphql/indexerTypes';
import { Avatar } from '@/components/Avatar';
import { User } from '../alpha/feed.utils';

export default function ProfileSearchCombobox(props: { setRecipient: any }) {
  const { track } = useAnalytics();
  const [showResults, setShowResults] = useState(false);

  const [searchQuery, { data, loading, called, variables: searchVariables }] =
    useProfileSearchLazyQuery();
  const [selectedPerson, setSelectedPerson] = useState<User | null>(null);

  const profileResults = (showResults && data?.profiles.slice(0, 5)) || [];

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value.length) {
      setShowResults(false);
    } else {
      setShowResults(true);
      searchQuery({
        variables: {
          term: e.target.value,
        },
      });
    }
  }

  return (
    <div className="relative">
      <Combobox
        value={selectedPerson}
        onChange={(p) => {
          setSelectedPerson(p);
          props.setRecipient(p);
        }}
      >
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          id="search"
          autoComplete={`off`}
          autoCorrect={`off`}
          autoFocus={true}
          className="w-full rounded-lg border-transparent bg-gray-900 text-white focus:border-white focus:ring-white"
          type="search"
          placeholder={`Search Holaplex...`}
          onChange={handleOnChange}
          element={Combobox.Input}
        />
        <Combobox.Options className={'absolute top-12 w-full max-w-lg bg-gray-900 shadow-2xl'}>
          {profileResults.map(({ address, profile }) => (
            <Combobox.Option key={address} value={{ address, profile }} as={Fragment}>
              {({ active, selected }) => (
                <div
                  className={clsx(
                    `flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`,
                    active && 'bg-gray-800'
                  )}
                >
                  <div className={'flex flex-row items-center gap-6'}>
                    <Avatar size={'md'} address={address} showAddress={false} />
                    <p className={'m-0 text-sm'}>
                      {profile?.handle ? `@${profile.handle}` : shortenAddress(address)}
                    </p>
                  </div>
                  <p className={'m-0 hidden text-sm text-gray-300 md:inline-block'}>
                    {shortenAddress(address)}
                  </p>
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}
