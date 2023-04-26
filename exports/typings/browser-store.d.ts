export default class BrowerStore {
    db: any;
    name: string;
    root: string;
    version: string;
    constructor(name?: string, root?: string, version?: string);
    toKeyPath(key: any): any;
    toKeyValue(value: any): any;
    get(key: any): Promise<any>;
    put(key: any, value: any): Promise<any>;
    delete(key: any): Promise<any>;
    clear(): Promise<any>;
    values(limit?: number): Promise<any[]>;
    keys(limit?: number): Promise<any[]>;
    iterate(): Promise<any>;
}
