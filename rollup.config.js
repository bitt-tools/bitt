const localResolve = require('rollup-plugin-local-resolve')
const { terser } = require('rollup-plugin-terser')

const { version } = require('./package.json')

module.exports = {
  input: './index.js',
  
  output: {
    file: `./dist/bitt-${version}.js`,
    name: 'bitt',
    preferConst: true,
  },

  plugins: [
    localResolve(),
    terser(),
  ]
}