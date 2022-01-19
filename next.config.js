const withImages = require('next-images');
const withAntdLess = require('next-plugin-antd-less');

const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

// Add your plugins here
// const plugins = [
//   withAntdLess,
 
// ];
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');


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

// Other config goes here
// const config = {
//   reactStrictMode: true,
//   lessVarsFilePath: './ant-theme.less',
// };


module.exports = withPlugins(plugins, {reactStrictMode: false})

// module.exports = plugins.reduce((conf, plug) => plug(conf), config);
