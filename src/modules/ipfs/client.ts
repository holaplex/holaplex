import { pinata } from './'
import { PinFileResponse } from './types';
import { Files } from 'formidable';
const GATEWAY = 'https://gateway.pinata.cloud/ipfs/'
export default async function UploadFiles(files: Files ) {
  const fileNames = Object.keys(files)
  const uploadPromises = fileNames.map((fileName) => {
    const options = {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: {
        cidVersion: 1 as 1 // I think this is right, not sure why.
      }
    };
    const file = files[fileName]
    return pinata.pinFileToIPFS(file, options)

  })

  const mixedResults: PinFileResponse[] = []

  const results = await Promise.allSettled(uploadPromises)
  results.forEach((result, index) => {
    const fileResponse: PinFileResponse = {
      file: {}
    }
    if (result.status === "rejected"){
      fileResponse.error = result.reason
      
    } else {
      fileResponse.file = {
        url: GATEWAY + result.value.IpfsHash,
        name: fileNames[index],
      }
    }
    mixedResults.push(fileResponse)
  })
  return mixedResults;
}