import { Notarized } from "../notary";
import { ArweaveFile } from "./types";

export const PAYLOAD_FORM_NAME = 'payload';
export const FILE_FORM_NAME = 'file';

export interface ArweaveUploadPayload {
  pubkey: string;
  fileHash: string;
}

export type ArweaveUploadParams = Notarized<ArweaveUploadPayload>;

export type ArweaveUploadResult = ArweaveFile;