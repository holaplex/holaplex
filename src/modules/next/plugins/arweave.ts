import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import getConfig from 'next/config';
import type { NextConfig } from 'next/dist/next-server/server/config-shared';
import { initArweave } from './../../../modules/arweave';

export interface ArweaveServerRuntimeConfig {
  jwk: JWKInterface;
  address: string;
  arweave: Arweave;
}

export const getArweaveConfig = (): Promise<ArweaveServerRuntimeConfig> =>
  getConfig().serverRuntimeConfig.arweave;

const withArweave = (secrets: SecretsManagerClient, SecretId: string) => {
  return (nextConfig: NextConfig): NextConfig => {
    const getArweave = async (): Promise<ArweaveServerRuntimeConfig> => {
      const arweave = initArweave();

      const secret = await secrets.send(new GetSecretValueCommand({ SecretId }));
      const jwk = JSON.parse(secret.SecretString ?? '');
      const address = await arweave.wallets.jwkToAddress(jwk);

      console.info(`Arweave address: ${address}`);

      return {
        jwk,
        address,
        arweave,
      };
    };

    return {
      ...nextConfig,
      serverRuntimeConfig: {
        ...(nextConfig.serverRuntimeConfig ?? {}),
        arweave: getArweave(),
      },
    };
  };
};

export default withArweave;
