import type { NextConfig } from 'next/dist/next-server/server/config-shared';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { initArweave } from '@/modules/arweave';
import type Arweave  from 'arweave';

type ArweaveServerRuntimeConfig = {
  secretKey: any,
  address: string,
  client: Arweave,
}

module.exports = function withArweave(client: SecretsManagerClient, SecretId: string) {
  return async (nextConfig: NextConfig) => {
    const arweaveClient = initArweave();
    const serverRuntimeConfig = nextConfig.serverRuntimeConfig || {}

    const arweaveServerRuntimeConfig = { } as ArweaveServerRuntimeConfig

    const arweaveSecretKey  = await client.send(
      new GetSecretValueCommand({
        SecretId,
      })
    )
    const secretKey = JSON.parse(arweaveSecretKey.SecretString as string)
    const address = await arweaveClient.wallets.jwkToAddress(arweaveServerRuntimeConfig.secretKey)
    
    arweaveServerRuntimeConfig.secretKey = secretKey
    arweaveServerRuntimeConfig.address = address
    arweaveServerRuntimeConfig.client = arweaveClient

    serverRuntimeConfig.arweave = arweaveServerRuntimeConfig

    return Object.assign({}, nextConfig, {
      serverRuntimeConfig,
    })
  }
}