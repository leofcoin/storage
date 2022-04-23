import { LevelDatastore } from 'datastore-level'
import { homedir } from 'os'
import { join } from 'path'
import { Key } from 'interface-datastore'
import {readdirSync, mkdirSync} from 'fs'

export default class LeofcoinStorage {

  constructor(path, root = '.leofcoin', home = true) {
    this.name = path
    if (!home) this.root = root
    else this.root = join(homedir(), root)

    let exists;
    if (readdirSync) try {
      readdirSync(this.root)
    } catch (e) {
      let _path = home ? homedir() : root
      let parts = root.split('/')
      if (parts.length === 0) parts = root.split(`\\`)
      if (e.code === 'ENOENT') {
        _path = ''
        if (parts.length > 0) {
          for (const path of parts) {
            _path = join(_path, path)
            console.log(_path);
            try {
              readdirSync(_path)
            } catch (e) {
              if (e.code === 'ENOENT') mkdirSync(_path)
              else throw e
            }
          }
        } else {
          mkdirSync(this.root)
        }
      } else throw e
    }
    this.db = new LevelDatastore(join(this.root, path));
    this.db.open()
  }

  toUint8Array(value) {
    if (value instanceof Uint8Array) return value
    if (value instanceof Object) value = JSON.stringify(value)
    return new TextEncoder().encode(value)
  }

  fromUint8Array(value) {
    value = new TextDecoder().decode(value)
    if (value === 'true') return true
    if (value === 'false') return false
    if (!isNaN(value)) return Number(value)
    if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}' ||
        value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') try {
          value = JSON.parse(value)
        } catch {

        }

    return value
  }

  async many(type, _value) {
    const jobs = [];

    for (const key of Object.keys(_value)) {
      const value = this.toUint8Array(_value[key])

      jobs.push(this[type](key, value))
    }

    return Promise.all(jobs)
  }

  async put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    value = this.toUint8Array(value)

    return this.db.put(new Key(String(key)), value);
  }

  async query() {
    const object = {}

    for await (let query of this.db.query({})) {
      // TODO: nested keys?
      object[new TextDecoder().decode(Object.values(query.key)[0])] = new TextDecoder().decode(query.value)
    }
    return object
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    let data = await this.db.get(new Key(String(key)))
    if (!data) return undefined
    return this.fromUint8Array(data)
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      await this.db.get(new Key(String(key)))
      return true;
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new Key(String(key)))
  }

  async keys() {
    let array = []

    for await (let query of this.db.queryKeys({})) {
      // TODO: nested keys?
      array = [...array, ...Object.values(query).map(value => new TextDecoder().decode(value))]
    }
    return array
  }

  async size() {
    const object = await this.query()
    return Object.keys(object).length
  }

}
