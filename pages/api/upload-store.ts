import { formatFingerprint } from '@/common/constants/signature-message';
import { ArweaveFile } from '@/modules/arweave/types';
import {
  FAVICON_FORM_NAME,
  LOGO_FORM_NAME,
  PAYLOAD_FORM_NAME,
  SIGNATURE_FORM_NAME,
  UploadPayload,
} from '@/modules/storefront/upload-store';
import { stylesheet } from '@/modules/theme';
import { ApiError, FormData } from '@/modules/utils';
import { WALLETS } from '@/modules/wallet/server';
import { PublicKey } from '@solana/web3.js';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { Buffer } from 'buffer';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import nacl from 'tweetnacl';

/** JSON schemas for parsing request parameters. */
const SCHEMAS = (() => {
  const ajv = new Ajv();

  const payload: JTDSchemaType<UploadPayload> = {
    properties: {
      depositTransaction: { type: 'string' },
      storefront: {
        properties: {
          theme: {
            properties: {
              primaryColor: { type: 'string' },
              backgroundColor: { type: 'string' },
              textFont: { type: 'string' },
              titleFont: { type: 'string' },
            },
            optionalProperties: {
              logo: {
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  url: { type: 'string' },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          meta: {
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
            },
            optionalProperties: {
              favicon: {
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  url: { type: 'string' },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          subdomain: { type: 'string' },
        },
        additionalProperties: true,
      },
      nonce: { type: 'string' },
    },
    additionalProperties: true,
  };

  return { parsePayload: ajv.compileParser(payload) };
})();

/** Verify a notarized post request, returning the storefront to upload. */
const verifyPostParams = async (params: FormData, uploadFee: number) => {
  const { solana, solanaKeypair } = await WALLETS;
  const { parsePayload } = SCHEMAS;

  const payload = params.files[PAYLOAD_FORM_NAME];
  const signature = params.fields[SIGNATURE_FORM_NAME];

  if (!(payload && typeof signature === 'string'))
    throw new ApiError(400, 'Invalid request parameters');

  let payloadBuf: Buffer;
  let signatureBuf: Buffer;
  let payloadDec: UploadPayload | undefined;

  try {
    const payloadFile: File | undefined = 'slice' in payload ? payload[0] : payload;
    if (payloadFile === undefined) throw new Error();

    payloadBuf = await fs.readFile(payloadFile.path);
    signatureBuf = Buffer.from(signature, 'base64');
    payloadDec = parsePayload(payloadBuf.toString('utf-8'));
  } catch {
    throw new ApiError(400, 'Invalid parameter encoding');
  }

  if (payloadDec === undefined) {
    throw new ApiError(400, `Invalid request parameters: ${parsePayload.message}`);
  }

  const { depositTransaction } = payloadDec;
  let tx;

  try {
    tx = await solana.getTransaction(depositTransaction);
  } catch {
    throw new ApiError(400, 'Invalid deposit transaction');
  }

  if (tx === null || tx.meta === null || tx.meta.err !== null)
    throw new ApiError(400, 'Invalid deposit transaction');

  const pubkeys = tx.transaction.message.accountKeys.map((k) => new PublicKey(k));

  const msg = await formatFingerprint(payloadBuf);
  const sender = pubkeys.findIndex((k) =>
    nacl.sign.detached.verify(msg, signatureBuf, k.toBytes())
  );
  const receiver = pubkeys.findIndex((k) => k.equals(solanaKeypair.publicKey));

  if (sender < 0 || receiver < 0) throw new ApiError(403, { message: 'Bad public keys' });

  if (
    !(
      tx.meta.preBalances[sender] - tx.meta.postBalances[sender] >= uploadFee &&
      tx.meta.postBalances[receiver] > tx.meta.preBalances[receiver]
    )
  ) {
    throw new ApiError(400, { message: 'Insufficient funds', uploadFee });
  }

  return { pubkey: pubkeys[sender], payload: payloadDec };
};

/** Upload a storefront to Arweave. */
const postArweaveTransaction = async (
  { files }: FormData,
  pubkey: PublicKey,
  { depositTransaction, storefront }: UploadPayload
) => {
  const {
    arweave,
    arweaveKeypair: { jwk },
  } = await WALLETS;
  const { api } = arweave.getConfig();

  {
    const txs = await arweave.transactions.search(
      'holaplex:deposit:transaction',
      depositTransaction
    );

    if (txs.length > 0) throw new ApiError(400, 'Storefront already uploaded');
  }

  const uploadFile = async (id: string): Promise<ArweaveFile | undefined> => {
    let file: File[] | File | undefined = files[id];

    if (file === undefined) return undefined;

    file = 'slice' in file ? file[0] : file;

    const data = await fs.readFile(file.path);
    const tx = await arweave.createTransaction({ data });

    if (file.type === null || file.name === null) throw new ApiError(400, `Invalid file '${id}'`);

    const { name, type } = file;

    tx.addTag('Content-Type', type);
    tx.addTag('File-Name', name);

    await arweave.transactions.sign(tx, jwk);
    await arweave.transactions.post(tx);

    return { url: `${api.protocol}://${api.host}:${api.port}/${tx.id}`, name, type };
  };

  const [newLogo, newFavicon] = await Promise.all([
    uploadFile(LOGO_FORM_NAME),
    uploadFile(FAVICON_FORM_NAME),
  ]);

  const logo = newLogo ?? storefront.theme.logo;
  const favicon = newFavicon ?? storefront.meta.favicon;

  if (logo === undefined) throw new ApiError(400, 'Missing store logo');
  if (favicon === undefined) throw new ApiError(400, 'Missing store favicon');

  const tx = await arweave.createTransaction({ data: stylesheet({ ...storefront.theme, logo }) });

  tx.addTag('Content-Type', 'text/css');
  tx.addTag('solana:pubkey', pubkey.toBase58());
  tx.addTag('holaplex:deposit:transaction', depositTransaction);
  tx.addTag('holaplex:metadata:subdomain', storefront.subdomain);
  tx.addTag('holaplex:metadata:favicon:url', favicon.url);
  tx.addTag('holaplex:metadata:favicon:name', favicon.name);
  tx.addTag('holaplex:metadata:favicon:type', favicon.type);
  tx.addTag('holaplex:metadata:page:title', storefront.meta.title);
  tx.addTag('holaplex:metadata:page:description', storefront.meta.description);
  tx.addTag('holaplex:theme:logo:url', logo.url);
  tx.addTag('holaplex:theme:logo:name', logo.name);
  tx.addTag('holaplex:theme:logo:type', logo.type);
  tx.addTag('holaplex:theme:color:primary', storefront.theme.primaryColor);
  tx.addTag('holaplex:theme:color:background', storefront.theme.backgroundColor);
  tx.addTag('holaplex:theme:font:title', storefront.theme.titleFont);
  tx.addTag('holaplex:theme:font:text', storefront.theme.textFont);
  tx.addTag('Arweave-App', 'holaplex');

  await arweave.transactions.sign(tx, jwk);
  await arweave.transactions.post(tx);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  try {
    const uploadFee = Number(process.env.STORE_UPLOAD_FEE);
    if (!Number.isFinite(uploadFee) || uploadFee !== Math.trunc(uploadFee))
      throw new Error('Invalid STORE_UPLOAD_FEE');

    switch (req.method) {
      // Return info for uploading a store
      case 'GET': {
        const {
          solanaKeypair: { publicKey }, // Cowardly refusing to load the private key
          solanaEndpoint,
        } = await WALLETS;

        return res
          .status(200)
          .json({ uploadFee, depositKey: publicKey.toBase58(), solanaEndpoint });
      }
      // Verify the upload fee was paid and post the storefront to Arweave
      case 'POST': {
        // Attempt to advise the client this request may take awhile
        res.setHeader('Connection', 'Keep-Alive');
        res.setHeader('Keep-Alive', `timeout=${5 * 60}`);

        const params = await new Promise<FormData>((ok) => {
          const form = new formidable.IncomingForm({ keepExtensions: true });

          form.parse(req, (formErr, fields, files) => {
            if (formErr) {
              console.error(formErr);
              throw new ApiError(400, 'Malformed request body');
            }

            ok({ fields, files });
          });
        });

        const { pubkey, payload } = await verifyPostParams(params, uploadFee);
        await postArweaveTransaction(params, pubkey, payload);

        return res.status(200).json({ success: true });
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json(e.json);
    } else {
      console.error(e);

      return res.status(500).end();
    }
  }
}
