import modify from 'rollup-plugin-modify'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
export default [{
  input: 'src/storage.js',
  output: {
    file: 'dist/commonjs.js',
    format: 'cjs'
  },
  external: [
    'node:fs/promises',
    'classic-level'
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
    file: 'dist/bundle/es.js',
    format: 'es'
  },
  plugins: [
    cjs(),
    resolve(),
    modify({
      '@store:import': './store-shim.js'
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
