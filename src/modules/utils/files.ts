export const isImage = (file: File) => file.type.startsWith('image/');

export const isVideo = (file: File) => file.type.startsWith('video/');

export const isAudio = (file: File) => file.type.startsWith('audio/');

export const is3D = (file: File) => file.type.startsWith('model/');
