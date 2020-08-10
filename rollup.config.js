const localResolve = require('rollup-plugin-local-resolve')
const { terser } = require('rollup-plugin-terser')

module.exports = {
  input: './index.js',
  
  output: {
    file: process.env.format === 'esm' 
      ? `./dist/bitt-esm.js`
      : `./dist/bitt.js`,

    name: 'bitt',
    preferConst: true,
  },

  plugins: [
    localResolve(),
    terser(),
  ]
}