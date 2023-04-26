import { join } from 'path';
import { homedir } from 'os';
import { readdirSync } from 'fs';
import { mkdirp } from 'mkdirp';
import KeyPath from './path.js';
import KeyValue from './value.js';
import { ClassicLevel } from 'classic-level';

const init = (root, home = true) => {
  let _root = root;
  if (home) _root = join(homedir(), root);
  if (readdirSync) try {
    readdirSync(_root);
  } catch (e) {
    mkdirp(_root);
  }

  return _root
};

class Store {
    db;
    name;
    root;
    version;
    constructor(name = 'storage', root, version = 'v1.0.0') {
        this.name = name;
        this.root = init(root);
        this.version = version;
        this.db = new ClassicLevel(join(this.root, this.name), { valueEncoding: 'view' });
    }
    toKeyPath(key) {
        if (!key.isKeyPath())
            key = new KeyPath(key);
        return key.toString();
    }
    toKeyValue(value) {
        if (!value.isKeyValue())
            value = new KeyValue(value);
        return value.uint8Array;
    }
    toUint8Array(buffer) {
        return Buffer.isBuffer(buffer) ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT) : buffer;
    }
    async get(key) {
        return this.toUint8Array(await this.db.get(this.toKeyPath(key)));
    }
    async put(key, value) {
        return this.db.put(this.toKeyPath(key), this.toKeyValue(value));
    }
    async delete(key) {
        return this.db.del(this.toKeyPath(key));
    }
    async clear() {
        return this.db.clear();
    }
    async values(limit = -1) {
        const values = [];
        for await (const value of this.db.values({ limit })) {
            values.push(this.toUint8Array(value));
        }
        return values;
    }
    async keys(limit = -1) {
        const keys = [];
        for await (const key of this.db.keys({ limit })) {
            keys.push(key);
        }
        return keys;
    }
    /**
     *
     * @param {object} options {  limit, gt, lt, reverse }
     * @returns
     */
    iterate(options) {
        return this.db.iterator(options);
    }
}

export { Store as default };
