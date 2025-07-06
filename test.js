import m from './exports/storage.js'
import test from 'tape'
let store

test('@leofcoin/storage', async (tape) => {
  tape.plan(19)
  store = new m('deep', 'storage_test')
  await store.init()
  tape.ok(store, 'can create store')

  store = new m('deep', 'storage_test/test/depth/very', false)
  await store.init()
  tape.ok(store, 'can create store outside homedir')

  await store.put('hello', new TextEncoder().encode('world'))
  tape.ok(await store.has('hello'), 'can put value')

  const value = await store.get('hello')
  tape.ok(Boolean('world' === new TextDecoder().decode(value)), 'can get value')

  const keys = await store.keys()
  tape.ok(keys.length > 0, 'can get keys')

  const values = await store.values()
  tape.ok(Object.keys(values).length > 0, 'can get values')

  tape.ok(store.name === 'deep', 'can get store name')

  tape.ok((await store.size()) > 0, 'can get store size')

  tape.ok((await store.length()) > 0, 'can get store length')

  const iterate = await store.iterate()
  tape.ok(Object.keys(iterate).length > 0, 'can iterate')

  await store.delete('has')
  tape.notOk(await store.has('has'), 'has undefined value')

  await store.put('has', new TextEncoder().encode(undefined))
  tape.notOk(await store.has('has'), 'has undefined value')

  await store.put('hasValue', new TextEncoder().encode(undefined))
  tape.notOk(await store.hasValue('hasValue'), 'has undefined value')

  await store.put('hasValue', new TextEncoder().encode(''))
  tape.notOk(await store.hasValue('hasValue'), 'hasValue returns false for empty value')

  await store.put('hasValue', new TextEncoder().encode(null))
  tape.ok(await store.hasValue('hasValue'), 'hasValue returns true for null')

  await store.put('hasValue', new TextEncoder().encode(false))
  tape.ok(await store.hasValue('hasValue'), 'hasValue returns true for false')

  await store.put('hasValue', new TextEncoder().encode('not empty'))
  tape.ok(await store.hasValue('hasValue'), 'hasValue returns true for non-empty value')

  tape.notOk(await store.has('nonexistentKey'), 'has returns false for nonexistent keys')
  tape.notOk(await store.hasValue('nonexistentKey'), 'hasValue returns false for nonexistent keys')
})
