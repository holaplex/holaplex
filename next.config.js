const withAntdLess = require('next-plugin-antd-less');
const withImages = require('next-images')

module.exports = withImages(withAntdLess({
  reactStrictMode: true,
  lessVarsFilePath: './ant-theme.less',

  webpack: function (config) {
    return Object.assign({}, config, { entry: function() {
      return config.entry().then((entry) => {
        return Object.assign({}, entry, { updateStores: './src/scripts/update-stores' })
      })
    }})
  }
}))
