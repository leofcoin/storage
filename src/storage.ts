import type BrowerStore from './browser-store.js'
import Path from './path.js'
import type Store from './store.js'
import { isBrowser } from './utils.js'
import KeyValue from './value.js'

export declare type DefaultOptions = {
  inWorker: boolean
  version: number
  homedir: boolean
}

const defaultOptions: DefaultOptions = {
  inWorker: false,
  version: 1,
  homedir: true
}
export default class LeofcoinStorage {
  name: string
  root: string
  version: number
  inWorker: boolean
  homedir: boolean
  db: Store | BrowerStore

  constructor(name = 'storage', root = '.leofcoin', options = {}) {
    const { version, inWorker, homedir } = { ...defaultOptions, ...options }
    this.name = name
    this.root = root
    this.version = version || 1
    this.inWorker = inWorker
    this.homedir = homedir
  }

  async init() {
    const importee = await import(isBrowser ? './browser-store.js' : './store.js')
    this.db = new importee.default()
    await this.db.init(this.name, this.root, this.version, this.inWorker, this.homedir)
  }

  async get(key: Path | string | Uint8Array) {
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
      const has = await this.db.has(new Path(key))

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

    switch (type) {
      case 'has':
      case 'get':
      case 'delete':
        for (const key of _value) {
          jobs.push(this[type](key, _value[key]))
        }
        break

      default:
        for (const key of Object.keys(_value)) {
          jobs.push(this[type](key, _value[key]))
        }
        break
    }

    return Promise.all(jobs)
  }

  async length() {
    const keys = await this.keys()
    return keys.length
  }

  size() {
    return this.db.size()
  }

  async clear() {
    return this.db.clear()
  }

  async iterate() {
    return this.db.iterate()
  }
}
export { LeofcoinStorage as Storage }
