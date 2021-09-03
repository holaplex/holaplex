import type { NextConfig } from 'next/dist/next-server/server/config-shared';

module.exports = function withSolana(nextConfig: NextConfig) {
  const serverRuntimeConfig = nextConfig.serverRuntimeConfig || {}

  const solana = { key: "test" }

  serverRuntimeConfig.solana = solana

  return Object.assign({}, nextConfig, {
    serverRuntimeConfig,
  })
}