import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [{
    format: 'es',
    sourcemap: true,
    file: 'dist/esm/index.js'
  }, {
    format: 'cjs',
    sourcemap: true,
    file: 'dist/cjs/index.js'
  }],
  plugins: [
    typescript({
      sourceMap: true
    })
  ]
}