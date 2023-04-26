import { ClassicLevel } from 'classic-level';
export default class Store {
    db: ClassicLevel;
    name: string;
    root: string;
    version: string;
    constructor(name: string, root: any, version?: string);
    toKeyPath(key: any): any;
    toKeyValue(value: any): any;
    toUint8Array(buffer: any): any;
    get(key: any): Promise<any>;
    put(key: any, value: any): Promise<void>;
    delete(key: any): Promise<void>;
    clear(): Promise<void>;
    values(limit?: number): Promise<any[]>;
    keys(limit?: number): Promise<any[]>;
    /**
     *
     * @param {object} options {  limit, gt, lt, reverse }
     * @returns
     */
    iterate(options?: any): import("classic-level").Iterator<ClassicLevel<string, string>, string, string>;
}
