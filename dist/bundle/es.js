import require$$0 from 'buffer';
import require$$2 from 'events';

// import base32 from '@vandeurenglenn/base32'
// import base58 from '@vandeurenglenn/base58'

// export const encodings = {
//   base58,
//   base32
// }

const encode = (string, encoding = 'utf-8') => {
  if (typeof string === 'string') {
    let encoded;
    
    // if (encodings[encoding]) encoded = encodings[encoding].encode(encoded)    
    encoded = new TextEncoder().encode(string);
    return encoded
  }
  throw Error(`expected typeof String instead got ${string}`)
};

const decode = (uint8Array, encoding) => {
  if (uint8Array instanceof Uint8Array) {
    let decoded;
    // if (encodings[encoding]) decoded = encodings[encoding].decode(decoded)
    decoded = new TextDecoder().decode(uint8Array);
    
    return decoded
  }
  throw Error(`expected typeof uint8Array instead got ${uint8Array}`)
};

const pathSepS = '/';
class KeyPath {

  /**
   * @param {string | Uint8Array} input
   */
  constructor(input) {
    if (typeof input === 'string') {
      this.uint8Array = encode(input);
    } else if (input instanceof Uint8Array) {
      this.uint8Array = input;
    } else if (input instanceof KeyPath) {
      this.uint8Array = input.uint8Array;
    } else {
      throw new Error('Invalid keyPath, should be a String, Uint8Array or KeyPath')
    }
  }

  /**
   * Convert to the string representation
   *
   * @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
   * @returns {string}
   */
  toString (encoding = 'hex') {
    return decode(this.uint8Array)
  }

  /**
   * Returns the `list` representation of this path.
   *
   * @returns {Array<string>}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').list()
   * // => ['Comedy', 'MontyPythong', 'Actor:JohnCleese']
   * ```
   */
  list() {
    return this.toString().split(pathSepS).slice(1)
  }

}

class KeyValue {

  /**
   * @param {string | Uint8Array} input
   */
  constructor(input) {
    if (typeof input === 'string') {
      this.uint8Array = encode(input);
    } else if (input instanceof Uint8Array) {
      this.uint8Array = input;
    } else if (input instanceof KeyValue) {
      this.uint8Array = input.uint8Array;
    } else {
      throw new Error('Invalid KeyValue, should be a String, Uint8Array or KeyValue')
    }
  }

  /**
   * Convert to the string representation
   *
   * @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
   * @returns {string}
   */
  toString(encoding = 'utf8') {
    return decode(this.uint8Array)
  }

}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var abstractLevel$1 = {};

var abstractLevel = {};

var levelSupports = {};

levelSupports.supports = function supports (...manifests) {
  const manifest = manifests.reduce((acc, m) => Object.assign(acc, m), {});

  return Object.assign(manifest, {
    snapshots: manifest.snapshots || false,
    permanence: manifest.permanence || false,
    seek: manifest.seek || false,
    clear: manifest.clear || false,
    getMany: manifest.getMany || false,
    keyIterator: manifest.keyIterator || false,
    valueIterator: manifest.valueIterator || false,
    iteratorNextv: manifest.iteratorNextv || false,
    iteratorAll: manifest.iteratorAll || false,
    status: manifest.status || false,
    createIfMissing: manifest.createIfMissing || false,
    errorIfExists: manifest.errorIfExists || false,
    deferredOpen: manifest.deferredOpen || false,
    promises: manifest.promises || false,
    streams: manifest.streams || false,
    encodings: Object.assign({}, manifest.encodings),
    events: Object.assign({}, manifest.events),
    additionalMethods: Object.assign({}, manifest.additionalMethods)
  })
};

var levelTranscoder = {};

var moduleError = class ModuleError extends Error {
  /**
   * @param {string} message Error message
   * @param {{ code?: string, cause?: Error, expected?: boolean, transient?: boolean }} [options]
   */
  constructor (message, options) {
    super(message || '');

    if (typeof options === 'object' && options !== null) {
      if (options.code) this.code = String(options.code);
      if (options.expected) this.expected = true;
      if (options.transient) this.transient = true;
      if (options.cause) this.cause = options.cause;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

var encodings$1 = {};

/** @type {{ textEncoder: TextEncoder, textDecoder: TextDecoder }|null} */
let lazy = null;

/**
 * Get semi-global instances of TextEncoder and TextDecoder.
 * @returns {{ textEncoder: TextEncoder, textDecoder: TextDecoder }}
 */
var textEndec$1 = function () {
  if (lazy === null) {
    lazy = {
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder()
    };
  }

  return lazy
};

var formats$2 = {};

var encoding = {};

const ModuleError$8 = moduleError;
const formats$1 = new Set(['buffer', 'view', 'utf8']);

/**
 * @template TIn, TFormat, TOut
 * @abstract
 */
class Encoding$2 {
  /**
   * @param {IEncoding<TIn,TFormat,TOut>} options
   */
  constructor (options) {
    /** @type {(data: TIn) => TFormat} */
    this.encode = options.encode || this.encode;

    /** @type {(data: TFormat) => TOut} */
    this.decode = options.decode || this.decode;

    /** @type {string} */
    this.name = options.name || this.name;

    /** @type {string} */
    this.format = options.format || this.format;

    if (typeof this.encode !== 'function') {
      throw new TypeError("The 'encode' property must be a function")
    }

    if (typeof this.decode !== 'function') {
      throw new TypeError("The 'decode' property must be a function")
    }

    this.encode = this.encode.bind(this);
    this.decode = this.decode.bind(this);

    if (typeof this.name !== 'string' || this.name === '') {
      throw new TypeError("The 'name' property must be a string")
    }

    if (typeof this.format !== 'string' || !formats$1.has(this.format)) {
      throw new TypeError("The 'format' property must be one of 'buffer', 'view', 'utf8'")
    }

    if (options.createViewTranscoder) {
      this.createViewTranscoder = options.createViewTranscoder;
    }

    if (options.createBufferTranscoder) {
      this.createBufferTranscoder = options.createBufferTranscoder;
    }

    if (options.createUTF8Transcoder) {
      this.createUTF8Transcoder = options.createUTF8Transcoder;
    }
  }

  get commonName () {
    return /** @type {string} */ (this.name.split('+')[0])
  }

  /** @return {BufferFormat<TIn,TOut>} */
  createBufferTranscoder () {
    throw new ModuleError$8(`Encoding '${this.name}' cannot be transcoded to 'buffer'`, {
      code: 'LEVEL_ENCODING_NOT_SUPPORTED'
    })
  }

  /** @return {ViewFormat<TIn,TOut>} */
  createViewTranscoder () {
    throw new ModuleError$8(`Encoding '${this.name}' cannot be transcoded to 'view'`, {
      code: 'LEVEL_ENCODING_NOT_SUPPORTED'
    })
  }

  /** @return {UTF8Format<TIn,TOut>} */
  createUTF8Transcoder () {
    throw new ModuleError$8(`Encoding '${this.name}' cannot be transcoded to 'utf8'`, {
      code: 'LEVEL_ENCODING_NOT_SUPPORTED'
    })
  }
}

encoding.Encoding = Encoding$2;

const { Buffer: Buffer$1 } = require$$0 || {};
const { Encoding: Encoding$1 } = encoding;
const textEndec = textEndec$1;

/**
 * @template TIn, TOut
 * @extends {Encoding<TIn,Buffer,TOut>}
 */
class BufferFormat$2 extends Encoding$1 {
  /**
   * @param {Omit<IEncoding<TIn, Buffer, TOut>, 'format'>} options
   */
  constructor (options) {
    super({ ...options, format: 'buffer' });
  }

  /** @override */
  createViewTranscoder () {
    return new ViewFormat$2({
      encode: this.encode, // Buffer is a view (UInt8Array)
      decode: (data) => this.decode(
        Buffer$1.from(data.buffer, data.byteOffset, data.byteLength)
      ),
      name: `${this.name}+view`
    })
  }

  /** @override */
  createBufferTranscoder () {
    return this
  }
}

/**
 * @extends {Encoding<TIn,Uint8Array,TOut>}
 * @template TIn, TOut
 */
class ViewFormat$2 extends Encoding$1 {
  /**
   * @param {Omit<IEncoding<TIn, Uint8Array, TOut>, 'format'>} options
   */
  constructor (options) {
    super({ ...options, format: 'view' });
  }

  /** @override */
  createBufferTranscoder () {
    return new BufferFormat$2({
      encode: (data) => {
        const view = this.encode(data);
        return Buffer$1.from(view.buffer, view.byteOffset, view.byteLength)
      },
      decode: this.decode, // Buffer is a view (UInt8Array)
      name: `${this.name}+buffer`
    })
  }

  /** @override */
  createViewTranscoder () {
    return this
  }
}

/**
 * @extends {Encoding<TIn,string,TOut>}
 * @template TIn, TOut
 */
class UTF8Format$2 extends Encoding$1 {
  /**
   * @param {Omit<IEncoding<TIn, string, TOut>, 'format'>} options
   */
  constructor (options) {
    super({ ...options, format: 'utf8' });
  }

  /** @override */
  createBufferTranscoder () {
    return new BufferFormat$2({
      encode: (data) => Buffer$1.from(this.encode(data), 'utf8'),
      decode: (data) => this.decode(data.toString('utf8')),
      name: `${this.name}+buffer`
    })
  }

  /** @override */
  createViewTranscoder () {
    const { textEncoder, textDecoder } = textEndec();

    return new ViewFormat$2({
      encode: (data) => textEncoder.encode(this.encode(data)),
      decode: (data) => this.decode(textDecoder.decode(data)),
      name: `${this.name}+view`
    })
  }

  /** @override */
  createUTF8Transcoder () {
    return this
  }
}

formats$2.BufferFormat = BufferFormat$2;
formats$2.ViewFormat = ViewFormat$2;
formats$2.UTF8Format = UTF8Format$2;

const { Buffer } = require$$0 || { Buffer: { isBuffer: () => false } };
const { textEncoder: textEncoder$1, textDecoder } = textEndec$1();
const { BufferFormat: BufferFormat$1, ViewFormat: ViewFormat$1, UTF8Format: UTF8Format$1 } = formats$2;

/** @type {<T>(v: T) => v} */
const identity = (v) => v;

/**
 * @type {typeof import('./encodings').utf8}
 */
encodings$1.utf8 = new UTF8Format$1({
  encode: function (data) {
    // On node 16.9.1 buffer.toString() is 5x faster than TextDecoder
    return Buffer.isBuffer(data)
      ? data.toString('utf8')
      : ArrayBuffer.isView(data)
        ? textDecoder.decode(data)
        : String(data)
  },
  decode: identity,
  name: 'utf8',
  createViewTranscoder () {
    return new ViewFormat$1({
      encode: function (data) {
        return ArrayBuffer.isView(data) ? data : textEncoder$1.encode(data)
      },
      decode: function (data) {
        return textDecoder.decode(data)
      },
      name: `${this.name}+view`
    })
  },
  createBufferTranscoder () {
    return new BufferFormat$1({
      encode: function (data) {
        return Buffer.isBuffer(data)
          ? data
          : ArrayBuffer.isView(data)
            ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
            : Buffer.from(String(data), 'utf8')
      },
      decode: function (data) {
        return data.toString('utf8')
      },
      name: `${this.name}+buffer`
    })
  }
});

/**
 * @type {typeof import('./encodings').json}
 */
encodings$1.json = new UTF8Format$1({
  encode: JSON.stringify,
  decode: JSON.parse,
  name: 'json'
});

/**
 * @type {typeof import('./encodings').buffer}
 */
encodings$1.buffer = new BufferFormat$1({
  encode: function (data) {
    return Buffer.isBuffer(data)
      ? data
      : ArrayBuffer.isView(data)
        ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
        : Buffer.from(String(data), 'utf8')
  },
  decode: identity,
  name: 'buffer',
  createViewTranscoder () {
    return new ViewFormat$1({
      encode: function (data) {
        return ArrayBuffer.isView(data) ? data : Buffer.from(String(data), 'utf8')
      },
      decode: function (data) {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength)
      },
      name: `${this.name}+view`
    })
  }
});

/**
 * @type {typeof import('./encodings').view}
 */
encodings$1.view = new ViewFormat$1({
  encode: function (data) {
    return ArrayBuffer.isView(data) ? data : textEncoder$1.encode(data)
  },
  decode: identity,
  name: 'view',
  createBufferTranscoder () {
    return new BufferFormat$1({
      encode: function (data) {
        return Buffer.isBuffer(data)
          ? data
          : ArrayBuffer.isView(data)
            ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
            : Buffer.from(String(data), 'utf8')
      },
      decode: identity,
      name: `${this.name}+buffer`
    })
  }
});

/**
 * @type {typeof import('./encodings').hex}
 */
encodings$1.hex = new BufferFormat$1({
  encode: function (data) {
    return Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'hex')
  },
  decode: function (buffer) {
    return buffer.toString('hex')
  },
  name: 'hex'
});

/**
 * @type {typeof import('./encodings').base64}
 */
encodings$1.base64 = new BufferFormat$1({
  encode: function (data) {
    return Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'base64')
  },
  decode: function (buffer) {
    return buffer.toString('base64')
  },
  name: 'base64'
});

