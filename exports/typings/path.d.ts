export default class KeyPath {
    uint8Array: Uint8Array;
    constructor(input: string | Uint8Array | KeyPath);
    isKeyPath(): boolean;
    toString(): string;
    /**
     * Returns the `list` representation of this path.
     *
     * @example
     * ```js
     * new Key('/Comedy/MontyPython/Actor:JohnCleese').list()
     * // => ['Comedy', 'MontyPythong', 'Actor:JohnCleese']
     * ```
     */
    list(): string[];
}
