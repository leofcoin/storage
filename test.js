const m = require('./');
const test = require('tape')

let store;

test('can create store', tape => {
  tape.plan(1)
  store = new m('storage_test/test/depth/very/deep')
  tape.ok(store)
})

test('can create store outside homedir', tape => {
  tape.plan(1)
  store = new m('storage_test/test/depth/very/deep', './', false)
  tape.ok(store)
})

test('can put value', async tape => {
  tape.plan(1)
  await store.put('test', 1)
  const value = await store.get('test')

  await store.put('hello', 'world')
  tape.ok(Boolean(value === 1))
})

test('can put value (key as number)', async tape => {
  tape.plan(1)
  await store.put(1, 1)
  const value = await store.get(1)
  tape.ok(Boolean(value === 1))
})

test('can get JSON', async tape => {
  tape.plan(1)
  await store.put('test2', {json: true})
  const value = await store.get('test2')

  tape.ok(value.json)
})
