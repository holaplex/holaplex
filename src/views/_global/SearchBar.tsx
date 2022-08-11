import React, { FC, useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { Search } from '@/assets/icons/Search';
import LoadingSearchItem from './SearchItemLoading';
import {
  useSearchLazyQuery,
  MetadataJson,
  Wallet,
  SearchQuery,
  Nft,
  Collection,
} from 'src/graphql/indexerTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import SearchResults from '@/views/_global/SearchResults';
import { useOutsideAlerter } from '@/hooks/useOutsideAlerter';
import { useRouter } from 'next/router';
import { XIcon } from '@heroicons/react/outline';
import { IShortcutProviderRenderProps, withShortcut } from 'react-keybind';
import KeyboardShortcut from '@/components/KeyboardShortcut';
import { DebounceInput } from 'react-debounce-input';
import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { Combobox, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { PublicKey } from '@solana/web3.js';

const schema = zod.object({
  query: zod.string().min(1, `Must enter something`),
});

interface SearchQuerySchema {
  query: string;
}

interface SearchBarProps {
  shortcut?: IShortcutProviderRenderProps;
}

export const isPublicKey = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

const SearchBar: FC<SearchBarProps> = ({ shortcut }) => {
  const searchResultsRef = useRef<HTMLDivElement>(null!);
  const searchInputRef = useRef<HTMLInputElement>(null!);

  const router = useRouter();

  const [showResults, setShowResults] = useState(false);
  const [showKeybind, setShowKeybind] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);

  useEffect(() => {
    setShowResults(false);
  }, [router.route]);

  useOutsideAlerter(searchResultsRef, () => setShowResults(false));

  const { track } = useAnalytics();
  const [searchQuery, { data, loading, called, variables: searchVariables }] = useSearchLazyQuery();
  type SearchResultItem =
    | SearchQuery['metadataJsons'][0]
    | SearchQuery['profiles'][0]
    | SearchQuery['wallet']
    | SearchQuery['nftByMintAddress']
    | SearchQuery['searchCollections'][0];
  const [selected, setSelected] = useState<SearchResultItem | null>(null);
  const wallet = useWallet();

  useEffect(() => {
    // keeping this as own side effect instead of moving it in with handleChange
    // debounced either way

    if (searchVariables?.term) {
      track('Search Queried', {
        term: searchVariables?.term,
        event_category: 'Search',
        event_label: searchVariables?.term,
        connected: wallet.connected,
        wallet: wallet.publicKey?.toBase58(),
      });
    }
  }, [searchVariables?.term]);

  const handleSearch = ({ query }: SearchQuerySchema) => {
    // handle enter
  };

  // mutate collection data to differentiate it from other search data
  const collectionData = data?.searchCollections.map((collection) => {
    return {
      __typename: 'CollectionMetadataJson',
      ...collection,
    };
  });

  // handle ctrl/cmd + k

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setHasSearch(false);
    } else {
      setHasSearch(true);
    }
    searchQuery({
      variables: {
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date(),
        nftMintAddress: e.target.value,
        term: e.target.value,
        walletAddress: e.target.value,
      },
    });
  }

  const handleReset = () => {
    setValue('query', '');
    setHasSearch(false);
    setShowResults(false);
  };

  const {
    handleSubmit,
    setValue,
    register,
    setFocus,
    formState: { isSubmitting },
  } = useForm<SearchQuerySchema>({
    resolver: zodResolver(schema),
  });

  // Keybinds
  const openSearch = () => {
    // setFocus('query', { shouldSelect: true }); // had to switch because of debounce
    searchInputRef?.current?.focus();
  };

  useEffect(() => {
    if (shortcut && shortcut.registerShortcut) {
      shortcut.registerShortcut(openSearch, ['ctrl+k', 'ctrl+k'], 'Search', 'Start searching');

      return () => {
        if (shortcut.unregisterShortcut) {
          shortcut.unregisterShortcut(['ctrl+k', 'ctrl+k']);
        }
      };
    }
  }, []);

  return (
    <div
      id={`searchbar-container`}
      ref={searchResultsRef}
      className={`relative z-30 -ml-4 flex w-full flex-row items-center`}
    >
      <form
        className={`group relative block w-full items-center justify-center `}
        onSubmit={handleSubmit(handleSearch)}
      >
        <Combobox
          value={selected}
          onChange={(v) => {
            setSelected(v);

            switch (v?.__typename) {
              case 'MetadataJson':
                // TODO: dirty hack until __typename from collection search has a different type name to differentiate it from NFT search
                // relies on searchCollections not having creatorAddress returned from graphql
                // @ts-ignore
                if (!v?.creatorAddress) {
                  router.push(`/collections/${v.address}`);
                  break;
                }
                router.push(`/nfts/${v.address}`);
                break;
              case 'Wallet':
                router.push(`/profiles/${v.address}`);
                break;
              default:
                toast.error(`Unknown Content`);
                break;
            }
          }}
        >
          <div className="relative z-0 flex flex-1 items-center  px-6 sm:absolute sm:inset-0">
            <div className="w-full ">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative block transition-all">
                <span
                  onClick={() => searchInputRef?.current?.focus()}
                  className="absolute inset-y-0 left-[45%] flex cursor-pointer items-center rounded-full p-3 shadow-lg shadow-black transition-all hover:scale-125  group-focus-within:left-0 group-focus-within:scale-100 group-focus-within:bg-transparent group-focus-within:shadow-none md:left-0"
                >
                  <Search className="h-6 w-6 text-white " aria-hidden="true" />
                </span>
                <DebounceInput
                  minLength={2}
                  debounceTimeout={300}
                  id="search"
                  autoComplete={`off`}
                  autoCorrect={`off`}
                  className="block w-full rounded-full border border-transparent bg-transparent py-3 pl-14 pr-2 text-base placeholder-transparent transition-all focus:border-white focus:placeholder-gray-500 focus:outline-none focus:ring-white sm:text-sm"
                  type="search"
                  {...register('query', { required: true })}
                  onFocus={() => {
                    setShowResults(true);
                    setShowKeybind(true);
                  }}
                  onBlur={() => {
                    setShowKeybind(false);
                    setHasSearch(false);
                  }}
                  placeholder={`Search Holaplex...`}
                  onChange={handleOnChange}
                  inputRef={searchInputRef}
                  element={Combobox.Input}
                />

                {hasSearch && (
                  <button
                    type={`button`}
                    onClick={handleReset}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 `}
                  >
                    <XIcon className="h-6 w-6 text-white hover:text-gray-400" />
                  </button>
                )}

                {showKeybind && (
                  <div
                    className={`absolute inset-y-0 ${
                      hasSearch ? `right-8` : `right-0`
                    } hidden items-center pr-3 sm:flex`}
                  >
                    <KeyboardShortcut keys={[`ctrl`, `k`]} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setShowResults(false)}
          >
            <Combobox.Options
              // className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              className={`h-content scrollbar-thumb-rounded-full absolute top-12 z-50 max-h-screen-95 w-full gap-6 overflow-y-auto rounded-lg bg-gray-900  shadow-lg shadow-black transition ease-in-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900`}
            >
              {loading && (
                <>
                  <LoadingSearchItem />
                  <LoadingSearchItem variant={`circle`} />
                  <LoadingSearchItem />
                  <LoadingSearchItem variant={`circle`} />
                </>
              )}
              {data && called && (
                <SearchResults
                  term={searchVariables?.term}
                  results={data?.metadataJsons as MetadataJson[]}
                  profileResults={data?.profiles as Wallet[]}
                  walletResult={data.wallet as Wallet}
                  mintAddressResult={data.nftByMintAddress as Nft}
                  collectionResults={collectionData as MetadataJson[]}
                  collectionVolumeResults={data.collectionsFeaturedByVolume as Collection[]}
                />
              )}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </form>
    </div>
  );
};

export default withShortcut(SearchBar);
