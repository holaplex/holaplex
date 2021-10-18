import { Files } from 'formidable';
import { PinFileResponse } from './types';
import uploadFile from './nft.storage';
import { fromCloudFlare } from '.';

export default async function UploadFiles(formFiles: Files ) {
  const files = Object.values(formFiles)
    .map(maybeFiles =>  maybeFiles instanceof Array ? maybeFiles[0] : maybeFiles)

  const uploadPromises: Promise<any>[] = []
  files.forEach((file) => {
    uploadPromises.push(uploadFile(file.path));
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
      fileResponse.uri = fromCloudFlare(json.value.cid)
    }
    mixedResults.push(fileResponse)
  }))

  return mixedResults

}