import type BrowerStore from './browser-store.js'
import Path from './path.js'
import type Store from './store.js'
import KeyValue from './value.js'

const isBrowser = globalThis.navigator ? true : false

export default class LeofcoinStorage {
  name: string
  root: string
  version: number
  db: Store | BrowerStore

  constructor(name = 'storage', root = '.leofcoin', version = 1) {
    this.name = name
    this.root = root
    this.version = 1
  }

  async init() {
    const importee = await import(isBrowser ? './browser-store.js' : './store.js')
    this.db = new importee.default()
    await this.db.init(this.name, this.root, this.version)
  }

  async get(key) {
    if (typeof key === 'object') return this.many('get', key)
    return this.db.get(new Path(key))
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   * @returns Promise
   */
  put(key, value) {
    if (typeof key === 'object') return this.many('put', key)
    return this.db.put(new Path(key), new KeyValue(value))
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key)

    try {
      const has = await this.db.get(new Path(key))

      return Boolean(has)
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new Path(key))
  }

  keys(limit = -1) {
    return this.db.keys(limit)
  }

  async values(limit = -1) {
    return this.db.values(limit)
  }

  async many(type, _value) {
    const jobs = []

    for (const key of Object.keys(_value)) {
      jobs.push(this[type](key, _value[key]))
    }

    return Promise.all(jobs)
  }

  async length() {
    const keys = await this.keys()
    return keys.length
  }

  async size() {
    let size = 0
    const query = await this.db.iterate()
    for await (const item of query) {
      // @ts-ignore
      size += item.value ? item.value.length : item[1].length
    }
    return size
  }

  async clear() {
    return this.db.clear()
  }

  async iterate() {
    return this.db.iterate()
  }
}
export { LeofcoinStorage as Storage }