const ModuleError$7 = moduleError;
const encodings = encodings$1;
const { Encoding } = encoding;
const { BufferFormat, ViewFormat, UTF8Format } = formats$2;

const kFormats = Symbol('formats');
const kEncodings = Symbol('encodings');
const validFormats = new Set(['buffer', 'view', 'utf8']);

/** @template T */
class Transcoder$1 {
  /**
   * @param {Array<'buffer'|'view'|'utf8'>} formats
   */
  constructor (formats) {
    if (!Array.isArray(formats)) {
      throw new TypeError("The first argument 'formats' must be an array")
    } else if (!formats.every(f => validFormats.has(f))) {
      // Note: we only only support aliases in key- and valueEncoding options (where we already did)
      throw new TypeError("Format must be one of 'buffer', 'view', 'utf8'")
    }

    /** @type {Map<string|MixedEncoding<any, any, any>, Encoding<any, any, any>>} */
    this[kEncodings] = new Map();
    this[kFormats] = new Set(formats);

    // Register encodings (done early in order to populate encodings())
    for (const k in encodings) {
      try {
        this.encoding(k);
      } catch (err) {
        /* istanbul ignore if: assertion */
        if (err.code !== 'LEVEL_ENCODING_NOT_SUPPORTED') throw err
      }
    }
  }

  /**
   * @returns {Array<Encoding<any,T,any>>}
   */
  encodings () {
    return Array.from(new Set(this[kEncodings].values()))
  }

  /**
   * @param {string|MixedEncoding<any, any, any>} encoding
   * @returns {Encoding<any, T, any>}
   */
  encoding (encoding) {
    let resolved = this[kEncodings].get(encoding);

    if (resolved === undefined) {
      if (typeof encoding === 'string' && encoding !== '') {
        resolved = lookup[encoding];

        if (!resolved) {
          throw new ModuleError$7(`Encoding '${encoding}' is not found`, {
            code: 'LEVEL_ENCODING_NOT_FOUND'
          })
        }
      } else if (typeof encoding !== 'object' || encoding === null) {
        throw new TypeError("First argument 'encoding' must be a string or object")
      } else {
        resolved = from(encoding);
      }

      const { name, format } = resolved;

      if (!this[kFormats].has(format)) {
        if (this[kFormats].has('view')) {
          resolved = resolved.createViewTranscoder();
        } else if (this[kFormats].has('buffer')) {
          resolved = resolved.createBufferTranscoder();
        } else if (this[kFormats].has('utf8')) {
          resolved = resolved.createUTF8Transcoder();
        } else {
          throw new ModuleError$7(`Encoding '${name}' cannot be transcoded`, {
            code: 'LEVEL_ENCODING_NOT_SUPPORTED'
          })
        }
      }

      for (const k of [encoding, name, resolved.name, resolved.commonName]) {
        this[kEncodings].set(k, resolved);
      }
    }

    return resolved
  }
}

levelTranscoder.Transcoder = Transcoder$1;

/**
 * @param {MixedEncoding<any, any, any>} options
 * @returns {Encoding<any, any, any>}
 */
function from (options) {
  if (options instanceof Encoding) {
    return options
  }

  // Loosely typed for ecosystem compatibility
  const maybeType = 'type' in options && typeof options.type === 'string' ? options.type : undefined;
  const name = options.name || maybeType || `anonymous-${anonymousCount++}`;

  switch (detectFormat(options)) {
    case 'view': return new ViewFormat({ ...options, name })
    case 'utf8': return new UTF8Format({ ...options, name })
    case 'buffer': return new BufferFormat({ ...options, name })
    default: {
      throw new TypeError("Format must be one of 'buffer', 'view', 'utf8'")
    }
  }
}

/**
 * If format is not provided, fallback to detecting `level-codec`
 * or `multiformats` encodings, else assume a format of buffer.
 * @param {MixedEncoding<any, any, any>} options
 * @returns {string}
 */
function detectFormat (options) {
  if ('format' in options && options.format !== undefined) {
    return options.format
  } else if ('buffer' in options && typeof options.buffer === 'boolean') {
    return options.buffer ? 'buffer' : 'utf8' // level-codec
  } else if ('code' in options && Number.isInteger(options.code)) {
    return 'view' // multiformats
  } else {
    return 'buffer'
  }
}

/**
 * @typedef {import('./lib/encoding').MixedEncoding<TIn,TFormat,TOut>} MixedEncoding
 * @template TIn, TFormat, TOut
 */

/**
 * @type {Object.<string, Encoding<any, any, any>>}
 */
const aliases = {
  binary: encodings.buffer,
  'utf-8': encodings.utf8
};

/**
 * @type {Object.<string, Encoding<any, any, any>>}
 */
const lookup = {
  ...encodings,
  ...aliases
};

let anonymousCount = 0;

var catering = {};

var nextTick$2 = process.nextTick.bind(process);

var nextTick$1 = nextTick$2;

catering.fromCallback = function (callback, symbol) {
  if (callback === undefined) {
    var promise = new Promise(function (resolve, reject) {
      callback = function (err, res) {
        if (err) reject(err);
        else resolve(res);
      };
    });

    callback[symbol !== undefined ? symbol : 'promise'] = promise;
  } else if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }

  return callback
};

catering.fromPromise = function (promise, callback) {
  if (callback === undefined) return promise

  promise
    .then(function (res) { nextTick$1(() => callback(null, res)); })
    .catch(function (err) { nextTick$1(() => callback(err)); });
};

var abstractIterator = {};

var common = {};

common.getCallback = function (options, callback) {
  return typeof options === 'function' ? options : callback
};

common.getOptions = function (options, def) {
  if (typeof options === 'object' && options !== null) {
    return options
  }

  if (def !== undefined) {
    return def
  }

  return {}
};

const { fromCallback: fromCallback$3 } = catering;
const ModuleError$6 = moduleError;
const { getOptions: getOptions$2, getCallback: getCallback$2 } = common;

const kPromise$3 = Symbol('promise');
const kCallback$1 = Symbol('callback');
const kWorking = Symbol('working');
const kHandleOne$1 = Symbol('handleOne');
const kHandleMany$1 = Symbol('handleMany');
const kAutoClose = Symbol('autoClose');
const kFinishWork = Symbol('finishWork');
const kReturnMany = Symbol('returnMany');
const kClosing = Symbol('closing');
const kHandleClose = Symbol('handleClose');
const kClosed = Symbol('closed');
const kCloseCallbacks$1 = Symbol('closeCallbacks');
const kKeyEncoding$1 = Symbol('keyEncoding');
const kValueEncoding$1 = Symbol('valueEncoding');
const kAbortOnClose = Symbol('abortOnClose');
const kLegacy = Symbol('legacy');
const kKeys = Symbol('keys');
const kValues = Symbol('values');
const kLimit = Symbol('limit');
const kCount = Symbol('count');

const emptyOptions$1 = Object.freeze({});
const noop$1 = () => {};
let warnedEnd = false;

// This class is an internal utility for common functionality between AbstractIterator,
// AbstractKeyIterator and AbstractValueIterator. It's not exported.
class CommonIterator {
  constructor (db, options, legacy) {
    if (typeof db !== 'object' || db === null) {
      const hint = db === null ? 'null' : typeof db;
      throw new TypeError(`The first argument must be an abstract-level database, received ${hint}`)
    }

    if (typeof options !== 'object' || options === null) {
      throw new TypeError('The second argument must be an options object')
    }

    this[kClosed] = false;
    this[kCloseCallbacks$1] = [];
    this[kWorking] = false;
    this[kClosing] = false;
    this[kAutoClose] = false;
    this[kCallback$1] = null;
    this[kHandleOne$1] = this[kHandleOne$1].bind(this);
    this[kHandleMany$1] = this[kHandleMany$1].bind(this);
    this[kHandleClose] = this[kHandleClose].bind(this);
    this[kKeyEncoding$1] = options[kKeyEncoding$1];
    this[kValueEncoding$1] = options[kValueEncoding$1];
    this[kLegacy] = legacy;
    this[kLimit] = Number.isInteger(options.limit) && options.limit >= 0 ? options.limit : Infinity;
    this[kCount] = 0;

    // Undocumented option to abort pending work on close(). Used by the
    // many-level module as a temporary solution to a blocked close().
    // TODO (next major): consider making this the default behavior. Native
    // implementations should have their own logic to safely close iterators.
    this[kAbortOnClose] = !!options.abortOnClose;

    this.db = db;
    this.db.attachResource(this);
    this.nextTick = db.nextTick;
  }

  get count () {
    return this[kCount]
  }

  get limit () {
    return this[kLimit]
  }

  next (callback) {
    let promise;

    if (callback === undefined) {
      promise = new Promise((resolve, reject) => {
        callback = (err, key, value) => {
          if (err) reject(err);
          else if (!this[kLegacy]) resolve(key);
          else if (key === undefined && value === undefined) resolve();
          else resolve([key, value]);
        };
      });
    } else if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function')
    }

