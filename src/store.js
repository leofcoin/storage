import { join } from 'path'
import { readFile, writeFile, readdir as _readdir, unlink as _unlink } from 'fs'
import { promisify } from 'util'
import KeyPath from './path'
import { init } from './utils'
const read = promisify(readFile)
const write = promisify(writeFile)
const readdir = promisify(_readdir)
const unlink = promisify(_unlink)

export default class Store {
  constructor(name = 'storage', root, version = 'v1.0.0') {
    this.name = name
    this.root = init(root)
    this.version = version
  }

  toKeyPath(key) {
    return join(this.root, this.name, key.toString('base32'))
  }

  toKeyValue(value) {
    return value.toString('base32')
  }

  async get(key) {
    return read(this.toKeyPath(key))
  }

  async put(key, value) {
    return write(this.toKeyPath(key), this.toKeyValue(value))
  }

  async delete(key) {
    return unlink(this.toKeyPath(key))
  }

  async clear() {
    const keys = await this.keys()
    return Promise.all(keys.map(key => unlink(this.toKeyPath(key))))
  }

  async keys() {
    const keys = await readdir(this.toKeyPath(''))
    return keys.map(key => new KeyPath(key))
  }

}