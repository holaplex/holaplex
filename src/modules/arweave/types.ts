export type ArweaveFile = {
  name: string;
  type: string;
  url: string;
};

export type ArweaveOwner = {
  address: string;
};

export type AreweaveTagFilter = {
  name: string;
  values: string[];
};
export type ArweaveTag = {
  name: string;
  value: string;
};
export type ArweaveTransaction = {
  owner: ArweaveOwner;
  tags: ArweaveTag[];
};

export type ArweaveDataOptions = {
  decode: boolean;
  string: boolean;
};
