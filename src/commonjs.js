import { readFile, writeFile, unlink as _unlink} from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { promisify } from 'util';

const read = promisify(readFile)
const write = promisify(writeFile)
const unlink = promisify(_unlink)

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
    let data;
    if (encoding && encoding !== 'json')
      data = await this._successOrFail(read(join(this.path, path), encoding));
    else data = await this._successOrFail(read(join(this.path, path)));
    
    if (encoding === 'json' && data) data = JSON.parse(data)
    return;
  }
  
  async set(path, value) {
    if (value instanceof Object) value = JSON.stringify(value);      
    return await this._successOrFail(write(join(this.path, path), value));
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