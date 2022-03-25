const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const plugins = [
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
      'assets.holaplex.tools',
      'assets1.holaplex.tools',
      'assets2.holaplex.tools',
      'assets3.holaplex.tools',
      'assets4.holaplex.tools',
    ],
  },
});
