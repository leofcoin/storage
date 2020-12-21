'use strict';

// const level = require('level');
const LevelStore = require('datastore-level');
const { homedir } = require('os');
const { join } = require('path');
const Key = require('interface-datastore').Key;
const {readdirSync, mkdirSync} = require('fs');

class LeofcoinStorage {

  constructor(path, root = '.leofcoin', home = true) {
    if (!home) this.root = root;
    else this.root = join(homedir(), root);
    if (readdirSync) try {
      readdirSync(this.root);
    } catch (e) {
      let _path = home ? homedir() : root;
      const parts = root.split('/');
      if (e.code === 'ENOENT') {

        if (parts.length > 0) {
          for (const path of parts) {
            _path = join(_path, path);
            try {
              readdirSync(_path);
            } catch (e) {
              if (e.code === 'ENOENT') mkdirSync(_path);
              else throw e
            }
          }
        } else {
          mkdirSync(this.root);
        }
      } else throw e
    }
    this.db = new LevelStore(join(this.root, path));
    // this.db = level(path, { prefix: 'lfc-'})
  }

  toBuffer(value) {
    if (Buffer.isBuffer(value)) return value;
    if (typeof value === 'object' ||
        typeof value === 'boolean' ||
        !isNaN(value)) value = JSON.stringify(value);

    return Buffer.from(value)
  }

  async many(type, _value) {
    const jobs = [];

    for (const key of Object.keys(_value)) {
      const value = this.toBuffer(_value[key]);

      jobs.push(this[type](key, value));
    }

    return Promise.all(jobs)
  }

  async put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    value = this.toBuffer(value);

    return this.db.put(new Key(String(key)), value);
  }

  async query() {
    const object = {};

    for await (let query of this.db.query({})) {
      const key = query.key.baseNamespace();
      object[key] = this.possibleJSON(query.value);
    }

    return object
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    let data = await this.db.get(new Key(String(key)));
    if (!data) return undefined
    return this.possibleJSON(data)
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      await this.db.get(new Key(String(key)));
      return true;
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new Key(String(key)))
  }

  async size() {
    const object = await this.query();
    return Object.keys(object).length
  }

  // TODO: deprecate usage possibleJSON
  // make possibleJSON optional
  // or release as its own package
  possibleJSON(data) {
    let string = data.toString();
    if (string.charAt(0) === '{' && string.charAt(string.length - 1) === '}' ||
        string.charAt(0) === '[' && string.charAt(string.length - 1) === ']' ||
        string === 'true' ||
        string === 'false' ||
        !isNaN(string))
        return JSON.parse(string);

    return data
  }

}

module.exports = LeofcoinStorage;
