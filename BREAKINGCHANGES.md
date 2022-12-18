# breaking changes
## 3.2.0
### before
```js
const store = new Store(name, root)
```
### after
```js
const store = new Store(name, root)
await store.init()
```