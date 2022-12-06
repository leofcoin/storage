import { join } from 'path';
import { homedir, platform } from 'os';
import { readdirSync } from 'fs';
import { execSync } from 'child_process';
import { ClassicLevel } from 'classic-level';

const mkdirp = path => execSync(`mkdir "${platform() === 'win32' ? path.replace(/\//g, '\\') : path}"`);

const init = (root, home = true) => {
  let _root;
  if (home) _root = join(homedir(), root);
    if (readdirSync) try {
      readdirSync(_root);
    } catch (e) {
      mkdirp(_root);
    }

    return _root
};

class Store {
  constructor(name = 'storage', root, version = 'v1.0.0') {
    this.name = name;
    this.root = init(root);
    this.version = version;

    this.db = new ClassicLevel(join(this.root, this.name), { valueEncoding: 'view'});
  }

  toKeyPath(key) {
    return key ? key.toString('base32') : key
  }

  toKeyValue(value) {
    return value.uint8Array
  }

  async get(key) {
    return this.db.get(this.toKeyPath(key))
  }

  async put(key, value) {
    return this.db.put(this.toKeyPath(key), this.toKeyValue(value))
  }

  async delete(key) {
    return this.db.del(this.toKeyPath(key))
  }

  async clear() {
    return this.db.clear()
  }

  async values(limit = -1) {
    const values = [];
    for await (const value of this.db.values({limit})) {
      values.push(value);
    }
    return values
  }

  async keys(limit = -1) {
    const keys = [];
    for await (const key of this.db.keys({limit})) {
      keys.push(key);
    }
    return keys
  }

}

export { Store as default };
