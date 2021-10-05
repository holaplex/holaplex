import type { NextConfig } from 'next/dist/next-server/server/config-shared';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { initArweave } from './../../../modules/arweave';
import type Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';

type ArweaveServerRuntimeConfig = {
  jwk: JWKInterface,
  address: string,
  arweave: Arweave,
}

module.exports = function withArweave(client: SecretsManagerClient, SecretId: string) {
  return (nextConfig: NextConfig) => {
    const arweaveClient = initArweave();
    const serverRuntimeConfig = nextConfig.serverRuntimeConfig || {}

    const getArweave = async (): Promise<ArweaveServerRuntimeConfig> => {
      const arweaveServerRuntimeConfig = {} as ArweaveServerRuntimeConfig
      const arweaveSecretKey = await client.send(
        new GetSecretValueCommand({
          SecretId,
        })
      )
      const secretKey = JSON.parse(arweaveSecretKey.SecretString as string)
      const address = await arweaveClient.wallets.jwkToAddress(arweaveServerRuntimeConfig.jwk)

      arweaveServerRuntimeConfig.jwk = secretKey
      arweaveServerRuntimeConfig.address = address
      arweaveServerRuntimeConfig.arweave = arweaveClient

      console.info(`Arweave address: ${address}`)

      return arweaveServerRuntimeConfig
    }

    serverRuntimeConfig.arweave = getArweave()

    return Object.assign({}, nextConfig, {
      serverRuntimeConfig,
    })
  }
}