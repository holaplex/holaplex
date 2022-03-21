const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const plugins = [
  withImages,
  [
    withLess,
    {
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  reactStrictMode: false,
  images: {
    domains: [
      'pbs.twimg.com',
      'arweave.net',
      'ipfs.dweb.link',
      'assets.holaplex.com',
      'assets1.holaplex.com',
      'assets2.holaplex.com',
      'assets3.holaplex.com',
      'assets4.holaplex.com',
    ],
  },
});
