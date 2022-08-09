export interface IWallet {
  address: string;
  twitterHandle: string;
}

interface NFT {
  address: string;
  mintAddress: string;
  name: string;
  description: string;
  image: string;
  creators?: {
    address: string;
    twitterHandle: string;
  }[];
}

export interface IActivityItem {
  id: string;
  price?: number;
  createdAt: string; // ISO Date // at
  wallets: IWallet[];
  activityType: string;
  nft?: NFT;
  auctionHouse?: {
    address: string;
    treasuryMint: string;
  };
}
