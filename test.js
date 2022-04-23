const m = require('./');
const test = require('tape')

let store;

test('can create store', tape => {
  tape.plan(1)
  store = new m('deep', 'storage_test/test/depth/very')
  tape.ok(store)
})

test('can create store outside homedir', tape => {
  tape.plan(1)
  store = new m('deep','./storage_test/test/depth/very', false)
  tape.ok(store)
})

test('can put value', async tape => {
  tape.plan(1)
  await store.put('hello', new TextEncoder().encode('world'))
  tape.ok(await store.has('hello'))
})

test('can get value', async tape => {
  tape.plan(1)
  const value = await store.get('hello')
  tape.ok(Boolean('world' === new TextDecoder().decode(value)))
  // tape.ok(Boolean('world' === new TextDecoder().decode(value)))
})

test('can get keys', async tape => {
  tape.plan(1)
  const value = await store.keys(true)
  tape.ok(value.length > 0)
})

test('can query', async tape => {
  tape.plan(1)
  const value = await store.get()
  tape.ok(Object.keys(value).length > 0)
})


test('can get store name', async tape => {
  tape.plan(1)
  tape.ok(store.name === 'deep')
})

test('can get store size', async tape => {
  tape.plan(1)
  tape.ok(await store.size() > 0)
})

test('can get store length', async tape => {
  tape.plan(1)
  tape.ok(await store.length() > 0)
})
