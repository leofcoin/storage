'use strict';

// const level = require('level');
const LevelStore = require('datastore-level');
const { homedir } = require('os');
const { join } = require('path');
const Key = require('interface-datastore').Key;
const {readdirSync, mkdirSync} = require('fs');

class LeofcoinStorage {

  constructor(path, root = '.leofcoin') {
    this.root = homedir();
    if (readdirSync) try {
      readdirSync(join(this.root, root));
    } catch (e) {
      if (e.code === 'ENOENT') mkdirSync(join(this.root, root));
      else throw e
    }
    this.db = new LevelStore(join(this.root, root, path));
    // this.db = level(path, { prefix: 'lfc-'})
  }
  
  async many(type, _value) {    
    const jobs = [];
    
    for (const key of Object.keys(_value)) {
      let value = _value[key];      
      if (typeof value === 'object' ||
          typeof value === 'boolean' ||
          !isNaN(value)) value = JSON.stringify(value);
          
      jobs.push(this[type](key, value));
    }
    
    return Promise.all(jobs)
  }
  
  async put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    if (typeof value === 'object' ||
        typeof value === 'boolean' ||
        !isNaN(value)) value = JSON.stringify(value);
    
    return this.db.put(new Key(key), value);    
  }
  
  async query() {
    const object = {};
    
    for await (let value of this.db.query({})) {
      const key = value.key.baseNamespace();
      value = value.value.toString();
      object[key] = this.possibleJSON(value);
    }
    
    return object
  }
  
  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    
    let data = await this.db.get(new Key(key));
    if (!data) return undefined
    data = data.toString();
        
    return this.possibleJSON(data)
  }
  
  async has(key) {
    if (typeof key === 'object') return this.many('has', key);
    
    try {
      await this.db.get(new Key(key));
      return true;
    } catch (e) {
      return false
    }
  }
  
  async delete(key) {
    return this.db.delete(new Key(key))
  }
  
  possibleJSON(string) {
    if (string.charAt(0) === '{' && string.charAt(string.length - 1) === '}' || 
        string.charAt(0) === '[' && string.charAt(string.length - 1) === ']' ||
        string === 'true' ||
        string === 'false' ||
        !isNaN(string)) 
        string = JSON.parse(string);
        
    return string;
  }

}

module.exports = LeofcoinStorage;
