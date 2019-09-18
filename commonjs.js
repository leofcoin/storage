'use strict';

var fs = require('fs');
var path$1 = require('path');
var os = require('os');
var util = require('util');

const read = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

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
    let data;
    if (encoding && encoding !== 'json')
      data = await this._successOrFail(read(path$1.join(this.path, path), encoding));
    else data = await this._successOrFail(read(path$1.join(this.path, path)));
    
    if (encoding === 'json' && data) data = JSON.parse(data);
    return;
  }
  
  async set(path, value) {
    if (value instanceof Object) value = JSON.stringify(value);      
    return await this._successOrFail(write(path$1.join(this.path, path), value));
  }
  
  async delete() {
    try {
      await unlink(path$1.join(this.path, path));
    } catch (e) {
      console.warn(e);
    }
    return;
  }
}

module.exports = LeofcoinStorage;
