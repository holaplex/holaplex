import ArweaveSDK from '@/modules/arweave/client';
import { ArweaveFile } from '@/modules/arweave/types';
import {
  ArweaveUploadParams,
  ArweaveUploadPayload,
  FILE_FORM_NAME,
  formatMessage,
  PAYLOAD_FORM_NAME,
} from '@/modules/arweave/upload';
import { parseNotarized, unpackNotarized, verifyNaclSelfContained } from '@/modules/notary/server';
import singletons from '@/modules/singletons';
import { SCHEMAS } from '@/modules/singletons/json-schemas';
import { ApiError, FormData } from '@/modules/utils';
import { ajvParse, JsonString } from '@/modules/utils/json';
import { resultThenAsync } from '@/modules/utils/result';
import { PublicKey } from '@solana/web3.js';
import { sha256 } from 'crypto-hash';
import { File, IncomingForm } from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';

/** Verify a notarized post request, returning the file to upload. */
const verifyPostParams = async (params: FormData) => {
  const schemas = singletons.jsonSchemas;
  const parsePayload = ajvParse(schemas.parser(SCHEMAS.arweaveUploadPayload));

  const notarizedFields: string[] | string | undefined = params.fields[PAYLOAD_FORM_NAME];
  const files: File[] | File | undefined = params.files[FILE_FORM_NAME];

  if (notarizedFields === undefined || files === undefined)
    throw new ApiError(400, 'Invalid request parameters');

  const notarized: string = notarizedFields instanceof Array ? notarizedFields[0] : notarizedFields;

  const payloadRes = await resultThenAsync(
    parseNotarized<ArweaveUploadPayload>(notarized as JsonString<ArweaveUploadParams>),
    (payload) =>
      unpackNotarized(
        payload,
        verifyNaclSelfContained((s) => new PublicKey(s.pubkey).toBuffer()),
        { parse: parsePayload, format: formatMessage }
      )
  );

  if (payloadRes.err !== undefined) {
    throw new ApiError(400, `Invalid request parameters: ${payloadRes.err}`);
  }
  const { ok: payload } = payloadRes;

  const file: File = files instanceof Array ? files[0] : files;

  const data = await fs.readFile(file.path);
  const dataArr = new Uint8Array(
    data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
  );

  const hash = Buffer.from(await sha256(dataArr, { outputFormat: 'buffer' }));

  if (hash.toString('base64') !== payload.fileHash) throw new ApiError(400, 'File hash mismatch');

  if (file.type == null || file.name == null) throw new ApiError(400, 'Invalid file');
  const { name, type } = file;

  return { data, name, type };
};

/** Upload a file to Arweave. */
const postArweaveFile = async ({
  data,
  name,
  type,
}: {
  data: Buffer;
  name: string;
  type: string;
}): Promise<ArweaveFile> => {
  const { jwk, arweave, address } = await singletons.arweave;
  const arweaveClient = ArweaveSDK.using(arweave);

  const tx = await arweave.createTransaction({ data });

  tx.addTag('Content-Type', type);
  tx.addTag('File-Name', name);

  await arweave.transactions.sign(tx, jwk);

  if (!arweaveClient.wallet.canAfford(address, data.byteLength)) {
    throw new ApiError(400, 'Holaplex account needs more AR');
  }

  await arweave.transactions.post(tx);

  const { api } = arweave.getConfig();
  return { url: `${api.protocol}://${api.host}:${api.port}/${tx.id}`, name, type };
};

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  try {
    switch (req.method) {
      case 'POST': {
        const params = await new Promise<FormData>((ok, err) => {
          const form = new IncomingForm({ keepExtensions: true });

          form.parse(req, (formErr, fields, files) => {
            if (formErr) {
              console.error(formErr);
              const e = new ApiError(400, 'Malformed request body');
              err(e);
              throw e;
            }

            ok({ fields, files });
          });
        });

        const bits = await verifyPostParams(params);
        const ret = await postArweaveFile(bits);

        return res.status(200).json(ret);
      }
      default:
        res.setHeader('Allow', ['POST']);
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
