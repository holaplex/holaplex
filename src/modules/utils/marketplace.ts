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
