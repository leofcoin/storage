export default [{
  input: 'src/browser.js',
  output: {
    file: 'browser.js',
    format: 'es'
  }
}, {
  input: 'src/commonjs.js',
  output: {
    file: 'commonjs.js',
    format: 'cjs'
  }
}]