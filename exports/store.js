import { join } from 'path';
import { homedir, platform } from 'os';
import { readdirSync } from 'fs';
import { execSync } from 'child_process';
import KeyValue from './value.js';
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
  
  isKeyPath() {
    return true
  }

  /**
   * Convert to the string representation
   *
   * @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
   * @returns {string}
   */
  toString(encoding = 'hex') {
    return decode(this.uint8Array)
  }

  /**
   * Returns the `list` representation of this path.
   *
   * @returns string[]
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

class Store {
  constructor(name = 'storage', root, version = 'v1.0.0') {
    this.name = name;
    this.root = init(root);
    this.version = version;

    this.db = new ClassicLevel(join(this.root, this.name), { valueEncoding: 'view'});
  }

  toKeyPath(key) {
    if (!key.isKeyPath()) key = new KeyPath(key);
    return key.toString('base32')
  }
  
  toKeyValue(value) {
    if (!value.isKeyValue()) value = new KeyValue(value);
    return value.uint8Array
  }

  toUint8Array(buffer) {
    return Buffer.isBuffer(buffer) ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT) : buffer
  }

  async get(key) {
    return this.toUint8Array(await this.db.get(this.toKeyPath(key))) 
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
      values.push(this.toUint8Array(value));
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

    /**
     * 
     * @param {object} options {  limit, gt, lt, reverse }
     * @returns 
     */
  iterate(options) {
    return this.db.iterator(options)
  }

}

export { Store as default };
