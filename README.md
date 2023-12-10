# LeofcoinStorage 
[![CodeQL](https://github.com/leofcoin/storage/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/leofcoin/storage/actions/workflows/codeql-analysis.yml)

>


## install
```sh
npm i @leofcoin/storage
```

## breaking changes
[checkout](./BREAKINGCHANGES.md)

## Usage

```js
import LeofcoinStorage from '@leofcoin/storage'

const storage = new LeofcoinStorage(name, root)
await storage.init()
// stores/returns a value as uint8Array

await storage.put('hello', 'world')
(await storage.get('hello')).toString() // world
await storage.get() // [{ key: 'hello', value: 'world'}]
await storage.has('hello') // true
await storage.size() // 4
await storage.delete('hello') // bye world
```

## API

### options

name: store name<br>
root: root directory<br>

```js
new LeofcoinStorage(name, root)
```

### methods

#### get
key: path/filename<br>
returns: Promise()&lt;uint8Array&gt;

```js
storage.get(key)

const all = storage.get()
console.log(all) // [{key,value}]
```

#### put
key: path/filename<br>
value: path/filename<br>
returns: Promise()

```js
storage.put(key, value)
```

#### has
key: path/filename<br>
returns: Promise()&lt;Boolean&gt;

```js
storage.has(key)
```

#### keys
returns: Promise()&lt;Array&gt;

```js
storage.keys()
```

#### values
returns: Promise()&lt;Array&gt;

```js
storage.values(limit)
```

## build for browser
rollup
```js
import resolve from '@rollup/plugin-node-resolve'
export default [{
  input: './node_modules/@leofcoin/src/storage.js',
  output: {
    file: 'dist/storage.js',
    format: 'es'
  }
}, {
  input: './node_modules/@leofcoin/src/browser-store.js',
  output: {
    file: 'dist/browser-store.js',
    format: 'es'
  },
  plugins: [
    resolve()
  ]
}]
```