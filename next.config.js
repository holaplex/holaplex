const withImages = require('next-images');
const withAntdLess = require('next-plugin-antd-less');

// Add your plugins here
const plugins = [withAntdLess, withImages];

// Other config goes here
const config = {
  reactStrictMode: true,
  lessVarsFilePath: './ant-theme.less',
  async rewrites() {
    return [
      {
        source: '/bee.js',
        destination: 'https://cdn.splitbee.io/sb.js',
      },
      {
        source: '/_hive/:slug',
        destination: 'https://hive.splitbee.io/:slug',
      },
    ];
  },
};

module.exports = plugins.reduce((conf, plug) => plug(conf), config);
