import { formatFingerprint } from '@/common/constants/signature-message';
import { initArweave } from '@/modules/arweave';
import { PAYLOAD_FORM_NAME, SIGNATURE_FORM_NAME, UploadPayload } from '@/modules/storefront/upload';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Buffer } from 'buffer';
import formidable, { Fields, Files, File } from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import nacl from 'tweetnacl';

/** Helper for formidable. */
interface FormData {
  fields: Fields;
  files: Files;
}

/** Helper for nonlocal control flow for REST errors. */
class ApiError extends Error {
  public readonly json: Readonly<object>;

  constructor(public readonly status: number, message: string | Record<string, any>) {
    super(typeof message === 'string' ? message : JSON.stringify(message));
    this.json = typeof message === 'string' ? { message } : message;
  }
}

/** Small helper for loading buffers from nullable byte arrays. */
const loadBuf = (a: Uint8Array | undefined) =>
  a === undefined ? undefined : Buffer.from(a).toString('utf-8');

/** Promise containing static environment data for this module. */
const ENV = (async () => {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  });

  const [solanaResp, arweaveResp] = await Promise.all([
    client.send(
      new GetSecretValueCommand({
        SecretId: process.env.SOLANA_SECRET_ID ?? '',
      })
    ),
    client.send(
      new GetSecretValueCommand({
        SecretId: process.env.ARWEAVE_SECRET_ID ?? '',
      })
    ),
  ]);

  const solanaSecret = solanaResp.SecretString ?? loadBuf(solanaResp.SecretBinary);
  const arweaveSecret = arweaveResp.SecretString ?? loadBuf(arweaveResp.SecretBinary);

  if (solanaSecret === undefined || arweaveSecret === undefined)
    throw new Error('Missing AWS secrets');

  const solanaEndpoint = process.env.SOLANA_ENDPOINT;
  if (solanaEndpoint === undefined) throw new Error('Missing SOLANA_ENDPOINT');

  const solana = new Connection(solanaEndpoint);
  const solanaSecretKey = new Uint8Array(JSON.parse(solanaSecret));
  const solanaKeypair = Keypair.fromSecretKey(solanaSecretKey);

  console.log(`Solana public key: ${solanaKeypair.publicKey.toBase58()}`);

  const arweave = initArweave();
  const arweaveJwk = JSON.parse(arweaveSecret);
  const arweaveKeypair = {
    jwk: arweaveJwk as JWKInterface,
    address: await arweave.wallets.jwkToAddress(arweaveJwk),
  };

  console.log(`Arweave public key: ${arweaveKeypair.address}`);

  const uploadFee = Number(process.env.STORE_UPLOAD_FEE);
  if (!Number.isFinite(uploadFee) || uploadFee !== Math.trunc(uploadFee))
    throw new Error('Invalid STORE_UPLOAD_FEE');

  return { solana, arweave, solanaKeypair, arweaveKeypair, uploadFee, solanaEndpoint };
})();

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
              logo: { type: 'string' },
            },
            additionalProperties: true,
          },
          meta: {
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              favicon: { type: 'string' },
            },
            additionalProperties: true,
          },
          subdomain: { type: 'string' },
          pubkey: { type: 'string' },
        },
        additionalProperties: true,
      },
      css: { type: 'string' },
      nonce: { type: 'string' },
    },
    additionalProperties: true,
  };

  return { parsePayload: ajv.compileParser(payload) };
})();

/** Verify a notarized post request, returning the storefront to upload. */
const verifyPostParams = async (params: FormData) => {
  const { solana, solanaKeypair, uploadFee, solanaEndpoint } = await ENV;
  const { parsePayload } = await SCHEMAS;

  const payload = params.files[PAYLOAD_FORM_NAME];
  const signature = params.fields[SIGNATURE_FORM_NAME];

  console.log({ payload, signature });

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

  const { depositTransaction, storefront, css } = payloadDec;

  if (!(typeof depositTransaction === 'string' && typeof storefront === 'object' && storefront))
    throw new ApiError(400, 'Invalid request parameters');

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

  return payloadDec;
};

/** Upload a storefront to Arweave. */
const postArweaveTransaction = async (
  { files }: FormData,
  { depositTransaction, storefront, css }: UploadPayload
) => {
  const {
    arweave,
    arweaveKeypair: { jwk },
  } = await ENV;

  const tx = await arweave.createTransaction({ data: css });

  tx.addTag('Content-Type', 'text/css');
  tx.addTag('solana:pubkey', storefront.pubkey);
  tx.addTag('holaplex:metadata:subdomain', storefront.subdomain);
  tx.addTag('holaplex:metadata:favicon:url', ''); // TODO make a transaction for this
  tx.addTag('holaplex:metadata:favicon:name', '');
  tx.addTag('holaplex:metadata:favicon:type', '');
  tx.addTag('holaplex:metadata:page:title', storefront.meta.title);
  tx.addTag('holaplex:metadata:page:description', storefront.meta.description);
  tx.addTag('holaplex:theme:logo:url', ''); // TODO make a transaction for this
  tx.addTag('holaplex:theme:logo:name', '');
  tx.addTag('holaplex:theme:logo:type', '');
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
    switch (req.method) {
      // Return info for uploading a store
      case 'GET': {
        const {
          uploadFee,
          solanaKeypair: { publicKey }, // Cowardly refusing to load the private key
          solanaEndpoint,
        } = await ENV;

        return res
          .status(200)
          .json({ uploadFee, depositKey: publicKey.toBase58(), solanaEndpoint });
      }
      // Verify the upload fee was paid and post the storefront to Arweave
      case 'POST': {
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

        const storeInfo = await verifyPostParams(params);
        const result = await postArweaveTransaction(params, storeInfo);

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
