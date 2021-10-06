import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { initArweave } from '../arweave';

export interface ArweaveServerRuntimeConfig {
  jwk: JWKInterface;
  address: string;
  arweave: Arweave;
}

const buildArweave = (SecretId: string | undefined) => {
  return async (ctx: { secrets: SecretsManagerClient }): Promise<ArweaveServerRuntimeConfig> => {
    if (SecretId === undefined) throw new Error('Missing Arweave secret ID');

    const arweave = initArweave();

    const secret = await ctx.secrets.send(new GetSecretValueCommand({ SecretId }));
    const jwk = JSON.parse(secret.SecretString ?? '');
    const address = await arweave.wallets.jwkToAddress(jwk);

    console.info(`Arweave address: ${address}`);

    return {
      jwk,
      address,
      arweave,
    };
  };
};

export default buildArweave;
