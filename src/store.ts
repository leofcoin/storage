import { join } from 'path'
import { init } from './utils.js'
import KeyPath from './path.js'
import KeyValue from './value.js'
import { ClassicLevel } from 'classic-level'

export default class Store {
  db: ClassicLevel
  name: string
  root: string
  version: string

  async init(name, root, version, inworker, homedir) {
    this.name = name
    this.root = await init(root, homedir)
    this.version = version

    this.db = new ClassicLevel(join(this.root, this.name), { valueEncoding: 'view' })
  }

  toKeyPath(key) {
    if (!key.isKeyPath()) key = new KeyPath(key)
    return key.toString()
  }

  toKeyValue(value) {
    if (!value.isKeyValue()) value = new KeyValue(value)
    return value.uint8Array
  }

  toUint8Array(buffer) {
    return Buffer.isBuffer(buffer)
      ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT)
      : buffer
  }

  async has(key) {
    try {
      await this.get(key)
      return true
    } catch (error) {
      return false
    }
  }

  async get(key) {
    return this.toUint8Array(await this.db.get(this.toKeyPath(key)))
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
    for await (const value of this.db.values({ limit })) {
      values.push(this.toUint8Array(value))
    }
    return values
  }

  async keys(limit = -1) {
    const keys = []
    for await (const key of this.db.keys({ limit })) {
      keys.push(key)
    }
    return keys
  }

  async size() {
    let size = 0
    for await (const [key, value] of this.db.iterator()) {
      size += value?.length ?? 0
    }
    return size
  }

  /**
   *
   * @param {object} options {  limit, gt, lt, reverse }
   * @returns
   */
  iterate(options?) {
    return this.db.iterator(options)
  }
}
