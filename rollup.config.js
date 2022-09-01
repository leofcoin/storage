import modify from 'rollup-plugin-modify'
import resolve from '@rollup/plugin-node-resolve'
export default [{
  input: 'src/storage.js',
  output: {
    file: 'dist/commonjs.js',
    format: 'cjs'
  },
  external: [
    'node:fs/promises'
  ],
  plugins: [
    resolve(),
    modify({
      '@store:import': './store.js'
    })
  ]
}, {
  input: 'src/storage.js',
  output: {
    file: 'dist/es.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    modify({
      '@store:import': './store-shim.js'
    })
  ]
}]
