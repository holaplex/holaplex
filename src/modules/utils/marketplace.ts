import { AhListing } from '@holaplex/marketplace-js-sdk';
import { AhListingMultiMarketplace } from '../../pages/nfts/[address]';
import {
  AUCTION_HOUSE_ADDRESSES,
  AUCTION_HOUSE_INFO,
  MARKETPLACE_PROGRAMS,
} from '../../views/_global/holaplexConstants';

enum MarketplaceErrorCodes {
  PublicKeyMismatch,
  InvalidMintAuthority,
  UninitializedAccount,
  IncorrectOwner,
  PublicKeyShouldBeUnique,
  StatementFalse,
  NotRentExempt,
  NumericalOverflow,
  ExpectedSolAccount,
  CannotExchangeSOLForSol,
  SOLWalletMustSign,
  CannotTakeThisActionWithoutAuctionHouseSignOff,
  NoPayerPresent,
  DerivedKeyInvalid,
  MetadataDoesntExist,
  InvalidTokenAmount,
  BothPartiesNeedToAgreeToSale,
  CannotMatchFreeSalesWithoutAuctionHouseOrSellerSignoff,
  SaleRequiresSigner,
  OldSellerNotInitialized,
  SellerATACannotHaveDelegate,
  BuyerATACannotHaveDelegate,
  NoValidSignerPresent,
  InvalidBasisPoints,
}

export const errorCodeHelper = (err: string) => {
  const errorCode = err.match(/0x[0-9A-F]+/)?.toString() || '';
  const decimal = parseInt(errorCode, 16);
  const errorVal = Number(decimal.toString().slice(2, 3));
  const errorMsg = `There was an error whilst performing an action that resulted in an error code of ${errorCode}: (${MarketplaceErrorCodes[errorVal]}). Full message: ${err} `;
  return {
    message: errorCode ? errorMsg : err,
  };
};

export const getAuctionHouseInfo = (listing: AhListingMultiMarketplace): AUCTION_HOUSE_INFO => {
  return (
    AUCTION_HOUSE_ADDRESSES.find(
      (ah) => ah.address === listing?.auctionHouse?.address.toString()
    ) ||
    MARKETPLACE_PROGRAMS.find((ah) => ah.address === listing?.marketplaceProgramAddress) || {
      name: 'Unknown Marketplace',
      address: null,
      logo: '/images/listings/unknown.svg',
      link: '',
    }
  );
};
