# LeofcoinStorage

>

## install
```sh
npm i --save @leofcoin/storage
```

## Usage

```js
import LeofcoinStorage from '@leofcoin/storage'

const storage = new LeofcoinStorage(name, root, home)

storage.put('hello', 'world') // hello world
storage.get('hello') // world
storage.has('hello') // true
storage.size('hello') // 4
storage.delete('hello') // bye world
```

## API

### options

name: store name<br>
root: root directory<br>
home: wether or not to use homedir (defaults to true) <br>

```js
new LeofcoinStorage(name, root, home)
```