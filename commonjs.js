'use strict';

// const level = require('level');
const LevelStore = require('datastore-level');
const { homedir } = require('os');
const { join } = require('path');
class LeofcoinStorage {

  constructor(path) {
    this.root = homedir();
    this.db = new LevelStore(join(this.root, '.leofcoin', path));
    // this.db = level(path, { prefix: 'lfc-'})
  }
  
  async many(type, _value) {
    if (Array.isArray(_value)) return this._many(_value.map((item, i) => {
      let value;
      if (typeof item === 'object') value = JSON.stringify(item);
      else value = item;
      
      return { 
        value,
        type,
        key: i
      };
    }));
    
    const jobs = [];
    
    for (const key of Object.keys(_value)) {
      let value;
      if (typeof _value[key] === 'object') value = JSON.stringify(_value[key]);
      else value = _value[key];
      
      jobs.push({ type, key, value});
    }
    
    return this._many(jobs)
  }
  
  async _many(jobs) {
    return this.db.batch(jobs)
  }
  
  async put(key, value) {
    if (!value) return this.many('put', key);
    if (typeof value === 'object') value = JSON.stringify(value);
    
    return this.db.put(key, value);    
  }
  
  async get(key) {
    if (typeof key === 'object') return this.many('get', key);
    
    let data = await this.db.get(key);
    data = data.toString();
    if (data.charAt(0) === '{' && data.charAt(data.length - 1) === '}' || 
        data.charAt(0) === '[' && data.charAt(data.length - 1) === ']') 
        data = JSON.parse(data);
        
    return data
  }

}

module.exports = LeofcoinStorage;
