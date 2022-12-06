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

var buffer = {};

var base64Js = {};

var hasRequiredBase64Js;

function requireBase64Js () {
	if (hasRequiredBase64Js) return base64Js;
	hasRequiredBase64Js = 1;

	base64Js.byteLength = byteLength;
	base64Js.toByteArray = toByteArray;
	base64Js.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	}

	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens (b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;

	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4);

	  return [validLen, placeHoldersLen]
	}

	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function toByteArray (b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];

	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

	  var curByte = 0;

	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen;

	  var i;
	  for (i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = (tmp >> 16) & 0xFF;
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    );
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    );
	  }

	  return parts.join('')
	}
	return base64Js;
}

var ieee754 = {};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

var hasRequiredIeee754;

function requireIeee754 () {
	if (hasRequiredIeee754) return ieee754;
	hasRequiredIeee754 = 1;
	ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	};

	ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};
	return ieee754;
}

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var hasRequiredBuffer;

function requireBuffer () {
	if (hasRequiredBuffer) return buffer;
	hasRequiredBuffer = 1;
	(function (exports) {

		const base64 = requireBase64Js();
		const ieee754 = requireIeee754();
		const customInspectSymbol =
		  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
		    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
		    : null;

		exports.Buffer = Buffer;
		exports.SlowBuffer = SlowBuffer;
		exports.INSPECT_MAX_BYTES = 50;

		const K_MAX_LENGTH = 0x7fffffff;
		exports.kMaxLength = K_MAX_LENGTH;

		/**
		 * If `Buffer.TYPED_ARRAY_SUPPORT`:
		 *   === true    Use Uint8Array implementation (fastest)
		 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
		 *               implementation (most compatible, even IE6)
		 *
		 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
		 * Opera 11.6+, iOS 4.2+.
		 *
		 * We report that the browser does not support typed arrays if the are not subclassable
		 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
		 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
		 * for __proto__ and has a buggy typed array implementation.
		 */
		Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

		if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
		    typeof console.error === 'function') {
		  console.error(
		    'This browser lacks typed array (Uint8Array) support which is required by ' +
		    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
		  );
		}

		function typedArraySupport () {
		  // Can typed array instances can be augmented?
		  try {
		    const arr = new Uint8Array(1);
		    const proto = { foo: function () { return 42 } };
		    Object.setPrototypeOf(proto, Uint8Array.prototype);
		    Object.setPrototypeOf(arr, proto);
		    return arr.foo() === 42
		  } catch (e) {
		    return false
		  }
		}

		Object.defineProperty(Buffer.prototype, 'parent', {
		  enumerable: true,
		  get: function () {
		    if (!Buffer.isBuffer(this)) return undefined
		    return this.buffer
		  }
		});

		Object.defineProperty(Buffer.prototype, 'offset', {
		  enumerable: true,
		  get: function () {
		    if (!Buffer.isBuffer(this)) return undefined
		    return this.byteOffset
		  }
		});

		function createBuffer (length) {
		  if (length > K_MAX_LENGTH) {
		    throw new RangeError('The value "' + length + '" is invalid for option "size"')
		  }
		  // Return an augmented `Uint8Array` instance
		  const buf = new Uint8Array(length);
		  Object.setPrototypeOf(buf, Buffer.prototype);
		  return buf
		}

		/**
		 * The Buffer constructor returns instances of `Uint8Array` that have their
		 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
		 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
		 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
		 * returns a single octet.
		 *
		 * The `Uint8Array` prototype remains unmodified.
		 */

		function Buffer (arg, encodingOrOffset, length) {
		  // Common case.
		  if (typeof arg === 'number') {
		    if (typeof encodingOrOffset === 'string') {
		      throw new TypeError(
		        'The "string" argument must be of type string. Received type number'
		      )
		    }
		    return allocUnsafe(arg)
		  }
		  return from(arg, encodingOrOffset, length)
		}

		Buffer.poolSize = 8192; // not used by this implementation

		function from (value, encodingOrOffset, length) {
		  if (typeof value === 'string') {
		    return fromString(value, encodingOrOffset)
		  }

		  if (ArrayBuffer.isView(value)) {
		    return fromArrayView(value)
		  }

		  if (value == null) {
		    throw new TypeError(
		      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
		      'or Array-like Object. Received type ' + (typeof value)
		    )
		  }

		  if (isInstance(value, ArrayBuffer) ||
		      (value && isInstance(value.buffer, ArrayBuffer))) {
		    return fromArrayBuffer(value, encodingOrOffset, length)
		  }

		  if (typeof SharedArrayBuffer !== 'undefined' &&
		      (isInstance(value, SharedArrayBuffer) ||
		      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
		    return fromArrayBuffer(value, encodingOrOffset, length)
		  }

		  if (typeof value === 'number') {
		    throw new TypeError(
		      'The "value" argument must not be of type number. Received type number'
		    )
		  }

		  const valueOf = value.valueOf && value.valueOf();
		  if (valueOf != null && valueOf !== value) {
		    return Buffer.from(valueOf, encodingOrOffset, length)
		  }

		  const b = fromObject(value);
		  if (b) return b

		  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
		      typeof value[Symbol.toPrimitive] === 'function') {
		    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
		  }

		  throw new TypeError(
		    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
		    'or Array-like Object. Received type ' + (typeof value)
		  )
		}

		/**
		 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
		 * if value is a number.
		 * Buffer.from(str[, encoding])
		 * Buffer.from(array)
		 * Buffer.from(buffer)
		 * Buffer.from(arrayBuffer[, byteOffset[, length]])
		 **/
		Buffer.from = function (value, encodingOrOffset, length) {
		  return from(value, encodingOrOffset, length)
		};

		// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
		// https://github.com/feross/buffer/pull/148
		Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
		Object.setPrototypeOf(Buffer, Uint8Array);

		function assertSize (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('"size" argument must be of type number')
		  } else if (size < 0) {
		    throw new RangeError('The value "' + size + '" is invalid for option "size"')
		  }
		}

		function alloc (size, fill, encoding) {
		  assertSize(size);
		  if (size <= 0) {
		    return createBuffer(size)
		  }
		  if (fill !== undefined) {
		    // Only pay attention to encoding if it's a string. This
		    // prevents accidentally sending in a number that would
		    // be interpreted as a start offset.
		    return typeof encoding === 'string'
		      ? createBuffer(size).fill(fill, encoding)
		      : createBuffer(size).fill(fill)
		  }
		  return createBuffer(size)
		}

		/**
		 * Creates a new filled Buffer instance.
		 * alloc(size[, fill[, encoding]])
		 **/
		Buffer.alloc = function (size, fill, encoding) {
		  return alloc(size, fill, encoding)
		};

		function allocUnsafe (size) {
		  assertSize(size);
		  return createBuffer(size < 0 ? 0 : checked(size) | 0)
		}

		/**
		 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
		 * */
		Buffer.allocUnsafe = function (size) {
		  return allocUnsafe(size)
		};
		/**
		 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
		 */
		Buffer.allocUnsafeSlow = function (size) {
		  return allocUnsafe(size)
		};

		function fromString (string, encoding) {
		  if (typeof encoding !== 'string' || encoding === '') {
		    encoding = 'utf8';
		  }

		  if (!Buffer.isEncoding(encoding)) {
		    throw new TypeError('Unknown encoding: ' + encoding)
		  }

		  const length = byteLength(string, encoding) | 0;
		  let buf = createBuffer(length);

		  const actual = buf.write(string, encoding);

		  if (actual !== length) {
		    // Writing a hex string, for example, that contains invalid characters will
		    // cause everything after the first invalid character to be ignored. (e.g.
		    // 'abxxcd' will be treated as 'ab')
		    buf = buf.slice(0, actual);
		  }

		  return buf
		}

		function fromArrayLike (array) {
		  const length = array.length < 0 ? 0 : checked(array.length) | 0;
		  const buf = createBuffer(length);
		  for (let i = 0; i < length; i += 1) {
		    buf[i] = array[i] & 255;
		  }
		  return buf
		}

		function fromArrayView (arrayView) {
		  if (isInstance(arrayView, Uint8Array)) {
		    const copy = new Uint8Array(arrayView);
		    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
		  }
		  return fromArrayLike(arrayView)
		}

		function fromArrayBuffer (array, byteOffset, length) {
		  if (byteOffset < 0 || array.byteLength < byteOffset) {
		    throw new RangeError('"offset" is outside of buffer bounds')
		  }

		  if (array.byteLength < byteOffset + (length || 0)) {
		    throw new RangeError('"length" is outside of buffer bounds')
		  }

		  let buf;
		  if (byteOffset === undefined && length === undefined) {
		    buf = new Uint8Array(array);
		  } else if (length === undefined) {
		    buf = new Uint8Array(array, byteOffset);
		  } else {
		    buf = new Uint8Array(array, byteOffset, length);
		  }

		  // Return an augmented `Uint8Array` instance
		  Object.setPrototypeOf(buf, Buffer.prototype);

		  return buf
		}

		function fromObject (obj) {
		  if (Buffer.isBuffer(obj)) {
		    const len = checked(obj.length) | 0;
		    const buf = createBuffer(len);

		    if (buf.length === 0) {
		      return buf
		    }

		    obj.copy(buf, 0, 0, len);
		    return buf
		  }

		  if (obj.length !== undefined) {
		    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
		      return createBuffer(0)
		    }
		    return fromArrayLike(obj)
		  }

		  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
		    return fromArrayLike(obj.data)
		  }
		}

		function checked (length) {
		  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
		  // length is NaN (which is otherwise coerced to zero.)
		  if (length >= K_MAX_LENGTH) {
		    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
		                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
		  }
		  return length | 0
		}

		function SlowBuffer (length) {
		  if (+length != length) { // eslint-disable-line eqeqeq
		    length = 0;
		  }
		  return Buffer.alloc(+length)
		}

		Buffer.isBuffer = function isBuffer (b) {
		  return b != null && b._isBuffer === true &&
		    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
		};

		Buffer.compare = function compare (a, b) {
		  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
		  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
		  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
		    throw new TypeError(
		      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
		    )
		  }

		  if (a === b) return 0

		  let x = a.length;
		  let y = b.length;

		  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
		    if (a[i] !== b[i]) {
		      x = a[i];
		      y = b[i];
		      break
		    }
		  }

		  if (x < y) return -1
		  if (y < x) return 1
		  return 0
		};

		Buffer.isEncoding = function isEncoding (encoding) {
		  switch (String(encoding).toLowerCase()) {
		    case 'hex':
		    case 'utf8':
		    case 'utf-8':
		    case 'ascii':
		    case 'latin1':
		    case 'binary':
		    case 'base64':
		    case 'ucs2':
		    case 'ucs-2':
		    case 'utf16le':
		    case 'utf-16le':
		      return true
		    default:
		      return false
		  }
		};

		Buffer.concat = function concat (list, length) {
		  if (!Array.isArray(list)) {
		    throw new TypeError('"list" argument must be an Array of Buffers')
		  }

		  if (list.length === 0) {
		    return Buffer.alloc(0)
		  }

		  let i;
		  if (length === undefined) {
		    length = 0;
		    for (i = 0; i < list.length; ++i) {
		      length += list[i].length;
		    }
		  }

		  const buffer = Buffer.allocUnsafe(length);
		  let pos = 0;
		  for (i = 0; i < list.length; ++i) {
		    let buf = list[i];
		    if (isInstance(buf, Uint8Array)) {
		      if (pos + buf.length > buffer.length) {
		        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
		        buf.copy(buffer, pos);
		      } else {
		        Uint8Array.prototype.set.call(
		          buffer,
		          buf,
		          pos
		        );
		      }
		    } else if (!Buffer.isBuffer(buf)) {
		      throw new TypeError('"list" argument must be an Array of Buffers')
		    } else {
		      buf.copy(buffer, pos);
		    }
		    pos += buf.length;
		  }
		  return buffer
		};

		function byteLength (string, encoding) {
		  if (Buffer.isBuffer(string)) {
		    return string.length
		  }
		  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
		    return string.byteLength
		  }
		  if (typeof string !== 'string') {
		    throw new TypeError(
		      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
		      'Received type ' + typeof string
		    )
		  }

		  const len = string.length;
		  const mustMatch = (arguments.length > 2 && arguments[2] === true);
		  if (!mustMatch && len === 0) return 0

		  // Use a for loop to avoid recursion
		  let loweredCase = false;
		  for (;;) {
		    switch (encoding) {
		      case 'ascii':
		      case 'latin1':
		      case 'binary':
		        return len
		      case 'utf8':
		      case 'utf-8':
		        return utf8ToBytes(string).length
		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return len * 2
		      case 'hex':
		        return len >>> 1
		      case 'base64':
		        return base64ToBytes(string).length
		      default:
		        if (loweredCase) {
		          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
		        }
		        encoding = ('' + encoding).toLowerCase();
		        loweredCase = true;
		    }
		  }
		}
		Buffer.byteLength = byteLength;

		function slowToString (encoding, start, end) {
		  let loweredCase = false;

		  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
		  // property of a typed array.

		  // This behaves neither like String nor Uint8Array in that we set start/end
		  // to their upper/lower bounds if the value passed is out of range.
		  // undefined is handled specially as per ECMA-262 6th Edition,
		  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
		  if (start === undefined || start < 0) {
		    start = 0;
		  }
		  // Return early if start > this.length. Done here to prevent potential uint32
		  // coercion fail below.
		  if (start > this.length) {
		    return ''
		  }

		  if (end === undefined || end > this.length) {
		    end = this.length;
		  }

		  if (end <= 0) {
		    return ''
		  }

		  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
		  end >>>= 0;
		  start >>>= 0;

		  if (end <= start) {
		    return ''
		  }

		  if (!encoding) encoding = 'utf8';

		  while (true) {
		    switch (encoding) {
		      case 'hex':
		        return hexSlice(this, start, end)

		      case 'utf8':
		      case 'utf-8':
		        return utf8Slice(this, start, end)

		      case 'ascii':
		        return asciiSlice(this, start, end)

		      case 'latin1':
		      case 'binary':
		        return latin1Slice(this, start, end)

		      case 'base64':
		        return base64Slice(this, start, end)

		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return utf16leSlice(this, start, end)

		      default:
		        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
		        encoding = (encoding + '').toLowerCase();
		        loweredCase = true;
		    }
		  }
		}

		// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
		// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
		// reliably in a browserify context because there could be multiple different
		// copies of the 'buffer' package in use. This method works even for Buffer
		// instances that were created from another copy of the `buffer` package.
		// See: https://github.com/feross/buffer/issues/154
		Buffer.prototype._isBuffer = true;

		function swap (b, n, m) {
		  const i = b[n];
		  b[n] = b[m];
		  b[m] = i;
		}

		Buffer.prototype.swap16 = function swap16 () {
		  const len = this.length;
		  if (len % 2 !== 0) {
		    throw new RangeError('Buffer size must be a multiple of 16-bits')
		  }
		  for (let i = 0; i < len; i += 2) {
		    swap(this, i, i + 1);
		  }
		  return this
		};

		Buffer.prototype.swap32 = function swap32 () {
		  const len = this.length;
		  if (len % 4 !== 0) {
		    throw new RangeError('Buffer size must be a multiple of 32-bits')
		  }
		  for (let i = 0; i < len; i += 4) {
		    swap(this, i, i + 3);
		    swap(this, i + 1, i + 2);
		  }
		  return this
		};

		Buffer.prototype.swap64 = function swap64 () {
		  const len = this.length;
		  if (len % 8 !== 0) {
		    throw new RangeError('Buffer size must be a multiple of 64-bits')
		  }
		  for (let i = 0; i < len; i += 8) {
		    swap(this, i, i + 7);
		    swap(this, i + 1, i + 6);
		    swap(this, i + 2, i + 5);
		    swap(this, i + 3, i + 4);
		  }
		  return this
		};

		Buffer.prototype.toString = function toString () {
		  const length = this.length;
		  if (length === 0) return ''
		  if (arguments.length === 0) return utf8Slice(this, 0, length)
		  return slowToString.apply(this, arguments)
		};

		Buffer.prototype.toLocaleString = Buffer.prototype.toString;

		Buffer.prototype.equals = function equals (b) {
		  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
		  if (this === b) return true
		  return Buffer.compare(this, b) === 0
		};

		Buffer.prototype.inspect = function inspect () {
		  let str = '';
		  const max = exports.INSPECT_MAX_BYTES;
		  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
		  if (this.length > max) str += ' ... ';
		  return '<Buffer ' + str + '>'
		};
		if (customInspectSymbol) {
		  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
		}

		Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
		  if (isInstance(target, Uint8Array)) {
		    target = Buffer.from(target, target.offset, target.byteLength);
		  }
		  if (!Buffer.isBuffer(target)) {
		    throw new TypeError(
		      'The "target" argument must be one of type Buffer or Uint8Array. ' +
		      'Received type ' + (typeof target)
		    )
		  }

		  if (start === undefined) {
		    start = 0;
		  }
		  if (end === undefined) {
		    end = target ? target.length : 0;
		  }
		  if (thisStart === undefined) {
		    thisStart = 0;
		  }
		  if (thisEnd === undefined) {
		    thisEnd = this.length;
		  }

		  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
		    throw new RangeError('out of range index')
		  }

		  if (thisStart >= thisEnd && start >= end) {
		    return 0
		  }
		  if (thisStart >= thisEnd) {
		    return -1
		  }
		  if (start >= end) {
		    return 1
		  }

		  start >>>= 0;
		  end >>>= 0;
		  thisStart >>>= 0;
		  thisEnd >>>= 0;

		  if (this === target) return 0

		  let x = thisEnd - thisStart;
		  let y = end - start;
		  const len = Math.min(x, y);

		  const thisCopy = this.slice(thisStart, thisEnd);
		  const targetCopy = target.slice(start, end);

		  for (let i = 0; i < len; ++i) {
		    if (thisCopy[i] !== targetCopy[i]) {
		      x = thisCopy[i];
		      y = targetCopy[i];
		      break
		    }
		  }

		  if (x < y) return -1
		  if (y < x) return 1
		  return 0
		};

		// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
		// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
		//
		// Arguments:
		// - buffer - a Buffer to search
		// - val - a string, Buffer, or number
		// - byteOffset - an index into `buffer`; will be clamped to an int32
		// - encoding - an optional encoding, relevant is val is a string
		// - dir - true for indexOf, false for lastIndexOf
		function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
		  // Empty buffer means no match
		  if (buffer.length === 0) return -1

		  // Normalize byteOffset
		  if (typeof byteOffset === 'string') {
		    encoding = byteOffset;
		    byteOffset = 0;
		  } else if (byteOffset > 0x7fffffff) {
		    byteOffset = 0x7fffffff;
		  } else if (byteOffset < -0x80000000) {
		    byteOffset = -0x80000000;
		  }
		  byteOffset = +byteOffset; // Coerce to Number.
		  if (numberIsNaN(byteOffset)) {
		    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
		    byteOffset = dir ? 0 : (buffer.length - 1);
		  }

		  // Normalize byteOffset: negative offsets start from the end of the buffer
		  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
		  if (byteOffset >= buffer.length) {
		    if (dir) return -1
		    else byteOffset = buffer.length - 1;
		  } else if (byteOffset < 0) {
		    if (dir) byteOffset = 0;
		    else return -1
		  }

		  // Normalize val
		  if (typeof val === 'string') {
		    val = Buffer.from(val, encoding);
		  }

		  // Finally, search either indexOf (if dir is true) or lastIndexOf
		  if (Buffer.isBuffer(val)) {
		    // Special case: looking for empty string/buffer always fails
		    if (val.length === 0) {
		      return -1
		    }
		    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
		  } else if (typeof val === 'number') {
		    val = val & 0xFF; // Search for a byte value [0-255]
		    if (typeof Uint8Array.prototype.indexOf === 'function') {
		      if (dir) {
		        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
		      } else {
		        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
		      }
		    }
		    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
		  }

		  throw new TypeError('val must be string, number or Buffer')
		}

		function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
		  let indexSize = 1;
		  let arrLength = arr.length;
		  let valLength = val.length;

		  if (encoding !== undefined) {
		    encoding = String(encoding).toLowerCase();
		    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
		        encoding === 'utf16le' || encoding === 'utf-16le') {
		      if (arr.length < 2 || val.length < 2) {
		        return -1
		      }
		      indexSize = 2;
		      arrLength /= 2;
		      valLength /= 2;
		      byteOffset /= 2;
		    }
		  }

		  function read (buf, i) {
		    if (indexSize === 1) {
		      return buf[i]
		    } else {
		      return buf.readUInt16BE(i * indexSize)
		    }
		  }

		  let i;
		  if (dir) {
		    let foundIndex = -1;
		    for (i = byteOffset; i < arrLength; i++) {
		      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
		        if (foundIndex === -1) foundIndex = i;
		        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
		      } else {
		        if (foundIndex !== -1) i -= i - foundIndex;
		        foundIndex = -1;
		      }
		    }
		  } else {
		    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
		    for (i = byteOffset; i >= 0; i--) {
		      let found = true;
		      for (let j = 0; j < valLength; j++) {
		        if (read(arr, i + j) !== read(val, j)) {
		          found = false;
		          break
		        }
		      }
		      if (found) return i
		    }
		  }

		  return -1
		}

		Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
		  return this.indexOf(val, byteOffset, encoding) !== -1
		};

		Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
		  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
		};

		Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
		  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
		};

		function hexWrite (buf, string, offset, length) {
		  offset = Number(offset) || 0;
		  const remaining = buf.length - offset;
		  if (!length) {
		    length = remaining;
		  } else {
		    length = Number(length);
		    if (length > remaining) {
		      length = remaining;
		    }
		  }

		  const strLen = string.length;

		  if (length > strLen / 2) {
		    length = strLen / 2;
		  }
		  let i;
		  for (i = 0; i < length; ++i) {
		    const parsed = parseInt(string.substr(i * 2, 2), 16);
		    if (numberIsNaN(parsed)) return i
		    buf[offset + i] = parsed;
		  }
		  return i
		}

		function utf8Write (buf, string, offset, length) {
		  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
		}

		function asciiWrite (buf, string, offset, length) {
		  return blitBuffer(asciiToBytes(string), buf, offset, length)
		}

		function base64Write (buf, string, offset, length) {
		  return blitBuffer(base64ToBytes(string), buf, offset, length)
		}

		function ucs2Write (buf, string, offset, length) {
		  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
		}

		Buffer.prototype.write = function write (string, offset, length, encoding) {
		  // Buffer#write(string)
		  if (offset === undefined) {
		    encoding = 'utf8';
		    length = this.length;
		    offset = 0;
		  // Buffer#write(string, encoding)
		  } else if (length === undefined && typeof offset === 'string') {
		    encoding = offset;
		    length = this.length;
		    offset = 0;
		  // Buffer#write(string, offset[, length][, encoding])
		  } else if (isFinite(offset)) {
		    offset = offset >>> 0;
		    if (isFinite(length)) {
		      length = length >>> 0;
		      if (encoding === undefined) encoding = 'utf8';
		    } else {
		      encoding = length;
		      length = undefined;
		    }
		  } else {
		    throw new Error(
		      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
		    )
		  }

		  const remaining = this.length - offset;
		  if (length === undefined || length > remaining) length = remaining;

		  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
		    throw new RangeError('Attempt to write outside buffer bounds')
		  }

		  if (!encoding) encoding = 'utf8';

		  let loweredCase = false;
		  for (;;) {
		    switch (encoding) {
		      case 'hex':
		        return hexWrite(this, string, offset, length)

		      case 'utf8':
		      case 'utf-8':
		        return utf8Write(this, string, offset, length)

		      case 'ascii':
		      case 'latin1':
		      case 'binary':
		        return asciiWrite(this, string, offset, length)

		      case 'base64':
		        // Warning: maxLength not taken into account in base64Write
		        return base64Write(this, string, offset, length)

		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return ucs2Write(this, string, offset, length)

		      default:
		        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
		        encoding = ('' + encoding).toLowerCase();
		        loweredCase = true;
		    }
		  }
		};

		Buffer.prototype.toJSON = function toJSON () {
		  return {
		    type: 'Buffer',
		    data: Array.prototype.slice.call(this._arr || this, 0)
		  }
		};

		function base64Slice (buf, start, end) {
		  if (start === 0 && end === buf.length) {
		    return base64.fromByteArray(buf)
		  } else {
		    return base64.fromByteArray(buf.slice(start, end))
		  }
		}

		function utf8Slice (buf, start, end) {
		  end = Math.min(buf.length, end);
		  const res = [];

		  let i = start;
		  while (i < end) {
		    const firstByte = buf[i];
		    let codePoint = null;
		    let bytesPerSequence = (firstByte > 0xEF)
		      ? 4
		      : (firstByte > 0xDF)
		          ? 3
		          : (firstByte > 0xBF)
		              ? 2
		              : 1;

		    if (i + bytesPerSequence <= end) {
		      let secondByte, thirdByte, fourthByte, tempCodePoint;

		      switch (bytesPerSequence) {
		        case 1:
		          if (firstByte < 0x80) {
		            codePoint = firstByte;
		          }
		          break
		        case 2:
		          secondByte = buf[i + 1];
		          if ((secondByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
		            if (tempCodePoint > 0x7F) {
		              codePoint = tempCodePoint;
		            }
		          }
		          break
		        case 3:
		          secondByte = buf[i + 1];
		          thirdByte = buf[i + 2];
		          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
		            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
		              codePoint = tempCodePoint;
		            }
		          }
		          break
		        case 4:
		          secondByte = buf[i + 1];
		          thirdByte = buf[i + 2];
		          fourthByte = buf[i + 3];
		          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
		            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
		              codePoint = tempCodePoint;
		            }
		          }
		      }
		    }

		    if (codePoint === null) {
		      // we did not generate a valid codePoint so insert a
		      // replacement char (U+FFFD) and advance only 1 byte
		      codePoint = 0xFFFD;
		      bytesPerSequence = 1;
		    } else if (codePoint > 0xFFFF) {
		      // encode to utf16 (surrogate pair dance)
		      codePoint -= 0x10000;
		      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
		      codePoint = 0xDC00 | codePoint & 0x3FF;
		    }

		    res.push(codePoint);
		    i += bytesPerSequence;
		  }

		  return decodeCodePointsArray(res)
		}

		// Based on http://stackoverflow.com/a/22747272/680742, the browser with
		// the lowest limit is Chrome, with 0x10000 args.
		// We go 1 magnitude less, for safety
		const MAX_ARGUMENTS_LENGTH = 0x1000;

		function decodeCodePointsArray (codePoints) {
		  const len = codePoints.length;
		  if (len <= MAX_ARGUMENTS_LENGTH) {
		    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
		  }

		  // Decode in chunks to avoid "call stack size exceeded".
		  let res = '';
		  let i = 0;
		  while (i < len) {
		    res += String.fromCharCode.apply(
		      String,
		      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
		    );
		  }
		  return res
		}

		function asciiSlice (buf, start, end) {
		  let ret = '';
		  end = Math.min(buf.length, end);

		  for (let i = start; i < end; ++i) {
		    ret += String.fromCharCode(buf[i] & 0x7F);
		  }
		  return ret
		}

		function latin1Slice (buf, start, end) {
		  let ret = '';
		  end = Math.min(buf.length, end);

		  for (let i = start; i < end; ++i) {
		    ret += String.fromCharCode(buf[i]);
		  }
		  return ret
		}

		function hexSlice (buf, start, end) {
		  const len = buf.length;

		  if (!start || start < 0) start = 0;
		  if (!end || end < 0 || end > len) end = len;

		  let out = '';
		  for (let i = start; i < end; ++i) {
		    out += hexSliceLookupTable[buf[i]];
		  }
		  return out
		}

		function utf16leSlice (buf, start, end) {
		  const bytes = buf.slice(start, end);
		  let res = '';
		  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
		  for (let i = 0; i < bytes.length - 1; i += 2) {
		    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
		  }
		  return res
		}

		Buffer.prototype.slice = function slice (start, end) {
		  const len = this.length;
		  start = ~~start;
		  end = end === undefined ? len : ~~end;

		  if (start < 0) {
		    start += len;
		    if (start < 0) start = 0;
		  } else if (start > len) {
		    start = len;
		  }

		  if (end < 0) {
		    end += len;
		    if (end < 0) end = 0;
		  } else if (end > len) {
		    end = len;
		  }

		  if (end < start) end = start;

		  const newBuf = this.subarray(start, end);
		  // Return an augmented `Uint8Array` instance
		  Object.setPrototypeOf(newBuf, Buffer.prototype);

		  return newBuf
		};

		/*
		 * Need to make sure that buffer isn't trying to write out of bounds.
		 */
		function checkOffset (offset, ext, length) {
		  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
		  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
		}

		Buffer.prototype.readUintLE =
		Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) checkOffset(offset, byteLength, this.length);

		  let val = this[offset];
		  let mul = 1;
		  let i = 0;
		  while (++i < byteLength && (mul *= 0x100)) {
		    val += this[offset + i] * mul;
		  }

		  return val
		};

		Buffer.prototype.readUintBE =
		Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) {
		    checkOffset(offset, byteLength, this.length);
		  }

		  let val = this[offset + --byteLength];
		  let mul = 1;
		  while (byteLength > 0 && (mul *= 0x100)) {
		    val += this[offset + --byteLength] * mul;
		  }

		  return val
		};

		Buffer.prototype.readUint8 =
		Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 1, this.length);
		  return this[offset]
		};

		Buffer.prototype.readUint16LE =
		Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  return this[offset] | (this[offset + 1] << 8)
		};

		Buffer.prototype.readUint16BE =
		Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  return (this[offset] << 8) | this[offset + 1]
		};

		Buffer.prototype.readUint32LE =
		Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return ((this[offset]) |
		      (this[offset + 1] << 8) |
		      (this[offset + 2] << 16)) +
		      (this[offset + 3] * 0x1000000)
		};

		Buffer.prototype.readUint32BE =
		Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return (this[offset] * 0x1000000) +
		    ((this[offset + 1] << 16) |
		    (this[offset + 2] << 8) |
		    this[offset + 3])
		};

		Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const lo = first +
		    this[++offset] * 2 ** 8 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 24;

		  const hi = this[++offset] +
		    this[++offset] * 2 ** 8 +
		    this[++offset] * 2 ** 16 +
		    last * 2 ** 24;

		  return BigInt(lo) + (BigInt(hi) << BigInt(32))
		});

		Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const hi = first * 2 ** 24 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    this[++offset];

		  const lo = this[++offset] * 2 ** 24 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    last;

		  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
		});

		Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) checkOffset(offset, byteLength, this.length);

		  let val = this[offset];
		  let mul = 1;
		  let i = 0;
		  while (++i < byteLength && (mul *= 0x100)) {
		    val += this[offset + i] * mul;
		  }
		  mul *= 0x80;

		  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

		  return val
		};

		Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) checkOffset(offset, byteLength, this.length);

		  let i = byteLength;
		  let mul = 1;
		  let val = this[offset + --i];
		  while (i > 0 && (mul *= 0x100)) {
		    val += this[offset + --i] * mul;
		  }
		  mul *= 0x80;

		  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

		  return val
		};

		Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 1, this.length);
		  if (!(this[offset] & 0x80)) return (this[offset])
		  return ((0xff - this[offset] + 1) * -1)
		};

		Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  const val = this[offset] | (this[offset + 1] << 8);
		  return (val & 0x8000) ? val | 0xFFFF0000 : val
		};

		Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  const val = this[offset + 1] | (this[offset] << 8);
		  return (val & 0x8000) ? val | 0xFFFF0000 : val
		};

		Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return (this[offset]) |
		    (this[offset + 1] << 8) |
		    (this[offset + 2] << 16) |
		    (this[offset + 3] << 24)
		};

		Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return (this[offset] << 24) |
		    (this[offset + 1] << 16) |
		    (this[offset + 2] << 8) |
		    (this[offset + 3])
		};

		Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const val = this[offset + 4] +
		    this[offset + 5] * 2 ** 8 +
		    this[offset + 6] * 2 ** 16 +
		    (last << 24); // Overflow

		  return (BigInt(val) << BigInt(32)) +
		    BigInt(first +
		    this[++offset] * 2 ** 8 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 24)
		});

		Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const val = (first << 24) + // Overflow
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    this[++offset];

		  return (BigInt(val) << BigInt(32)) +
		    BigInt(this[++offset] * 2 ** 24 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    last)
		});

		Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);
		  return ieee754.read(this, offset, true, 23, 4)
		};

		Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);
		  return ieee754.read(this, offset, false, 23, 4)
		};

		Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 8, this.length);
		  return ieee754.read(this, offset, true, 52, 8)
		};

		Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 8, this.length);
		  return ieee754.read(this, offset, false, 52, 8)
		};

		function checkInt (buf, value, offset, ext, max, min) {
		  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
		  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
		  if (offset + ext > buf.length) throw new RangeError('Index out of range')
		}

		Buffer.prototype.writeUintLE =
		Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) {
		    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
		    checkInt(this, value, offset, byteLength, maxBytes, 0);
		  }

		  let mul = 1;
		  let i = 0;
		  this[offset] = value & 0xFF;
		  while (++i < byteLength && (mul *= 0x100)) {
		    this[offset + i] = (value / mul) & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeUintBE =
		Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) {
		    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
		    checkInt(this, value, offset, byteLength, maxBytes, 0);
		  }

		  let i = byteLength - 1;
		  let mul = 1;
		  this[offset + i] = value & 0xFF;
		  while (--i >= 0 && (mul *= 0x100)) {
		    this[offset + i] = (value / mul) & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeUint8 =
		Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
		  this[offset] = (value & 0xff);
		  return offset + 1
		};

		Buffer.prototype.writeUint16LE =
		Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
		  this[offset] = (value & 0xff);
		  this[offset + 1] = (value >>> 8);
		  return offset + 2
		};

		Buffer.prototype.writeUint16BE =
		Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
		  this[offset] = (value >>> 8);
		  this[offset + 1] = (value & 0xff);
		  return offset + 2
		};

		Buffer.prototype.writeUint32LE =
		Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
		  this[offset + 3] = (value >>> 24);
		  this[offset + 2] = (value >>> 16);
		  this[offset + 1] = (value >>> 8);
		  this[offset] = (value & 0xff);
		  return offset + 4
		};

		Buffer.prototype.writeUint32BE =
		Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
		  this[offset] = (value >>> 24);
		  this[offset + 1] = (value >>> 16);
		  this[offset + 2] = (value >>> 8);
		  this[offset + 3] = (value & 0xff);
		  return offset + 4
		};

		function wrtBigUInt64LE (buf, value, offset, min, max) {
		  checkIntBI(value, min, max, buf, offset, 7);

		  let lo = Number(value & BigInt(0xffffffff));
		  buf[offset++] = lo;
		  lo = lo >> 8;
		  buf[offset++] = lo;
		  lo = lo >> 8;
		  buf[offset++] = lo;
		  lo = lo >> 8;
		  buf[offset++] = lo;
		  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
		  buf[offset++] = hi;
		  hi = hi >> 8;
		  buf[offset++] = hi;
		  hi = hi >> 8;
		  buf[offset++] = hi;
		  hi = hi >> 8;
		  buf[offset++] = hi;
		  return offset
		}

		function wrtBigUInt64BE (buf, value, offset, min, max) {
		  checkIntBI(value, min, max, buf, offset, 7);

		  let lo = Number(value & BigInt(0xffffffff));
		  buf[offset + 7] = lo;
		  lo = lo >> 8;
		  buf[offset + 6] = lo;
		  lo = lo >> 8;
		  buf[offset + 5] = lo;
		  lo = lo >> 8;
		  buf[offset + 4] = lo;
		  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
		  buf[offset + 3] = hi;
		  hi = hi >> 8;
		  buf[offset + 2] = hi;
		  hi = hi >> 8;
		  buf[offset + 1] = hi;
		  hi = hi >> 8;
		  buf[offset] = hi;
		  return offset + 8
		}

		Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
		  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
		});

		Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
		  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
		});

		Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    const limit = Math.pow(2, (8 * byteLength) - 1);

		    checkInt(this, value, offset, byteLength, limit - 1, -limit);
		  }

		  let i = 0;
		  let mul = 1;
		  let sub = 0;
		  this[offset] = value & 0xFF;
		  while (++i < byteLength && (mul *= 0x100)) {
		    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
		      sub = 1;
		    }
		    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    const limit = Math.pow(2, (8 * byteLength) - 1);

		    checkInt(this, value, offset, byteLength, limit - 1, -limit);
		  }

		  let i = byteLength - 1;
		  let mul = 1;
		  let sub = 0;
		  this[offset + i] = value & 0xFF;
		  while (--i >= 0 && (mul *= 0x100)) {
		    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
		      sub = 1;
		    }
		    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
		  if (value < 0) value = 0xff + value + 1;
		  this[offset] = (value & 0xff);
		  return offset + 1
		};

		Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
		  this[offset] = (value & 0xff);
		  this[offset + 1] = (value >>> 8);
		  return offset + 2
		};

		Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
		  this[offset] = (value >>> 8);
		  this[offset + 1] = (value & 0xff);
		  return offset + 2
		};

		Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
		  this[offset] = (value & 0xff);
		  this[offset + 1] = (value >>> 8);
		  this[offset + 2] = (value >>> 16);
		  this[offset + 3] = (value >>> 24);
		  return offset + 4
		};

		Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
		  if (value < 0) value = 0xffffffff + value + 1;
		  this[offset] = (value >>> 24);
		  this[offset + 1] = (value >>> 16);
		  this[offset + 2] = (value >>> 8);
		  this[offset + 3] = (value & 0xff);
		  return offset + 4
		};

		Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
		  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
		});

		Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
		  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
		});

		function checkIEEE754 (buf, value, offset, ext, max, min) {
		  if (offset + ext > buf.length) throw new RangeError('Index out of range')
		  if (offset < 0) throw new RangeError('Index out of range')
		}

		function writeFloat (buf, value, offset, littleEndian, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    checkIEEE754(buf, value, offset, 4);
		  }
		  ieee754.write(buf, value, offset, littleEndian, 23, 4);
		  return offset + 4
		}

		Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
		  return writeFloat(this, value, offset, true, noAssert)
		};

		Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
		  return writeFloat(this, value, offset, false, noAssert)
		};

		function writeDouble (buf, value, offset, littleEndian, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    checkIEEE754(buf, value, offset, 8);
		  }
		  ieee754.write(buf, value, offset, littleEndian, 52, 8);
		  return offset + 8
		}

		Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
		  return writeDouble(this, value, offset, true, noAssert)
		};

		Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
		  return writeDouble(this, value, offset, false, noAssert)
		};

		// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
		Buffer.prototype.copy = function copy (target, targetStart, start, end) {
		  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
		  if (!start) start = 0;
		  if (!end && end !== 0) end = this.length;
		  if (targetStart >= target.length) targetStart = target.length;
		  if (!targetStart) targetStart = 0;
		  if (end > 0 && end < start) end = start;

		  // Copy 0 bytes; we're done
		  if (end === start) return 0
		  if (target.length === 0 || this.length === 0) return 0

		  // Fatal error conditions
		  if (targetStart < 0) {
		    throw new RangeError('targetStart out of bounds')
		  }
		  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
		  if (end < 0) throw new RangeError('sourceEnd out of bounds')

		  // Are we oob?
		  if (end > this.length) end = this.length;
		  if (target.length - targetStart < end - start) {
		    end = target.length - targetStart + start;
		  }

		  const len = end - start;

		  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
		    // Use built-in when available, missing from IE11
		    this.copyWithin(targetStart, start, end);
		  } else {
		    Uint8Array.prototype.set.call(
		      target,
		      this.subarray(start, end),
		      targetStart
		    );
		  }

		  return len
		};

		// Usage:
		//    buffer.fill(number[, offset[, end]])
		//    buffer.fill(buffer[, offset[, end]])
		//    buffer.fill(string[, offset[, end]][, encoding])
		Buffer.prototype.fill = function fill (val, start, end, encoding) {
		  // Handle string cases:
		  if (typeof val === 'string') {
		    if (typeof start === 'string') {
		      encoding = start;
		      start = 0;
		      end = this.length;
		    } else if (typeof end === 'string') {
		      encoding = end;
		      end = this.length;
		    }
		    if (encoding !== undefined && typeof encoding !== 'string') {
		      throw new TypeError('encoding must be a string')
		    }
		    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
		      throw new TypeError('Unknown encoding: ' + encoding)
		    }
		    if (val.length === 1) {
		      const code = val.charCodeAt(0);
		      if ((encoding === 'utf8' && code < 128) ||
		          encoding === 'latin1') {
		        // Fast path: If `val` fits into a single byte, use that numeric value.
		        val = code;
		      }
		    }
		  } else if (typeof val === 'number') {
		    val = val & 255;
		  } else if (typeof val === 'boolean') {
		    val = Number(val);
		  }

		  // Invalid ranges are not set to a default, so can range check early.
		  if (start < 0 || this.length < start || this.length < end) {
		    throw new RangeError('Out of range index')
		  }

		  if (end <= start) {
		    return this
		  }

		  start = start >>> 0;
		  end = end === undefined ? this.length : end >>> 0;

		  if (!val) val = 0;

		  let i;
		  if (typeof val === 'number') {
		    for (i = start; i < end; ++i) {
		      this[i] = val;
		    }
		  } else {
		    const bytes = Buffer.isBuffer(val)
		      ? val
		      : Buffer.from(val, encoding);
		    const len = bytes.length;
		    if (len === 0) {
		      throw new TypeError('The value "' + val +
		        '" is invalid for argument "value"')
		    }
		    for (i = 0; i < end - start; ++i) {
		      this[i + start] = bytes[i % len];
		    }
		  }

		  return this
		};

		// CUSTOM ERRORS
		// =============

		// Simplified versions from Node, changed for Buffer-only usage
		const errors = {};
		function E (sym, getMessage, Base) {
		  errors[sym] = class NodeError extends Base {
		    constructor () {
		      super();

		      Object.defineProperty(this, 'message', {
		        value: getMessage.apply(this, arguments),
		        writable: true,
		        configurable: true
		      });

		      // Add the error code to the name to include it in the stack trace.
		      this.name = `${this.name} [${sym}]`;
		      // Access the stack to generate the error message including the error code
		      // from the name.
		      this.stack; // eslint-disable-line no-unused-expressions
		      // Reset the name to the actual name.
		      delete this.name;
		    }

		    get code () {
		      return sym
		    }

		    set code (value) {
		      Object.defineProperty(this, 'code', {
		        configurable: true,
		        enumerable: true,
		        value,
		        writable: true
		      });
		    }

		    toString () {
		      return `${this.name} [${sym}]: ${this.message}`
		    }
		  };
		}

		E('ERR_BUFFER_OUT_OF_BOUNDS',
		  function (name) {
		    if (name) {
		      return `${name} is outside of buffer bounds`
		    }

		    return 'Attempt to access memory outside buffer bounds'
		  }, RangeError);
		E('ERR_INVALID_ARG_TYPE',
		  function (name, actual) {
		    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
		  }, TypeError);
		E('ERR_OUT_OF_RANGE',
		  function (str, range, input) {
		    let msg = `The value of "${str}" is out of range.`;
		    let received = input;
		    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
		      received = addNumericalSeparator(String(input));
		    } else if (typeof input === 'bigint') {
		      received = String(input);
		      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
		        received = addNumericalSeparator(received);
		      }
		      received += 'n';
		    }
		    msg += ` It must be ${range}. Received ${received}`;
		    return msg
		  }, RangeError);

		function addNumericalSeparator (val) {
		  let res = '';
		  let i = val.length;
		  const start = val[0] === '-' ? 1 : 0;
		  for (; i >= start + 4; i -= 3) {
		    res = `_${val.slice(i - 3, i)}${res}`;
		  }
		  return `${val.slice(0, i)}${res}`
		}

		// CHECK FUNCTIONS
		// ===============

		function checkBounds (buf, offset, byteLength) {
		  validateNumber(offset, 'offset');
		  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
		    boundsError(offset, buf.length - (byteLength + 1));
		  }
		}

		function checkIntBI (value, min, max, buf, offset, byteLength) {
		  if (value > max || value < min) {
		    const n = typeof min === 'bigint' ? 'n' : '';
		    let range;
		    if (byteLength > 3) {
		      if (min === 0 || min === BigInt(0)) {
		        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
		      } else {
		        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
		                `${(byteLength + 1) * 8 - 1}${n}`;
		      }
		    } else {
		      range = `>= ${min}${n} and <= ${max}${n}`;
		    }
		    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
		  }
		  checkBounds(buf, offset, byteLength);
		}

		function validateNumber (value, name) {
		  if (typeof value !== 'number') {
		    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
		  }
		}

		function boundsError (value, length, type) {
		  if (Math.floor(value) !== value) {
		    validateNumber(value, type);
		    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
		  }

		  if (length < 0) {
		    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
		  }

		  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
		                                    `>= ${type ? 1 : 0} and <= ${length}`,
		                                    value)
		}

		// HELPER FUNCTIONS
		// ================

		const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

		function base64clean (str) {
		  // Node takes equal signs as end of the Base64 encoding
		  str = str.split('=')[0];
		  // Node strips out invalid characters like \n and \t from the string, base64-js does not
		  str = str.trim().replace(INVALID_BASE64_RE, '');
		  // Node converts strings with length < 2 to ''
		  if (str.length < 2) return ''
		  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
		  while (str.length % 4 !== 0) {
		    str = str + '=';
		  }
		  return str
		}

		function utf8ToBytes (string, units) {
		  units = units || Infinity;
		  let codePoint;
		  const length = string.length;
		  let leadSurrogate = null;
		  const bytes = [];

		  for (let i = 0; i < length; ++i) {
		    codePoint = string.charCodeAt(i);

		    // is surrogate component
		    if (codePoint > 0xD7FF && codePoint < 0xE000) {
		      // last char was a lead
		      if (!leadSurrogate) {
		        // no lead yet
		        if (codePoint > 0xDBFF) {
		          // unexpected trail
		          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		          continue
		        } else if (i + 1 === length) {
		          // unpaired lead
		          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		          continue
		        }

		        // valid lead
		        leadSurrogate = codePoint;

		        continue
		      }

		      // 2 leads in a row
		      if (codePoint < 0xDC00) {
		        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		        leadSurrogate = codePoint;
		        continue
		      }

		      // valid surrogate pair
		      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
		    } else if (leadSurrogate) {
		      // valid bmp char, but last char was a lead
		      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		    }

		    leadSurrogate = null;

		    // encode utf8
		    if (codePoint < 0x80) {
		      if ((units -= 1) < 0) break
		      bytes.push(codePoint);
		    } else if (codePoint < 0x800) {
		      if ((units -= 2) < 0) break
		      bytes.push(
		        codePoint >> 0x6 | 0xC0,
		        codePoint & 0x3F | 0x80
		      );
		    } else if (codePoint < 0x10000) {
		      if ((units -= 3) < 0) break
		      bytes.push(
		        codePoint >> 0xC | 0xE0,
		        codePoint >> 0x6 & 0x3F | 0x80,
		        codePoint & 0x3F | 0x80
		      );
		    } else if (codePoint < 0x110000) {
		      if ((units -= 4) < 0) break
		      bytes.push(
		        codePoint >> 0x12 | 0xF0,
		        codePoint >> 0xC & 0x3F | 0x80,
		        codePoint >> 0x6 & 0x3F | 0x80,
		        codePoint & 0x3F | 0x80
		      );
		    } else {
		      throw new Error('Invalid code point')
		    }
		  }

		  return bytes
		}

		function asciiToBytes (str) {
		  const byteArray = [];
		  for (let i = 0; i < str.length; ++i) {
		    // Node's code seems to be doing this and not & 0x7F..
		    byteArray.push(str.charCodeAt(i) & 0xFF);
		  }
		  return byteArray
		}

		function utf16leToBytes (str, units) {
		  let c, hi, lo;
		  const byteArray = [];
		  for (let i = 0; i < str.length; ++i) {
		    if ((units -= 2) < 0) break

		    c = str.charCodeAt(i);
		    hi = c >> 8;
		    lo = c % 256;
		    byteArray.push(lo);
		    byteArray.push(hi);
		  }

		  return byteArray
		}

		function base64ToBytes (str) {
		  return base64.toByteArray(base64clean(str))
		}

		function blitBuffer (src, dst, offset, length) {
		  let i;
		  for (i = 0; i < length; ++i) {
		    if ((i + offset >= dst.length) || (i >= src.length)) break
		    dst[i + offset] = src[i];
		  }
		  return i
		}

		// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
		// the `instanceof` check but they should be treated as of that type.
		// See: https://github.com/feross/buffer/issues/166
		function isInstance (obj, type) {
		  return obj instanceof type ||
		    (obj != null && obj.constructor != null && obj.constructor.name != null &&
		      obj.constructor.name === type.name)
		}
		function numberIsNaN (obj) {
		  // For IE11 support
		  return obj !== obj // eslint-disable-line no-self-compare
		}

		// Create lookup table for `toString('hex')`
		// See: https://github.com/feross/buffer/issues/219
		const hexSliceLookupTable = (function () {
		  const alphabet = '0123456789abcdef';
		  const table = new Array(256);
		  for (let i = 0; i < 16; ++i) {
		    const i16 = i * 16;
		    for (let j = 0; j < 16; ++j) {
		      table[i16 + j] = alphabet[i] + alphabet[j];
		    }
		  }
		  return table
		})();

		// Return not function with Error if BigInt not supported
		function defineBigIntMethod (fn) {
		  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
		}

		function BufferBigIntNotDefined () {
		  throw new Error('BigInt not supported')
		}
} (buffer));
	return buffer;
}

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

const { Buffer: Buffer$1 } = requireBuffer() || {};
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

const { Buffer } = requireBuffer() || { Buffer: { isBuffer: () => false } };
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

var events = {exports: {}};

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter$1() {
  EventEmitter$1.init.call(this);
}
events.exports = EventEmitter$1;
events.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter$1.EventEmitter = EventEmitter$1;

EventEmitter$1.prototype._events = undefined;
EventEmitter$1.prototype._eventsCount = 0;
EventEmitter$1.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter$1, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter$1.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter$1.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter$1.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter$1.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter$1.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter$1.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter$1.prototype.on = EventEmitter$1.prototype.addListener;

EventEmitter$1.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter$1.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter$1.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter$1.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter$1.prototype.off = EventEmitter$1.prototype.removeListener;

EventEmitter$1.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter$1.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter$1.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter$1.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter$1.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter$1.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

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
	const { Buffer } = requireBuffer() || {};
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
const { EventEmitter } = events.exports;
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

export { Store as default };
