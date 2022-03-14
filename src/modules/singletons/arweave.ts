import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import fs from 'fs/promises';
import { initArweave } from '../arweave';

export interface ArweaveServerRuntimeConfig {
  jwk: JWKInterface;
  address: string;
  arweave: Arweave;
}

const buildArweave = (SecretId: string | undefined) => {
  return async (ctx: { secrets: SecretsManagerClient }): Promise<ArweaveServerRuntimeConfig> => {
    const arweave = initArweave();

    let jwkStr;
    if (SecretId === undefined) {
      console.warn('!!! NO ARWEAVE ID PROVIDED !!!');
      console.warn('Using debug wallet!');

      jwkStr = (await fs.readFile('fixtures/debug-jwk.json')).toString('utf8');
    } else {
      const secret = await ctx.secrets.send(new GetSecretValueCommand({ SecretId }));

      jwkStr = secret.SecretString ?? '';
    }

    const jwk = JSON.parse(jwkStr);
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
