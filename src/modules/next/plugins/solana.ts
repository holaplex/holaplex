import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Connection, Keypair } from '@solana/web3.js';
import getConfig from 'next/config';
import { NextConfig } from 'next/dist/next-server/server/config-shared';

export interface SolanaServerRuntimeConfig {
  keypair: Keypair;
  endpoint: string;
  connection: Connection;
}

export const getSolanaConfig = (): Promise<SolanaServerRuntimeConfig> =>
  getConfig().serverRuntimeConfig.solana;

const withSolana = (secrets: SecretsManagerClient, SecretId: string) => {
  return (nextConfig: NextConfig): NextConfig => {
    const getSolana = async (): Promise<SolanaServerRuntimeConfig> => {
      const endpoint = process.env.SOLANA_ENDPOINT;
      if (endpoint === undefined) throw new Error('Missing SOLANA_ENDPOINT');

      const connection = new Connection(endpoint);

      const secret = await secrets.send(new GetSecretValueCommand({ SecretId }));
      const secretKey = new Uint8Array(JSON.parse(secret.SecretString ?? ''));
      const keypair = Keypair.fromSecretKey(secretKey);

      console.info(`Solana public key: ${keypair.publicKey.toBase58()}`);

      return {
        keypair,
        endpoint,
        connection,
      };
    };

    return {
      ...nextConfig,
      serverRuntimeConfig: {
        ...(nextConfig.serverRuntimeConfig ?? {}),
        solana: getSolana(),
      },
    };
  };
};

export default withSolana;
