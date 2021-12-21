import { FilePreview } from 'pages/nfts/new';

export const isImage = (file: File | FilePreview) => file.type.startsWith('image/');

export const isVideo = (file: File | FilePreview) => file.type.startsWith('video/');

export const isAudio = (file: File | FilePreview) => file.type.startsWith('audio/');

export const is3DFilePreview = (filePreview: FilePreview) =>
  filePreview.type.startsWith('model/glb');

export const is3DFile = (file: File) => file.name.endsWith('.glb');

export function getFinalFileWithUpdatedName(file: File, numberOfDuplicates: number) {
  const fileNameParts = file.name.split('.');
  const extension = fileNameParts.pop();
  const finalName = fileNameParts.join('.') + '_' + numberOfDuplicates + '.' + extension;
  return new File([file], finalName, { type: file.type });
}
