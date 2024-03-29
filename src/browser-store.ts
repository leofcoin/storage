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
  inWorker: boolean
  version: string
  busy: boolean
  queue = []

  async init(name = 'storage', root = '.leofcoin', version = '1', inWorker: boolean = false) {
    this.version = version
    this.name = name
    this.root = opfsRoot
    this.inWorker = inWorker
    let directoryHandle: FileSystemDirectoryHandle
    try {
      directoryHandle = await opfsRoot.getDirectoryHandle(this.name, {
        create: true
      })
      if (inWorker) {
        directoryHandle = await directoryHandle.createSyncAccessHandle()
      }
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
    let handle = await this.db.getFileHandle(this.toKeyPath(key))
    let readBuffer
    if (this.inWorker) {
      handle = await handle.createSyncAccessHandle()
      const fileSize = handle.getSize()
      // Read file content to a buffer.
      const buffer = new DataView(new ArrayBuffer(fileSize))
      readBuffer = handle.read(buffer, { at: 0 })
      handle.close()
    } else {
      const file = await handle.getFile()
      readBuffer = await file.arrayBuffer()
    }
    return new Uint8Array(readBuffer)
  }

  async put(key: KeyInput, value: ValueInput) {
    const promise = () =>
      new Promise(async (resolve) => {
        debug(`put ${this.toKeyPath(key)}`)
        let handle = await this.db.getFileHandle(this.toKeyPath(key), { create: true })
        let writeable
        if (this.inWorker) {
          writeable = await handle.createSyncAccessHandle()
        } else {
          writeable = await handle.createWritable()
        }
        ;(await writeable).write(this.toKeyValue(value))
        ;(await writeable).close()
        resolve(true)

        if (this.queue.length > 0 && !this.busy) {
          this.runQueue()
        }
      })
    this.queue.push(promise)
    this.runQueue()
    return promise
  }

  async runQueue() {
    if (this.queue.length > 0) {
      this.busy = true
      const next = this.queue.shift()
      await next()
      return this.runQueue()
    } else {
      this.busy = false
    }
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

  async values() {
    let values = []

    for await (const cursor of this.db.values()) {
      values.push(cursor.getFile())
    }

    values = await Promise.all(values)
    return Promise.all(values.map(async (file) => new Uint8Array(await file.arrayBuffer())))
  }

  async keys() {
    const keys = []
    for await (const cursor of this.db.keys()) {
      keys.push(cursor)
    }
    return keys
  }

  async iterate() {
    return this.db.entries()
  }
}
