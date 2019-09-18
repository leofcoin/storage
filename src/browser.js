import * as idb from './../node_modules/idb-keyval/dist/idb-keyval.mjs';
const { Store, set, get, del } = idb;

export default class LeofcoinStorage { 
  async _init(key) {
    this.store = await new Store(`lfc-${key}`, key);
  }
  
  async get(key) {
    await this._init(key)
    return await get(this.store)
  }
  
  async set(key, value) {    
    await this._init(key)
    return await set(value, this.store)
  }
  
  async delete(key) {
    return await del(key, this.store)
  }
} 