const { SecretsManagerClient } = require('@aws-sdk/client-secrets-manager');
const withImages = require('next-images');
const withAntdLess = require('next-plugin-antd-less');
const withArweave = require('./src/modules/next/plugins/arweave');
const withJsonSchemas = require('./src/modules/next/plugins/json-schemas');
const withSolana = require('./src/modules/next/plugins/solana');

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

// Add your plugins here
const plugins = [
  withArweave(client, process.env.ARWEAVE_SECRET_ID),
  withSolana(client, process.env.SOLANA_SECRET_ID),
  withJsonSchemas,
  withAntdLess,
  withImages,
];

// Other config goes here
const config = {
  reactStrictMode: true,
  lessVarsFilePath: './ant-theme.less',
};

module.exports = plugins.reduce((conf, plug) => plug(conf), config);
