import { openDB } from 'idb/with-async-ittr'
import KeyPath from './path.js'
import KeyValue from './value.js'

export default class BrowerStore {
  constructor(name = 'storage', root = '.leofcoin', version = 1) {
    this.version = version
    this.name = name
    this.root = root
    this.db = openDB(`${root}/${name}`, version, {
      upgrade(db) {
        db.createObjectStore(name);
      }
    })
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
    return (await this.db).get(this.name, this.toKeyPath(key))
  }

  async put(key, value) {
    return (await this.db).put(this.name, this.toKeyValue(value), this.toKeyPath(key))
  }

  async delete(key) {
    return (await this.db).delete(this.name, this.toKeyPath(key))
  }

  async clear() {
    return (await this.db).clear(this.name)
  }

  async values(limit = -1) {
    const values = []
    const tx = (await this.db).transaction(this.name);
    
    for await (const cursor of tx.store) {
      values.push(cursor.value)
      if (limit && values.length === limit) return values      
    }
    return values
  }

  async keys(limit = -1) {
    const keys = []
    const tx = (await this.db).transaction(this.name);

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