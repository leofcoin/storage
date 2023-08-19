import BrowerStore from './browser-store.js';
import Store from './store.js';
export default class LeofcoinStorage {
    name: string;
    root: string;
    db: Store | BrowerStore;
    constructor(name?: string, root?: string);
    init(): Promise<void>;
    get(key: any): Promise<any>;
    /**
     *
     * @param {*} key
     * @param {*} value
     * @returns Promise
     */
    put(key: any, value: any): Promise<any>;
    has(key: any): Promise<boolean | any[]>;
    delete(key: any): Promise<any>;
    keys(limit?: number): Promise<any[]>;
    values(limit?: number): Promise<any[]>;
    many(type: any, _value: any): Promise<any[]>;
    length(): Promise<number>;
    size(): Promise<number>;
    clear(): Promise<any>;
    iterate(): Promise<any>;
}
