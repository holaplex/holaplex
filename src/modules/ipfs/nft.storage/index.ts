export default function uploadFile(path: string) {
  return fetch("https://api.nft.storage/upload", {
    //@ts-ignore
    body: fs.createReadStream(path),
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NFT_STORAGE_API_KEY || ''}`,
      "Content-Type": "application/x-www-form-urlencoded",
    } 
  })

}