import Path from './path.js';
import KeyValue from './value.js';

class LeofcoinStorage {
    name;
    root;
    db;
    constructor(name = 'storage', root = '.leofcoin') {
        this.name = name;
        this.root = root;
    }
    async init(name, root) {
        const importee = await import(globalThis.navigator ? './browser-store.js' : './store.js');
        const Store = importee.default;
        this.db = new Store(this.name, this.root);
    }
    async get(key) {
        if (typeof key === 'object')
            return this.many('get', key);
        return this.db.get(new Path(key));
    }
    /**
     *
     * @param {*} key
     * @param {*} value
     * @returns Promise
     */
    put(key, value) {
        if (typeof key === 'object')
            return this.many('put', key);
        return this.db.put(new Path(key), new KeyValue(value));
    }
    async has(key) {
        if (typeof key === 'object')
            return this.many('has', key);
        try {
            const has = await this.db.get(new Path(key));
            return Boolean(has);
        }
        catch (e) {
            return false;
        }
    }
    async delete(key) {
        return this.db.delete(new Path(key));
    }
    keys(limit = -1) {
        return this.db.keys(limit);
    }
    async values(limit = -1) {
        return this.db.values(limit);
    }
    async many(type, _value) {
        const jobs = [];
        for (const key of Object.keys(_value)) {
            jobs.push(this[type](key, _value[key]));
        }
        return Promise.all(jobs);
    }
    async length() {
        const keys = await this.keys();
        return keys.length;
    }
    async size() {
        let size = 0;
        const query = await this.db.iterate();
        for await (const item of query) {
            size += item.value ? item.value.length : item[1].length;
        }
        return size;
    }
    async clear() {
        return this.db.clear();
    }
    async iterate() {
        return this.db.iterate();
    }
}

export { LeofcoinStorage as default };
