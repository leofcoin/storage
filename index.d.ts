declare type KeyLike = string | Uint8Array

declare type KeyPathLike = KeyPath | KeyLike

declare type KeyValueLike = KeyValue | KeyLike

declare type jobType = 'get' | 'put' | 'delete'

export function encode(string: string): Uint8Array

export function decode(uint8Array: Uint8Array): string

export class KeyValue {  
  constructor(input: KeyValueLike)
  isKeyValue(): boolean
  toString(): string
}

export class KeyPath {
  constructor(input: KeyPathLike)
  isKeyPath(): boolean
  toString(): string
  list(): string[]
}

export class Store {
  constructor(name: string, root: string, version: number)
  toKeyPath(key: KeyPathLike): string
  toKeyValue(value: KeyValueLike): Uint8Array
  get(key: KeyPathLike) : Promise<Uint8Array>
  put(key: KeyPathLike, value: KeyValueLike): Promise
  /**
   * 
   * @param key key/name of the entry to delete
   */
  delete(key: KeyPathLike): Promise
  /**
   * delete everything in storage
   */
  clear(): Promise
  values(limit: number): Uint8Array[]
  keys(limit: number): string[]
  iterate(): IterableIterator
}

export class LeofcoinStorage {  
  constructor(name: string, root: string)
  /**
   * opens the DB
   */
  init(): Promise
  get(key: KeyPathLike) : Promise<Uint8Array>
  put(key: KeyPathLike, value: KeyValueLike): Promise
  has(key: KeyPathLike): boolean
  /**
   * 
   * @param key key/name of the entry to delete
   */
  delete(key: KeyPathLike): Promise
  /**
   * delete everything in storage
   */
  clear(): Promise
  values(limit: number): Uint8Array[]
  keys(limit: number): string[]
  iterate(): IterableIterator
  many(type: jobType, set: []): Promise
  /**
   * amount of keys
   */
  length(): number
  /**
   * amount of storage taken
   */
  size(): number
}