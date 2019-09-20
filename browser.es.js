class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readonly', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readonly', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}

var idb = /*#__PURE__*/Object.freeze({
    Store: Store,
    get: get,
    set: set,
    del: del,
    clear: clear,
    keys: keys
});

const { Store: Store$1, set: set$1, get: get$1, del: del$1, keys: keys$1 } = idb;

class LeofcoinStorage {
  
  constructor(name) {
    this.name = name;
    this._init(name);
  }
  async _init(name) {
    this.store = await new Store$1(`lfc-storage`, name);
    return
  }
  
  async get(child) {
    let data;
    if (child) data = await get$1(child, this.store);
    else {
      data = {};
      const promises = [];
      const dataKeys = await keys$1(this.store);
      if (dataKeys && dataKeys.length > 0) for (const key of dataKeys) {
        promises.push(( async () => {
          const value = await get$1(key, this.store);
          return {value, key}
        })());
      }
      const _data = await Promise.all(promises);
      _data.forEach(({key, value}) => data[key] = value);
    }
    return data;
  }
  
  async set(child, value) {
    if (value === undefined) {
      value = child;
      child = undefined;
    } 
    if (child) {
     return await set$1(child, value, this.store);
   }
   const promises = [];
   
   for (const key of Object.keys(value)) {
     promises.push((async () => await set$1(key, value[key], this.store))());
   }
   return Promise.all(promises);
  }
  
  async delete(key) {
    return await del$1(key, this.store)
  }
}

export default LeofcoinStorage;
