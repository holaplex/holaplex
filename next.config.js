const withImages = require('next-images');
const withAntdLess = require('next-plugin-antd-less');

// Add your plugins here
const plugins = [
  withAntdLess,
  withImages,
];

// Other config goes here
const config = {
  reactStrictMode: true,
  lessVarsFilePath: './ant-theme.less',
};

module.exports = plugins.reduce((conf, plug) => plug(conf), config);
