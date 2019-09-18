'use strict';

var fs = require('fs');
var path$1 = require('path');
var os = require('os');

class LeofcoinStorage {
  constructor(path) {
    if (!path) path = path$1.join(os.homedir(), '.leofcoin');
    this.path = path;
  }
  
  async get(path, encoding = 'json') {
    return await fs.read(path$1.join(this.path, path), encoding)
  }
  
  async set(path, value) {
    if (value instanceof Object) value = JSON.stringify(value);
    
    return await fs.write(path$1.join(this.path, path), value);    
  }
  
  async delete() {
    return await fs.unlink(path$1.join(this.path, path))
  }
}

module.exports = LeofcoinStorage;
