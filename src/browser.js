import * as idb from './../node_modules/idb-keyval/dist/idb-keyval.mjs';
const { Store, set, get, del, keys } = idb;

export default class LeofcoinStorage {
  
  constructor(name) {
    this.name = name;
    this._init(name)
  }
  async _init(name) {
    this.store = await new Store(`lfc-storage`, name);
    return
  }
  
  async get(child) {
    let data;
    if (child) data = await get(child, this.store);
    else {
      data = {};
      const promises = []
      const dataKeys = await keys(this.store);
      if (dataKeys && dataKeys.length > 0) for (const key of dataKeys) {
        promises.push(( async () => {
          const value = await get(key, this.store)
          return {value, key}
        })())
      }
      const _data = await Promise.all(promises)
      _data.forEach(({key, value}) => data[key] = value)
    }
    return data;
  }
  
  async set(child, value) {
    if (value === undefined) {
      value = child
      child = undefined
    } 
    if (child) {
     return await set(child, value, this.store);
   }
   const promises = [];
   
   for (const key of Object.keys(value)) {
     promises.push((async () => await set(key, value[key], this.store))())
   }
   return Promise.all(promises);
  }
  
  async delete(key) {
    return await del(key, this.store)
  }
} 