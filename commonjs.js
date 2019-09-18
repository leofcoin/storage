'use strict';

var fs = require('fs');
var path$1 = require('path');
var os = require('os');

class LeofcoinStorage {
  
  constructor(path) {
    if (!path) path = path$1.join(os.homedir(), '.leofcoin');
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
    return await this._successOrFail(fs.read(path$1.join(this.path, path)));
  }
  
  async set(path, value) {
    if (value instanceof Object) value = JSON.stringify(value);      
    return await this._successOrFail(fs.write(path$1.join(this.path, path), value));
  }
  
  async delete() {
    try {
      await fs.unlink(path$1.join(this.path, path));
    } catch (e) {
      console.warn(e);
    }
    return;
  }
}

module.exports = LeofcoinStorage;
