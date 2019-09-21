export default [ {
  input: 'src/level.js',
  output: {
    file: 'browser.js',
    name: 'LeofcoinStorage',
    format: 'cjs'
  }
}, {
  input: 'src/level.js',
  output: {
    file: 'commonjs.js',
    format: 'cjs'
  }
}]