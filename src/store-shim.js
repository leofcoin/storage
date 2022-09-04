import { openDB } from 'idb';

export default class Store {
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
    return key.toString('base32')
  }
  
  toKeyValue(value) {
    return value.uint8Array
  }

  async get(key) {
    return (await (await this.db).get(this.name, this.toKeyPath(key))).toString()
  }

  async put(key, value) {
    return (await this.db).put(this.name, this.toKeyValue(value), this.toKeyPath(key))
  }

  async del(key) {
    return (await this.db).delete(this.name, this.toKeyPath(key))
  }

  async clear() {
    return (await this.db).clear(this.name)
  }

  async keys() {
    return (await this.db).getAllKeys(this.name)
  }


}