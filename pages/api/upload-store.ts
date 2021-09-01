import { formatFingerprint } from '@/common/constants/signature-message';
import { initArweave } from '@/modules/arweave';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from 'next';
import nacl from 'tweetnacl';

class ApiError extends Error {
  public readonly json: Readonly<object>;

  constructor(public readonly status: number, message: string | Record<string, any>) {
    super(typeof message === 'string' ? message : JSON.stringify(message));
    this.json = typeof message === 'string' ? { message } : message;
  }
}

const loadBuf = (a: Uint8Array | undefined) =>
  a === undefined ? undefined : Buffer.from(a).toString('utf-8');

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

const verifyPostParams = async (params: any) => {
  const { solana, solanaKeypair, uploadFee, solanaEndpoint } = await ENV;

  if (!(typeof params === 'object' && params))
    throw new ApiError(400, 'Missing request parameters');

  const { payload, signature } = params;

  if (!(typeof payload === 'string' && typeof signature === 'string'))
    throw new ApiError(400, 'Invalid request parameters');

  let payloadBuf: Buffer;
  let signatureBuf: Buffer;
  let payloadDec: any;

  try {
    payloadBuf = Buffer.from(payload, 'base64');
    signatureBuf = Buffer.from(signature, 'base64');
    payloadDec = JSON.parse(payloadBuf.toString('utf-8'));
  } catch {
    throw new ApiError(400, 'Invalid parameter encoding');
  }

  if (!(typeof payloadDec === 'object' && payloadDec))
    throw new ApiError(400, 'Invalid parameter encoding');

  const { depositTransaction } = payloadDec;

  if (typeof depositTransaction !== 'string') throw new ApiError(400, 'Invalid request parameters');

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
};

const postArweaveTransaction = async () => {
  const {} = await ENV;
  // TODO
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  try {
    switch (req.method) {
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
      case 'POST': {
        const params = await verifyPostParams(req.body);
        const result = await postArweaveTransaction();

        return res.status(200).json({ success: true });
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (e) {
    console.error(e);

    if (e instanceof ApiError) {
      return res.status(e.status).json(e.json);
    } else {
      return res.status(500).end();
    }
  }
}
