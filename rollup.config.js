export default [{
  input: 'src/browser.js',
  output: {
    file: 'browser.es.js',
    format: 'es'
  }
}, {
  input: 'src/browser.js',
  output: {
    file: 'browser.js',
    name: 'LeofcoinStorage',
    format: 'iife'
  }
}, {
  input: 'src/commonjs.js',
  output: {
    file: 'commonjs.js',
    format: 'cjs'
  }
}]