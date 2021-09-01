import { Storefront } from './types';

export const PAYLOAD_FORM_NAME = '._payload.json';
export const SIGNATURE_FORM_NAME = '._signature';

export interface UploadPayload {
  depositTransaction: string;
  storefront: Storefront<string>;
  css: string;
  nonce: string;
}
