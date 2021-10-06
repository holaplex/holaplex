import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Connection, Keypair } from '@solana/web3.js';

export interface SolanaServerRuntimeConfig {
  keypair: Keypair;
  endpoint: string;
  connection: Connection;
}

const buildSolana = (SecretId: string | undefined) => {
  return async (ctx: { secrets: SecretsManagerClient }): Promise<SolanaServerRuntimeConfig> => {
    if (SecretId === undefined) throw new Error('Missing Solana secret ID');

    const endpoint = process.env.SOLANA_ENDPOINT;
    if (endpoint === undefined) throw new Error('Missing SOLANA_ENDPOINT');

    const connection = new Connection(endpoint);

    const secret = await ctx.secrets.send(new GetSecretValueCommand({ SecretId }));
    const secretKey = new Uint8Array(JSON.parse(secret.SecretString ?? ''));
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
