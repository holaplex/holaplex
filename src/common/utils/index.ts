const captureCid = /https:\/\/(.*).ipfs.dweb.*$/;
export const maybeCDN = (uri: string) => {
  const cdnURI = uri.replace(captureCid, `${process.env.NEXT_PUBLIC_IPFS_CDN_HOST}/$1`);
  return cdnURI ?? uri;
};

export const maybeImageCDN = (uri?: string) => {
  if (!uri) { return uri }
  const cdnURI = uri.replace(captureCid, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/$1`);
  return cdnURI ?? uri;
};
