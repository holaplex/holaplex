import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Connection, Keypair } from '@solana/web3.js';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { Buffer } from 'buffer';
import { initArweave } from '../arweave';

/** Small helper for loading buffers from nullable byte arrays. */
const loadBuf = (a: Uint8Array | undefined) =>
  a === undefined ? undefined : Buffer.from(a).toString('utf-8');

/** Promise containing static environment data for this module. */
export const WALLETS = (async () => {
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

  return { solana, arweave, solanaKeypair, arweaveKeypair, solanaEndpoint };
})();
