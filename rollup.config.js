const { terser } = require('rollup-plugin-terser')

module.exports = {
  input: './index.js',
  
  output: {
    file: process.env.format === 'esm' 
      ? `./dist/esm.js`
      : `./dist/cjs.js`,

    name: 'bitt',
    preferConst: true,
  },

  plugins: [
    terser(),
  ]
}