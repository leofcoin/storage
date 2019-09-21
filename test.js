const m = require('./');

const store = new m('config')

new Promise((resolve, reject) => store.put('test', 'val').then(() => {
  store.get('test').then(value => {
    value = Boolean(value === 'val')  
    if (value) resolve(0)
    else reject(1)
  })
}))