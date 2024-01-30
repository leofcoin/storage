import KeyPath from './path.js'
import KeyValue from './value.js'
import '@vandeurenglenn/debug'
export declare type KeyInput = string | Uint8Array | KeyPath
export declare type ValueInput = string | Uint8Array | KeyValue

const debug = globalThis.createDebugger('leofcoin/storage')

const opfsRoot = await navigator.storage.getDirectory()

export default class BrowerStore {
  db: FileSystemDirectoryHandle
  name: string
  root: typeof opfsRoot
  version: string

  async init(name = 'storage', root = '.leofcoin', version = '1') {
    console.log('init')

    this.version = version
    this.name = name
    this.root = opfsRoot
    console.log(`${this.root}/${this.name}`)
    let directoryHandle
    try {
      directoryHandle = await opfsRoot.getDirectoryHandle(this.name, {
        create: true
      })
    } catch (error) {
      console.error(error)
    }

    this.db = directoryHandle
  }

  toKeyPath(key: KeyInput) {
    if (key! instanceof KeyPath) key = new KeyPath(key)
    return key.toString()
  }

  toKeyValue(value: ValueInput) {
    if (value! instanceof KeyValue) value = new KeyValue(value)
    // @ts-ignore
    return value.uint8Array
  }

  async has(key: KeyInput) {
    debug(`has ${this.toKeyPath(key)}`)
    try {
      await this.db.getFileHandle(this.toKeyPath(key))
      return true
    } catch (error) {
      return false
    }
  }

  async get(key: KeyInput) {
    debug(`get ${this.toKeyPath(key)}`)
    const handle = await this.db.getFileHandle(this.toKeyPath(key))
    const file = await handle.getFile()
    return new Uint8Array(await file.arrayBuffer())
  }

  async put(key: KeyInput, value: ValueInput) {
    debug(`put ${this.toKeyPath(key)}`)
    const handle = await this.db.getFileHandle(this.toKeyPath(key), { create: true })
    const writeable = handle.createWritable()
    ;(await writeable).write(this.toKeyValue(value))
    ;(await writeable).close()
  }

  async delete(key: KeyInput) {
    debug(`delete ${this.toKeyPath(key)}`)
    return this.db.removeEntry(this.toKeyPath(key))
  }

  async clear() {
    debug(`clear ${this.toKeyPath(key)}`)
    for await (const key of this.db.keys()) {
      await this.db.removeEntry(key)
    }
  }

  async values(limit = -1) {
    debug(`values ${limit}`)
    let values = []

    for await (const cursor of this.db.values()) {
      values.push(cursor.getFile)
      if (limit && values.length === limit) return values
    }

    values = await Promise.all(values)
    return Promise.all(values.map((file) => file.arrayBuffer))
  }

  async keys(limit = -1) {
    debug(`keys ${limit}`)
    const keys = []

    for await (const cursor of this.db.keys()) {
      keys.push(cursor)
      if (limit && keys.length === limit) return keys
    }
    return keys
  }

  async iterate() {
    return this.db.entries()
  }
}
