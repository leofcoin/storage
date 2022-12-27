import { join } from 'path'
import { init } from './utils.js'
import KeyPath from './path.js'
import KeyValue from './value.js'
import { ClassicLevel } from 'classic-level'

export default class Store {
  constructor(name = 'storage', root, version = 'v1.0.0') {
    this.name = name
    this.root = init(root)
    this.version = version

    this.db = new ClassicLevel(join(this.root, this.name), { valueEncoding: 'view'})
  }

  toKeyPath(key) {
    if (!key.isKeyPath()) key = new KeyPath(key)
    return key.toString('base32')
  }
  
  toKeyValue(value) {
    if (!value.isKeyValue()) value = new KeyValue(value)
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

    /**
     * 
     * @param {object} options {  limit, gt, lt, reverse }
     * @returns 
     */
  iterate(options) {
    return this.db.iterator(options)
  }

}