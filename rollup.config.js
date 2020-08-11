const { version } = require('./package.json')
const { terser } = require('rollup-plugin-terser')

module.exports = {
  input: './index.js',
  
  output: {
    file: `./dist/bitt-${version}.js`,
    name: 'bitt',
    preferConst: true,
  },

  plugins: [
    terser(),
  ]
}