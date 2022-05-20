import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { Search } from '../icons/Search';
import LoadingSearchItem from './LoadingSearchItem';
import { useSearchLazyQuery, MetadataJson, Wallet } from 'src/graphql/indexerTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import SearchResults from './SearchResults';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { useRouter } from 'next/router';
import { Close } from '../icons/Close';
import { PublicKey } from '@solana/web3.js';
import { SearchIcon, XIcon } from '@heroicons/react/outline';

const schema = zod.object({
  query: zod.string().nonempty({ message: `Must enter something` }),
});

interface SearchQuerySchema {
  query: string;
}

export const isPublicKey = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

const SearchBar: FC = () => {
  const searchResultsRef = useRef<HTMLDivElement>(null!);

  const router = useRouter();

  const [showResults, setShowResults] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);

  useEffect(() => {
    setShowResults(false);
  }, [router.route]);

  useOutsideAlerter(searchResultsRef, () => setShowResults(false));

  const [searchQuery, { data, loading, called }] = useSearchLazyQuery();

  const handleSearch = ({ query }: SearchQuerySchema) => {
    // handle enter
  };

  // handle ctrl/cmd + k

  const handleOnChange = (e: any) => {
    if (e.target.value === '') {
      setHasSearch(false);
    } else {
      setHasSearch(true);
    }
    searchQuery({
      variables: {
        term: e.target.value,
        walletAddress: e.target.value,
      },
    });
  };

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
        <div className="relative z-0 flex flex-1 items-center  px-2 sm:absolute sm:inset-0">
          <div className="w-full ">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative block transition-all ">
              <span
                onClick={() => setFocus('query', { shouldSelect: true })}
                className="absolute inset-y-0 left-[45%] flex cursor-pointer items-center rounded-full p-2 shadow-lg shadow-black transition-all hover:bg-gray-800 group-focus-within:left-0 group-focus-within:bg-transparent group-focus-within:shadow-none md:left-0"
              >
                <Search className="h-6 w-6 text-white " aria-hidden="true" />
              </span>

              <input
                id="search"
                autoComplete={`off`}
                autoCorrect={`off`}
                className="block w-full rounded-full border border-transparent bg-transparent py-2 pr-3 pl-12 text-base placeholder-transparent transition-all focus:border-white focus:placeholder-gray-500 focus:outline-none focus:ring-white sm:text-sm"
                type="search"
                {...register('query', { required: true })}
                onFocus={() => setShowResults(true)}
                onChange={handleOnChange}
                placeholder={`Search Holaplex...`}
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
            </div>
          </div>
        </div>
      </form>
      {showResults && (
        <div
          className={`h-content scrollbar-thumb-rounded-full absolute top-12 z-50 max-h-96 w-full gap-6 overflow-y-auto rounded-lg bg-gray-900 ${
            data && called ? `p-6` : ``
          } transition ease-in-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900`}
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
              results={data?.metadataJsons as MetadataJson[]}
              profileResults={data?.profiles as Wallet[]}
              walletResult={data.wallet as Wallet}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
