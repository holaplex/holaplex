// removing this enables faster compiling, but leads to console errors with styled components having different classnames on client and server
module.exports = {
  presets: [['next/babel']],
  plugins: [['styled-components', { ssr: true }]],
};
