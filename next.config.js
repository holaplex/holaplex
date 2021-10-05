const withAntdLess = require('next-plugin-antd-less');
const withImages = require('next-images')
const withArweave = require('./src/modules/next/plugins/arweave')
const { SecretsManagerClient } = require('@aws-sdk/client-secrets-manager');

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

module.exports = withImages(
  withAntdLess(
    withArweave(client, process.env.ARWEAVE_SECRET_ID)(
      {
        reactStrictMode: true,
        lessVarsFilePath: './ant-theme.less',
      }
    )
  )
)