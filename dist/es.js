import { join } from 'path';
import { homedir } from 'os';
import { readdirSync } from 'fs';
import { execSync } from 'child_process';
import { LevelBrowser } from 'level-browser';

// import base32 from '@vandeurenglenn/base32'
// import base58 from '@vandeurenglenn/base58'

// export const encodings = {
//   base58,
//   base32
// }

const encode = (string, encoding = 'utf-8') => {
  if (typeof string === 'string') {
    let encoded;
    
    // if (encodings[encoding]) encoded = encodings[encoding].encode(encoded)    
    encoded = new TextEncoder().encode(string);
    return encoded
  }
  throw Error(`expected typeof String instead got ${string}`)
};

const decode = (uint8Array, encoding) => {
  if (uint8Array instanceof Uint8Array) {
    let decoded;
    // if (encodings[encoding]) decoded = encodings[encoding].decode(decoded)
    decoded = new TextDecoder().decode(uint8Array);
    
    return decoded
  }
  throw Error(`expected typeof uint8Array instead got ${uint8Array}`)
};

const pathSepS = '/';
class KeyPath {

  /**
   * @param {string | Uint8Array} input
   */
  constructor(input) {
    if (typeof input === 'string') {
      this.uint8Array = encode(input);
    } else if (input instanceof Uint8Array) {
      this.uint8Array = input;
    } else if (input instanceof KeyPath) {
      this.uint8Array = input.uint8Array;
    } else {
      throw new Error('Invalid keyPath, should be a String, Uint8Array or KeyPath')
    }
  }

  /**
   * Convert to the string representation
   *
   * @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
   * @returns {string}
   */
  toString (encoding = 'hex') {
    return decode(this.uint8Array)
  }

  /**
   * Returns the `list` representation of this path.
   *
   * @returns {Array<string>}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').list()
   * // => ['Comedy', 'MontyPythong', 'Actor:JohnCleese']
   * ```
   */
  list() {
    return this.toString().split(pathSepS).slice(1)
  }

}

class KeyValue {

  /**
   * @param {string | Uint8Array} input
   */
  constructor(input) {
    if (typeof input === 'string') {
      this.uint8Array = encode(input);
    } else if (input instanceof Uint8Array) {
      this.uint8Array = input;
    } else if (input instanceof KeyValue) {
      this.uint8Array = input.uint8Array;
    } else {
      throw new Error('Invalid KeyValue, should be a String, Uint8Array or KeyValue')
    }
  }

  /**
   * Convert to the string representation
   *
   * @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
   * @returns {string}
   */
  toString(encoding = 'utf8') {
    return decode(this.uint8Array)
  }

}

const mkdirp = path => execSync(`mkdir "${path.replace(/\//g, '\\')}"`);

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

    this.db = new LevelBrowser(join(this.root, this.name), { valueEncoding: 'view'});
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

class LeofcoinStorage {

  constructor(name = 'storage', root = '.leofcoin') {
    this.name = name;
    this.db = new Store(name, root);
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    return this.db.get(new KeyPath(key))
  }
  
  /**
   * 
   * @param {*} key 
   * @param {*} value 
   * @returns Promise
   */
  put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    return this.db.put(new KeyPath(key), new KeyValue(value));
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      const has = await this.db.get(new KeyPath(key));

      return Boolean(has);
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new KeyPath(key))
  }

  keys(limit = -1) {
    return this.db.keys({limit})
  }

  async #queryJob(key) {
    const value = await this.db.get(key);
    return { key, value }
  }

  async query() {
    const keys = await this.keys();
    let promises = [];
    for (const key of keys) {
      promises.push(this.#queryJob(key));
    }
    return Promise.all(promises)
  }

  async values(limit = -1) {
    return this.db.values({limit})
  }

  async many(type, _value) {
    const jobs = [];

    for (const key of Object.keys(_value)) {
      jobs.push(this[type](key, _value[key]));
    }

    return Promise.all(jobs)
  }

  async length() {
    const keys = await this.keys();
    return keys.length
  }

  async size() {
    let size = 0;
    const query = await this.query();
    for (const item of query) {
      size += item.value.length;
    }
    return size
  }

  async clear() {
    return this.db.clear()
  }

}

export { LeofcoinStorage as default };
