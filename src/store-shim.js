import { openDB } from 'idb';

export default class Store {
  constructor(name = 'storage', root = '.leofcoin', version = 1) {
    this.version = version
    this.name = name
    this.root = root
    this.db = openDB(root, version, {
      upgrade(db) {
        db.createObjectStore(name);
      }
    })
  }

  async get(key) {
    return (await this.db).get(this.name, key.toString('base32'));
  }

  async put(key, value) {
    return (await this.db).put(this.name, value, key.toString('base32'));
  }

  async del(key) {
    return (await this.db).delete(this.name, key.toString('base32'));
  }

  async clear() {
    return (await this.db).clear(this.name);
  }

  async keys() {
    return (await this.db).getAllKeys(this.name);
  }


}