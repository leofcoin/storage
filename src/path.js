import { decode, encode } from './encoding'

const pathSepS = '/'
export default class KeyPath {

  /**
   * @param {string | Uint8Array} input
   */
  constructor(input) {
    if (typeof input === 'string') {
      this.uint8Array = encode(input)
    } else if (input instanceof Uint8Array) {
      this.uint8Array = input
    } else if (input instanceof KeyPath) {
      this.uint8Array = input.uint8Array
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
    return decode(this.uint8Array, encoding)
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