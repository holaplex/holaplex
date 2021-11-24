import { Files } from 'formidable';
import uploadFile from './nft.storage';
import { values, map, pipe, is, take, when } from 'ramda';

export default async function uploadFiles(formFiles: Files) {
  // @ts-ignore
  const files = pipe(values, map(when(is(Array), take(0))))(formFiles) as File[];
  const uploadPromises = files.map((file) => uploadFile(file));
  return await Promise.all(uploadPromises);
}
