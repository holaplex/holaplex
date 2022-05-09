import React, { FC } from 'react'
import { BasicSearchQuery } from 'src/graphql/indexerTypes'
import { PublicKey } from '@solana/web3.js'
import { ProfileSearchItem, NFTSearchItem } from './SearchItems'

interface SearchResultsProps {
    results: BasicSearchQuery
}

const SearchResults: FC<SearchResultsProps> = ({results}) => {

    const isPublicKey = (address: string) => {
        try{
            new PublicKey(address)
            return true
        } catch{
            return false
        }
    }

    if(results.nfts.length === 0 && !isPublicKey(results.wallet.address)){
        return(
            <div className={`w-full h-6 flex justify-center items-center`}>
                <p className={`text-base text-center font-medium m-0`}>No Results</p>
            </div>
        )
    }
    return (
        <>
        <h6 className={`text-base text-gray-300 font-medium`}>Profiles</h6>
        <ProfileSearchItem address={results.wallet.address} handle={results.wallet.profile?.handle}/>
        <h6 className={`text-base text-gray-300 font-medium`}>NFTs</h6>
        {results.nfts.map((nft) => (
            <NFTSearchItem creatorHandle={nft?.creators[0]?.twitterHandle} key={nft.address} address={nft.address} image={nft.image} name={nft.name} creatorAddress={nft.creators[0].address}/>
        ))}
        </>
    )
}

export default SearchResults