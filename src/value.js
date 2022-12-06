import { decode, encode } from './encoding.js'

export default class KeyValue {

  /**
   * @param {string | Uint8Array} input
   */
  constructor(input) {
    if (typeof input === 'string') {
      this.uint8Array = encode(input)
    } else if (input instanceof Uint8Array) {
      this.uint8Array = input
    } else if (input instanceof KeyValue) {
      this.uint8Array = input.uint8Array
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
    return decode(this.uint8Array, encoding)
  }

}
