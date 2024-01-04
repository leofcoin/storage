import { IDBPDatabase, openDB } from 'idb'
import KeyPath from './path.js'
import KeyValue from './value.js'

export declare type KeyInput = string | Uint8Array | KeyPath
export declare type ValueInput = string | Uint8Array | KeyValue

export default class BrowerStore {
  db: Promise<IDBPDatabase<unknown>>
  name: string
  root: string
  version: string

  init(name = 'storage', root = '.leofcoin', version = '1') {
    this.version = version
    this.name = name
    this.root = root
    this.db = openDB(`${root}/${name}`, Number(version), {
      upgrade(db) {
        db.createObjectStore(name)
      }
    })
  }

  toKeyPath(key: KeyInput) {
    if (key! instanceof KeyPath) key = new KeyPath(key)
    return key.toString()
  }

  toKeyValue(value: ValueInput) {
    if (value! instanceof KeyValue) value = new KeyValue(value)
    // @ts-ignore
    return value.uint8Array
  }

  async get(key: KeyInput) {
    return (await this.db).get(this.name, this.toKeyPath(key))
  }

  async put(key: KeyInput, value: ValueInput) {
    return (await this.db).put(this.name, this.toKeyValue(value), this.toKeyPath(key))
  }

  async delete(key: KeyInput) {
    return (await this.db).delete(this.name, this.toKeyPath(key))
  }

  async clear() {
    return (await this.db).clear(this.name)
  }

  async values(limit = -1) {
    const values = []
    const tx = (await this.db).transaction(this.name)

    for await (const cursor of tx.store) {
      values.push(cursor.value)
      if (limit && values.length === limit) return values
    }
    return values
  }

  async keys(limit = -1) {
    const keys = []
    const tx = (await this.db).transaction(this.name)

    for await (const cursor of tx.store) {
      keys.push(cursor.key)
      if (limit && keys.length === limit) return keys
    }
    return keys
  }

  async iterate() {
    return (await this.db).transaction(this.name).store
  }
}
