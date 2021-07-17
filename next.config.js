const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  reactStrictMode: true,
  lessVarsFilePath: './ant-theme.less' 
})
