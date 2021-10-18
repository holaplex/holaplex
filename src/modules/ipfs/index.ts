
export const fromCloudFlare = (cid: string) => (
  `https://cloudflare-ipfs.com/ipfs/${cid}`
)

export const fromDwebLink = (cid: string) => (
  `https://${cid}.ipfs.dweb.link`
)