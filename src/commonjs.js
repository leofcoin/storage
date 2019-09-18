import { read, write, unlink } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export default class LeofcoinStorage {
  constructor(path) {
    if (!path) path = join(homedir(), '.leofcoin')
    this.path = path;
  }
  
  async get(path, encoding = 'json') {
    return await read(join(this.path, path), encoding)
  }
  
  async set(path, value) {
    if (value instanceof Object) value = JSON.stringify(value);
    
    return await write(join(this.path, path), value);    
  }
  
  async delete() {
    return await unlink(join(this.path, path))
  }
};