    if (this[kClosing]) {
      this.nextTick(callback, new ModuleError$6('Iterator is not open: cannot call next() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    } else if (this[kWorking]) {
      this.nextTick(callback, new ModuleError$6('Iterator is busy: cannot call next() until previous call has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      }));
    } else {
      this[kWorking] = true;
      this[kCallback$1] = callback;

      if (this[kCount] >= this[kLimit]) this.nextTick(this[kHandleOne$1], null);
      else this._next(this[kHandleOne$1]);
    }

    return promise
  }

  _next (callback) {
    this.nextTick(callback);
  }

  nextv (size, options, callback) {
    callback = getCallback$2(options, callback);
    callback = fromCallback$3(callback, kPromise$3);
    options = getOptions$2(options, emptyOptions$1);

    if (!Number.isInteger(size)) {
      this.nextTick(callback, new TypeError("The first argument 'size' must be an integer"));
      return callback[kPromise$3]
    }

    if (this[kClosing]) {
      this.nextTick(callback, new ModuleError$6('Iterator is not open: cannot call nextv() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    } else if (this[kWorking]) {
      this.nextTick(callback, new ModuleError$6('Iterator is busy: cannot call nextv() until previous call has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      }));
    } else {
      if (size < 1) size = 1;
      if (this[kLimit] < Infinity) size = Math.min(size, this[kLimit] - this[kCount]);

      this[kWorking] = true;
      this[kCallback$1] = callback;

      if (size <= 0) this.nextTick(this[kHandleMany$1], null, []);
      else this._nextv(size, options, this[kHandleMany$1]);
    }

    return callback[kPromise$3]
  }

  _nextv (size, options, callback) {
    const acc = [];
    const onnext = (err, key, value) => {
      if (err) {
        return callback(err)
      } else if (this[kLegacy] ? key === undefined && value === undefined : key === undefined) {
        return callback(null, acc)
      }

      acc.push(this[kLegacy] ? [key, value] : key);

      if (acc.length === size) {
        callback(null, acc);
      } else {
        this._next(onnext);
      }
    };

    this._next(onnext);
  }

  all (options, callback) {
    callback = getCallback$2(options, callback);
    callback = fromCallback$3(callback, kPromise$3);
    options = getOptions$2(options, emptyOptions$1);

    if (this[kClosing]) {
      this.nextTick(callback, new ModuleError$6('Iterator is not open: cannot call all() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    } else if (this[kWorking]) {
      this.nextTick(callback, new ModuleError$6('Iterator is busy: cannot call all() until previous call has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      }));
    } else {
      this[kWorking] = true;
      this[kCallback$1] = callback;
      this[kAutoClose] = true;

      if (this[kCount] >= this[kLimit]) this.nextTick(this[kHandleMany$1], null, []);
      else this._all(options, this[kHandleMany$1]);
    }

    return callback[kPromise$3]
  }

  _all (options, callback) {
    // Must count here because we're directly calling _nextv()
    let count = this[kCount];
    const acc = [];

    const nextv = () => {
      // Not configurable, because implementations should optimize _all().
      const size = this[kLimit] < Infinity ? Math.min(1e3, this[kLimit] - count) : 1e3;

      if (size <= 0) {
        this.nextTick(callback, null, acc);
      } else {
        this._nextv(size, emptyOptions$1, onnextv);
      }
    };

    const onnextv = (err, items) => {
      if (err) {
        callback(err);
      } else if (items.length === 0) {
        callback(null, acc);
      } else {
        acc.push.apply(acc, items);
        count += items.length;
        nextv();
      }
    };

    nextv();
  }

  [kFinishWork] () {
    const cb = this[kCallback$1];

    // Callback will be null if work was aborted on close
    if (this[kAbortOnClose] && cb === null) return noop$1

    this[kWorking] = false;
    this[kCallback$1] = null;

    if (this[kClosing]) this._close(this[kHandleClose]);

    return cb
  }

  [kReturnMany] (cb, err, items) {
    if (this[kAutoClose]) {
      this.close(cb.bind(null, err, items));
    } else {
      cb(err, items);
    }
  }

  seek (target, options) {
    options = getOptions$2(options, emptyOptions$1);

    if (this[kClosing]) ; else if (this[kWorking]) {
      throw new ModuleError$6('Iterator is busy: cannot call seek() until next() has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      })
    } else {
      const keyEncoding = this.db.keyEncoding(options.keyEncoding || this[kKeyEncoding$1]);
      const keyFormat = keyEncoding.format;

      if (options.keyEncoding !== keyFormat) {
        options = { ...options, keyEncoding: keyFormat };
      }

      const mapped = this.db.prefixKey(keyEncoding.encode(target), keyFormat);
      this._seek(mapped, options);
    }
  }

  _seek (target, options) {
    throw new ModuleError$6('Iterator does not support seek()', {
      code: 'LEVEL_NOT_SUPPORTED'
    })
  }

  close (callback) {
    callback = fromCallback$3(callback, kPromise$3);

    if (this[kClosed]) {
      this.nextTick(callback);
    } else if (this[kClosing]) {
      this[kCloseCallbacks$1].push(callback);
    } else {
      this[kClosing] = true;
      this[kCloseCallbacks$1].push(callback);

      if (!this[kWorking]) {
        this._close(this[kHandleClose]);
      } else if (this[kAbortOnClose]) {
        // Don't wait for work to finish. Subsequently ignore the result.
        const cb = this[kFinishWork]();

        cb(new ModuleError$6('Aborted on iterator close()', {
          code: 'LEVEL_ITERATOR_NOT_OPEN'
        }));
      }
    }

    return callback[kPromise$3]
  }

  _close (callback) {
    this.nextTick(callback);
  }

  [kHandleClose] () {
    this[kClosed] = true;
    this.db.detachResource(this);

    const callbacks = this[kCloseCallbacks$1];
    this[kCloseCallbacks$1] = [];

    for (const cb of callbacks) {
      cb();
    }
  }

  async * [Symbol.asyncIterator] () {
    try {
      let item;

      while ((item = (await this.next())) !== undefined) {
        yield item;
      }
    } finally {
      if (!this[kClosed]) await this.close();
    }
  }
}

// For backwards compatibility this class is not (yet) called AbstractEntryIterator.
class AbstractIterator$3 extends CommonIterator {
  constructor (db, options) {
    super(db, options, true);
    this[kKeys] = options.keys !== false;
    this[kValues] = options.values !== false;
  }

  [kHandleOne$1] (err, key, value) {
    const cb = this[kFinishWork]();
    if (err) return cb(err)

    try {
      key = this[kKeys] && key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
      value = this[kValues] && value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
    } catch (err) {
      return cb(new IteratorDecodeError('entry', err))
    }

    if (!(key === undefined && value === undefined)) {
      this[kCount]++;
    }

    cb(null, key, value);
  }

  [kHandleMany$1] (err, entries) {
    const cb = this[kFinishWork]();
    if (err) return this[kReturnMany](cb, err)

    try {
      for (const entry of entries) {
        const key = entry[0];
        const value = entry[1];

        entry[0] = this[kKeys] && key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
        entry[1] = this[kValues] && value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
      }
    } catch (err) {
      return this[kReturnMany](cb, new IteratorDecodeError('entries', err))
    }

    this[kCount] += entries.length;
    this[kReturnMany](cb, null, entries);
  }

  end (callback) {
    if (!warnedEnd && typeof console !== 'undefined') {
      warnedEnd = true;
      console.warn(new ModuleError$6(
        'The iterator.end() method was renamed to close() and end() is an alias that will be removed in a future version',
        { code: 'LEVEL_LEGACY' }
      ));
    }

    return this.close(callback)
  }
}

class AbstractKeyIterator$2 extends CommonIterator {
  constructor (db, options) {
    super(db, options, false);
  }

  [kHandleOne$1] (err, key) {
    const cb = this[kFinishWork]();
    if (err) return cb(err)

    try {
      key = key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
    } catch (err) {
      return cb(new IteratorDecodeError('key', err))
    }

    if (key !== undefined) this[kCount]++;
    cb(null, key);
  }

  [kHandleMany$1] (err, keys) {
    const cb = this[kFinishWork]();
    if (err) return this[kReturnMany](cb, err)

    try {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        keys[i] = key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
      }
    } catch (err) {
      return this[kReturnMany](cb, new IteratorDecodeError('keys', err))
    }

    this[kCount] += keys.length;
    this[kReturnMany](cb, null, keys);
  }
}

class AbstractValueIterator$2 extends CommonIterator {
  constructor (db, options) {
    super(db, options, false);
  }

  [kHandleOne$1] (err, value) {
    const cb = this[kFinishWork]();
    if (err) return cb(err)

    try {
      value = value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
    } catch (err) {
      return cb(new IteratorDecodeError('value', err))
    }

    if (value !== undefined) this[kCount]++;
    cb(null, value);
  }

  [kHandleMany$1] (err, values) {
    const cb = this[kFinishWork]();
    if (err) return this[kReturnMany](cb, err)

    try {
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        values[i] = value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
      }
    } catch (err) {
      return this[kReturnMany](cb, new IteratorDecodeError('values', err))
    }

    this[kCount] += values.length;
    this[kReturnMany](cb, null, values);
  }
}

// Internal utility, not typed or exported
class IteratorDecodeError extends ModuleError$6 {
  constructor (subject, cause) {
    super(`Iterator could not decode ${subject}`, {
      code: 'LEVEL_DECODE_ERROR',
      cause
    });
  }
}

// To help migrating to abstract-level
for (const k of ['_ended property', '_nexting property', '_end method']) {
  Object.defineProperty(AbstractIterator$3.prototype, k.split(' ')[0], {
    get () { throw new ModuleError$6(`The ${k} has been removed`, { code: 'LEVEL_LEGACY' }) },
    set () { throw new ModuleError$6(`The ${k} has been removed`, { code: 'LEVEL_LEGACY' }) }
  });
}

// Exposed so that AbstractLevel can set these options
AbstractIterator$3.keyEncoding = kKeyEncoding$1;
AbstractIterator$3.valueEncoding = kValueEncoding$1;

abstractIterator.AbstractIterator = AbstractIterator$3;
abstractIterator.AbstractKeyIterator = AbstractKeyIterator$2;
abstractIterator.AbstractValueIterator = AbstractValueIterator$2;

var defaultKvIterator = {};

const { AbstractKeyIterator: AbstractKeyIterator$1, AbstractValueIterator: AbstractValueIterator$1 } = abstractIterator;

const kIterator = Symbol('iterator');
const kCallback = Symbol('callback');
const kHandleOne = Symbol('handleOne');
const kHandleMany = Symbol('handleMany');

class DefaultKeyIterator$1 extends AbstractKeyIterator$1 {
  constructor (db, options) {
    super(db, options);

    this[kIterator] = db.iterator({ ...options, keys: true, values: false });
    this[kHandleOne] = this[kHandleOne].bind(this);
    this[kHandleMany] = this[kHandleMany].bind(this);
  }
}

class DefaultValueIterator$1 extends AbstractValueIterator$1 {
  constructor (db, options) {
    super(db, options);

    this[kIterator] = db.iterator({ ...options, keys: false, values: true });
    this[kHandleOne] = this[kHandleOne].bind(this);
    this[kHandleMany] = this[kHandleMany].bind(this);
  }
}

for (const Iterator of [DefaultKeyIterator$1, DefaultValueIterator$1]) {
  const keys = Iterator === DefaultKeyIterator$1;
  const mapEntry = keys ? (entry) => entry[0] : (entry) => entry[1];

  Iterator.prototype._next = function (callback) {
    this[kCallback] = callback;
    this[kIterator].next(this[kHandleOne]);
  };

  Iterator.prototype[kHandleOne] = function (err, key, value) {
    const callback = this[kCallback];
    if (err) callback(err);
    else callback(null, keys ? key : value);
  };

  Iterator.prototype._nextv = function (size, options, callback) {
    this[kCallback] = callback;
    this[kIterator].nextv(size, options, this[kHandleMany]);
  };

  Iterator.prototype._all = function (options, callback) {
    this[kCallback] = callback;
    this[kIterator].all(options, this[kHandleMany]);
  };

  Iterator.prototype[kHandleMany] = function (err, entries) {
    const callback = this[kCallback];
    if (err) callback(err);
    else callback(null, entries.map(mapEntry));
  };

  Iterator.prototype._seek = function (target, options) {
    this[kIterator].seek(target, options);
  };

  Iterator.prototype._close = function (callback) {
    this[kIterator].close(callback);
  };
}

// Internal utilities, should be typed as AbstractKeyIterator and AbstractValueIterator
defaultKvIterator.DefaultKeyIterator = DefaultKeyIterator$1;
defaultKvIterator.DefaultValueIterator = DefaultValueIterator$1;

var deferredIterator = {};

const { AbstractIterator: AbstractIterator$2, AbstractKeyIterator, AbstractValueIterator } = abstractIterator;
const ModuleError$5 = moduleError;

const kNut = Symbol('nut');
const kUndefer$1 = Symbol('undefer');
const kFactory = Symbol('factory');

class DeferredIterator$1 extends AbstractIterator$2 {
  constructor (db, options) {
    super(db, options);

    this[kNut] = null;
    this[kFactory] = () => db.iterator(options);

    this.db.defer(() => this[kUndefer$1]());
  }
}

class DeferredKeyIterator$1 extends AbstractKeyIterator {
  constructor (db, options) {
    super(db, options);

    this[kNut] = null;
    this[kFactory] = () => db.keys(options);

    this.db.defer(() => this[kUndefer$1]());
  }
}

class DeferredValueIterator$1 extends AbstractValueIterator {
  constructor (db, options) {
    super(db, options);

    this[kNut] = null;
    this[kFactory] = () => db.values(options);

    this.db.defer(() => this[kUndefer$1]());
  }
}

for (const Iterator of [DeferredIterator$1, DeferredKeyIterator$1, DeferredValueIterator$1]) {
  Iterator.prototype[kUndefer$1] = function () {
    if (this.db.status === 'open') {
      this[kNut] = this[kFactory]();
    }
  };

  Iterator.prototype._next = function (callback) {
    if (this[kNut] !== null) {
      this[kNut].next(callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._next(callback));
    } else {
      this.nextTick(callback, new ModuleError$5('Iterator is not open: cannot call next() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    }
  };

  Iterator.prototype._nextv = function (size, options, callback) {
    if (this[kNut] !== null) {
      this[kNut].nextv(size, options, callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._nextv(size, options, callback));
    } else {
      this.nextTick(callback, new ModuleError$5('Iterator is not open: cannot call nextv() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    }
  };

  Iterator.prototype._all = function (options, callback) {
    if (this[kNut] !== null) {
      this[kNut].all(callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._all(options, callback));
    } else {
      this.nextTick(callback, new ModuleError$5('Iterator is not open: cannot call all() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    }
  };

  Iterator.prototype._seek = function (target, options) {
    if (this[kNut] !== null) {
      // TODO: explain why we need _seek() rather than seek() here
      this[kNut]._seek(target, options);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._seek(target, options));
    }
  };

  Iterator.prototype._close = function (callback) {
    if (this[kNut] !== null) {
      this[kNut].close(callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._close(callback));
    } else {
      this.nextTick(callback);
    }
  };
}

deferredIterator.DeferredIterator = DeferredIterator$1;
deferredIterator.DeferredKeyIterator = DeferredKeyIterator$1;
deferredIterator.DeferredValueIterator = DeferredValueIterator$1;

var defaultChainedBatch = {};

var abstractChainedBatch = {};

const { fromCallback: fromCallback$2 } = catering;
const ModuleError$4 = moduleError;
const { getCallback: getCallback$1, getOptions: getOptions$1 } = common;

const kPromise$2 = Symbol('promise');
const kStatus$1 = Symbol('status');
const kOperations$1 = Symbol('operations');
const kFinishClose = Symbol('finishClose');
const kCloseCallbacks = Symbol('closeCallbacks');

class AbstractChainedBatch$1 {
  constructor (db) {
    if (typeof db !== 'object' || db === null) {
      const hint = db === null ? 'null' : typeof db;
      throw new TypeError(`The first argument must be an abstract-level database, received ${hint}`)
    }

    this[kOperations$1] = [];
    this[kCloseCallbacks] = [];
    this[kStatus$1] = 'open';
    this[kFinishClose] = this[kFinishClose].bind(this);

    this.db = db;
    this.db.attachResource(this);
    this.nextTick = db.nextTick;
  }

  get length () {
    return this[kOperations$1].length
  }

  put (key, value, options) {
    if (this[kStatus$1] !== 'open') {
      throw new ModuleError$4('Batch is not open: cannot call put() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      })
    }

    const err = this.db._checkKey(key) || this.db._checkValue(value);
    if (err) throw err

    const db = options && options.sublevel != null ? options.sublevel : this.db;
    const original = options;
    const keyEncoding = db.keyEncoding(options && options.keyEncoding);
    const valueEncoding = db.valueEncoding(options && options.valueEncoding);
    const keyFormat = keyEncoding.format;

    // Forward encoding options
    options = { ...options, keyEncoding: keyFormat, valueEncoding: valueEncoding.format };

    // Prevent double prefixing
    if (db !== this.db) {
      options.sublevel = null;
    }

    const mappedKey = db.prefixKey(keyEncoding.encode(key), keyFormat);
    const mappedValue = valueEncoding.encode(value);

    this._put(mappedKey, mappedValue, options);
    this[kOperations$1].push({ ...original, type: 'put', key, value });

    return this
  }

  _put (key, value, options) {}

  del (key, options) {
    if (this[kStatus$1] !== 'open') {
      throw new ModuleError$4('Batch is not open: cannot call del() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      })
    }

    const err = this.db._checkKey(key);
    if (err) throw err

    const db = options && options.sublevel != null ? options.sublevel : this.db;
    const original = options;
    const keyEncoding = db.keyEncoding(options && options.keyEncoding);
    const keyFormat = keyEncoding.format;

    // Forward encoding options
    options = { ...options, keyEncoding: keyFormat };

    // Prevent double prefixing
    if (db !== this.db) {
      options.sublevel = null;
    }

    this._del(db.prefixKey(keyEncoding.encode(key), keyFormat), options);
    this[kOperations$1].push({ ...original, type: 'del', key });

    return this
  }

  _del (key, options) {}

  clear () {
    if (this[kStatus$1] !== 'open') {
      throw new ModuleError$4('Batch is not open: cannot call clear() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      })
    }

    this._clear();
    this[kOperations$1] = [];

    return this
  }

  _clear () {}

  write (options, callback) {
    callback = getCallback$1(options, callback);
    callback = fromCallback$2(callback, kPromise$2);
    options = getOptions$1(options);

    if (this[kStatus$1] !== 'open') {
      this.nextTick(callback, new ModuleError$4('Batch is not open: cannot call write() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      }));
    } else if (this.length === 0) {
      this.close(callback);
    } else {
      this[kStatus$1] = 'writing';
      this._write(options, (err) => {
        this[kStatus$1] = 'closing';
        this[kCloseCallbacks].push(() => callback(err));

        // Emit after setting 'closing' status, because event may trigger a
        // db close which in turn triggers (idempotently) closing this batch.
        if (!err) this.db.emit('batch', this[kOperations$1]);

        this._close(this[kFinishClose]);
      });
    }

    return callback[kPromise$2]
  }

  _write (options, callback) {}

  close (callback) {
    callback = fromCallback$2(callback, kPromise$2);

    if (this[kStatus$1] === 'closing') {
      this[kCloseCallbacks].push(callback);
    } else if (this[kStatus$1] === 'closed') {
      this.nextTick(callback);
    } else {
      this[kCloseCallbacks].push(callback);

      if (this[kStatus$1] !== 'writing') {
        this[kStatus$1] = 'closing';
        this._close(this[kFinishClose]);
      }
    }

    return callback[kPromise$2]
  }

  _close (callback) {
    this.nextTick(callback);
  }

  [kFinishClose] () {
    this[kStatus$1] = 'closed';
    this.db.detachResource(this);

    const callbacks = this[kCloseCallbacks];
    this[kCloseCallbacks] = [];

    for (const cb of callbacks) {
      cb();
    }
  }
}

abstractChainedBatch.AbstractChainedBatch = AbstractChainedBatch$1;

const { AbstractChainedBatch } = abstractChainedBatch;
const ModuleError$3 = moduleError;
const kEncoded = Symbol('encoded');

// Functional default for chained batch, with support of deferred open
class DefaultChainedBatch$1 extends AbstractChainedBatch {
  constructor (db) {
    super(db);
    this[kEncoded] = [];
  }

  _put (key, value, options) {
    this[kEncoded].push({ ...options, type: 'put', key, value });
  }

  _del (key, options) {
    this[kEncoded].push({ ...options, type: 'del', key });
  }

  _clear () {
    this[kEncoded] = [];
  }

  // Assumes this[kEncoded] cannot change after write()
  _write (options, callback) {
    if (this.db.status === 'opening') {
      this.db.defer(() => this._write(options, callback));
    } else if (this.db.status === 'open') {
      if (this[kEncoded].length === 0) this.nextTick(callback);
      else this.db._batch(this[kEncoded], options, callback);
    } else {
      this.nextTick(callback, new ModuleError$3('Batch is not open: cannot call write() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      }));
    }
  }
}

defaultChainedBatch.DefaultChainedBatch = DefaultChainedBatch$1;

const ModuleError$2 = moduleError;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const rangeOptions$1 = new Set(['lt', 'lte', 'gt', 'gte']);

var rangeOptions_1 = function (options, keyEncoding) {
  const result = {};

  for (const k in options) {
    if (!hasOwnProperty.call(options, k)) continue
    if (k === 'keyEncoding' || k === 'valueEncoding') continue

    if (k === 'start' || k === 'end') {
      throw new ModuleError$2(`The legacy range option '${k}' has been removed`, {
        code: 'LEVEL_LEGACY'
      })
    } else if (k === 'encoding') {
      // To help migrating to abstract-level
      throw new ModuleError$2("The levelup-style 'encoding' alias has been removed, use 'valueEncoding' instead", {
        code: 'LEVEL_LEGACY'
      })
    }

    if (rangeOptions$1.has(k)) {
      // Note that we don't reject nullish and empty options here. While
      // those types are invalid as keys, they are valid as range options.
      result[k] = keyEncoding.encode(options[k]);
    } else {
      result[k] = options[k];
    }
  }

  result.reverse = !!result.reverse;
  result.limit = Number.isInteger(result.limit) && result.limit >= 0 ? result.limit : -1;

  return result
};

var nextTick;
var hasRequiredNextTick;

function requireNextTick () {
	if (hasRequiredNextTick) return nextTick;
	hasRequiredNextTick = 1;

	nextTick = process.nextTick;
	return nextTick;
}

var abstractSublevelIterator = {};

var hasRequiredAbstractSublevelIterator;

function requireAbstractSublevelIterator () {
	if (hasRequiredAbstractSublevelIterator) return abstractSublevelIterator;
	hasRequiredAbstractSublevelIterator = 1;

	const { AbstractIterator, AbstractKeyIterator, AbstractValueIterator } = abstractIterator;

	const kUnfix = Symbol('unfix');
	const kIterator = Symbol('iterator');
	const kHandleOne = Symbol('handleOne');
	const kHandleMany = Symbol('handleMany');
	const kCallback = Symbol('callback');

	// TODO: unfix natively if db supports it
	class AbstractSublevelIterator extends AbstractIterator {
	  constructor (db, options, iterator, unfix) {
	    super(db, options);

	    this[kIterator] = iterator;
	    this[kUnfix] = unfix;
	    this[kHandleOne] = this[kHandleOne].bind(this);
	    this[kHandleMany] = this[kHandleMany].bind(this);
	    this[kCallback] = null;
	  }

	  [kHandleOne] (err, key, value) {
	    const callback = this[kCallback];
	    if (err) return callback(err)
	    if (key !== undefined) key = this[kUnfix](key);
	    callback(err, key, value);
	  }

	  [kHandleMany] (err, entries) {
	    const callback = this[kCallback];
	    if (err) return callback(err)

	    for (const entry of entries) {
	      const key = entry[0];
	      if (key !== undefined) entry[0] = this[kUnfix](key);
	    }

	    callback(err, entries);
	  }
	}

	class AbstractSublevelKeyIterator extends AbstractKeyIterator {
	  constructor (db, options, iterator, unfix) {
	    super(db, options);

	    this[kIterator] = iterator;
	    this[kUnfix] = unfix;
	    this[kHandleOne] = this[kHandleOne].bind(this);
	    this[kHandleMany] = this[kHandleMany].bind(this);
	    this[kCallback] = null;
	  }

	  [kHandleOne] (err, key) {
	    const callback = this[kCallback];
	    if (err) return callback(err)
	    if (key !== undefined) key = this[kUnfix](key);
	    callback(err, key);
	  }

	  [kHandleMany] (err, keys) {
	    const callback = this[kCallback];
	    if (err) return callback(err)

	    for (let i = 0; i < keys.length; i++) {
	      const key = keys[i];
	      if (key !== undefined) keys[i] = this[kUnfix](key);
	    }

	    callback(err, keys);
	  }
	}

	class AbstractSublevelValueIterator extends AbstractValueIterator {
	  constructor (db, options, iterator) {
	    super(db, options);
	    this[kIterator] = iterator;
	  }
	}

	for (const Iterator of [AbstractSublevelIterator, AbstractSublevelKeyIterator]) {
	  Iterator.prototype._next = function (callback) {
	    this[kCallback] = callback;
	    this[kIterator].next(this[kHandleOne]);
	  };

	  Iterator.prototype._nextv = function (size, options, callback) {
	    this[kCallback] = callback;
	    this[kIterator].nextv(size, options, this[kHandleMany]);
	  };

	  Iterator.prototype._all = function (options, callback) {
	    this[kCallback] = callback;
	    this[kIterator].all(options, this[kHandleMany]);
	  };
	}

	for (const Iterator of [AbstractSublevelValueIterator]) {
	  Iterator.prototype._next = function (callback) {
	    this[kIterator].next(callback);
	  };

	  Iterator.prototype._nextv = function (size, options, callback) {
	    this[kIterator].nextv(size, options, callback);
	  };

	  Iterator.prototype._all = function (options, callback) {
	    this[kIterator].all(options, callback);
	  };
	}

	for (const Iterator of [AbstractSublevelIterator, AbstractSublevelKeyIterator, AbstractSublevelValueIterator]) {
	  Iterator.prototype._seek = function (target, options) {
	    this[kIterator].seek(target, options);
	  };

	  Iterator.prototype._close = function (callback) {
	    this[kIterator].close(callback);
	  };
	}

	abstractSublevelIterator.AbstractSublevelIterator = AbstractSublevelIterator;
	abstractSublevelIterator.AbstractSublevelKeyIterator = AbstractSublevelKeyIterator;
	abstractSublevelIterator.AbstractSublevelValueIterator = AbstractSublevelValueIterator;
	return abstractSublevelIterator;
}

var abstractSublevel;
var hasRequiredAbstractSublevel;

function requireAbstractSublevel () {
	if (hasRequiredAbstractSublevel) return abstractSublevel;
	hasRequiredAbstractSublevel = 1;

	const ModuleError = moduleError;
	const { Buffer } = require$$0 || {};
	const {
	  AbstractSublevelIterator,
	  AbstractSublevelKeyIterator,
	  AbstractSublevelValueIterator
	} = requireAbstractSublevelIterator();

	const kPrefix = Symbol('prefix');
	const kUpperBound = Symbol('upperBound');
	const kPrefixRange = Symbol('prefixRange');
	const kParent = Symbol('parent');
	const kUnfix = Symbol('unfix');

	const textEncoder = new TextEncoder();
	const defaults = { separator: '!' };

	// Wrapped to avoid circular dependency
	abstractSublevel = function ({ AbstractLevel }) {
	  class AbstractSublevel extends AbstractLevel {
	    static defaults (options) {
	      // To help migrating from subleveldown to abstract-level
	      if (typeof options === 'string') {
	        throw new ModuleError('The subleveldown string shorthand for { separator } has been removed', {
	          code: 'LEVEL_LEGACY'
	        })
	      } else if (options && options.open) {
	        throw new ModuleError('The subleveldown open option has been removed', {
	          code: 'LEVEL_LEGACY'
	        })
	      }

	      if (options == null) {
	        return defaults
	      } else if (!options.separator) {
	        return { ...options, separator: '!' }
	      } else {
	        return options
	      }
	    }

	    // TODO: add autoClose option, which if true, does parent.attachResource(this)
	    constructor (db, name, options) {
	      // Don't forward AbstractSublevel options to AbstractLevel
	      const { separator, manifest, ...forward } = AbstractSublevel.defaults(options);
	      name = trim(name, separator);

	      // Reserve one character between separator and name to give us an upper bound
	      const reserved = separator.charCodeAt(0) + 1;
	      const parent = db[kParent] || db;

	      // Keys should sort like ['!a!', '!a!!a!', '!a"', '!aa!', '!b!'].
	      // Use ASCII for consistent length between string, Buffer and Uint8Array
	      if (!textEncoder.encode(name).every(x => x > reserved && x < 127)) {
	        throw new ModuleError(`Prefix must use bytes > ${reserved} < ${127}`, {
	          code: 'LEVEL_INVALID_PREFIX'
	        })
	      }

	      super(mergeManifests(parent, manifest), forward);

	      const prefix = (db.prefix || '') + separator + name + separator;
	      const upperBound = prefix.slice(0, -1) + String.fromCharCode(reserved);

	      this[kParent] = parent;
	      this[kPrefix] = new MultiFormat(prefix);
	      this[kUpperBound] = new MultiFormat(upperBound);
	      this[kUnfix] = new Unfixer();

	      this.nextTick = parent.nextTick;
	    }

	    prefixKey (key, keyFormat) {
	      if (keyFormat === 'utf8') {
	        return this[kPrefix].utf8 + key
	      } else if (key.byteLength === 0) {
	        // Fast path for empty key (no copy)
	        return this[kPrefix][keyFormat]
	      } else if (keyFormat === 'view') {
	        const view = this[kPrefix].view;
	        const result = new Uint8Array(view.byteLength + key.byteLength);

	        result.set(view, 0);
	        result.set(key, view.byteLength);

	        return result
	      } else {
	        const buffer = this[kPrefix].buffer;
	        return Buffer.concat([buffer, key], buffer.byteLength + key.byteLength)
	      }
	    }

	    // Not exposed for now.
	    [kPrefixRange] (range, keyFormat) {
	      if (range.gte !== undefined) {
	        range.gte = this.prefixKey(range.gte, keyFormat);
	      } else if (range.gt !== undefined) {
	        range.gt = this.prefixKey(range.gt, keyFormat);
	      } else {
	        range.gte = this[kPrefix][keyFormat];
	      }

	      if (range.lte !== undefined) {
	        range.lte = this.prefixKey(range.lte, keyFormat);
	      } else if (range.lt !== undefined) {
	        range.lt = this.prefixKey(range.lt, keyFormat);
	      } else {
	        range.lte = this[kUpperBound][keyFormat];
	      }
	    }

	    get prefix () {
	      return this[kPrefix].utf8
	    }

	    get db () {
	      return this[kParent]
	    }

	    _open (options, callback) {
	      // The parent db must open itself or be (re)opened by the user because
	      // a sublevel should not initiate state changes on the rest of the db.
	      this[kParent].open({ passive: true }, callback);
	    }

	    _put (key, value, options, callback) {
	      this[kParent].put(key, value, options, callback);
	    }

	    _get (key, options, callback) {
	      this[kParent].get(key, options, callback);
	    }

	    _getMany (keys, options, callback) {
	      this[kParent].getMany(keys, options, callback);
	    }

	    _del (key, options, callback) {
	      this[kParent].del(key, options, callback);
	    }

	    _batch (operations, options, callback) {
	      this[kParent].batch(operations, options, callback);
	    }

	    _clear (options, callback) {
	      // TODO (refactor): move to AbstractLevel
	      this[kPrefixRange](options, options.keyEncoding);
	      this[kParent].clear(options, callback);
	    }

	    _iterator (options) {
	      // TODO (refactor): move to AbstractLevel
	      this[kPrefixRange](options, options.keyEncoding);
	      const iterator = this[kParent].iterator(options);
	      const unfix = this[kUnfix].get(this[kPrefix].utf8.length, options.keyEncoding);
	      return new AbstractSublevelIterator(this, options, iterator, unfix)
	    }

	    _keys (options) {
	      this[kPrefixRange](options, options.keyEncoding);
	      const iterator = this[kParent].keys(options);
	      const unfix = this[kUnfix].get(this[kPrefix].utf8.length, options.keyEncoding);
	      return new AbstractSublevelKeyIterator(this, options, iterator, unfix)
	    }

	    _values (options) {
	      this[kPrefixRange](options, options.keyEncoding);
	      const iterator = this[kParent].values(options);
	      return new AbstractSublevelValueIterator(this, options, iterator)
	    }
	  }

	  return { AbstractSublevel }
	};

	const mergeManifests = function (parent, manifest) {
	  return {
	    // Inherit manifest of parent db
	    ...parent.supports,

	    // Disable unsupported features
	    createIfMissing: false,
	    errorIfExists: false,

	    // Unset additional events because we're not forwarding them
	    events: {},

	    // Unset additional methods (like approximateSize) which we can't support here unless
	    // the AbstractSublevel class is overridden by an implementation of `abstract-level`.
	    additionalMethods: {},

	    // Inherit manifest of custom AbstractSublevel subclass. Such a class is not
	    // allowed to override encodings.
	    ...manifest,

	    encodings: {
	      utf8: supportsEncoding(parent, 'utf8'),
	      buffer: supportsEncoding(parent, 'buffer'),
	      view: supportsEncoding(parent, 'view')
	    }
	  }
	};

	const supportsEncoding = function (parent, encoding) {
	  // Prefer a non-transcoded encoding for optimal performance
	  return parent.supports.encodings[encoding]
	    ? parent.keyEncoding(encoding).name === encoding
	    : false
	};

	class MultiFormat {
	  constructor (key) {
	    this.utf8 = key;
	    this.view = textEncoder.encode(key);
	    this.buffer = Buffer ? Buffer.from(this.view.buffer, 0, this.view.byteLength) : {};
	  }
	}

	class Unfixer {
	  constructor () {
	    this.cache = new Map();
	  }

	  get (prefixLength, keyFormat) {
	    let unfix = this.cache.get(keyFormat);

	    if (unfix === undefined) {
	      if (keyFormat === 'view') {
	        unfix = function (prefixLength, key) {
	          // Avoid Uint8Array#slice() because it copies
	          return key.subarray(prefixLength)
	        }.bind(null, prefixLength);
	      } else {
	        unfix = function (prefixLength, key) {
	          // Avoid Buffer#subarray() because it's slow
	          return key.slice(prefixLength)
	        }.bind(null, prefixLength);
	      }

	      this.cache.set(keyFormat, unfix);
	    }

	    return unfix
	  }
	}

	const trim = function (str, char) {
	  let start = 0;
	  let end = str.length;

	  while (start < end && str[start] === char) start++;
	  while (end > start && str[end - 1] === char) end--;

	  return str.slice(start, end)
	};
	return abstractSublevel;
}

const { supports } = levelSupports;
const { Transcoder } = levelTranscoder;
const { EventEmitter } = require$$2;
const { fromCallback: fromCallback$1 } = catering;
const ModuleError$1 = moduleError;
const { AbstractIterator: AbstractIterator$1 } = abstractIterator;
const { DefaultKeyIterator, DefaultValueIterator } = defaultKvIterator;
const { DeferredIterator, DeferredKeyIterator, DeferredValueIterator } = deferredIterator;
const { DefaultChainedBatch } = defaultChainedBatch;
const { getCallback, getOptions } = common;
const rangeOptions = rangeOptions_1;

const kPromise$1 = Symbol('promise');
const kLanded = Symbol('landed');
const kResources = Symbol('resources');
const kCloseResources = Symbol('closeResources');
const kOperations = Symbol('operations');
const kUndefer = Symbol('undefer');
const kDeferOpen = Symbol('deferOpen');
const kOptions$1 = Symbol('options');
const kStatus = Symbol('status');
const kDefaultOptions = Symbol('defaultOptions');
const kTranscoder = Symbol('transcoder');
const kKeyEncoding = Symbol('keyEncoding');
const kValueEncoding = Symbol('valueEncoding');
const noop = () => {};

class AbstractLevel$1 extends EventEmitter {
  constructor (manifest, options) {
    super();

    if (typeof manifest !== 'object' || manifest === null) {
      throw new TypeError("The first argument 'manifest' must be an object")
    }

    options = getOptions(options);
    const { keyEncoding, valueEncoding, passive, ...forward } = options;

    this[kResources] = new Set();
    this[kOperations] = [];
    this[kDeferOpen] = true;
    this[kOptions$1] = forward;
    this[kStatus] = 'opening';

    this.supports = supports(manifest, {
      status: true,
      promises: true,
      clear: true,
      getMany: true,
      deferredOpen: true,

      // TODO (next major): add seek
      snapshots: manifest.snapshots !== false,
      permanence: manifest.permanence !== false,

      // TODO: remove from level-supports because it's always supported
      keyIterator: true,
      valueIterator: true,
      iteratorNextv: true,
      iteratorAll: true,

      encodings: manifest.encodings || {},
      events: Object.assign({}, manifest.events, {
        opening: true,
        open: true,
        closing: true,
        closed: true,
        put: true,
        del: true,
        batch: true,
        clear: true
      })
    });

    this[kTranscoder] = new Transcoder(formats(this));
    this[kKeyEncoding] = this[kTranscoder].encoding(keyEncoding || 'utf8');
    this[kValueEncoding] = this[kTranscoder].encoding(valueEncoding || 'utf8');

    // Add custom and transcoder encodings to manifest
    for (const encoding of this[kTranscoder].encodings()) {
      if (!this.supports.encodings[encoding.commonName]) {
        this.supports.encodings[encoding.commonName] = true;
      }
    }

    this[kDefaultOptions] = {
      empty: Object.freeze({}),
      entry: Object.freeze({
        keyEncoding: this[kKeyEncoding].commonName,
        valueEncoding: this[kValueEncoding].commonName
      }),
      key: Object.freeze({
        keyEncoding: this[kKeyEncoding].commonName
      })
    };

    // Let subclass finish its constructor
    this.nextTick(() => {
      if (this[kDeferOpen]) {
        this.open({ passive: false }, noop);
      }
    });
  }

  get status () {
    return this[kStatus]
  }

  keyEncoding (encoding) {
    return this[kTranscoder].encoding(encoding != null ? encoding : this[kKeyEncoding])
  }

  valueEncoding (encoding) {
    return this[kTranscoder].encoding(encoding != null ? encoding : this[kValueEncoding])
  }

  open (options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback$1(callback, kPromise$1);

    options = { ...this[kOptions$1], ...getOptions(options) };

    options.createIfMissing = options.createIfMissing !== false;
    options.errorIfExists = !!options.errorIfExists;

    const maybeOpened = (err) => {
      if (this[kStatus] === 'closing' || this[kStatus] === 'opening') {
        // Wait until pending state changes are done
        this.once(kLanded, err ? () => maybeOpened(err) : maybeOpened);
      } else if (this[kStatus] !== 'open') {
        callback(new ModuleError$1('Database is not open', {
          code: 'LEVEL_DATABASE_NOT_OPEN',
          cause: err
        }));
      } else {
        callback();
      }
    };

    if (options.passive) {
      if (this[kStatus] === 'opening') {
        this.once(kLanded, maybeOpened);
      } else {
        this.nextTick(maybeOpened);
      }
    } else if (this[kStatus] === 'closed' || this[kDeferOpen]) {
      this[kDeferOpen] = false;
      this[kStatus] = 'opening';
      this.emit('opening');

      this._open(options, (err) => {
        if (err) {
          this[kStatus] = 'closed';

          // Resources must be safe to close in any db state
          this[kCloseResources](() => {
            this.emit(kLanded);
            maybeOpened(err);
          });

          this[kUndefer]();
          return
        }

        this[kStatus] = 'open';
        this[kUndefer]();
        this.emit(kLanded);

        // Only emit public event if pending state changes are done
        if (this[kStatus] === 'open') this.emit('open');

        // TODO (next major): remove this alias
        if (this[kStatus] === 'open') this.emit('ready');

        maybeOpened();
      });
    } else if (this[kStatus] === 'open') {
      this.nextTick(maybeOpened);
    } else {
      this.once(kLanded, () => this.open(options, callback));
    }

    return callback[kPromise$1]
  }

  _open (options, callback) {
    this.nextTick(callback);
  }

  close (callback) {
    callback = fromCallback$1(callback, kPromise$1);

    const maybeClosed = (err) => {
      if (this[kStatus] === 'opening' || this[kStatus] === 'closing') {
        // Wait until pending state changes are done
        this.once(kLanded, err ? maybeClosed(err) : maybeClosed);
      } else if (this[kStatus] !== 'closed') {
        callback(new ModuleError$1('Database is not closed', {
          code: 'LEVEL_DATABASE_NOT_CLOSED',
          cause: err
        }));
      } else {
        callback();
      }
    };

    if (this[kStatus] === 'open') {
      this[kStatus] = 'closing';
      this.emit('closing');

      const cancel = (err) => {
        this[kStatus] = 'open';
        this[kUndefer]();
        this.emit(kLanded);
        maybeClosed(err);
      };

      this[kCloseResources](() => {
        this._close((err) => {
          if (err) return cancel(err)

          this[kStatus] = 'closed';
          this[kUndefer]();
          this.emit(kLanded);

          // Only emit public event if pending state changes are done
          if (this[kStatus] === 'closed') this.emit('closed');

          maybeClosed();
        });
      });
    } else if (this[kStatus] === 'closed') {
      this.nextTick(maybeClosed);
    } else {
      this.once(kLanded, () => this.close(callback));
    }

    return callback[kPromise$1]
  }

  [kCloseResources] (callback) {
    if (this[kResources].size === 0) {
      return this.nextTick(callback)
    }

    let pending = this[kResources].size;
    let sync = true;

    const next = () => {
      if (--pending === 0) {
        // We don't have tests for generic resources, so dezalgo
        if (sync) this.nextTick(callback);
        else callback();
      }
    };

    // In parallel so that all resources know they are closed
    for (const resource of this[kResources]) {
      resource.close(next);
    }

    sync = false;
    this[kResources].clear();
  }

  _close (callback) {
    this.nextTick(callback);
  }

  get (key, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions(options, this[kDefaultOptions].entry);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.get(key, options, callback));
      return callback[kPromise$1]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise$1]
    }

    const err = this._checkKey(key);

    if (err) {
      this.nextTick(callback, err);
      return callback[kPromise$1]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const valueEncoding = this.valueEncoding(options.valueEncoding);
    const keyFormat = keyEncoding.format;
    const valueFormat = valueEncoding.format;

    // Forward encoding options to the underlying store
    if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
      // Avoid spread operator because of https://bugs.chromium.org/p/chromium/issues/detail?id=1204540
      options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
    }

    this._get(this.prefixKey(keyEncoding.encode(key), keyFormat), options, (err, value) => {
      if (err) {
        // Normalize not found error for backwards compatibility with abstract-leveldown and level(up)
        if (err.code === 'LEVEL_NOT_FOUND' || err.notFound || /NotFound/i.test(err)) {
          if (!err.code) err.code = 'LEVEL_NOT_FOUND'; // Preferred way going forward
          if (!err.notFound) err.notFound = true; // Same as level-errors
          if (!err.status) err.status = 404; // Same as level-errors
        }

        return callback(err)
      }

      try {
        value = valueEncoding.decode(value);
      } catch (err) {
        return callback(new ModuleError$1('Could not decode value', {
          code: 'LEVEL_DECODE_ERROR',
          cause: err
        }))
      }

      callback(null, value);
    });

    return callback[kPromise$1]
  }

  _get (key, options, callback) {
    this.nextTick(callback, new Error('NotFound'));
  }

  getMany (keys, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions(options, this[kDefaultOptions].entry);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.getMany(keys, options, callback));
      return callback[kPromise$1]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise$1]
    }

    if (!Array.isArray(keys)) {
      this.nextTick(callback, new TypeError("The first argument 'keys' must be an array"));
      return callback[kPromise$1]
    }

    if (keys.length === 0) {
      this.nextTick(callback, null, []);
      return callback[kPromise$1]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const valueEncoding = this.valueEncoding(options.valueEncoding);
    const keyFormat = keyEncoding.format;
    const valueFormat = valueEncoding.format;

    // Forward encoding options
    if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
      options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
    }

    const mappedKeys = new Array(keys.length);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const err = this._checkKey(key);

      if (err) {
        this.nextTick(callback, err);
        return callback[kPromise$1]
      }

      mappedKeys[i] = this.prefixKey(keyEncoding.encode(key), keyFormat);
    }

    this._getMany(mappedKeys, options, (err, values) => {
      if (err) return callback(err)

      try {
        for (let i = 0; i < values.length; i++) {
          if (values[i] !== undefined) {
            values[i] = valueEncoding.decode(values[i]);
          }
        }
      } catch (err) {
        return callback(new ModuleError$1(`Could not decode one or more of ${values.length} value(s)`, {
          code: 'LEVEL_DECODE_ERROR',
          cause: err
        }))
      }

      callback(null, values);
    });

    return callback[kPromise$1]
  }

  _getMany (keys, options, callback) {
    this.nextTick(callback, null, new Array(keys.length).fill(undefined));
  }

  put (key, value, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions(options, this[kDefaultOptions].entry);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.put(key, value, options, callback));
      return callback[kPromise$1]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise$1]
    }

    const err = this._checkKey(key) || this._checkValue(value);

    if (err) {
      this.nextTick(callback, err);
      return callback[kPromise$1]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const valueEncoding = this.valueEncoding(options.valueEncoding);
    const keyFormat = keyEncoding.format;
    const valueFormat = valueEncoding.format;

    // Forward encoding options
    if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
      options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
    }

    const mappedKey = this.prefixKey(keyEncoding.encode(key), keyFormat);
    const mappedValue = valueEncoding.encode(value);

    this._put(mappedKey, mappedValue, options, (err) => {
      if (err) return callback(err)
      this.emit('put', key, value);
      callback();
    });

    return callback[kPromise$1]
  }

  _put (key, value, options, callback) {
    this.nextTick(callback);
  }

  del (key, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions(options, this[kDefaultOptions].key);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.del(key, options, callback));
      return callback[kPromise$1]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise$1]
    }

    const err = this._checkKey(key);

    if (err) {
      this.nextTick(callback, err);
      return callback[kPromise$1]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const keyFormat = keyEncoding.format;

    // Forward encoding options
    if (options.keyEncoding !== keyFormat) {
      options = Object.assign({}, options, { keyEncoding: keyFormat });
    }

    this._del(this.prefixKey(keyEncoding.encode(key), keyFormat), options, (err) => {
      if (err) return callback(err)
      this.emit('del', key);
      callback();
    });

    return callback[kPromise$1]
  }

  _del (key, options, callback) {
    this.nextTick(callback);
  }

  batch (operations, options, callback) {
    if (!arguments.length) {
      if (this[kStatus] === 'opening') return new DefaultChainedBatch(this)
      if (this[kStatus] !== 'open') {
        throw new ModuleError$1('Database is not open', {
          code: 'LEVEL_DATABASE_NOT_OPEN'
        })
      }
      return this._chainedBatch()
    }

    if (typeof operations === 'function') callback = operations;
    else callback = getCallback(options, callback);

    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions(options, this[kDefaultOptions].empty);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.batch(operations, options, callback));
      return callback[kPromise$1]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise$1]
    }

    if (!Array.isArray(operations)) {
      this.nextTick(callback, new TypeError("The first argument 'operations' must be an array"));
      return callback[kPromise$1]
    }

    if (operations.length === 0) {
      this.nextTick(callback);
      return callback[kPromise$1]
    }

    const mapped = new Array(operations.length);
    const { keyEncoding: ke, valueEncoding: ve, ...forward } = options;

    for (let i = 0; i < operations.length; i++) {
      if (typeof operations[i] !== 'object' || operations[i] === null) {
        this.nextTick(callback, new TypeError('A batch operation must be an object'));
        return callback[kPromise$1]
      }

      const op = Object.assign({}, operations[i]);

      if (op.type !== 'put' && op.type !== 'del') {
        this.nextTick(callback, new TypeError("A batch operation must have a type property that is 'put' or 'del'"));
        return callback[kPromise$1]
      }

      const err = this._checkKey(op.key);

      if (err) {
        this.nextTick(callback, err);
        return callback[kPromise$1]
      }

      const db = op.sublevel != null ? op.sublevel : this;
      const keyEncoding = db.keyEncoding(op.keyEncoding || ke);
      const keyFormat = keyEncoding.format;

      op.key = db.prefixKey(keyEncoding.encode(op.key), keyFormat);
      op.keyEncoding = keyFormat;

      if (op.type === 'put') {
        const valueErr = this._checkValue(op.value);

        if (valueErr) {
          this.nextTick(callback, valueErr);
          return callback[kPromise$1]
        }

        const valueEncoding = db.valueEncoding(op.valueEncoding || ve);

        op.value = valueEncoding.encode(op.value);
        op.valueEncoding = valueEncoding.format;
      }

      // Prevent double prefixing
      if (db !== this) {
        op.sublevel = null;
      }

      mapped[i] = op;
    }

    this._batch(mapped, forward, (err) => {
      if (err) return callback(err)
      this.emit('batch', operations);
      callback();
    });

    return callback[kPromise$1]
  }

  _batch (operations, options, callback) {
    this.nextTick(callback);
  }

  sublevel (name, options) {
    return this._sublevel(name, AbstractSublevel.defaults(options))
  }

  _sublevel (name, options) {
    return new AbstractSublevel(this, name, options)
  }

  prefixKey (key, keyFormat) {
    return key
  }

  clear (options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions(options, this[kDefaultOptions].empty);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.clear(options, callback));
      return callback[kPromise$1]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise$1]
    }

    const original = options;
    const keyEncoding = this.keyEncoding(options.keyEncoding);

    options = rangeOptions(options, keyEncoding);
    options.keyEncoding = keyEncoding.format;

    if (options.limit === 0) {
      this.nextTick(callback);
    } else {
      this._clear(options, (err) => {
        if (err) return callback(err)
        this.emit('clear', original);
        callback();
      });
    }

    return callback[kPromise$1]
  }

  _clear (options, callback) {
    this.nextTick(callback);
  }

  iterator (options) {
    const keyEncoding = this.keyEncoding(options && options.keyEncoding);
    const valueEncoding = this.valueEncoding(options && options.valueEncoding);

    options = rangeOptions(options, keyEncoding);
    options.keys = options.keys !== false;
    options.values = options.values !== false;

    // We need the original encoding options in AbstractIterator in order to decode data
    options[AbstractIterator$1.keyEncoding] = keyEncoding;
    options[AbstractIterator$1.valueEncoding] = valueEncoding;

    // Forward encoding options to private API
    options.keyEncoding = keyEncoding.format;
    options.valueEncoding = valueEncoding.format;

    if (this[kStatus] === 'opening') {
      return new DeferredIterator(this, options)
    } else if (this[kStatus] !== 'open') {
      throw new ModuleError$1('Database is not open', {
        code: 'LEVEL_DATABASE_NOT_OPEN'
      })
    }

    return this._iterator(options)
  }

  _iterator (options) {
    return new AbstractIterator$1(this, options)
  }

  keys (options) {
    // Also include valueEncoding (though unused) because we may fallback to _iterator()
    const keyEncoding = this.keyEncoding(options && options.keyEncoding);
    const valueEncoding = this.valueEncoding(options && options.valueEncoding);

    options = rangeOptions(options, keyEncoding);

    // We need the original encoding options in AbstractKeyIterator in order to decode data
    options[AbstractIterator$1.keyEncoding] = keyEncoding;
    options[AbstractIterator$1.valueEncoding] = valueEncoding;

    // Forward encoding options to private API
    options.keyEncoding = keyEncoding.format;
    options.valueEncoding = valueEncoding.format;

    if (this[kStatus] === 'opening') {
      return new DeferredKeyIterator(this, options)
    } else if (this[kStatus] !== 'open') {
      throw new ModuleError$1('Database is not open', {
        code: 'LEVEL_DATABASE_NOT_OPEN'
      })
    }

    return this._keys(options)
  }

  _keys (options) {
    return new DefaultKeyIterator(this, options)
  }

  values (options) {
    const keyEncoding = this.keyEncoding(options && options.keyEncoding);
    const valueEncoding = this.valueEncoding(options && options.valueEncoding);

    options = rangeOptions(options, keyEncoding);

    // We need the original encoding options in AbstractValueIterator in order to decode data
    options[AbstractIterator$1.keyEncoding] = keyEncoding;
    options[AbstractIterator$1.valueEncoding] = valueEncoding;

    // Forward encoding options to private API
    options.keyEncoding = keyEncoding.format;
    options.valueEncoding = valueEncoding.format;

    if (this[kStatus] === 'opening') {
      return new DeferredValueIterator(this, options)
    } else if (this[kStatus] !== 'open') {
      throw new ModuleError$1('Database is not open', {
        code: 'LEVEL_DATABASE_NOT_OPEN'
      })
    }

    return this._values(options)
  }

  _values (options) {
    return new DefaultValueIterator(this, options)
  }

  defer (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('The first argument must be a function')
    }

    this[kOperations].push(fn);
  }

  [kUndefer] () {
    if (this[kOperations].length === 0) {
      return
    }

    const operations = this[kOperations];
    this[kOperations] = [];

    for (const op of operations) {
      op();
    }
  }

  // TODO: docs and types
  attachResource (resource) {
    if (typeof resource !== 'object' || resource === null ||
      typeof resource.close !== 'function') {
      throw new TypeError('The first argument must be a resource object')
    }

    this[kResources].add(resource);
  }

  // TODO: docs and types
  detachResource (resource) {
    this[kResources].delete(resource);
  }

  _chainedBatch () {
    return new DefaultChainedBatch(this)
  }

  _checkKey (key) {
    if (key === null || key === undefined) {
      return new ModuleError$1('Key cannot be null or undefined', {
        code: 'LEVEL_INVALID_KEY'
      })
    }
  }

  _checkValue (value) {
    if (value === null || value === undefined) {
      return new ModuleError$1('Value cannot be null or undefined', {
        code: 'LEVEL_INVALID_VALUE'
      })
    }
  }
}

// Expose browser-compatible nextTick for dependents
// TODO: after we drop node 10, also use queueMicrotask in node
AbstractLevel$1.prototype.nextTick = requireNextTick();

const { AbstractSublevel } = requireAbstractSublevel()({ AbstractLevel: AbstractLevel$1 });

abstractLevel.AbstractLevel = AbstractLevel$1;
abstractLevel.AbstractSublevel = AbstractSublevel;

const maybeError = function (db, callback) {
  if (db[kStatus] !== 'open') {
    db.nextTick(callback, new ModuleError$1('Database is not open', {
      code: 'LEVEL_DATABASE_NOT_OPEN'
    }));
    return true
  }

  return false
};

const formats = function (db) {
  return Object.keys(db.supports.encodings)
    .filter(k => !!db.supports.encodings[k])
};

abstractLevel$1.AbstractLevel = abstractLevel.AbstractLevel;
abstractLevel$1.AbstractSublevel = abstractLevel.AbstractSublevel;
abstractLevel$1.AbstractIterator = abstractIterator.AbstractIterator;
abstractLevel$1.AbstractKeyIterator = abstractIterator.AbstractKeyIterator;
abstractLevel$1.AbstractValueIterator = abstractIterator.AbstractValueIterator;
abstractLevel$1.AbstractChainedBatch = abstractChainedBatch.AbstractChainedBatch;

/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

let promise;

var queueMicrotask_1 = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : commonjsGlobal)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0));

/*! run-parallel-limit. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var runParallelLimit_1 = runParallelLimit;

const queueMicrotask$1 = queueMicrotask_1;

function runParallelLimit (tasks, limit, cb) {
  if (typeof limit !== 'number') throw new Error('second argument must be a Number')
  let results, len, pending, keys, isErrored;
  let isSync = true;
  let next;

  if (Array.isArray(tasks)) {
    results = [];
    pending = len = tasks.length;
  } else {
    keys = Object.keys(tasks);
    results = {};
    pending = len = keys.length;
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results);
      cb = null;
    }
    if (isSync) queueMicrotask$1(end);
    else end();
  }

  function each (i, err, result) {
    results[i] = result;
    if (err) isErrored = true;
    if (--pending === 0 || err) {
      done(err);
    } else if (!isErrored && next < len) {
      let key;
      if (keys) {
        key = keys[next];
        next += 1;
        tasks[key](function (err, result) { each(key, err, result); });
      } else {
        key = next;
        next += 1;
        tasks[key](function (err, result) { each(key, err, result); });
      }
    }
  }

  next = limit;
  if (!pending) {
    // empty
    done(null);
  } else if (keys) {
    // object
    keys.some(function (key, i) {
      tasks[key](function (err, result) { each(key, err, result); });
      if (i === limit - 1) return true // early return
      return false
    });
  } else {
    // array
    tasks.some(function (task, i) {
      task(function (err, result) { each(i, err, result); });
      if (i === limit - 1) return true // early return
      return false
    });
  }

  isSync = false;
}

var iterator = {};

/* global IDBKeyRange */

var keyRange = function createKeyRange (options) {
  const lower = options.gte !== undefined ? options.gte : options.gt !== undefined ? options.gt : undefined;
  const upper = options.lte !== undefined ? options.lte : options.lt !== undefined ? options.lt : undefined;
  const lowerExclusive = options.gte === undefined;
  const upperExclusive = options.lte === undefined;

  if (lower !== undefined && upper !== undefined) {
    return IDBKeyRange.bound(lower, upper, lowerExclusive, upperExclusive)
  } else if (lower !== undefined) {
    return IDBKeyRange.lowerBound(lower, lowerExclusive)
  } else if (upper !== undefined) {
    return IDBKeyRange.upperBound(upper, upperExclusive)
  } else {
    return null
  }
};

const textEncoder = new TextEncoder();

var deserialize$2 = function (data) {
  if (data instanceof Uint8Array) {
    return data
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data)
  } else {
    // Non-binary data stored with an old version (level-js < 5.0.0)
    return textEncoder.encode(data)
  }
};

const { AbstractIterator } = abstractLevel$1;
const createKeyRange$1 = keyRange;
const deserialize$1 = deserialize$2;

const kCache = Symbol('cache');
const kFinished = Symbol('finished');
const kOptions = Symbol('options');
const kCurrentOptions = Symbol('currentOptions');
const kPosition = Symbol('position');
const kLocation$1 = Symbol('location');
const kFirst = Symbol('first');
const emptyOptions = {};

class Iterator$1 extends AbstractIterator {
  constructor (db, location, options) {
    super(db, options);

    this[kCache] = [];
    this[kFinished] = this.limit === 0;
    this[kOptions] = options;
    this[kCurrentOptions] = { ...options };
    this[kPosition] = undefined;
    this[kLocation$1] = location;
    this[kFirst] = true;
  }

  // Note: if called by _all() then size can be Infinity. This is an internal
  // detail; by design AbstractIterator.nextv() does not support Infinity.
  _nextv (size, options, callback) {
    this[kFirst] = false;

    if (this[kFinished]) {
      return this.nextTick(callback, null, [])
    } else if (this[kCache].length > 0) {
      // TODO: mixing next and nextv is not covered by test suite
      size = Math.min(size, this[kCache].length);
      return this.nextTick(callback, null, this[kCache].splice(0, size))
    }

    // Adjust range by what we already visited
    if (this[kPosition] !== undefined) {
      if (this[kOptions].reverse) {
        this[kCurrentOptions].lt = this[kPosition];
        this[kCurrentOptions].lte = undefined;
      } else {
        this[kCurrentOptions].gt = this[kPosition];
        this[kCurrentOptions].gte = undefined;
      }
    }

    let keyRange;

    try {
      keyRange = createKeyRange$1(this[kCurrentOptions]);
    } catch (_) {
      // The lower key is greater than the upper key.
      // IndexedDB throws an error, but we'll just return 0 results.
      this[kFinished] = true;
      return this.nextTick(callback, null, [])
    }

    const transaction = this.db.db.transaction([this[kLocation$1]], 'readonly');
    const store = transaction.objectStore(this[kLocation$1]);
    const entries = [];

    if (!this[kOptions].reverse) {
      let keys;
      let values;

      const complete = () => {
        // Wait for both requests to complete
        if (keys === undefined || values === undefined) return

        const length = Math.max(keys.length, values.length);

        if (length === 0 || size === Infinity) {
          this[kFinished] = true;
        } else {
          this[kPosition] = keys[length - 1];
        }

        // Resize
        entries.length = length;

        // Merge keys and values
        for (let i = 0; i < length; i++) {
          const key = keys[i];
          const value = values[i];

          entries[i] = [
            this[kOptions].keys && key !== undefined ? deserialize$1(key) : undefined,
            this[kOptions].values && value !== undefined ? deserialize$1(value) : undefined
          ];
        }

        maybeCommit(transaction);
      };

      // If keys were not requested and size is Infinity, we don't have to keep
      // track of position and can thus skip getting keys.
      if (this[kOptions].keys || size < Infinity) {
        store.getAllKeys(keyRange, size < Infinity ? size : undefined).onsuccess = (ev) => {
          keys = ev.target.result;
          complete();
        };
      } else {
        keys = [];
        this.nextTick(complete);
      }

      if (this[kOptions].values) {
        store.getAll(keyRange, size < Infinity ? size : undefined).onsuccess = (ev) => {
          values = ev.target.result;
          complete();
        };
      } else {
        values = [];
        this.nextTick(complete);
      }
    } else {
      // Can't use getAll() in reverse, so use a slower cursor that yields one item at a time
      // TODO: test if all target browsers support openKeyCursor
      const method = !this[kOptions].values && store.openKeyCursor ? 'openKeyCursor' : 'openCursor';

      store[method](keyRange, 'prev').onsuccess = (ev) => {
        const cursor = ev.target.result;

        if (cursor) {
          const { key, value } = cursor;
          this[kPosition] = key;

          entries.push([
            this[kOptions].keys && key !== undefined ? deserialize$1(key) : undefined,
            this[kOptions].values && value !== undefined ? deserialize$1(value) : undefined
          ]);

          if (entries.length < size) {
            cursor.continue();
          } else {
            maybeCommit(transaction);
          }
        } else {
          this[kFinished] = true;
        }
      };
    }

    // If an error occurs (on the request), the transaction will abort.
    transaction.onabort = () => {
      callback(transaction.error || new Error('aborted by user'));
      callback = null;
    };

    transaction.oncomplete = () => {
      callback(null, entries);
      callback = null;
    };
  }

  _next (callback) {
    if (this[kCache].length > 0) {
      const [key, value] = this[kCache].shift();
      this.nextTick(callback, null, key, value);
    } else if (this[kFinished]) {
      this.nextTick(callback);
    } else {
      let size = Math.min(100, this.limit - this.count);

      if (this[kFirst]) {
        // It's common to only want one entry initially or after a seek()
        this[kFirst] = false;
        size = 1;
      }

      this._nextv(size, emptyOptions, (err, entries) => {
        if (err) return callback(err)
        this[kCache] = entries;
        this._next(callback);
      });
    }
  }

  _all (options, callback) {
    this[kFirst] = false;

    // TODO: mixing next and all is not covered by test suite
    const cache = this[kCache].splice(0, this[kCache].length);
    const size = this.limit - this.count - cache.length;

    if (size <= 0) {
      return this.nextTick(callback, null, cache)
    }

    this._nextv(size, emptyOptions, (err, entries) => {
      if (err) return callback(err)
      if (cache.length > 0) entries = cache.concat(entries);
      callback(null, entries);
    });
  }

  _seek (target, options) {
    this[kFirst] = true;
    this[kCache] = [];
    this[kFinished] = false;
    this[kPosition] = undefined;

    // TODO: not covered by test suite
    this[kCurrentOptions] = { ...this[kOptions] };

    let keyRange;

    try {
      keyRange = createKeyRange$1(this[kOptions]);
    } catch (_) {
      this[kFinished] = true;
      return
    }

    if (keyRange !== null && !keyRange.includes(target)) {
      this[kFinished] = true;
    } else if (this[kOptions].reverse) {
      this[kCurrentOptions].lte = target;
    } else {
      this[kCurrentOptions].gte = target;
    }
  }
}

iterator.Iterator = Iterator$1;

function maybeCommit (transaction) {
  // Commit (meaning close) now instead of waiting for auto-commit
  if (typeof transaction.commit === 'function') {
    transaction.commit();
  }
}

var clear$1 = function clear (db, location, keyRange, options, callback) {
  if (options.limit === 0) return db.nextTick(callback)

  const transaction = db.db.transaction([location], 'readwrite');
  const store = transaction.objectStore(location);
  let count = 0;

  transaction.oncomplete = function () {
    callback();
  };

  transaction.onabort = function () {
    callback(transaction.error || new Error('aborted by user'));
  };

  // A key cursor is faster (skips reading values) but not supported by IE
  // TODO: we no longer support IE. Test others
  const method = store.openKeyCursor ? 'openKeyCursor' : 'openCursor';
  const direction = options.reverse ? 'prev' : 'next';

  store[method](keyRange, direction).onsuccess = function (ev) {
    const cursor = ev.target.result;

    if (cursor) {
      // Wait for a request to complete before continuing, saving CPU.
      store.delete(cursor.key).onsuccess = function () {
        if (options.limit <= 0 || ++count < options.limit) {
          cursor.continue();
        }
      };
    }
  };
};

/* global indexedDB */

const { AbstractLevel } = abstractLevel$1;
const ModuleError = moduleError;
const parallel = runParallelLimit_1;
const { fromCallback } = catering;
const { Iterator } = iterator;
const deserialize = deserialize$2;
const clear = clear$1;
const createKeyRange = keyRange;

// Keep as-is for compatibility with existing level-js databases
const DEFAULT_PREFIX = 'level-js-';

const kIDB = Symbol('idb');
const kNamePrefix = Symbol('namePrefix');
const kLocation = Symbol('location');
const kVersion = Symbol('version');
const kStore = Symbol('store');
const kOnComplete = Symbol('onComplete');
const kPromise = Symbol('promise');

class BrowserLevel extends AbstractLevel {
  constructor (location, options, _) {
    // To help migrating to abstract-level
    if (typeof options === 'function' || typeof _ === 'function') {
      throw new ModuleError('The levelup-style callback argument has been removed', {
        code: 'LEVEL_LEGACY'
      })
    }

    const { prefix, version, ...forward } = options || {};

    super({
      encodings: { view: true },
      snapshots: false,
      createIfMissing: false,
      errorIfExists: false,
      seek: true
    }, forward);

    if (typeof location !== 'string') {
      throw new Error('constructor requires a location string argument')
    }

    // TODO (next major): remove default prefix
    this[kLocation] = location;
    this[kNamePrefix] = prefix == null ? DEFAULT_PREFIX : prefix;
    this[kVersion] = parseInt(version || 1, 10);
    this[kIDB] = null;
  }

  get location () {
    return this[kLocation]
  }

  get namePrefix () {
    return this[kNamePrefix]
  }

  get version () {
    return this[kVersion]
  }

  // Exposed for backwards compat and unit tests
  get db () {
    return this[kIDB]
  }

  get type () {
    return 'browser-level'
  }

  _open (options, callback) {
    const req = indexedDB.open(this[kNamePrefix] + this[kLocation], this[kVersion]);

    req.onerror = function () {
      callback(req.error || new Error('unknown error'));
    };

    req.onsuccess = () => {
      this[kIDB] = req.result;
      callback();
    };

    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;

      if (!db.objectStoreNames.contains(this[kLocation])) {
        db.createObjectStore(this[kLocation]);
      }
    };
  }

  [kStore] (mode) {
    const transaction = this[kIDB].transaction([this[kLocation]], mode);
    return transaction.objectStore(this[kLocation])
  }

  [kOnComplete] (request, callback) {
    const transaction = request.transaction;

    // Take advantage of the fact that a non-canceled request error aborts
    // the transaction. I.e. no need to listen for "request.onerror".
    transaction.onabort = function () {
      callback(transaction.error || new Error('aborted by user'));
    };

    transaction.oncomplete = function () {
      callback(null, request.result);
    };
  }

  _get (key, options, callback) {
    const store = this[kStore]('readonly');
    let req;

    try {
      req = store.get(key);
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, function (err, value) {
      if (err) return callback(err)

      if (value === undefined) {
        return callback(new ModuleError('Entry not found', {
          code: 'LEVEL_NOT_FOUND'
        }))
      }

      callback(null, deserialize(value));
    });
  }

  _getMany (keys, options, callback) {
    const store = this[kStore]('readonly');
    const tasks = keys.map((key) => (next) => {
      let request;

      try {
        request = store.get(key);
      } catch (err) {
        return next(err)
      }

      request.onsuccess = () => {
        const value = request.result;
        next(null, value === undefined ? value : deserialize(value));
      };

      request.onerror = (ev) => {
        ev.stopPropagation();
        next(request.error);
      };
    });

    parallel(tasks, 16, callback);
  }

  _del (key, options, callback) {
    const store = this[kStore]('readwrite');
    let req;

    try {
      req = store.delete(key);
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, callback);
  }

  _put (key, value, options, callback) {
    const store = this[kStore]('readwrite');
    let req;

    try {
      // Will throw a DataError or DataCloneError if the environment
      // does not support serializing the key or value respectively.
      req = store.put(value, key);
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, callback);
  }

  // TODO: implement key and value iterators
  _iterator (options) {
    return new Iterator(this, this[kLocation], options)
  }

  _batch (operations, options, callback) {
    const store = this[kStore]('readwrite');
    const transaction = store.transaction;
    let index = 0;
    let error;

    transaction.onabort = function () {
      callback(error || transaction.error || new Error('aborted by user'));
    };

    transaction.oncomplete = function () {
      callback();
    };

    // Wait for a request to complete before making the next, saving CPU.
    function loop () {
      const op = operations[index++];
      const key = op.key;

      let req;

      try {
        req = op.type === 'del' ? store.delete(key) : store.put(op.value, key);
      } catch (err) {
        error = err;
        transaction.abort();
        return
      }

      if (index < operations.length) {
        req.onsuccess = loop;
      } else if (typeof transaction.commit === 'function') {
        // Commit now instead of waiting for auto-commit
        transaction.commit();
      }
    }

    loop();
  }

  _clear (options, callback) {
    let keyRange;
    let req;

    try {
      keyRange = createKeyRange(options);
    } catch (e) {
      // The lower key is greater than the upper key.
      // IndexedDB throws an error, but we'll just do nothing.
      return this.nextTick(callback)
    }

    if (options.limit >= 0) {
      // IDBObjectStore#delete(range) doesn't have such an option.
      // Fall back to cursor-based implementation.
      return clear(this, this[kLocation], keyRange, options, callback)
    }

    try {
      const store = this[kStore]('readwrite');
      req = keyRange ? store.delete(keyRange) : store.clear();
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, callback);
  }

  _close (callback) {
    this[kIDB].close();
    this.nextTick(callback);
  }
}

BrowserLevel.destroy = function (location, prefix, callback) {
  if (typeof prefix === 'function') {
    callback = prefix;
    prefix = DEFAULT_PREFIX;
  }

  callback = fromCallback(callback, kPromise);
  const request = indexedDB.deleteDatabase(prefix + location);

  request.onsuccess = function () {
    callback();
  };

  request.onerror = function (err) {
    callback(err);
  };

  return callback[kPromise]
};

var BrowserLevel_1 = BrowserLevel;

class Store {
  constructor(name = 'storage', root, version = 'v1.0.0') {
    this.name = name;
    this.root = root;
    this.version = version;

    this.db = new BrowserLevel_1(
      this.name,
      { valueEncoding: 'view'}
    );
  }

