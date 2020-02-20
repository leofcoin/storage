const m = require('./');

const store = new m('storage_test/test/depth/very/deep')

new Promise((resolve, reject) => store.put('test', 1).then(() => {
  store.get('test').then(value => {
    value = Boolean(value === 1)
    if (value) resolve(0)
    else reject(1)
  })
}))

new Promise((resolve, reject) => store.put('test2', {'json': true}).then(() => {
  store.get('test2').then(value => {
    // value = Boolean(value === 1)
    console.log(value);
    if (value) resolve(0)
    else reject(1)
  })
}))