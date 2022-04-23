'use strict';

var datastoreLevel = require('datastore-level');
var os = require('os');
var path = require('path');
var interfaceDatastore = require('interface-datastore');
var fs = require('fs');

class LeofcoinStorage {

  constructor(path$1, root = '.leofcoin', home = true) {
    this.name = path$1;
    if (!home) this.root = root;
    else this.root = path.join(os.homedir(), root);
    if (fs.readdirSync) try {
      fs.readdirSync(this.root);
    } catch (e) {
      let _path = home ? os.homedir() : root;
      let parts = root.split('/');
      if (parts.length === 0) parts = root.split(`\\`);
      if (e.code === 'ENOENT') {
        _path = '';
        if (parts.length > 0) {
          for (const path$1 of parts) {
            _path = path.join(_path, path$1);
            console.log(_path);
            try {
              fs.readdirSync(_path);
            } catch (e) {
              if (e.code === 'ENOENT') fs.mkdirSync(_path);
              else throw e
            }
          }
        } else {
          fs.mkdirSync(this.root);
        }
      } else throw e
    }
    this.db = new datastoreLevel.LevelDatastore(path.join(this.root, path$1));
    this.db.open();
  }

  toUint8Array(value) {
    if (value instanceof Uint8Array) return value
    if (value instanceof Object) value = JSON.stringify(value);
    return new TextEncoder().encode(value)
  }

  fromUint8Array(value) {
    value = new TextDecoder().decode(value);
    if (value === 'true') return true
    if (value === 'false') return false
    if (!isNaN(value)) return Number(value)
    if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}' ||
        value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') try {
          value = JSON.parse(value);
        } catch {

        }

    return value
  }

  async many(type, _value) {
    const jobs = [];

    for (const key of Object.keys(_value)) {
      const value = this.toUint8Array(_value[key]);

      jobs.push(this[type](key, value));
    }

    return Promise.all(jobs)
  }

  async put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    value = this.toUint8Array(value);

    return this.db.put(new interfaceDatastore.Key(String(key)), value);
  }

  async query() {
    const object = {};

    for await (let query of this.db.query({})) {
      // TODO: nested keys?
      object[new TextDecoder().decode(Object.values(query.key)[0])] = new TextDecoder().decode(query.value);
    }
    return object
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    let data = await this.db.get(new interfaceDatastore.Key(String(key)));
    if (!data) return undefined
    return this.fromUint8Array(data)
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      await this.db.get(new interfaceDatastore.Key(String(key)));
      return true;
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new interfaceDatastore.Key(String(key)))
  }

  async keys() {
    let array = [];

    for await (let query of this.db.queryKeys({})) {
      // TODO: nested keys?
      array = [...array, ...Object.values(query).map(value => new TextDecoder().decode(value))];
    }
    return array
  }

  async size() {
    const object = await this.query();
    return Object.keys(object).length
  }

}

module.exports = LeofcoinStorage;
