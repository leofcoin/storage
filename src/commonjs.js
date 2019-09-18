import { read, write, unlink } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export default class LeofcoinStorage {
  
  constructor(path) {
    if (!path) path = join(homedir(), '.leofcoin')
    this.path = path;
  }
  
  async _successOrFail(fn) {
    let result;
    try {
      result = await fn;
    } catch (e) {
      result = undefined;
    }
    return result;
  }
  
  async get(path, encoding = 'json') {
    return await _successOrFail(read(join(this.path, path), encoding));
  }
  
  async set(path, value) {
    if (value instanceof Object) value = JSON.stringify(value);      
    return await _successOrFail(write(join(this.path, path), value););
  }
  
  async delete() {
    try {
      await unlink(join(this.path, path))
    } catch (e) {
      console.warn(e);
    }
    return;
  }
};