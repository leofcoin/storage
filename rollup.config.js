import modify from 'rollup-plugin-modify'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
export default [{
  input: 'src/storage.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  }
}, {
  input: 'src/browser-store.js',
  output: {
    file: 'dist/browser-store.js',
    format: 'es'
  },
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    cjs()
  ]
}, {
  input: 'src/store.js',
  output: {
    file: 'dist/store.js',
    format: 'es'
  },
  external: [
    'path',
    'classic-level',
    'os',
    'fs',
    'child_process'
  ]
}]
