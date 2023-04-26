import { encode, decode } from './encoding.js';

class KeyValue {
    uint8Array;
    constructor(input) {
        if (typeof input === 'string') {
            this.uint8Array = encode(input);
        }
        else if (input instanceof Uint8Array) {
            this.uint8Array = input;
        }
        else if (input instanceof KeyValue) {
            this.uint8Array = input.uint8Array;
        }
        else {
            throw new Error('Invalid KeyValue, should be a String, Uint8Array or KeyValue');
        }
    }
    isKeyValue() {
        return true;
    }
    toString() {
        return decode(this.uint8Array);
    }
}

export { KeyValue as default };
