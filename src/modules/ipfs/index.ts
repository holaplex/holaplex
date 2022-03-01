export const fromCloudFlare = (cid: string): string => `https://cloudflare-ipfs.com/ipfs/${cid}`;

export const fromDwebLink = (cid: string): string => `https://${cid}.ipfs.dweb.link`;
