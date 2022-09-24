import { join } from 'path'
import { init } from './utils'
import {LevelBrowser} from 'level-browser'

export default class Store {
  constructor(name = 'storage', root, version = 'v1.0.0') {
    this.name = name
    this.root = init(root)
    this.version = version

    this.db = new LevelBrowser(join(this.root, this.name), { valueEncoding: 'view'})
  }

  toKeyPath(key) {
    return key ? key.toString('base32') : key
  }

  toKeyValue(value) {
    return value.uint8Array
  }

  async get(key) {
    return this.db.get(this.toKeyPath(key))
  }

  async put(key, value) {
    return this.db.put(this.toKeyPath(key), this.toKeyValue(value))
  }

  async delete(key) {
    return this.db.del(this.toKeyPath(key))
  }

  async clear() {
    return this.db.clear()
  }

  async values(limit = -1) {
    const values = []
    for await (const value of this.db.values({limit})) {
      values.push(value)
    }
    return values
  }

  async keys(limit = -1) {
    const keys = []
    for await (const key of this.db.keys({limit})) {
      keys.push(key)
    }
    return keys
  }

}