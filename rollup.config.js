const { terser } = require('rollup-plugin-terser')
const typescript = require('@rollup/plugin-typescript')

module.exports = {
  input: './index.js',
  
  output: {
    file: `./dist/bitt.min.js`,
    name: 'bitt',
    preferConst: true,
  },

  plugins: [
    terser(),
    typescript(),
  ]
}