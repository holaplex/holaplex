const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
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
  experimental: {
    outputStandalone: true,
  },
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
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
});
