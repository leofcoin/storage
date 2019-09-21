// const level = require('level');
const LevelStore = require('datastore-level')
const { homedir } = require('os')
const { join } = require('path')
const Key = require('interface-datastore').Key

export default class LeofcoinStorage {

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
        key: new Key(i)
      };
    }));
    
    const jobs = [];
    
    for (const key of Object.keys(_value)) {
      let value;
      if (typeof _value[key] === 'object') value = JSON.stringify(_value[key]);
      else value = _value[key];
      
      jobs.push({ type, key: new Key(key), value})
    }
    
    return this._many(jobs)
  }
  
  async _many(jobs) {
    return this.db.batch(jobs)
  }
  
  async put(key, value) {
    if (!value) return this.many('put', key);
    if (typeof value === 'object') value = JSON.stringify(value);
    
    return this.db.put(new Key(key), value);    
  }
  
  async query() {
    const object = {}
    
    for await (let value of this.db.query({})) {
      const key = value.key.baseNamespace()
      value = value.value.toString()
      object[key] = this.possibleJSON(value);
    }
    
    return object
  }
  
  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    
    let data = await this.db.get(new Key(key))
    if (!data) return undefined
    data = data.toString();
        
    return this.possibleJSON(data)
  }
  
  async delete(key) {
    return this.db.delete(new Key(key))
  }
  
  possibleJSON(string) {
    if (string.charAt(0) === '{' && string.charAt(string.length - 1) === '}' || 
        string.charAt(0) === '[' && string.charAt(string.length - 1) === ']') 
        string = JSON.parse(string);
        
    return string;
  }

}