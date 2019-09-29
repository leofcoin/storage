const m = require('./');

const store = new m('config')

new Promise((resolve, reject) => store.put('test', 1).then(() => {
  store.get('test').then(value => {
    value = Boolean(value === 1)
    if (value) resolve(0)
    else reject(1)
  })
}))