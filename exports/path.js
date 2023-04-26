import { encode, decode } from './encoding.js';

const pathSepS = '/';
class KeyPath {
    uint8Array;
    constructor(input) {
        if (typeof input === 'string') {
            this.uint8Array = encode(input);
        }
        else if (input instanceof Uint8Array) {
            this.uint8Array = input;
        }
        else if (input instanceof KeyPath) {
            this.uint8Array = input.uint8Array;
        }
        else {
            throw new Error('Invalid keyPath, should be a String, Uint8Array or KeyPath');
        }
    }
    isKeyPath() {
        return true;
    }
    toString() {
        return decode(this.uint8Array);
    }
    /**
     * Returns the `list` representation of this path.
     *
     * @example
     * ```js
     * new Key('/Comedy/MontyPython/Actor:JohnCleese').list()
     * // => ['Comedy', 'MontyPythong', 'Actor:JohnCleese']
     * ```
     */
    list() {
        return this.toString().split(pathSepS).slice(1);
    }
}

export { KeyPath as default };
