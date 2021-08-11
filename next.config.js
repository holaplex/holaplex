const withAntdLess = require('next-plugin-antd-less');
const withImages = require('next-images')

module.exports = withImages(withAntdLess({
  reactStrictMode: true,
  lessVarsFilePath: './ant-theme.less'
}))
