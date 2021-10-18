import { Files, File } from 'formidable';
import fs from 'fs'
import { PinFileResponse } from './types';

const uploadPromise = (file: File) => (
  fetch("https://api.nft.storage/upload", {
    //@ts-ignore
    body: fs.createReadStream(file.path),
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NFT_STORAGE_API_KEY || ''}`,
      "Content-Type": "application/x-www-form-urlencoded",
    } 
  })
)

export default async function UploadFiles(formFiles: Files ) {
  const files = Object.values(formFiles)
    .map(maybeFiles =>  maybeFiles instanceof Array ? maybeFiles[0] : maybeFiles)

  const uploadPromises: Promise<any>[] = []
  files.forEach((file) => {
    uploadPromises.push(uploadPromise(file));
  })

  const results = await Promise.allSettled(uploadPromises)

  const mixedResults: PinFileResponse[] = []
  await Promise.all(results.map(async(result, index) => {
    const fileResponse: PinFileResponse = {
      error: undefined,
      uri: '',
      name: files[index].name || '',
      type: files[index].type || ''
    }
    if (result.status === "rejected"){
      fileResponse.error = result.reason
    } else {
      const json = await result.value.json()
      fileResponse.uri = `https://${json.value.cid}.ipfs.dweb.link`
    }
    mixedResults.push(fileResponse)
  }))

  return mixedResults

}