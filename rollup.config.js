import resolve from '@rollup/plugin-node-resolve'
export default [{
  input: 'src/storage.js',
  output: {
    file: 'exports/storage.js',
    format: 'es'
  },
  external: [    
    './value.js',
    './key.js'
  ]
}, {
  input: 'src/browser-store.js',
  output: {
    file: 'exports/browser-store.js',
    format: 'es'
  },  
  external: [    
    './value.js',
    './key.js'
  ],
  plugins: [
    resolve()
  ]
}, {
  input: 'src/store.js',
  output: {
    file: 'exports/store.js',
    format: 'es'
  },
  external: [
    'path',
    'classic-level',
    'os',
    'fs',
    'child_process',
    './value.js',
    './key.js'
  ]
}, {
  input: 'src/path.js',
  output: {
    file: 'exports/path.js',
    format: 'es'
  },
  external: [
    './encoding.js',
  ]
}, {
  input: 'src/value.js',
  output: {
    file: 'exports/value.js',
    format: 'es'
  },
  external: [
    './encoding.js',
  ]
}, {
  input: 'src/encoding.js',
  output: {
    file: 'exports/encoding.js',
    format: 'es'
  }
}]
