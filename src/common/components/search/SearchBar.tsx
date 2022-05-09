import React, { FC, useState, useRef, useEffect } from 'react';
import { Search } from '../icons/Search';
import cx from 'classnames';
import LoadingSearchItem from './LoadingSearchItem';
import { useBasicSearchLazyQuery } from 'src/graphql/indexerTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import SearchResults from './SearchResults';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { useRouter } from 'next/router';
import { Close } from '../icons/Close';

const schema = zod.object({
    query: zod.string().nonempty({message: `Must enter something`})
})

interface SearchQuerySchema {
    query: string;
}

const SearchBar: FC = () => {

    const searchResultsRef = useRef<HTMLDivElement>(null!);

    const router = useRouter()
    

    const [showBar, setShowBar] = useState(false)
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        setShowResults(false)
    }, [router.route])

    useOutsideAlerter(searchResultsRef, () => setShowResults(false))

    const toggleBar = () => {
        setShowBar(!showBar)
    }

    const [searchQuery, { data, loading, called, refetch }] = useBasicSearchLazyQuery()

    const handleSearch = ({query}: SearchQuerySchema) => {
        setShowResults(true)
        searchQuery({variables: {
            walletAddress: query
        }})
    }

    const handleReset = () => {
        setValue("query", "")
        setShowResults(false)
    }

    const { 
        handleSubmit, 
        setValue,
        register,
        watch,
        formState: {isSubmitting}
    } = useForm<SearchQuerySchema>({
        resolver: zodResolver(schema)
    })

    const searchQueryWatchable = watch("query")


    return (
        <div id={`searchbar-container`} ref={searchResultsRef} className={`flex flex-row items-center w-full relative z-30`}>
            {!showBar ? (
                <a onClick={toggleBar} className={`hover:bg-gray-800 p-2 ease-in-out transition rounded-full hover:cursor-pointer`}>
                    <Search/>
                </a>
            ) : (
                <div className={`flex flex-row gap-2 items-center p-2 rounded-full bg-gray-900 border border-white w-full`}>
                    <a onClick={toggleBar} className={``}>
                        <Search/>
                    </a>
                    <form className={`flex items-center w-full relative`} onSubmit={handleSubmit(handleSearch)}>
                        <input
                        {...register('query', {required: true})}
                        // onBlur={() => setShowResults(false)} 
                        // onFocus={() => setShowResults(true)} 
                        placeholder={`Search Holaplex...`} 
                        className={`w-full h-full bg-gray-900 text-gray-500 text-base`}/>
                        {searchQueryWatchable && (
                            <button
                            type={`button`}
                            onClick={handleReset}
                            className={`absolute top-0 right-2 hover:text-gray-400`}
                            >
                                <Close color={`#ffffff`} />
                            </button>
                        )}
                        
                    </form>
                </div>
            )}
            {showResults && (
                <div className={`absolute bg-gray-900 z-50 p-6 rounded-lg w-full h-content max-h-96 overflow-y-auto top-12 gap-6`}>
                    {isSubmitting || loading && (
                        <>
                            <LoadingSearchItem/>
                            <LoadingSearchItem variant={`circle`}/>
                            <LoadingSearchItem/>
                            <LoadingSearchItem variant={`circle`}/>
                        </>
                    )}
                    {data && called && (
                        <SearchResults results={data}/>
                    )}
                    
                </div>
            )}
        </div>
    )
}

export default SearchBar