  toKeyPath(key) {
    return key ? key.toString('base32') : key
  }

  toKeyValue(value) {
    return value.uint8Array
  }

  async get(key) {
    return this.db.get(this.toKeyPath(key))
  }

  async put(key, value) {
    return this.db.put(this.toKeyPath(key), this.toKeyValue(value))
  }

  async delete(key) {
    return this.db.del(this.toKeyPath(key))
  }

  async clear() {
    return this.db.clear()
  }

  async values(limit = -1) {
    const values = [];
    for await (const value of this.db.values({limit})) {
      values.push(value);
    }
    return values
  }

  async keys(limit = -1) {
    const keys = [];
    for await (const key of this.db.keys({limit})) {
      keys.push(key);
    }
    return keys
  }

}

class LeofcoinStorage {

  constructor(name = 'storage', root = '.leofcoin') {
    this.name = name;
    this.db = new Store(name, root);
  }

  async get(key) {
    if (!key) return this.query()
    if (typeof key === 'object') return this.many('get', key);
    return this.db.get(new KeyPath(key))
  }
  
  /**
   * 
   * @param {*} key 
   * @param {*} value 
   * @returns Promise
   */
  put(key, value) {
    if (typeof key === 'object') return this.many('put', key);
    return this.db.put(new KeyPath(key), new KeyValue(value));
  }

  async has(key) {
    if (typeof key === 'object') return this.many('has', key);

    try {
      const has = await this.db.get(new KeyPath(key));

      return Boolean(has);
    } catch (e) {
      return false
    }
  }

  async delete(key) {
    return this.db.delete(new KeyPath(key))
  }

  keys(limit = -1) {
    return this.db.keys({limit})
  }

  async #queryJob(key) {
    const value = await this.db.get(key);
    return { key, value }
  }

  async query() {
    const keys = await this.keys();
    let promises = [];
    for (const key of keys) {
      promises.push(this.#queryJob(key));
    }
    return Promise.all(promises)
  }

  async values(limit = -1) {
    return this.db.values({limit})
  }

  async many(type, _value) {
    const jobs = [];

    for (const key of Object.keys(_value)) {
      jobs.push(this[type](key, _value[key]));
    }

    return Promise.all(jobs)
  }

  async length() {
    const keys = await this.keys();
    return keys.length
  }

  async size() {
    let size = 0;
    const query = await this.query();
    for (const item of query) {
      size += item.value.length;
    }
    return size
  }

  async clear() {
    return this.db.clear()
  }

}

export { LeofcoinStorage as default };
