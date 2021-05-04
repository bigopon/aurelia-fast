import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [{
    format: 'es',
    sourcemap: true,
    file: 'dist/esm/index.js',
  }, {
    format: 'cjs',
    sourcemap: true,
    file: 'dist/cjs/index.js',
  }],
  plugins: [
    typescript({
      sourceMap: true
    }),
    {
      name: 'external-resolver',
      resolveId(source) {
        console.log('source', source);
        if (source === '@aurelia/kernel') {
          return { id: '@aurelia/kernel', external: true, absolute: true };
        } else if (source === '@aurelia/runtime') {
          return { id: '@aurelia/runtime', external: true, absolute: true };
        }
        return null;
      }
    }
  ]
}