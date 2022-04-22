const captureCid = /https:\/\/(.*).ipfs.dweb.*$/;
const captureCidArweave = /https:\/\/arweave.net\/(.*)/;
const cleanExt = /\?ext=(.*)/;
const replaceWidth = /\?width=400/;
const captureCidArweaveCache = /https:\/\/arweave.cache.holaplex.com\/(.*)/;
const captureCidIpfsIo = /https:\/\/ipfs.io\/ipfs\/(.*)/;

const captureCidOldHolaplexAssets = /https:\/\/images.holaplex.com\/(.*)/;

export const maybeCDN = (uri: string) => {
  const cdnURI = uri.replace(captureCid, `${process.env.NEXT_PUBLIC_IPFS_CDN_HOST}/$1`);
  return cdnURI ?? uri;
};

type IMAGE_SIZE =
  | 0 // original size
  | 50
  | 100
  | 200
  | 400
  | 500
  | 600
  | 800
  | 700
  | 900
  | 1000
  | 1100
  | 1200
  | 1300
  | 1400
  | 1500;

export const imgOpt = (uri?: string, width: IMAGE_SIZE = 0) => {
  if (!uri){
    return uri;
  } else if (uri.includes('holaplex.tools')) {
    return uri.replace(replaceWidth, `?width=${width}`)
  } else {
    let cdnURI = uri
    .replace(':443', '')
    .replace('www.', '')
    .replace(cleanExt, '')
    .replace(captureCid, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/ipfs/$1`)
    .replace(captureCidOldHolaplexAssets, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/ipfs/$1`)
    .replace(captureCidArweave, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/arweave/$1`)
    .replace(captureCidArweaveCache, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/arweave/$1`)
    .replace(captureCidIpfsIo, `${process.env.NEXT_PUBLIC_IMAGE_CDN_HOST}/ipfs/$1`);
    cdnURI = cdnURI + `?width=${width}`;

    return cdnURI ?? uri;
  }
};

export const RUST_ISO_UTC_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export function isTouchScreenOnly(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}
