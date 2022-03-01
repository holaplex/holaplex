import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import fs from 'fs/promises';
import { Connection, Keypair } from '@solana/web3.js';

export interface SolanaServerRuntimeConfig {
  keypair: Keypair;
  endpoint: string;
  connection: Connection;
}

export const buildSolana = (SecretId: string | undefined, endpoint?: string) => {
  return async (ctx: { secrets: SecretsManagerClient, endpoint?: string }): Promise<SolanaServerRuntimeConfig> => {
    const endpoint = ctx.endpoint || process.env.SOLANA_ENDPOINT;
    if (endpoint === undefined) throw new Error('Missing SOLANA_ENDPOINT');

    const connection = new Connection(endpoint);

    let secretStr;
    if (SecretId === undefined) {
      console.warn('!!! NO SOLANA ID PROVIDED !!!');
      console.warn('Using debug wallet!');

      secretStr = (await fs.readFile('fixtures/debug-keypair.json')).toString('utf8');
    } else {
      const secret = await ctx.secrets.send(new GetSecretValueCommand({ SecretId }));

      secretStr = secret.SecretString ?? '';
    }

    const secretKey = new Uint8Array(JSON.parse(secretStr));
    const keypair = Keypair.fromSecretKey(secretKey);

    console.info(`Solana public key: ${keypair.publicKey.toBase58()}`);

    return {
      keypair,
      endpoint,
      connection,
    };
  };
};

export default buildSolana;
