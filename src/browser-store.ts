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
        // it's in a worker so that's why typings invalid?
        // @ts-ignore
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

  async get(key: KeyInput): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        debug(`get ${this.toKeyPath(key)}`)
        try {
          let handle = await this.db.getFileHandle(this.toKeyPath(key))
          let readBuffer
          if (this.inWorker) {
            // it's in a worker so that's why typings invalid?
            // @ts-ignore
            handle = await handle.createSyncAccessHandle()
            // @ts-ignore
            const fileSize = handle.getSize()
            // Read file content to a buffer.
            const buffer = new DataView(new ArrayBuffer(fileSize))
            // @ts-ignore
            readBuffer = handle.read(buffer, { at: 0 })
            // @ts-ignore
            handle.close()
          } else {
            const file = await handle.getFile()
            readBuffer = await file.arrayBuffer()
          }
          resolve(new Uint8Array(readBuffer))
        } catch (error) {
          reject(error)
        }
      }
      this.queue.push(task)
      this.runQueue()
    })
  }

  async put(key: KeyInput, value: ValueInput) {
    return new Promise((resolve, reject) => {
      const task = async () => {
        debug(`put ${this.toKeyPath(key)}`)
        try {
          let handle = await this.db.getFileHandle(this.toKeyPath(key), { create: true })
          let writeable
          if (this.inWorker) {
            // it's in a worker so that's why typings invalid?
            // @ts-ignore
            writeable = await handle.createSyncAccessHandle()
          } else {
            writeable = await handle.createWritable()
          }
          await (await writeable).write(this.toKeyValue(value))
          await (await writeable).close()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      }
      this.queue.push(task)
      this.runQueue()
    })
  }

  async runQueue() {
    if (this.queue.length > 0 && !this.busy) {
      this.busy = true
      const next = this.queue.shift()
      await next()
      this.busy = false
      return this.runQueue()
    } else if (this.queue.length === 0 && this.busy) {
      this.busy = false
    }
  }

  async delete(key: KeyInput) {
    return new Promise((resolve, reject) => {
      const task = async () => {
        debug(`delete ${this.toKeyPath(key)}`)
        try {
          await this.db.getFileHandle(`${this.toKeyPath(key)}.crswap`)
          setTimeout(() => resolve(this.delete(key)), 5)
        } catch (error) {
          try {
            await this.db.removeEntry(this.toKeyPath(key))
            resolve(true)
          } catch (error) {
            if (error.name === 'NoModificationAllowedError') setTimeout(() => resolve(this.delete(key)), 5)
            else reject(error)
          }
        }
      }
      this.queue.push(task)
      this.runQueue()
    })
  }

  async clear() {
    for await (const key of this.db.keys()) {
      debug(`clear ${this.toKeyPath(key)}`)
      await this.delete(key)
    }
  }

  async values() {
    let values = []

    for await (const cursor of this.db.values()) {
      // huh? Outdated typings?
      // @ts-ignore
      values.push(cursor.getFile())
    }

    values = await Promise.all(values)
    return Promise.all(values.map(async (file) => new Uint8Array(await file.arrayBuffer())))
  }

  async size() {
    let size = 0
    for await (const cursor of this.db.values()) {
      // huh? Outdated typings?
      // @ts-ignore
      size += (await cursor.getFile()).size
    }
    return size
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

  async entries() {
    let values = []

    for await (const [key, cursor] of this.db.entries()) {
      values.push(
        (async () => {
          // huh? Outdated typings?
          // @ts-ignore
          const file = await cursor.getFile()
          return [key, new Uint8Array(await file.arrayBuffer())]
        })()
      )
    }

    return Promise.all(values)
  }
}
