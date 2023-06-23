export default class KeyValue {
    uint8Array: Uint8Array;
    constructor(input: string | Uint8Array | KeyValue);
    isKeyValue(): boolean;
    toString(): string;
}
