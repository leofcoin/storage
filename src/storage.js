import Path from './path'
import KeyValue from './value'
import Store from '@store:import'

export default class LeofcoinStorage {

  constructor(name = 'storage', root = '.leofcoin') {
    this.name = name
    this.db = new Store(name, root);
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    return this.db.get(new Path(key))
  }
  
  /**
   * 
   * @param {*} key 
   * @param {*} value 
   * @returns Promise
   */
  put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    return this.db.put(new Path(key), new KeyValue(value));
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      const has = await this.db.get(new Path(key))

      return Boolean(has);
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new Path(key))
  }

  keys() {
    return this.db.keys()
  }

  async #queryJob(key) {
    const value = await this.db.get(key)
    return { key, value }
  }

  async query() {
    const keys = await this.keys()

    let promises = []
    for (const key of keys) {
      promises.push(this.#queryJob(key))
    }
    return Promise.all(promises)
  }

  async values() {
    const keys = await this.keys()

    let promises = []
    for (const key of keys) {
      promises.push(this.db.get(key))
    }
    return Promise.all(promises)
  }

  async many(type, _value) {
    const jobs = [];

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
    const query = await this.query()
    for (const item of query) {
      size += item.value.length
    }
    return size
  }

  async clear() {
    return this.db.clear()
  }

}
