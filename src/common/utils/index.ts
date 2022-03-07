const captureCid = /https:\/\/(.*).ipfs.dweb.*$/;
const captureCidArweave = /https:\/\/arweave.net\/(.*)/;
const cleanExt = /\?ext=(.*)/;
const captureCidArweaveCache = /https:\/\/arweave.cache.holaplex.com\/(.*)/;
const captureCidIpfsIo = /https:\/\/ipfs.io\/ipfs\/(.*)/;

export const maybeCDN = (uri: string) => {
  const cdnURI = uri.replace(captureCid, `${process.env.NEXT_PUBLIC_IPFS_CDN_HOST}/$1`);
  return cdnURI ?? uri;
};

export const imgOpt = (uri?: string, width?: number) => {
  if (!uri) { return uri }
  let cdnURI = uri
  .replace(':443', '')
  .replace('www.', '')
  .replace(cleanExt, '')
  .replace(captureCid, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/ipfs/$1`)
  .replace(captureCidArweave, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/arweave/$1`)
  .replace(captureCidArweaveCache, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/arweave/$1`)
  .replace(captureCidIpfsIo, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/ipfs/$1`);
  cdnURI = cdnURI + `?width=${width}`

  return cdnURI ?? uri;
};
