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

  async many(type, _value) {
    const jobs = [];

    for (const key of Object.keys(_value)) {
      jobs.push(this[type](key, _value[key]));
    }

    return Promise.all(jobs)
  }

  async put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    return this.db.put(new interfaceDatastore.Key(key), value);
  }

  async query() {
    const object = {};
    for await (const item of this.db.query({})) {
      object[item.key] = item.value;
    }
    return object
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    return this.db.get(new interfaceDatastore.Key(key))
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      await this.db.get(new interfaceDatastore.Key(key));
      return true;
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new interfaceDatastore.Key(key))
  }

  async keys(asUint8Array = false) {
    const array = [];
    for await (const item of this.db.queryKeys({})) {
      array.push(asUint8Array ? item.uint8Array() : item.toString());
    }
    return array
  }

  async length() {
    const keys = await this.keys();
    return keys.length
  }

  async size() {
    let size = 0;
    for await (const item of this.db.query({})) {
      size += item.value.length;
    }
    return size
  }

}

module.exports = LeofcoinStorage;
