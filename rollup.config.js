import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'src/storage.ts',
    output: {
      file: 'exports/storage.js',
      format: 'es'
    },

    external: ['path', 'classic-level', 'os', 'fs', 'child_process', './value.js', './key.js', './path.js'],

    plugins: [typescript()]
  },
  {
    input: 'src/browser-store.ts',
    output: {
      file: 'exports/browser-store.js',
      format: 'es'
    },
    external: ['path', 'classic-level', 'os', 'fs', 'child_process', './value.js', './key.js', './path.js'],
    plugins: [resolve(), typescript()]
  },
  {
    input: 'src/store.ts',
    output: {
      file: 'exports/store.js',
      format: 'es'
    },
    external: ['path', 'classic-level', 'os', 'fs', 'child_process', './value.js', './key.js', './path.js'],
    plugins: [typescript()]
  },
  {
    input: 'src/path.ts',
    output: {
      file: 'exports/path.js',
      format: 'es'
    },
    external: ['./encoding.js'],
    plugins: [typescript()]
  },
  {
    input: 'src/value.ts',
    output: {
      file: 'exports/value.js',
      format: 'es'
    },
    external: ['./encoding.js'],
    plugins: [typescript()]
  },
  {
    input: 'src/encoding.ts',
    output: {
      file: 'exports/encoding.js',
      format: 'es'
    },
    plugins: [typescript()]
  }
]
