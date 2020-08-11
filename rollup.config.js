const { terser } = require('rollup-plugin-terser')

module.exports = {
  input: './index.js',
  
  output: {
    file: `./dist/bitt.min.js`,
    name: 'bitt',
    preferConst: true,
  },

  plugins: [
    terser(),
  ]
}