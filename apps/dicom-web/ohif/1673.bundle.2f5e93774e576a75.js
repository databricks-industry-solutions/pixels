(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[1673], {
93008(module, __unused_rspack_exports, __webpack_require__) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


},
23836(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
function _getHash(annotationUID, drawingElementType, nodeUID) {
    return `${annotationUID}::${drawingElementType}::${nodeUID}`;
}
/* export default */ const __rspack_default_export = (_getHash);


},
57290(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
var Events;
(function (Events) {
    Events["TOOL_ACTIVATED"] = "CORNERSTONE_TOOLS_TOOL_ACTIVATED";
    Events["TOOLGROUP_VIEWPORT_ADDED"] = "CORNERSTONE_TOOLS_TOOLGROUP_VIEWPORT_ADDED";
    Events["TOOLGROUP_VIEWPORT_REMOVED"] = "CORNERSTONE_TOOLS_TOOLGROUP_VIEWPORT_REMOVED";
    Events["TOOL_MODE_CHANGED"] = "CORNERSTONE_TOOLS_TOOL_MODE_CHANGED";
    Events["CROSSHAIR_TOOL_CENTER_CHANGED"] = "CORNERSTONE_TOOLS_CROSSHAIR_TOOL_CENTER_CHANGED";
    Events["WORLD_CROSSHAIR_POINT_CHANGED"] = "CORNERSTONE_TOOLS_WORLD_CROSSHAIR_POINT_CHANGED";
    Events["WORLD_CROSSHAIR_POINT_CLEARED"] = "CORNERSTONE_TOOLS_WORLD_CROSSHAIR_POINT_CLEARED";
    Events["WORLD_CROSSHAIR_JUMPED_TO_POINT"] = "CORNERSTONE_TOOLS_WORLD_CROSSHAIR_JUMPED_TO_POINT";
    Events["SLICE_INTERSECTION_LINE_SELECTED"] = "CORNERSTONE_TOOLS_SLICE_INTERSECTION_LINE_SELECTED";
    Events["SLICE_INTERSECTION_MANIPULATION_STARTED"] = "CORNERSTONE_TOOLS_SLICE_INTERSECTION_MANIPULATION_STARTED";
    Events["SLICE_INTERSECTION_MANIPULATION_ENDED"] = "CORNERSTONE_TOOLS_SLICE_INTERSECTION_MANIPULATION_ENDED";
    Events["SLICE_INTERSECTION_SLAB_THICKNESS_CHANGED"] = "CORNERSTONE_TOOLS_SLICE_INTERSECTION_SLAB_THICKNESS_CHANGED";
    Events["VOLUMECROPPINGCONTROL_TOOL_CHANGED"] = "CORNERSTONE_TOOLS_VOLUMECROPPINGCONTROL_TOOL_CHANGED";
    Events["VOLUMECROPPING_TOOL_CHANGED"] = "CORNERSTONE_TOOLS_VOLUMECROPPING_TOOL_CHANGED";
    Events["STACK_PREFETCH_COMPLETE"] = "CORNERSTONE_TOOLS_STACK_PREFETCH_COMPLETE";
    Events["ANNOTATION_ADDED"] = "CORNERSTONE_TOOLS_ANNOTATION_ADDED";
    Events["ANNOTATION_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_COMPLETED";
    Events["ANNOTATION_MODIFIED"] = "CORNERSTONE_TOOLS_ANNOTATION_MODIFIED";
    Events["ANNOTATION_REMOVED"] = "CORNERSTONE_TOOLS_ANNOTATION_REMOVED";
    Events["ANNOTATION_SELECTION_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_SELECTION_CHANGE";
    Events["ANNOTATION_LOCK_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_LOCK_CHANGE";
    Events["ANNOTATION_VISIBILITY_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_VISIBILITY_CHANGE";
    Events["ANNOTATION_RENDERED"] = "CORNERSTONE_TOOLS_ANNOTATION_RENDERED";
    Events["ANNOTATION_CUT_MERGE_PROCESS_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_CUT_MERGE_PROCESS_COMPLETED";
    Events["ANNOTATION_INTERPOLATION_PROCESS_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_INTERPOLATION_PROCESS_COMPLETED";
    Events["INTERPOLATED_ANNOTATIONS_REMOVED"] = "CORNERSTONE_TOOLS_INTERPOLATED_ANNOTATIONS_REMOVED";
    Events["SEGMENTATION_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_MODIFIED";
    Events["SEGMENTATION_RENDERED"] = "CORNERSTONE_TOOLS_SEGMENTATION_RENDERED";
    Events["SEGMENTATION_REPRESENTATION_ADDED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_ADDED";
    Events["SEGMENTATION_ADDED"] = "CORNERSTONE_TOOLS_SEGMENTATION_ADDED";
    Events["SEGMENTATION_REPRESENTATION_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_MODIFIED";
    Events["SEGMENTATION_REMOVED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REMOVED";
    Events["SEGMENTATION_REPRESENTATION_REMOVED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_REMOVED";
    Events["SEGMENTATION_DATA_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_DATA_MODIFIED";
    Events["HISTORY_UNDO"] = "CORNERSTONE_TOOLS_HISTORY_UNDO";
    Events["HISTORY_REDO"] = "CORNERSTONE_TOOLS_HISTORY_REDO";
    Events["KEY_DOWN"] = "CORNERSTONE_TOOLS_KEY_DOWN";
    Events["KEY_UP"] = "CORNERSTONE_TOOLS_KEY_UP";
    Events["MOUSE_DOWN"] = "CORNERSTONE_TOOLS_MOUSE_DOWN";
    Events["MOUSE_UP"] = "CORNERSTONE_TOOLS_MOUSE_UP";
    Events["MOUSE_DOWN_ACTIVATE"] = "CORNERSTONE_TOOLS_MOUSE_DOWN_ACTIVATE";
    Events["MOUSE_DRAG"] = "CORNERSTONE_TOOLS_MOUSE_DRAG";
    Events["MOUSE_MOVE"] = "CORNERSTONE_TOOLS_MOUSE_MOVE";
    Events["MOUSE_CLICK"] = "CORNERSTONE_TOOLS_MOUSE_CLICK";
    Events["MOUSE_DOUBLE_CLICK"] = "CORNERSTONE_TOOLS_MOUSE_DOUBLE_CLICK";
    Events["MOUSE_WHEEL"] = "CORNERSTONE_TOOLS_MOUSE_WHEEL";
    Events["TOUCH_START"] = "CORNERSTONE_TOOLS_TOUCH_START";
    Events["TOUCH_START_ACTIVATE"] = "CORNERSTONE_TOOLS_TOUCH_START_ACTIVATE";
    Events["TOUCH_PRESS"] = "CORNERSTONE_TOOLS_TOUCH_PRESS";
    Events["TOUCH_DRAG"] = "CORNERSTONE_TOOLS_TOUCH_DRAG";
    Events["TOUCH_END"] = "CORNERSTONE_TOOLS_TOUCH_END";
    Events["TOUCH_TAP"] = "CORNERSTONE_TOOLS_TAP";
    Events["TOUCH_SWIPE"] = "CORNERSTONE_TOOLS_SWIPE";
})(Events || (Events = {}));
/* export default */ const __rspack_default_export = (Events);


},
63555(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
var SegmentationRepresentations;
(function (SegmentationRepresentations) {
    SegmentationRepresentations["Labelmap"] = "Labelmap";
    SegmentationRepresentations["Contour"] = "Contour";
    SegmentationRepresentations["Surface"] = "Surface";
})(SegmentationRepresentations || (SegmentationRepresentations = {}));
/* export default */ const __rspack_default_export = (SegmentationRepresentations);


},
44075(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  i: () => (MouseBindings),
  q: () => (KeyboardBindings)
});
var MouseBindings;
(function (MouseBindings) {
    MouseBindings[MouseBindings["Primary"] = 1] = "Primary";
    MouseBindings[MouseBindings["Secondary"] = 2] = "Secondary";
    MouseBindings[MouseBindings["Primary_And_Secondary"] = 3] = "Primary_And_Secondary";
    MouseBindings[MouseBindings["Auxiliary"] = 4] = "Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Auxiliary"] = 5] = "Primary_And_Auxiliary";
    MouseBindings[MouseBindings["Secondary_And_Auxiliary"] = 6] = "Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Secondary_And_Auxiliary"] = 7] = "Primary_And_Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Fourth_Button"] = 8] = "Fourth_Button";
    MouseBindings[MouseBindings["Fifth_Button"] = 16] = "Fifth_Button";
    MouseBindings[MouseBindings["Wheel"] = 524288] = "Wheel";
    MouseBindings[MouseBindings["Wheel_Primary"] = 524289] = "Wheel_Primary";
})(MouseBindings || (MouseBindings = {}));
var KeyboardBindings;
(function (KeyboardBindings) {
    KeyboardBindings[KeyboardBindings["Shift"] = 16] = "Shift";
    KeyboardBindings[KeyboardBindings["Ctrl"] = 17] = "Ctrl";
    KeyboardBindings[KeyboardBindings["Alt"] = 18] = "Alt";
    KeyboardBindings[KeyboardBindings["Meta"] = 91] = "Meta";
    KeyboardBindings[KeyboardBindings["ShiftCtrl"] = 1617] = "ShiftCtrl";
    KeyboardBindings[KeyboardBindings["ShiftAlt"] = 1618] = "ShiftAlt";
    KeyboardBindings[KeyboardBindings["ShiftMeta"] = 1691] = "ShiftMeta";
    KeyboardBindings[KeyboardBindings["CtrlAlt"] = 1718] = "CtrlAlt";
    KeyboardBindings[KeyboardBindings["CtrlMeta"] = 1791] = "CtrlMeta";
    KeyboardBindings[KeyboardBindings["AltMeta"] = 1891] = "AltMeta";
})(KeyboardBindings || (KeyboardBindings = {}));



},
48657(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
var ToolModes;
(function (ToolModes) {
    ToolModes["Active"] = "Active";
    ToolModes["Passive"] = "Passive";
    ToolModes["Enabled"] = "Enabled";
    ToolModes["Disabled"] = "Disabled";
})(ToolModes || (ToolModes = {}));
/* export default */ const __rspack_default_export = (ToolModes);


},
69531(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _annotationLocking_js__rspack_import_0 = __webpack_require__(3043);
/* import */ var _annotationSelection_js__rspack_import_1 = __webpack_require__(41908);
/* import */ var _enums_index_js__rspack_import_2 = __webpack_require__(53870);



function getState(annotation) {
    if (annotation) {
        if (annotation.data && annotation.highlighted) {
            return _enums_index_js__rspack_import_2.AnnotationStyleStates.Highlighted;
        }
        if ((0,_annotationSelection_js__rspack_import_1.isAnnotationSelected)(annotation.annotationUID)) {
            return _enums_index_js__rspack_import_2.AnnotationStyleStates.Selected;
        }
        if ((0,_annotationLocking_js__rspack_import_0.isAnnotationLocked)(annotation.annotationUID)) {
            return _enums_index_js__rspack_import_2.AnnotationStyleStates.Locked;
        }
        if (annotation.data && annotation.autoGenerated) {
            return _enums_index_js__rspack_import_2.AnnotationStyleStates.AutoGenerated;
        }
    }
    return _enums_index_js__rspack_import_2.AnnotationStyleStates.Default;
}
/* export default */ const __rspack_default_export = (getState);


},
55649(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  h: () => (getStyleProperty)
});
/* import */ var _ToolStyle_js__rspack_import_0 = __webpack_require__(51995);

function getHierarchalPropertyStyles(property, state, mode) {
    const list = [`${property}`];
    if (state) {
        list.push(`${list[0]}${state}`);
    }
    if (mode) {
        list.push(`${list[list.length - 1]}${mode}`);
    }
    return list;
}
function getStyleProperty(property, styleSpecifier, state, mode) {
    const alternatives = getHierarchalPropertyStyles(property, state, mode);
    for (let i = alternatives.length - 1; i >= 0; --i) {
        const style = _ToolStyle_js__rspack_import_0/* ["default"].getStyleProperty */.A.getStyleProperty(alternatives[i], styleSpecifier);
        if (style !== undefined) {
            return style;
        }
    }
}



},
34350(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  triggerAnnotationAddedForElement: () => (triggerAnnotationAddedForElement),
  triggerAnnotationAddedForFOR: () => (triggerAnnotationAddedForFOR),
  triggerAnnotationCompleted: () => (triggerAnnotationCompleted),
  triggerAnnotationModified: () => (triggerAnnotationModified),
  triggerAnnotationRemoved: () => (triggerAnnotationRemoved),
  triggerContourAnnotationCompleted: () => (triggerContourAnnotationCompleted)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _enums_index_js__rspack_import_1 = __webpack_require__(53870);
/* import */ var _store_ToolGroupManager_index_js__rspack_import_2 = __webpack_require__(72314);



function triggerAnnotationAddedForElement(annotation, element) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { renderingEngine, viewportId } = enabledElement;
    const eventType = _enums_index_js__rspack_import_1.Events.ANNOTATION_ADDED;
    const eventDetail = {
        annotation,
        viewportId,
        renderingEngineId: renderingEngine.id,
    };
    (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, eventType, eventDetail);
}
function triggerAnnotationAddedForFOR(annotation) {
    const { toolName } = annotation.metadata;
    const toolGroups = (0,_store_ToolGroupManager_index_js__rspack_import_2.getToolGroupsWithToolName)(toolName);
    if (!toolGroups.length) {
        return;
    }
    const viewportsToRender = [];
    toolGroups.forEach((toolGroup) => {
        toolGroup.viewportsInfo.forEach((viewportInfo) => {
            const { renderingEngineId, viewportId } = viewportInfo;
            const { FrameOfReferenceUID } = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByIds)(viewportId, renderingEngineId);
            if (annotation.metadata.FrameOfReferenceUID === FrameOfReferenceUID) {
                viewportsToRender.push(viewportInfo);
            }
        });
    });
    const eventType = _enums_index_js__rspack_import_1.Events.ANNOTATION_ADDED;
    const eventDetail = { annotation };
    if (!viewportsToRender.length) {
        (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, eventType, eventDetail);
        return;
    }
    viewportsToRender.forEach(({ renderingEngineId, viewportId }) => {
        eventDetail.viewportId = viewportId;
        eventDetail.renderingEngineId = renderingEngineId;
        (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, eventType, eventDetail);
    });
}
function triggerAnnotationRemoved(eventDetail) {
    const eventType = _enums_index_js__rspack_import_1.Events.ANNOTATION_REMOVED;
    (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, eventType, eventDetail);
}
function triggerAnnotationModified(annotation, element, changeType = _enums_index_js__rspack_import_1.ChangeTypes.HandlesUpdated) {
    const enabledElement = element && (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { viewportId, renderingEngineId } = enabledElement || {};
    const eventType = _enums_index_js__rspack_import_1.Events.ANNOTATION_MODIFIED;
    const eventDetail = {
        annotation,
        viewportId,
        renderingEngineId,
        changeType,
    };
    (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, eventType, eventDetail);
}
function triggerAnnotationCompleted(annotation) {
    const eventDetail = {
        annotation,
    };
    _triggerAnnotationCompleted(eventDetail);
}
function triggerContourAnnotationCompleted(annotation, contourHoleProcessingEnabled = false) {
    const eventDetail = {
        annotation,
        contourHoleProcessingEnabled,
    };
    _triggerAnnotationCompleted(eventDetail);
}
function _triggerAnnotationCompleted(eventDetail) {
    const eventType = _enums_index_js__rspack_import_1.Events.ANNOTATION_COMPLETED;
    (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, eventType, eventDetail);
}



},
30362(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  c: () => (/* binding */ resetAnnotationManager)
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/utilities/defineProperties.js
const checkAndDefineTextBoxProperty = (annotation) => {
    if (!annotation.data) {
        annotation.data = {};
    }
    if (!annotation.data.handles) {
        annotation.data.handles = {};
    }
    if (!annotation.data.handles.textBox) {
        annotation.data.handles.textBox = {};
    }
    return annotation;
};
const checkAndDefineCachedStatsProperty = (annotation) => {
    if (!annotation.data) {
        annotation.data = {};
    }
    if (!annotation.data.cachedStats) {
        annotation.data.cachedStats = {};
    }
    return annotation;
};


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationLocking.js
var annotationLocking = __webpack_require__(3043);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationVisibility.js
var annotationVisibility = __webpack_require__(46804);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/FrameOfReferenceSpecificAnnotationManager.js
var FrameOfReferenceSpecificAnnotationManager = __webpack_require__(83342);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState.js
var annotationState = __webpack_require__(44627);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/resetAnnotationManager.js





const defaultManager = FrameOfReferenceSpecificAnnotationManager/* .defaultFrameOfReferenceSpecificAnnotationManager */.H;
const preprocessingFn = (annotation) => {
    annotation = checkAndDefineTextBoxProperty(annotation);
    annotation = checkAndDefineCachedStatsProperty(annotation);
    const uid = annotation.annotationUID;
    const isLocked = (0,annotationLocking.checkAndSetAnnotationLocked)(uid);
    annotation.isLocked = isLocked;
    const isVisible = (0,annotationVisibility.checkAndSetAnnotationVisibility)(uid);
    annotation.isVisible = isVisible;
    return annotation;
};
defaultManager.setPreprocessingFn(preprocessingFn);
(0,annotationState.setAnnotationManager)(defaultManager);
function resetAnnotationManager() {
    (0,annotationState.setAnnotationManager)(defaultManager);
}


},
84368(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  R: () => (triggerSegmentationAdded)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _enums_index_js__rspack_import_1 = __webpack_require__(53870);


function triggerSegmentationAdded(segmentationId) {
    const eventDetail = {
        segmentationId,
    };
    (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, _enums_index_js__rspack_import_1.Events.SEGMENTATION_ADDED, eventDetail);
}


},
61395(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Q: () => (getActiveSegmentIndex)
});
/* import */ var _getSegmentation_js__rspack_import_0 = __webpack_require__(99212);

function getActiveSegmentIndex(segmentationId) {
    const segmentation = (0,_getSegmentation_js__rspack_import_0/* .getSegmentation */.T)(segmentationId);
    if (segmentation) {
        const activeSegmentIndex = Object.keys(segmentation.segments).find((segmentIndex) => segmentation.segments[segmentIndex].active);
        return activeSegmentIndex ? Number(activeSegmentIndex) : undefined;
    }
    return undefined;
}


},
39550(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  B: () => (getColorLUT)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getColorLUT(index) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getColorLUT(index);
}


},
99212(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  T: () => (getSegmentation)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getSegmentation(segmentationId) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getSegmentation(segmentationId);
}


},
83470(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  P: () => (getViewportIdsWithSegmentation)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getViewportIdsWithSegmentation(segmentationId) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    const state = segmentationStateManager.getState();
    const viewportSegRepresentations = state.viewportSegRepresentations;
    const viewportIdsWithSegmentation = Object.entries(viewportSegRepresentations)
        .filter(([, viewportSegmentations]) => viewportSegmentations.some((segRep) => segRep.segmentationId === segmentationId))
        .map(([viewportId]) => viewportId);
    return viewportIdsWithSegmentation;
}


},
72293(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getViewportLabelmapRenderMode)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _labelmapImageMapperSupport_js__rspack_import_1 = __webpack_require__(53585);


function getViewportLabelmapRenderMode(viewport, options) {
    const compatibilityViewport = viewport;
    const useSliceRendering = (0,_labelmapImageMapperSupport_js__rspack_import_1/* .isSliceRenderingEnabled */.yc)(options);
    if (useSliceRendering && (0,_labelmapImageMapperSupport_js__rspack_import_1/* .canRenderVolumeViewportLabelmapAsImage */.QO)(viewport)) {
        return 'image';
    }
    if (viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport) {
        return 'volume';
    }
    if (viewport instanceof _cornerstonejs_core__rspack_import_0.StackViewport) {
        return 'image';
    }
    const defaultActor = typeof compatibilityViewport.getDefaultActor === 'function'
        ? compatibilityViewport.getDefaultActor()
        : undefined;
    const actorMapper = defaultActor?.actorMapper;
    const renderMode = actorMapper?.renderMode;
    if (renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_VOLUME ||
        renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_VOLUME_SLICE) {
        return 'volume';
    }
    if (renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.CPU_VOLUME) {
        return 'volume';
    }
    if (renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_IMAGE ||
        renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.CPU_IMAGE) {
        return 'image';
    }
    const actorClassName = typeof defaultActor?.actor?.getClassName === 'function'
        ? defaultActor.actor.getClassName()
        : undefined;
    if (actorClassName === 'vtkVolume') {
        return 'volume';
    }
    if (actorClassName === 'vtkImageSlice') {
        return 'image';
    }
    if (actorClassName === 'CanvasActor') {
        const defaultActorRenderMode = actorMapper?.renderMode;
        if (defaultActorRenderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.CPU_VOLUME) {
            return 'volume';
        }
        return 'image';
    }
    if (compatibilityViewport.type === _cornerstonejs_core__rspack_import_0.Enums.ViewportType.PLANAR_NEXT) {
        if (compatibilityViewport.getVolumeId?.()) {
            return 'volume';
        }
        return typeof compatibilityViewport.getCurrentImageId === 'function'
            ? 'image'
            : 'unsupported';
    }
    return typeof compatibilityViewport.getCurrentImageId === 'function'
        ? 'image'
        : 'unsupported';
}


},
76868(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  wV: () => (/* reexport */ getSegmentationActor/* .getLabelmapActorEntry */.wV)
});

// UNUSED EXPORTS: getLabelmapActorEntries, getLabelmapActorUID, getSurfaceActorEntry, validateSegmentationInput

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/validateLabelmap.js
var validateLabelmap = __webpack_require__(3120);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/validateSegmentationInput.js


function validateSegmentationInput(segmentationInputArray) {
    if (!segmentationInputArray || segmentationInputArray.length === 0) {
        throw new Error('The segmentationInputArray is undefined or an empty array');
    }
    segmentationInputArray.forEach((segmentationInput) => {
        if (segmentationInput.segmentationId === undefined) {
            throw new Error('Undefined segmentationInput.segmentationId. Please provide a valid segmentationId');
        }
        if (segmentationInput.representation === undefined) {
            throw new Error('Undefined segmentationInput.representation. Please provide a valid representation');
        }
        if (segmentationInput.representation.type ===
            Enums.SegmentationRepresentations.Labelmap) {
            validatePublicLabelmap(segmentationInput);
        }
    });
}
/* export default */ const helpers_validateSegmentationInput = ((/* unused pure expression or super */ null && (validateSegmentationInput)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getSegmentationActor.js
var getSegmentationActor = __webpack_require__(47153);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/index.js





},
83789(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  s: () => (internalGetHiddenSegmentIndices)
});
/* import */ var _getSegmentationRepresentation_js__rspack_import_0 = __webpack_require__(54869);

function internalGetHiddenSegmentIndices(viewportId, specifier) {
    const representation = (0,_getSegmentationRepresentation_js__rspack_import_0/* .getSegmentationRepresentation */.Ut)(viewportId, specifier);
    if (!representation) {
        return new Set();
    }
    const segmentsHidden = Object.entries(representation.segments).reduce((acc, [segmentIndex, segment]) => {
        if (!segment.visible) {
            acc.add(Number(segmentIndex));
        }
        return acc;
    }, new Set());
    return segmentsHidden;
}


},
73344(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Qk: () => (beginLabelmapEditTransaction),
  Ry: () => (eraseLabelmapEditTransactionOverwrites),
  VQ: () => (resolveLabelmapLayerEditTarget)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _labelmapLayerStore_js__rspack_import_1 = __webpack_require__(88392);
/* import */ var _labelmapSegmentBindings_js__rspack_import_2 = __webpack_require__(59371);
/* import */ var _privateLabelmap_js__rspack_import_3 = __webpack_require__(48019);




function getProtectedSegmentIndicesForLayer(segmentation, labelmapId, segmentIndex, overwriteSegmentIndices = []) {
    return (0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentsOnLabelmap */.I3)(segmentation, labelmapId).filter((candidateSegmentIndex) => candidateSegmentIndex !== segmentIndex &&
        !overwriteSegmentIndices.includes(candidateSegmentIndex));
}
function hasProtectedSegmentOverwrite(segmentation, labelmapId, protectedSegmentIndices, voxelManager, options = {}) {
    if (!voxelManager || !protectedSegmentIndices.length) {
        return false;
    }
    const protectedSet = new Set(protectedSegmentIndices);
    let hasConflict = false;
    voxelManager.forEach(({ value }) => {
        if (!value || hasConflict) {
            return;
        }
        const candidateSegmentIndex = (0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentIndexForLabelValue */.Mx)(segmentation, labelmapId, Number(value));
        if (candidateSegmentIndex && protectedSet.has(candidateSegmentIndex)) {
            hasConflict = true;
        }
    }, {
        imageData: options.segmentationImageData,
        isInObject: options.isInObject,
        boundsIJK: options.isInObjectBoundsIJK,
    });
    return hasConflict;
}
function collectCrossLayerEraseBindings(segmentation, labelmapId, overwriteSegmentIndices = []) {
    if (!labelmapId || !overwriteSegmentIndices.length) {
        return [];
    }
    return overwriteSegmentIndices
        .map((overwriteSegmentIndex) => (0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentBinding */.hM)(segmentation, overwriteSegmentIndex))
        .filter((binding) => !!binding && binding.labelmapId !== labelmapId);
}
function beginLabelmapEditTransaction(segmentation, options) {
    const { segmentIndex } = options;
    const overwriteSegmentIndices = options.overwriteSegmentIndices ?? [];
    if (!segmentIndex) {
        return {
            segmentIndex,
            labelValue: 0,
            overwriteSegmentIndices,
            protectedSegmentIndices: [],
            crossLayerEraseBindings: [],
            movedSegment: false,
        };
    }
    const binding = (0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentBinding */.hM)(segmentation, segmentIndex);
    const sourceLayer = binding
        ? (0,_labelmapLayerStore_js__rspack_import_1/* .getLabelmap */.Hs)(segmentation, binding.labelmapId)
        : undefined;
    if (!binding || !sourceLayer) {
        return {
            segmentIndex,
            labelValue: segmentIndex,
            overwriteSegmentIndices,
            protectedSegmentIndices: [],
            crossLayerEraseBindings: [],
            movedSegment: false,
        };
    }
    let activeLayer = sourceLayer;
    let labelmapId = binding.labelmapId;
    let labelValue = binding.labelValue;
    let movedSegment = false;
    const protectedSegmentIndices = getProtectedSegmentIndicesForLayer(segmentation, labelmapId, segmentIndex, overwriteSegmentIndices);
    const shouldMoveSegment = hasProtectedSegmentOverwrite(segmentation, labelmapId, protectedSegmentIndices, options.segmentationVoxelManager, {
        segmentationImageData: options.segmentationImageData,
        isInObject: options.isInObject,
        isInObjectBoundsIJK: options.isInObjectBoundsIJK,
    });
    let moveStep;
    if (shouldMoveSegment) {
        const moveSegmentToPrivateLabelmap = options.moveSegmentToPrivateLabelmap ??
            _privateLabelmap_js__rspack_import_3/* .moveSegmentToPrivateLabelmap */.J;
        const privateLayer = moveSegmentToPrivateLabelmap(segmentation, segmentIndex, { moveStepCallback: (step) => (moveStep = step) });
        const privateBinding = (0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentBinding */.hM)(segmentation, segmentIndex);
        if (privateLayer && privateBinding) {
            activeLayer = privateLayer;
            labelmapId = privateBinding.labelmapId;
            labelValue = privateBinding.labelValue;
            movedSegment = privateLayer.labelmapId !== sourceLayer.labelmapId;
        }
        else if (privateLayer) {
            activeLayer = privateLayer;
            labelmapId = privateLayer.labelmapId;
            labelValue = 1;
            movedSegment = privateLayer.labelmapId !== sourceLayer.labelmapId;
        }
    }
    return {
        segmentIndex,
        labelmapId,
        labelValue,
        sourceLayer,
        activeLayer,
        overwriteSegmentIndices,
        protectedSegmentIndices,
        crossLayerEraseBindings: collectCrossLayerEraseBindings(segmentation, labelmapId, overwriteSegmentIndices),
        movedSegment,
        moveStep,
    };
}
function getViewportImageIds(viewport) {
    const stackViewport = viewport;
    return typeof stackViewport?.getImageIds === 'function'
        ? stackViewport.getImageIds()
        : [];
}
function getCurrentViewportImageId(viewport) {
    const stackViewport = viewport;
    return typeof stackViewport?.getCurrentImageId === 'function'
        ? stackViewport.getCurrentImageId()
        : undefined;
}
function getLayerImageIndex(layer, options) {
    const currentImageId = options.imageId ?? getCurrentViewportImageId(options.viewport);
    if (!currentImageId) {
        return -1;
    }
    const sourceImageIndex = options.sourceLayer?.imageIds?.indexOf(currentImageId) ?? -1;
    if (sourceImageIndex >= 0) {
        return sourceImageIndex;
    }
    const layerImageIndex = layer.imageIds?.indexOf(currentImageId) ?? -1;
    if (layerImageIndex >= 0) {
        return layerImageIndex;
    }
    return getViewportImageIds(options.viewport).indexOf(currentImageId);
}
function getLabelmapLayerImageId(layer, options = {}) {
    const targetIndex = getLayerImageIndex(layer, options);
    return targetIndex >= 0 ? layer.imageIds?.[targetIndex] : layer.imageIds?.[0];
}
function resolveLabelmapLayerEditTarget(layer, options = {}) {
    const imageId = getLabelmapLayerImageId(layer, options);
    if (options.preferVolume ||
        layer.volumeId ||
        options.viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport) {
        const volume = (0,_labelmapLayerStore_js__rspack_import_1/* .getOrCreateLabelmapVolume */.kL)(layer);
        return {
            imageId,
            imageData: volume?.imageData,
            voxelManager: volume?.voxelManager,
            volume,
        };
    }
    const image = imageId ? _cornerstonejs_core__rspack_import_0.cache.getImage(imageId) : undefined;
    return {
        imageId,
        voxelManager: image?.voxelManager,
        image,
    };
}
function eraseVolumeLayer(layer, binding, options, modifiedSlices) {
    const volume = (0,_labelmapLayerStore_js__rspack_import_1/* .getOrCreateLabelmapVolume */.kL)(layer);
    if (!volume) {
        return;
    }
    const erasedIndices = [];
    volume.voxelManager.forEach(({ value, index, pointIJK }) => {
        if (value !== binding.labelValue) {
            return;
        }
        const worldPoint = volume.imageData.indexToWorld(pointIJK);
        if (!options.isInObject(worldPoint)) {
            return;
        }
        volume.voxelManager.setAtIndex(index, 0);
        erasedIndices.push(index);
    }, {
        imageData: volume.imageData,
        boundsIJK: options.isInObjectBoundsIJK,
    });
    if (erasedIndices.length) {
        options.crossLayerEraseCallback?.({
            voxelManager: volume.voxelManager,
            labelValue: binding.labelValue,
            indices: erasedIndices,
        });
    }
    volume.voxelManager
        ?.getArrayOfModifiedSlices?.()
        ?.forEach((sliceIndex) => modifiedSlices.add(sliceIndex));
}
function eraseStackLayer(layer, binding, options, modifiedSlices) {
    const stackViewport = options.viewport;
    const currentImageId = getCurrentViewportImageId(options.viewport) ?? options.imageId;
    const { image, voxelManager } = resolveLabelmapLayerEditTarget(layer, {
        viewport: options.viewport,
        imageId: currentImageId,
    });
    if (!image || !voxelManager) {
        return;
    }
    const erasedIndices = [];
    voxelManager.forEach(({ value, index, pointIJK }) => {
        if (value !== binding.labelValue) {
            return;
        }
        const worldPoint = options.referenceImageData.indexToWorld(pointIJK);
        if (!options.isInObject(worldPoint)) {
            return;
        }
        voxelManager.setAtIndex(index, 0);
        erasedIndices.push(index);
    }, {
        imageData: options.referenceImageData,
        boundsIJK: options.isInObjectBoundsIJK,
    });
    if (erasedIndices.length) {
        options.crossLayerEraseCallback?.({
            voxelManager,
            labelValue: binding.labelValue,
            indices: erasedIndices,
        });
    }
    const currentSlice = stackViewport.getCurrentImageIdIndex?.();
    if (typeof currentSlice === 'number') {
        modifiedSlices.add(currentSlice);
    }
}
function eraseLabelmapEditTransactionOverwrites(segmentation, transaction, options) {
    if (!transaction?.crossLayerEraseBindings?.length) {
        return [];
    }
    const modifiedSlices = new Set();
    transaction.crossLayerEraseBindings.forEach((binding) => {
        const layer = (0,_labelmapLayerStore_js__rspack_import_1/* .getLabelmap */.Hs)(segmentation, binding.labelmapId);
        if (!layer) {
            return;
        }
        if (options.viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport || layer.volumeId) {
            eraseVolumeLayer(layer, binding, options, modifiedSlices);
            return;
        }
        eraseStackLayer(layer, binding, options, modifiedSlices);
    });
    return Array.from(modifiedSlices);
}



},
26372(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Zd: () => (forEachLabelmapImageReference),
  dm: () => (hasMultipleLabelmapImagesPerReferencedImageId),
  s_: () => (getLabelmapImageIdsForReferencedImageId)
});
function getReferencedImageIdForImageIndex(layer, imageIndex) {
    const imageIds = layer.imageIds ?? [];
    const referencedImageIds = layer.referencedImageIds ?? imageIds;
    if (!referencedImageIds.length) {
        return;
    }
    if (layer.referencedImageIds?.length &&
        imageIds.length > referencedImageIds.length &&
        imageIds.length % referencedImageIds.length === 0) {
        return referencedImageIds[imageIndex % referencedImageIds.length];
    }
    return referencedImageIds[imageIndex];
}
function forEachLabelmapImageReference(layer, callback) {
    layer.imageIds?.forEach((labelmapImageId, imageIndex) => {
        const referencedImageId = getReferencedImageIdForImageIndex(layer, imageIndex);
        if (!referencedImageId || !labelmapImageId) {
            return;
        }
        callback(referencedImageId, labelmapImageId, imageIndex);
    });
}
function getLabelmapImageIdsForReferencedImageId(layer, referencedImageId) {
    const imageIds = [];
    forEachLabelmapImageReference(layer, (candidateReference, imageId) => {
        if (candidateReference === referencedImageId) {
            imageIds.push(imageId);
        }
    });
    return imageIds;
}
function hasMultipleLabelmapImagesPerReferencedImageId(layer) {
    const imageIdsByReference = new Map();
    forEachLabelmapImageReference(layer, (referencedImageId) => {
        imageIdsByReference.set(referencedImageId, (imageIdsByReference.get(referencedImageId) ?? 0) + 1);
    });
    return Array.from(imageIdsByReference.values()).some((count) => count > 1);
}



},
77438(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _helpers_getViewportLabelmapRenderMode_js__rspack_import_1 = __webpack_require__(72293);
/* import */ var _normalizeLabelmapSegmentationData_js__rspack_import_2 = __webpack_require__(209);
/* import */ var _labelmapLayerStore_js__rspack_import_3 = __webpack_require__(88392);
/* import */ var _labelmapSegmentBindings_js__rspack_import_4 = __webpack_require__(59371);
/* import */ var _labelmapLegacyAdapter_js__rspack_import_5 = __webpack_require__(2674);
/* import */ var _labelmapImageIdMapping_js__rspack_import_6 = __webpack_require__(26372);







class LabelmapImageReferenceResolver {
    constructor(getSegmentation) {
        this.stackLabelmapImageIdReferenceMap = new Map();
        this.labelmapImageIdReferenceMap = new Map();
        this.keysBySegmentationId = new Map();
        this.completedScanResultsBySegmentationId = new Map();
        this.getSegmentation = getSegmentation;
    }
    reset() {
        this.stackLabelmapImageIdReferenceMap.clear();
        this.labelmapImageIdReferenceMap.clear();
        this.keysBySegmentationId.clear();
        this.completedScanResultsBySegmentationId.clear();
    }
    removeSegmentation(segmentationId) {
        this.stackLabelmapImageIdReferenceMap.delete(segmentationId);
        this.completedScanResultsBySegmentationId.delete(segmentationId);
        const keys = this.keysBySegmentationId.get(segmentationId);
        if (keys) {
            for (const key of keys) {
                this.labelmapImageIdReferenceMap.delete(key);
            }
            this.keysBySegmentationId.delete(segmentationId);
        }
    }
    setLabelmapImageIds(segmentationId, key, labelmapImageIds) {
        this.labelmapImageIdReferenceMap.set(key, labelmapImageIds);
        let keys = this.keysBySegmentationId.get(segmentationId);
        if (!keys) {
            keys = new Set();
            this.keysBySegmentationId.set(segmentationId, keys);
        }
        keys.add(key);
    }
    getLabelmapImageIds(representationData) {
        const labelmapData = representationData.Labelmap;
        let labelmapImageIds;
        if (!labelmapData) {
            return;
        }
        if (labelmapData?.labelmaps) {
            const imageIds = Object.values(labelmapData.labelmaps).flatMap((layer) => {
                if (layer.imageIds?.length) {
                    return layer.imageIds;
                }
                if (layer.volumeId) {
                    return _cornerstonejs_core__rspack_import_0.cache.getVolume(layer.volumeId)
                        ?.imageIds;
                }
                return [];
            });
            return Array.from(new Set(imageIds.filter(Boolean)));
        }
        if (labelmapData.imageIds) {
            labelmapImageIds = labelmapData
                .imageIds;
        }
        else if (labelmapData.volumeId) {
            const volumeId = labelmapData
                .volumeId;
            const volume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
            labelmapImageIds = volume.imageIds;
        }
        return labelmapImageIds;
    }
    getLabelmapImageIdsForImageId(imageId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation?.representationData?.Labelmap) {
            return;
        }
        (0,_normalizeLabelmapSegmentationData_js__rspack_import_2/* .ensureLabelmapState */.uk)(segmentation);
        return (0,_labelmapLegacyAdapter_js__rspack_import_5/* .getReferencedImageIdToCurrentImageIdMap */._)(segmentation).get(imageId);
    }
    updateLabelmapSegmentationImageReferences(viewportId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        if (!this.stackLabelmapImageIdReferenceMap.has(segmentationId)) {
            this.stackLabelmapImageIdReferenceMap.set(segmentationId, new Map());
        }
        const { representationData } = segmentation;
        if (!representationData.Labelmap) {
            return;
        }
        const labelmapImageIds = this.getLabelmapImageIds(representationData);
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement || !labelmapImageIds?.length) {
            return;
        }
        const viewport = enabledElement.viewport;
        const scanKey = this.generateScanKey('current', viewport, labelmapImageIds);
        if (scanKey && this.hasCompletedScan(segmentationId, scanKey)) {
            return this.getCompletedScanResult(segmentationId, scanKey);
        }
        const result = this.updateLabelmapSegmentationReferences(segmentationId, viewport, labelmapImageIds);
        if (scanKey) {
            this.markCompletedScan(segmentationId, scanKey, result);
        }
        return result;
    }
    generateScanKey(kind, viewport, labelmapImageIds) {
        const referenceImageId = typeof viewport.getCurrentImageId === 'function'
            ? viewport.getCurrentImageId()
            : undefined;
        if (!referenceImageId) {
            return;
        }
        return `${kind}|${viewport.id}|${referenceImageId}|${labelmapImageIds.length}|${labelmapImageIds[0]}|${labelmapImageIds[labelmapImageIds.length - 1]}`;
    }
    hasCompletedScan(segmentationId, scanKey) {
        return !!this.completedScanResultsBySegmentationId
            .get(segmentationId)
            ?.has(scanKey);
    }
    getCompletedScanResult(segmentationId, scanKey) {
        return this.completedScanResultsBySegmentationId
            .get(segmentationId)
            ?.get(scanKey);
    }
    markCompletedScan(segmentationId, scanKey, result) {
        let results = this.completedScanResultsBySegmentationId.get(segmentationId);
        if (!results) {
            results = new Map();
            this.completedScanResultsBySegmentationId.set(segmentationId, results);
        }
        results.set(scanKey, result);
    }
    getCurrentLabelmapImageIdsForViewport(viewportId, segmentationId) {
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const { viewport } = enabledElement;
        const viewportRenderMode = (0,_helpers_getViewportLabelmapRenderMode_js__rspack_import_1/* ["default"] */.A)(viewport);
        if (viewportRenderMode !== 'image' ||
            typeof viewport.getCurrentImageId !== 'function') {
            return;
        }
        const referenceImageId = viewport.getCurrentImageId();
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        (0,_normalizeLabelmapSegmentationData_js__rspack_import_2/* .ensureLabelmapState */.uk)(segmentation);
        const viewportImageIds = viewport.getImageIds();
        const currentIndex = viewportImageIds.indexOf(referenceImageId);
        const labelmapImageIds = [];
        (0,_labelmapLayerStore_js__rspack_import_3/* .getLabelmaps */.m)(segmentation).forEach((layer) => {
            const referencedLabelmapImageIds = (0,_labelmapImageIdMapping_js__rspack_import_6/* .getLabelmapImageIdsForReferencedImageId */.s_)(layer, referenceImageId);
            if (referencedLabelmapImageIds.length) {
                labelmapImageIds.push(...referencedLabelmapImageIds);
                return;
            }
            if (currentIndex !== -1 && layer.imageIds?.[currentIndex]) {
                labelmapImageIds.push(layer.imageIds[currentIndex]);
                return;
            }
            layer.imageIds?.some((candidateImageId) => {
                const viewableImageId = viewport.isReferenceViewable({ referencedImageId: candidateImageId }, { asOverlay: true });
                if (viewableImageId) {
                    labelmapImageIds.push(candidateImageId);
                }
                return !!viewableImageId;
            });
        });
        const resolvedImageIds = Array.from(new Set(labelmapImageIds));
        const key = this.generateMapKey({
            segmentationId,
            referenceImageId,
        });
        this.setLabelmapImageIds(segmentationId, key, resolvedImageIds);
        if (!this.stackLabelmapImageIdReferenceMap.has(segmentationId)) {
            this.stackLabelmapImageIdReferenceMap.set(segmentationId, new Map());
        }
        const activeSegmentIndex = Object.keys(segmentation.segments).find((segmentIndex) => segmentation.segments[segmentIndex].active);
        const activeImageId = activeSegmentIndex
            ? (0,_labelmapSegmentBindings_js__rspack_import_4/* .getLabelmapForSegment */.r)(segmentation, Number(activeSegmentIndex))
                ?.imageIds?.[currentIndex]
            : undefined;
        this.stackLabelmapImageIdReferenceMap
            .get(segmentationId)
            .set(referenceImageId, activeImageId ?? resolvedImageIds[0]);
        return resolvedImageIds;
    }
    getCurrentLabelmapImageIdForViewport(viewportId, segmentationId) {
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const { viewport } = enabledElement;
        const viewportRenderMode = (0,_helpers_getViewportLabelmapRenderMode_js__rspack_import_1/* ["default"] */.A)(viewport);
        if (viewportRenderMode !== 'image' ||
            typeof viewport.getCurrentImageId !== 'function') {
            return;
        }
        const currentImageId = viewport.getCurrentImageId();
        const currentImageIds = this.getCurrentLabelmapImageIdsForViewport(viewportId, segmentationId);
        if (!currentImageIds?.length) {
            return;
        }
        const segmentation = this.getSegmentation(segmentationId);
        const currentIndex = viewport
            .getImageIds()
            .indexOf(currentImageId);
        const activeSegmentIndex = segmentation
            ? Object.keys(segmentation.segments).find((segmentIndex) => segmentation.segments[segmentIndex].active)
            : undefined;
        const activeImageId = segmentation && activeSegmentIndex
            ? (0,_labelmapSegmentBindings_js__rspack_import_4/* .getLabelmapForSegment */.r)(segmentation, Number(activeSegmentIndex))
                ?.imageIds?.[currentIndex]
            : undefined;
        return activeImageId ?? currentImageIds[0];
    }
    getStackSegmentationImageIdsForViewport(viewportId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return [];
        }
        this.updateAllLabelmapSegmentationImageReferences(viewportId, segmentationId);
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
        const imageIds = enabledElement?.viewport.getImageIds?.() ?? [];
        const imageIdMap = (0,_labelmapLegacyAdapter_js__rspack_import_5/* .getReferencedImageIdToCurrentImageIdMap */._)(segmentation);
        return imageIds.flatMap((imageId) => imageIdMap.get(imageId) ?? []);
    }
    updateLabelmapSegmentationReferences(segmentationId, viewport, labelmapImageIds, updateCallback) {
        const referenceImageId = viewport.getCurrentImageId();
        let viewableLabelmapImageIdFound = false;
        for (const labelmapImageId of labelmapImageIds) {
            const viewableImageId = viewport.isReferenceViewable({ referencedImageId: labelmapImageId }, { asOverlay: true });
            if (viewableImageId) {
                viewableLabelmapImageIdFound = true;
                this.stackLabelmapImageIdReferenceMap
                    .get(segmentationId)
                    .set(referenceImageId, labelmapImageId);
                this.updateLabelmapImageIdReferenceMap({
                    segmentationId,
                    referenceImageId,
                    labelmapImageId,
                });
            }
        }
        updateCallback?.(viewport, segmentationId, labelmapImageIds);
        return viewableLabelmapImageIdFound
            ? this.stackLabelmapImageIdReferenceMap
                .get(segmentationId)
                .get(referenceImageId)
            : undefined;
    }
    updateAllLabelmapSegmentationImageReferences(viewportId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        if (!this.stackLabelmapImageIdReferenceMap.has(segmentationId)) {
            this.stackLabelmapImageIdReferenceMap.set(segmentationId, new Map());
        }
        const { representationData } = segmentation;
        if (!representationData.Labelmap) {
            return;
        }
        const labelmapImageIds = this.getLabelmapImageIds(representationData);
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement || !labelmapImageIds?.length) {
            return;
        }
        const stackViewport = enabledElement.viewport;
        const scanKey = this.generateScanKey('all', stackViewport, labelmapImageIds);
        if (scanKey && this.hasCompletedScan(segmentationId, scanKey)) {
            return;
        }
        if (scanKey) {
            this.markCompletedScan(segmentationId, scanKey);
        }
        this.updateLabelmapSegmentationReferences(segmentationId, stackViewport, labelmapImageIds, (stackViewport, segmentationId, labelmapImageIds) => {
            const imageIds = stackViewport.getImageIds();
            imageIds.forEach((referenceImageId, index) => {
                for (const labelmapImageId of labelmapImageIds) {
                    const viewableImageId = stackViewport.isReferenceViewable({ referencedImageId: labelmapImageId, sliceIndex: index }, { asOverlay: true, withNavigation: true });
                    if (viewableImageId) {
                        this.stackLabelmapImageIdReferenceMap
                            .get(segmentationId)
                            .set(referenceImageId, labelmapImageId);
                        this.updateLabelmapImageIdReferenceMap({
                            segmentationId,
                            referenceImageId,
                            labelmapImageId,
                        });
                    }
                }
            });
        });
    }
    updateLabelmapImageIdReferenceMap({ segmentationId, referenceImageId, labelmapImageId, }) {
        const key = this.generateMapKey({ segmentationId, referenceImageId });
        if (!this.labelmapImageIdReferenceMap.has(key)) {
            this.setLabelmapImageIds(segmentationId, key, [labelmapImageId]);
            return;
        }
        const currentValues = this.labelmapImageIdReferenceMap.get(key) ?? [];
        const newValues = Array.from(new Set([...currentValues, labelmapImageId]));
        this.setLabelmapImageIds(segmentationId, key, newValues);
    }
    generateMapKey({ segmentationId, referenceImageId }) {
        return `${segmentationId}-${referenceImageId}`;
    }
}
/* export default */ const __rspack_default_export = (LabelmapImageReferenceResolver);


},
2674(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  _: () => (getReferencedImageIdToCurrentImageIdMap),
  x: () => (syncLegacyLabelmapData)
});
/* import */ var _normalizeLabelmapSegmentationData_js__rspack_import_0 = __webpack_require__(209);
/* import */ var _labelmapLayerStore_js__rspack_import_1 = __webpack_require__(88392);
/* import */ var _labelmapImageIdMapping_js__rspack_import_2 = __webpack_require__(26372);



function syncOptionalLegacyProperty(target, key, value) {
    if (value == null) {
        delete target[key];
        return;
    }
    target[key] = value;
}
function syncLegacyLabelmapData(segmentation) {
    const labelmapState = (0,_normalizeLabelmapSegmentationData_js__rspack_import_0/* .ensureLabelmapState */.uk)(segmentation);
    if (!labelmapState) {
        return;
    }
    const firstSegmentIndex = (0,_normalizeLabelmapSegmentationData_js__rspack_import_0/* .getSegmentOrder */.gV)(segmentation)[0] ?? 1;
    const primaryLabelmapId = labelmapState.primaryLabelmapId ??
        labelmapState.segmentBindings[firstSegmentIndex]?.labelmapId ??
        Object.keys(labelmapState.labelmaps)[0];
    const primaryLayer = labelmapState.labelmaps[primaryLabelmapId];
    if (!primaryLayer) {
        return;
    }
    syncOptionalLegacyProperty(labelmapState, 'volumeId', primaryLayer.volumeId);
    syncOptionalLegacyProperty(labelmapState, 'referencedVolumeId', primaryLayer.referencedVolumeId);
    syncOptionalLegacyProperty(labelmapState, 'imageIds', primaryLayer.imageIds);
    syncOptionalLegacyProperty(labelmapState, 'referencedImageIds', primaryLayer.referencedImageIds);
}
function getReferencedImageIdToCurrentImageIdMap(segmentation) {
    const map = new Map();
    (0,_labelmapLayerStore_js__rspack_import_1/* .getLabelmaps */.m)(segmentation).forEach((layer) => {
        (0,_labelmapImageIdMapping_js__rspack_import_2/* .forEachLabelmapImageReference */.Zd)(layer, (referenceImageId, labelmapImageId) => {
            const values = map.get(referenceImageId) ?? [];
            if (!values.includes(labelmapImageId)) {
                values.push(labelmapImageId);
            }
            map.set(referenceImageId, values);
        });
    });
    return map;
}



},
209(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  gV: () => (getSegmentOrder),
  uk: () => (ensureLabelmapState)
});
const SOURCE_REPRESENTATION_NAME = 'binaryLabelmap';
function getSegmentOrder(segmentation) {
    if (segmentation.segmentOrder?.length) {
        return [...segmentation.segmentOrder];
    }
    return Object.keys(segmentation.segments)
        .map(Number)
        .sort((a, b) => a - b);
}
function getPrimaryLabelmapId(segmentationId) {
    return `${segmentationId}-storage-0`;
}
function getPrimaryLabelmapType(labelmapData) {
    return labelmapData.volumeId ? 'volume' : 'stack';
}
function createPrimaryLabelmapLayer(segmentation, labelmapData, labelmapId = getPrimaryLabelmapId(segmentation.segmentationId)) {
    const layer = {
        labelmapId,
        storageKind: getPrimaryLabelmapType(labelmapData),
        labelToSegmentIndex: {},
    };
    if (labelmapData.volumeId != null) {
        layer.volumeId = labelmapData.volumeId;
    }
    if (labelmapData.referencedVolumeId != null) {
        layer.referencedVolumeId = labelmapData.referencedVolumeId;
    }
    if (labelmapData.referencedImageIds != null) {
        layer.referencedImageIds = labelmapData.referencedImageIds;
    }
    if (labelmapData.imageIds != null) {
        layer.imageIds = labelmapData.imageIds;
    }
    return layer;
}
function resolvePrimaryLabelmapId(segmentation, labelmapData) {
    const storedLabelmapId = labelmapData.primaryLabelmapId;
    if (storedLabelmapId && labelmapData.labelmaps?.[storedLabelmapId]) {
        return storedLabelmapId;
    }
    const fallbackLabelmapId = Object.keys(labelmapData.labelmaps ?? {})[0] ??
        getPrimaryLabelmapId(segmentation.segmentationId);
    labelmapData.primaryLabelmapId = fallbackLabelmapId;
    return fallbackLabelmapId;
}
function ensureLabelmapState(segmentation) {
    const labelmapData = segmentation.representationData.Labelmap;
    if (!labelmapData) {
        return;
    }
    labelmapData.labelmaps ||= {};
    const primaryLabelmapId = resolvePrimaryLabelmapId(segmentation, labelmapData);
    labelmapData.labelmaps[primaryLabelmapId] ||= createPrimaryLabelmapLayer(segmentation, labelmapData, primaryLabelmapId);
    labelmapData.segmentBindings ||= {};
    labelmapData.sourceRepresentationName ||= SOURCE_REPRESENTATION_NAME;
    getSegmentOrder(segmentation).forEach((segmentIndex) => {
        labelmapData.segmentBindings[segmentIndex] ||= {
            labelmapId: primaryLabelmapId,
            labelValue: segmentIndex,
        };
    });
    Object.values(labelmapData.labelmaps).forEach((layer) => {
        layer.labelToSegmentIndex = {};
    });
    Object.entries(labelmapData.segmentBindings).forEach(([segmentIndex, binding]) => {
        const layer = labelmapData.labelmaps[binding.labelmapId];
        if (!layer) {
            return;
        }
        layer.labelToSegmentIndex ||= {};
        layer.labelToSegmentIndex[binding.labelValue] = Number(segmentIndex);
    });
    return labelmapData;
}



},
48019(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  J: () => (moveSegmentToPrivateLabelmap)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _labelmapLayerStore_js__rspack_import_1 = __webpack_require__(88392);
/* import */ var _labelmapSegmentBindings_js__rspack_import_2 = __webpack_require__(59371);
/* import */ var _labelmapLegacyAdapter_js__rspack_import_3 = __webpack_require__(2674);




function createPrivateVolumeLabelmap(segmentation, sourceLabelmap) {
    const sourceVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(sourceLabelmap.volumeId);
    const volumeId = `${segmentation.segmentationId}-storage-${_cornerstonejs_core__rspack_import_0.utilities.uuidv4()}`;
    const referencedVolumeId = sourceLabelmap.referencedVolumeId ??
        sourceVolume?.referencedVolumeId ??
        sourceLabelmap.volumeId;
    const volume = _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheDerivedLabelmapVolume(referencedVolumeId, {
        volumeId,
    });
    return {
        labelmapId: volumeId,
        storageKind: 'volume',
        volumeId,
        imageIds: volume.imageIds,
        referencedVolumeId,
        referencedImageIds: sourceLabelmap.referencedImageIds ?? sourceVolume?.referencedImageIds,
        labelToSegmentIndex: {},
    };
}
function createPrivateStackLabelmap(segmentation, sourceLabelmap) {
    const referencedImageIds = sourceLabelmap.referencedImageIds ?? sourceLabelmap.imageIds ?? [];
    const sourceImageIds = sourceLabelmap.imageIds ?? [];
    const sourceImage = sourceImageIds[0]
        ? _cornerstonejs_core__rspack_import_0.cache.getImage(sourceImageIds[0])
        : null;
    const targetType = sourceImage?.voxelManager?.getConstructor?.().name ?? 'Uint8Array';
    const images = _cornerstonejs_core__rspack_import_0.imageLoader.createAndCacheDerivedImages(referencedImageIds, {
        getDerivedImageId: (referencedImageId) => `${segmentation.segmentationId}-storage-${_cornerstonejs_core__rspack_import_0.utilities.uuidv4()}-${referencedImageId.slice(-12)}`,
        targetBuffer: {
            type: targetType,
        },
    });
    return {
        labelmapId: `${segmentation.segmentationId}-storage-${_cornerstonejs_core__rspack_import_0.utilities.uuidv4()}`,
        storageKind: 'stack',
        imageIds: images.map((image) => image.imageId),
        referencedVolumeId: sourceLabelmap.referencedVolumeId,
        referencedImageIds,
        labelToSegmentIndex: {},
    };
}
function createPrivateLabelmap(segmentation, sourceLabelmap) {
    if (sourceLabelmap.imageIds?.length ||
        sourceLabelmap.referencedImageIds?.length) {
        return createPrivateStackLabelmap(segmentation, sourceLabelmap);
    }
    if (sourceLabelmap.volumeId) {
        return createPrivateVolumeLabelmap(segmentation, sourceLabelmap);
    }
    return createPrivateStackLabelmap(segmentation, sourceLabelmap);
}
function moveSegmentToPrivateLabelmap(segmentation, segmentIndex, options = {}) {
    const binding = (0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentBinding */.hM)(segmentation, segmentIndex);
    if (!binding) {
        return;
    }
    const sourceLabelmap = (0,_labelmapLayerStore_js__rspack_import_1/* .getLabelmap */.Hs)(segmentation, binding.labelmapId);
    if (!sourceLabelmap) {
        return;
    }
    if ((0,_labelmapSegmentBindings_js__rspack_import_2/* .getSegmentsOnLabelmap */.I3)(segmentation, sourceLabelmap.labelmapId).length <= 1) {
        return sourceLabelmap;
    }
    const privateLabelmap = createPrivateLabelmap(segmentation, sourceLabelmap);
    (0,_labelmapLayerStore_js__rspack_import_1/* .registerLabelmap */.AD)(segmentation, privateLabelmap);
    const movedVoxels = [];
    if (sourceLabelmap.volumeId && privateLabelmap.volumeId) {
        const sourceVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(sourceLabelmap.volumeId);
        const targetVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(privateLabelmap.volumeId);
        const indices = [];
        sourceVolume.voxelManager.forEach(({ value, index }) => {
            if (value !== binding.labelValue) {
                return;
            }
            targetVolume.voxelManager.setAtIndex(index, 1);
            sourceVolume.voxelManager.setAtIndex(index, 0);
            indices.push(index);
        });
        if (indices.length) {
            movedVoxels.push({
                source: sourceVolume.voxelManager,
                target: targetVolume.voxelManager,
                indices,
            });
        }
    }
    else {
        const sourceImageIds = sourceLabelmap.imageIds ?? [];
        const targetImageIds = privateLabelmap.imageIds ?? [];
        sourceImageIds.forEach((imageId, imageIndex) => {
            const sourceImage = _cornerstonejs_core__rspack_import_0.cache.getImage(imageId);
            const targetImage = _cornerstonejs_core__rspack_import_0.cache.getImage(targetImageIds[imageIndex]);
            if (!sourceImage || !targetImage) {
                return;
            }
            const indices = [];
            sourceImage.voxelManager.forEach(({ value, index }) => {
                if (value !== binding.labelValue) {
                    return;
                }
                targetImage.voxelManager.setAtIndex(index, 1);
                sourceImage.voxelManager.setAtIndex(index, 0);
                indices.push(index);
            });
            if (indices.length) {
                movedVoxels.push({
                    source: sourceImage.voxelManager,
                    target: targetImage.voxelManager,
                    indices,
                });
            }
        });
    }
    const previousBinding = { ...binding };
    const newBinding = {
        labelmapId: privateLabelmap.labelmapId,
        labelValue: 1,
    };
    (0,_labelmapSegmentBindings_js__rspack_import_2/* .setSegmentBinding */.Zs)(segmentation, segmentIndex, { ...newBinding });
    (0,_labelmapLegacyAdapter_js__rspack_import_3/* .syncLegacyLabelmapData */.x)(segmentation);
    options.moveStepCallback?.({
        undo: () => {
            for (const { source, target, indices } of movedVoxels) {
                for (const index of indices) {
                    target.setAtIndex(index, 0);
                    source.setAtIndex(index, previousBinding.labelValue);
                }
            }
            (0,_labelmapSegmentBindings_js__rspack_import_2/* .setSegmentBinding */.Zs)(segmentation, segmentIndex, { ...previousBinding });
            (0,_labelmapLayerStore_js__rspack_import_1/* .removeLabelmap */.$n)(segmentation, privateLabelmap.labelmapId);
            (0,_labelmapLegacyAdapter_js__rspack_import_3/* .syncLegacyLabelmapData */.x)(segmentation);
        },
        redo: () => {
            (0,_labelmapLayerStore_js__rspack_import_1/* .registerLabelmap */.AD)(segmentation, privateLabelmap);
            for (const { source, target, indices } of movedVoxels) {
                for (const index of indices) {
                    source.setAtIndex(index, 0);
                    target.setAtIndex(index, 1);
                }
            }
            (0,_labelmapSegmentBindings_js__rspack_import_2/* .setSegmentBinding */.Zs)(segmentation, segmentIndex, { ...newBinding });
            (0,_labelmapLegacyAdapter_js__rspack_import_3/* .syncLegacyLabelmapData */.x)(segmentation);
        },
    });
    return privateLabelmap;
}



},
19748(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _state_js__rspack_import_0 = __webpack_require__(17873);

function getToolGroup(toolGroupId) {
    return _state_js__rspack_import_0/* .state.toolGroups.find */.wk.toolGroups.find((s) => s.id === toolGroupId);
}
/* export default */ const __rspack_default_export = (getToolGroup);


},
90654(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _state_js__rspack_import_0 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_1 = __webpack_require__(53870);


const MODES = [_enums_index_js__rspack_import_1.ToolModes.Active, _enums_index_js__rspack_import_1.ToolModes.Passive, _enums_index_js__rspack_import_1.ToolModes.Enabled];
function getToolGroupsWithToolName(toolName) {
    return _state_js__rspack_import_0/* .state.toolGroups.filter */.wk.toolGroups.filter(({ toolOptions }) => {
        const toolGroupToolNames = Object.keys(toolOptions);
        for (let i = 0; i < toolGroupToolNames.length; i++) {
            if (toolName !== toolGroupToolNames[i]) {
                continue;
            }
            if (!toolOptions[toolName]) {
                continue;
            }
            if (MODES.includes(toolOptions[toolName].mode)) {
                return true;
            }
        }
        return false;
    });
}
/* export default */ const __rspack_default_export = (getToolGroupsWithToolName);


},
6524(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _store_state_js__rspack_import_2 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_3 = __webpack_require__(53870);
/* import */ var _cursors_elementCursor_js__rspack_import_4 = __webpack_require__(45128);
/* import */ var _utilities_math_index_js__rspack_import_5 = __webpack_require__(44292);
/* import */ var _types_ContourAnnotation_js__rspack_import_6 = __webpack_require__(12967);
/* import */ var _utilities_planarFreehandROITool_smoothPoints_js__rspack_import_7 = __webpack_require__(9578);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8 = __webpack_require__(85321);
/* import */ var _utilities_contours_updateContourPolyline_js__rspack_import_9 = __webpack_require__(25732);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_10 = __webpack_require__(34350);











const { getSubPixelSpacingAndXYDirections, addCanvasPointsToArray, getArea } = _utilities_math_index_js__rspack_import_5.polyline;
function activateClosedContourEdit(evt, annotation, viewportIdsToRender) {
    this.isEditingClosed = true;
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    const prevCanvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution);
    this.editData = {
        prevCanvasPoints,
        editCanvasPoints: [canvasPos],
        startCrossingIndex: undefined,
        editIndex: 0,
        annotation,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox: false,
    };
    _store_state_js__rspack_import_2/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
    element.addEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_UP, this.mouseUpClosedContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_DRAG, this.mouseDragClosedContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_CLICK, this.mouseUpClosedContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_END, this.mouseUpClosedContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_DRAG, this.mouseDragClosedContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_TAP, this.mouseUpClosedContourEditCallback);
    (0,_cursors_elementCursor_js__rspack_import_4.hideElementCursor)(element);
}
function deactivateClosedContourEdit(element) {
    _store_state_js__rspack_import_2/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_UP, this.mouseUpClosedContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_DRAG, this.mouseDragClosedContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_CLICK, this.mouseUpClosedContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_END, this.mouseUpClosedContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_DRAG, this.mouseDragClosedContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_TAP, this.mouseUpClosedContourEditCallback);
    (0,_cursors_elementCursor_js__rspack_import_4.resetElementCursor)(element);
}
function mouseDragClosedContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { viewportIdsToRender, xDir, yDir, spacing } = this.commonData;
    const { editIndex, editCanvasPoints, startCrossingIndex, annotation } = this.editData;
    this.createMemo(element, annotation);
    const lastCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const lastWorldPoint = viewport.canvasToWorld(lastCanvasPoint);
    const worldPosDiff = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(worldPosDiff, worldPos, lastWorldPoint);
    const xDist = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(worldPosDiff, yDir));
    if (xDist <= spacing[0] && yDist <= spacing[1]) {
        return;
    }
    if (startCrossingIndex !== undefined) {
        this.checkAndRemoveCrossesOnEditLine(evt);
    }
    const numPointsAdded = addCanvasPointsToArray(element, editCanvasPoints, canvasPos, this.commonData);
    const currentEditIndex = editIndex + numPointsAdded;
    this.editData.editIndex = currentEditIndex;
    if (startCrossingIndex === undefined && editCanvasPoints.length > 1) {
        this.checkForFirstCrossing(evt, true);
    }
    this.editData.snapIndex = this.findSnapIndex();
    if (this.editData.snapIndex === -1) {
        this.finishEditAndStartNewEdit(evt);
        return;
    }
    this.editData.fusedCanvasPoints = this.fuseEditPointsWithClosedContour(evt);
    if (startCrossingIndex !== undefined &&
        this.checkForSecondCrossing(evt, true)) {
        this.removePointsAfterSecondCrossing(true);
        this.finishEditAndStartNewEdit(evt);
    }
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(viewportIdsToRender);
}
function finishEditAndStartNewEdit(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport, renderingEngine } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    const { fusedCanvasPoints, editCanvasPoints } = this.editData;
    (0,_utilities_contours_updateContourPolyline_js__rspack_import_9/* ["default"] */.A)(annotation, {
        points: fusedCanvasPoints,
        closed: true,
        targetWindingDirection: _types_ContourAnnotation_js__rspack_import_6/* .ContourWindingDirection.Clockwise */.W.Clockwise,
    }, viewport);
    if (annotation.autoGenerated) {
        annotation.autoGenerated = false;
    }
    (0,_stateManagement_annotation_helpers_state_js__rspack_import_10.triggerAnnotationModified)(annotation, element);
    const lastEditCanvasPoint = editCanvasPoints.pop();
    this.editData = {
        prevCanvasPoints: fusedCanvasPoints,
        editCanvasPoints: [lastEditCanvasPoint],
        startCrossingIndex: undefined,
        editIndex: 0,
        snapIndex: undefined,
        annotation,
    };
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(viewportIdsToRender);
}
function fuseEditPointsWithClosedContour(evt) {
    const { prevCanvasPoints, editCanvasPoints, startCrossingIndex, snapIndex } = this.editData;
    if (startCrossingIndex === undefined || snapIndex === undefined) {
        return;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const augmentedEditCanvasPoints = [...editCanvasPoints];
    addCanvasPointsToArray(element, augmentedEditCanvasPoints, prevCanvasPoints[snapIndex], this.commonData);
    if (augmentedEditCanvasPoints.length > editCanvasPoints.length) {
        augmentedEditCanvasPoints.pop();
    }
    let lowIndex;
    let highIndex;
    if (startCrossingIndex > snapIndex) {
        lowIndex = snapIndex;
        highIndex = startCrossingIndex;
    }
    else {
        lowIndex = startCrossingIndex;
        highIndex = snapIndex;
    }
    const distanceBetweenLowAndFirstPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenLowAndLastPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const distanceBetweenHighAndFirstPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenHighAndLastPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const pointSet1 = [];
    for (let i = 0; i < lowIndex; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointSet1.push([canvasPoint[0], canvasPoint[1]]);
    }
    let inPlaceDistance = distanceBetweenLowAndFirstPoint + distanceBetweenHighAndLastPoint;
    let reverseDistance = distanceBetweenLowAndLastPoint + distanceBetweenHighAndFirstPoint;
    if (inPlaceDistance < reverseDistance) {
        for (let i = 0; i < augmentedEditCanvasPoints.length; i++) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet1.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = augmentedEditCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet1.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    for (let i = highIndex; i < prevCanvasPoints.length; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointSet1.push([canvasPoint[0], canvasPoint[1]]);
    }
    const pointSet2 = [];
    for (let i = lowIndex; i < highIndex; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointSet2.push([canvasPoint[0], canvasPoint[1]]);
    }
    inPlaceDistance =
        distanceBetweenHighAndFirstPoint + distanceBetweenLowAndLastPoint;
    reverseDistance =
        distanceBetweenHighAndLastPoint + distanceBetweenLowAndFirstPoint;
    if (inPlaceDistance < reverseDistance) {
        for (let i = 0; i < augmentedEditCanvasPoints.length; i++) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet2.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = augmentedEditCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet2.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    const areaPointSet1 = getArea(pointSet1);
    const areaPointSet2 = getArea(pointSet2);
    const pointsToRender = areaPointSet1 > areaPointSet2 ? pointSet1 : pointSet2;
    return pointsToRender;
}
function mouseUpClosedContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    this.completeClosedContourEdit(element);
}
function completeClosedContourEdit(element) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    this.doneEditMemo();
    const { fusedCanvasPoints, prevCanvasPoints } = this.editData;
    if (fusedCanvasPoints) {
        const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_7/* .shouldSmooth */.Q)(this.configuration, annotation)
            ? (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_7/* .getInterpolatedPoints */.p)(this.configuration, fusedCanvasPoints, prevCanvasPoints)
            : fusedCanvasPoints;
        const decimateConfig = this.configuration?.decimate || {};
        (0,_utilities_contours_updateContourPolyline_js__rspack_import_9/* ["default"] */.A)(annotation, {
            points: updatedPoints,
            closed: true,
            targetWindingDirection: _types_ContourAnnotation_js__rspack_import_6/* .ContourWindingDirection.Clockwise */.W.Clockwise,
        }, viewport, {
            decimate: {
                enabled: !!decimateConfig.enabled,
                epsilon: decimateConfig.epsilon,
            },
        });
        if (annotation.autoGenerated) {
            annotation.autoGenerated = false;
        }
        (0,_stateManagement_annotation_helpers_state_js__rspack_import_10.triggerAnnotationModified)(annotation, element);
    }
    this.isEditingClosed = false;
    this.editData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(viewportIdsToRender);
    this.deactivateClosedContourEdit(element);
}
function cancelClosedContourEdit(element) {
    this.completeClosedContourEdit(element);
}
function registerClosedContourEditLoop(toolInstance) {
    toolInstance.activateClosedContourEdit =
        activateClosedContourEdit.bind(toolInstance);
    toolInstance.deactivateClosedContourEdit =
        deactivateClosedContourEdit.bind(toolInstance);
    toolInstance.mouseDragClosedContourEditCallback =
        mouseDragClosedContourEditCallback.bind(toolInstance);
    toolInstance.mouseUpClosedContourEditCallback =
        mouseUpClosedContourEditCallback.bind(toolInstance);
    toolInstance.finishEditAndStartNewEdit =
        finishEditAndStartNewEdit.bind(toolInstance);
    toolInstance.fuseEditPointsWithClosedContour =
        fuseEditPointsWithClosedContour.bind(toolInstance);
    toolInstance.cancelClosedContourEdit =
        cancelClosedContourEdit.bind(toolInstance);
    toolInstance.completeClosedContourEdit =
        completeClosedContourEdit.bind(toolInstance);
}
/* export default */ const __rspack_default_export = (registerClosedContourEditLoop);


},
44646(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _cursors_elementCursor_js__rspack_import_1 = __webpack_require__(45128);
/* import */ var _enums_index_js__rspack_import_2 = __webpack_require__(53870);
/* import */ var _store_state_js__rspack_import_3 = __webpack_require__(17873);
/* import */ var gl_matrix__rspack_import_4 = __webpack_require__(40230);
/* import */ var _utilities_planarFreehandROITool_smoothPoints_js__rspack_import_5 = __webpack_require__(9578);
/* import */ var _eventDispatchers_shared_getMouseModifier_js__rspack_import_6 = __webpack_require__(90057);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7 = __webpack_require__(85321);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_8 = __webpack_require__(34350);
/* import */ var _findOpenUShapedContourVectorToPeak_js__rspack_import_9 = __webpack_require__(57210);
/* import */ var _utilities_math_index_js__rspack_import_10 = __webpack_require__(44292);
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_11 = __webpack_require__(44627);
/* import */ var _types_ContourAnnotation_js__rspack_import_12 = __webpack_require__(12967);
/* import */ var _utilities_contourSegmentation_bridgeWeaklyConnected_js__rspack_import_13 = __webpack_require__(81047);














const { addCanvasPointsToArray, pointsAreWithinCloseContourProximity, getFirstLineSegmentIntersectionIndexes, getSubPixelSpacingAndXYDirections, } = _utilities_math_index_js__rspack_import_10.polyline;
function activateDraw(evt, annotation, viewportIdsToRender) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const contourHoleProcessingEnabled = (0,_eventDispatchers_shared_getMouseModifier_js__rspack_import_6/* ["default"] */.A)(evt.detail.event) ===
        this.configuration.contourHoleAdditionModifierKey;
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution) || {};
    if (!spacing || !xDir || !yDir) {
        return;
    }
    this.isDrawing = true;
    this.drawData = {
        canvasPoints: [canvasPos],
        polylineIndex: 0,
        contourHoleProcessingEnabled,
        newAnnotation: true,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox: false,
    };
    _store_state_js__rspack_import_3/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
    element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_UP, this.mouseUpDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_CLICK, this.mouseUpDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_END, this.mouseUpDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_TAP, this.mouseUpDrawCallback);
    (0,_cursors_elementCursor_js__rspack_import_1.hideElementCursor)(element);
}
function deactivateDraw(element) {
    _store_state_js__rspack_import_3/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
    element.removeEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_UP, this.mouseUpDrawCallback);
    element.removeEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_DRAG, this.mouseDragDrawCallback);
    element.removeEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_CLICK, this.mouseUpDrawCallback);
    element.removeEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_END, this.mouseUpDrawCallback);
    element.removeEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_DRAG, this.mouseDragDrawCallback);
    element.removeEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_TAP, this.mouseUpDrawCallback);
    (0,_cursors_elementCursor_js__rspack_import_1.resetElementCursor)(element);
}
function mouseDragDrawCallback(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender, xDir, yDir, spacing, movingTextBox, } = this.commonData;
    const { polylineIndex, canvasPoints, newAnnotation } = this.drawData;
    this.createMemo(element, annotation, { newAnnotation });
    const lastCanvasPoint = canvasPoints[canvasPoints.length - 1];
    const lastWorldPoint = viewport.canvasToWorld(lastCanvasPoint);
    const worldPosDiff = gl_matrix__rspack_import_4/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_4/* .vec3.subtract */.eR.Re(worldPosDiff, worldPos, lastWorldPoint);
    const xDist = Math.abs(gl_matrix__rspack_import_4/* .vec3.dot */.eR.Om(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__rspack_import_4/* .vec3.dot */.eR.Om(worldPosDiff, yDir));
    if (xDist <= spacing[0] && yDist <= spacing[1]) {
        return;
    }
    if (movingTextBox) {
        this.isDrawing = false;
        const { deltaPoints } = eventDetail;
        const worldPosDelta = deltaPoints.world;
        const { textBox } = annotation.data.handles;
        const { worldPosition } = textBox;
        worldPosition[0] += worldPosDelta[0];
        worldPosition[1] += worldPosDelta[1];
        worldPosition[2] += worldPosDelta[2];
        textBox.hasMoved = true;
    }
    else {
        const crossingIndex = this.findCrossingIndexDuringCreate(evt);
        const crossingClosesContour = crossingIndex !== undefined &&
            pointsAreWithinCloseContourProximity(canvasPoints[0], canvasPoints[crossingIndex], this.configuration.closeContourProximity);
        if (crossingClosesContour) {
            this.applyCreateOnCross(evt, crossingIndex);
        }
        else {
            const numPointsAdded = addCanvasPointsToArray(element, canvasPoints, canvasPos, this.commonData);
            this.drawData.polylineIndex = polylineIndex + numPointsAdded;
        }
        annotation.invalidated = true;
    }
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
    if (annotation.invalidated) {
        (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationModified)(annotation, element, _enums_index_js__rspack_import_2.ChangeTypes.HandlesUpdated);
    }
}
function mouseUpDrawCallback(evt) {
    const { allowOpenContours } = this.configuration;
    const { canvasPoints, contourHoleProcessingEnabled } = this.drawData;
    const firstPoint = canvasPoints[0];
    const lastPoint = canvasPoints[canvasPoints.length - 1];
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    this.doneEditMemo();
    this.drawData.newAnnotation = false;
    if (allowOpenContours &&
        !pointsAreWithinCloseContourProximity(firstPoint, lastPoint, this.configuration.closeContourProximity)) {
        this.completeDrawOpenContour(element, { contourHoleProcessingEnabled });
    }
    else {
        this.completeDrawClosedContour(element, { contourHoleProcessingEnabled });
    }
}
function completeDrawClosedContour(element, options) {
    this.removeCrossedLinesOnCompleteDraw();
    const { canvasPoints } = this.drawData;
    const { contourHoleProcessingEnabled, minPointsToSave } = options ?? {};
    if (minPointsToSave && canvasPoints.length < minPointsToSave) {
        return false;
    }
    if (this.haltDrawing(element, canvasPoints)) {
        return false;
    }
    const { annotation, viewportIdsToRender, movingTextBox } = this.commonData;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { viewport } = enabledElement;
    addCanvasPointsToArray(element, canvasPoints, canvasPoints[0], this.commonData);
    canvasPoints.pop();
    const smoothedPoints = (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_5/* .shouldSmooth */.Q)(this.configuration, annotation)
        ? (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_5/* .getInterpolatedPoints */.p)(this.configuration, canvasPoints)
        : canvasPoints;
    const updatedPoints = (0,_utilities_contourSegmentation_bridgeWeaklyConnected_js__rspack_import_13/* .bridgeSelfIntersectingPolyline */.f)(smoothedPoints);
    this.updateContourPolyline(annotation, {
        points: updatedPoints,
        closed: true,
        targetWindingDirection: _types_ContourAnnotation_js__rspack_import_12/* .ContourWindingDirection.Clockwise */.W.Clockwise,
    }, viewport);
    const { textBox } = annotation.data.handles;
    if (!textBox?.hasMoved && !movingTextBox) {
        (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerContourAnnotationCompleted)(annotation, contourHoleProcessingEnabled);
    }
    this.isDrawing = false;
    this.drawData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
    this.deactivateDraw(element);
    return true;
}
function removeCrossedLinesOnCompleteDraw() {
    const { canvasPoints } = this.drawData;
    const numPoints = canvasPoints.length;
    const endToStart = [canvasPoints[0], canvasPoints[numPoints - 1]];
    const canvasPointsMinusEnds = canvasPoints.slice(0, -1).slice(1);
    const lineSegment = getFirstLineSegmentIntersectionIndexes(canvasPointsMinusEnds, endToStart[0], endToStart[1], false);
    if (lineSegment) {
        const indexToRemoveUpTo = lineSegment[1];
        if (indexToRemoveUpTo === 1) {
            this.drawData.canvasPoints = canvasPoints.splice(1);
        }
        else {
            this.drawData.canvasPoints = canvasPoints.splice(0, indexToRemoveUpTo);
        }
    }
}
function completeDrawOpenContour(element, options) {
    const { canvasPoints } = this.drawData;
    const { contourHoleProcessingEnabled } = options ?? {};
    if (this.haltDrawing(element, canvasPoints)) {
        return false;
    }
    const { annotation, viewportIdsToRender, movingTextBox } = this.commonData;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_5/* .shouldSmooth */.Q)(this.configuration, annotation)
        ? (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_5/* .getInterpolatedPoints */.p)(this.configuration, canvasPoints)
        : canvasPoints;
    this.updateContourPolyline(annotation, {
        points: updatedPoints,
        closed: false,
    }, viewport);
    const { textBox } = annotation.data.handles;
    const worldPoints = annotation.data.contour.polyline;
    annotation.data.handles.points = [
        worldPoints[0],
        worldPoints[worldPoints.length - 1],
    ];
    if (!annotation.data.isOpenUShapeContour &&
        this.configuration?.openUShapeContour) {
        annotation.data.isOpenUShapeContour = this.configuration.openUShapeContour;
    }
    if (annotation.data.isOpenUShapeContour) {
        annotation.data.openUShapeContourVectorToPeak = (0,_findOpenUShapedContourVectorToPeak_js__rspack_import_9/* .resolveVectorToPeak */.aV)(canvasPoints, viewport, annotation.data.isOpenUShapeContour);
    }
    if (!textBox.hasMoved && !movingTextBox) {
        (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerContourAnnotationCompleted)(annotation, contourHoleProcessingEnabled);
    }
    this.isDrawing = false;
    this.drawData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
    this.deactivateDraw(element);
    return true;
}
function findCrossingIndexDuringCreate(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { canvasPoints } = this.drawData;
    const pointsLessLastOne = canvasPoints.slice(0, -1);
    const lineSegment = getFirstLineSegmentIntersectionIndexes(pointsLessLastOne, canvasPos, lastCanvasPoint, false);
    if (lineSegment === undefined) {
        return;
    }
    const crossingIndex = lineSegment[0];
    return crossingIndex;
}
function applyCreateOnCross(evt, crossingIndex) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const { canvasPoints, contourHoleProcessingEnabled } = this.drawData;
    const { annotation, viewportIdsToRender } = this.commonData;
    addCanvasPointsToArray(element, canvasPoints, canvasPoints[crossingIndex], this.commonData);
    canvasPoints.pop();
    const remainingPoints = canvasPoints.slice(crossingIndex);
    const newArea = _utilities_math_index_js__rspack_import_10.polyline.getArea(remainingPoints);
    if (_cornerstonejs_core__rspack_import_0.utilities.isEqual(newArea, 0)) {
        canvasPoints.splice(crossingIndex + 1);
        return;
    }
    canvasPoints.splice(0, crossingIndex);
    const options = { contourHoleProcessingEnabled, minPointsToSave: 3 };
    if (this.completeDrawClosedContour(element, options)) {
        this.activateClosedContourEdit(evt, annotation, viewportIdsToRender);
    }
}
function cancelDrawing(element) {
    const { allowOpenContours } = this.configuration;
    const { canvasPoints, contourHoleProcessingEnabled } = this.drawData;
    const firstPoint = canvasPoints[0];
    const lastPoint = canvasPoints[canvasPoints.length - 1];
    if (allowOpenContours &&
        !pointsAreWithinCloseContourProximity(firstPoint, lastPoint, this.configuration.closeContourProximity)) {
        this.completeDrawOpenContour(element, { contourHoleProcessingEnabled });
    }
    else {
        this.completeDrawClosedContour(element, { contourHoleProcessingEnabled });
    }
}
function shouldHaltDrawing(canvasPoints, subPixelResolution) {
    const minPoints = Math.max(subPixelResolution * 3, 3);
    return canvasPoints.length < minPoints;
}
function haltDrawing(element, canvasPoints) {
    const { subPixelResolution } = this.configuration;
    if (shouldHaltDrawing(canvasPoints, subPixelResolution)) {
        const { annotation, viewportIdsToRender } = this.commonData;
        (0,_stateManagement_annotation_annotationState_js__rspack_import_11.removeAnnotation)(annotation.annotationUID);
        this.isDrawing = false;
        this.drawData = undefined;
        this.commonData = undefined;
        (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
        this.deactivateDraw(element);
        return true;
    }
    return false;
}
function registerDrawLoop(toolInstance) {
    toolInstance.activateDraw = activateDraw.bind(toolInstance);
    toolInstance.deactivateDraw = deactivateDraw.bind(toolInstance);
    toolInstance.applyCreateOnCross = applyCreateOnCross.bind(toolInstance);
    toolInstance.findCrossingIndexDuringCreate =
        findCrossingIndexDuringCreate.bind(toolInstance);
    toolInstance.completeDrawOpenContour =
        completeDrawOpenContour.bind(toolInstance);
    toolInstance.removeCrossedLinesOnCompleteDraw =
        removeCrossedLinesOnCompleteDraw.bind(toolInstance);
    toolInstance.mouseDragDrawCallback = mouseDragDrawCallback.bind(toolInstance);
    toolInstance.mouseUpDrawCallback = mouseUpDrawCallback.bind(toolInstance);
    toolInstance.completeDrawClosedContour =
        completeDrawClosedContour.bind(toolInstance);
    toolInstance.cancelDrawing = cancelDrawing.bind(toolInstance);
    toolInstance.haltDrawing = haltDrawing.bind(toolInstance);
}
/* export default */ const __rspack_default_export = (registerDrawLoop);


},
82045(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _utilities_math_index_js__rspack_import_1 = __webpack_require__(44292);


const { addCanvasPointsToArray, getFirstLineSegmentIntersectionIndexes } = _utilities_math_index_js__rspack_import_1.polyline;
function checkForFirstCrossing(evt, isClosedContour) {
    const eventDetail = evt.detail;
    const { element, currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { editCanvasPoints, prevCanvasPoints } = this.editData;
    const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, canvasPos, lastCanvasPoint, isClosedContour);
    if (crossedLineSegment) {
        this.editData.startCrossingIndex = crossedLineSegment[0];
        this.removePointsUpUntilFirstCrossing(isClosedContour);
    }
    else if (prevCanvasPoints.length >= 2) {
        if (editCanvasPoints.length >
            this.configuration.checkCanvasEditFallbackProximity) {
            const firstEditCanvasPoint = editCanvasPoints[0];
            const distanceIndexPairs = [];
            for (let i = 0; i < prevCanvasPoints.length; i++) {
                const prevCanvasPoint = prevCanvasPoints[i];
                const distance = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoint, firstEditCanvasPoint);
                distanceIndexPairs.push({ distance, index: i });
            }
            distanceIndexPairs.sort((a, b) => a.distance - b.distance);
            const twoClosestDistanceIndexPairs = [
                distanceIndexPairs[0],
                distanceIndexPairs[1],
            ];
            const lowestIndex = Math.min(twoClosestDistanceIndexPairs[0].index, twoClosestDistanceIndexPairs[1].index);
            this.editData.startCrossingIndex = lowestIndex;
        }
        else {
            const dir = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
            gl_matrix__rspack_import_0/* .vec2.subtract */.Zc.Re(dir, editCanvasPoints[1], editCanvasPoints[0]);
            gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(dir, dir);
            const proximity = 6;
            const extendedPoint = [
                editCanvasPoints[0][0] - dir[0] * proximity,
                editCanvasPoints[0][1] - dir[1] * proximity,
            ];
            const crossedLineSegmentFromExtendedPoint = getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, extendedPoint, editCanvasPoints[0], isClosedContour);
            if (crossedLineSegmentFromExtendedPoint) {
                const pointsToPrepend = [extendedPoint];
                addCanvasPointsToArray(element, pointsToPrepend, editCanvasPoints[0], this.commonData);
                editCanvasPoints.unshift(...pointsToPrepend);
                this.removePointsUpUntilFirstCrossing(isClosedContour);
                this.editData.editIndex = editCanvasPoints.length - 1;
                this.editData.startCrossingIndex =
                    crossedLineSegmentFromExtendedPoint[0];
            }
        }
    }
}
function removePointsUpUntilFirstCrossing(isClosedContour) {
    const { editCanvasPoints, prevCanvasPoints } = this.editData;
    let numPointsToRemove = 0;
    for (let i = 0; i < editCanvasPoints.length - 1; i++) {
        const firstLine = [editCanvasPoints[i], editCanvasPoints[i + 1]];
        const didCrossLine = !!getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, firstLine[0], firstLine[1], isClosedContour);
        numPointsToRemove++;
        if (didCrossLine) {
            break;
        }
    }
    editCanvasPoints.splice(0, numPointsToRemove);
    this.editData.editIndex = editCanvasPoints.length - 1;
}
function checkForSecondCrossing(evt, isClosedContour) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { prevCanvasPoints } = this.editData;
    const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, canvasPos, lastCanvasPoint, isClosedContour);
    if (!crossedLineSegment) {
        return false;
    }
    return true;
}
function removePointsAfterSecondCrossing(isClosedContour) {
    const { prevCanvasPoints, editCanvasPoints } = this.editData;
    for (let i = editCanvasPoints.length - 1; i > 0; i--) {
        const lastLine = [editCanvasPoints[i], editCanvasPoints[i - 1]];
        const didCrossLine = !!getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, lastLine[0], lastLine[1], isClosedContour);
        editCanvasPoints.pop();
        if (didCrossLine) {
            break;
        }
    }
}
function findSnapIndex() {
    const { editCanvasPoints, prevCanvasPoints, startCrossingIndex } = this.editData;
    if (startCrossingIndex === undefined) {
        return;
    }
    const lastEditCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const distanceIndexPairs = [];
    for (let i = 0; i < prevCanvasPoints.length; i++) {
        const prevCanvasPoint = prevCanvasPoints[i];
        const distance = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoint, lastEditCanvasPoint);
        distanceIndexPairs.push({ distance, index: i });
    }
    distanceIndexPairs.sort((a, b) => a.distance - b.distance);
    const editCanvasPointsLessLastOne = editCanvasPoints.slice(0, -1);
    for (let i = 0; i < distanceIndexPairs.length; i++) {
        const { index } = distanceIndexPairs[i];
        const snapCanvasPosition = prevCanvasPoints[index];
        const lastEditCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
        const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(editCanvasPointsLessLastOne, snapCanvasPosition, lastEditCanvasPoint, false);
        if (!crossedLineSegment) {
            return index;
        }
    }
    return -1;
}
function checkAndRemoveCrossesOnEditLine(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { editCanvasPoints } = this.editData;
    const editCanvasPointsLessLastOne = editCanvasPoints.slice(0, -2);
    const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(editCanvasPointsLessLastOne, canvasPos, lastCanvasPoint, false);
    if (!crossedLineSegment) {
        return;
    }
    const editIndexCrossed = crossedLineSegment[0];
    const numPointsToRemove = editCanvasPoints.length - editIndexCrossed;
    for (let i = 0; i < numPointsToRemove; i++) {
        editCanvasPoints.pop();
    }
}
function registerEditLoopCommon(toolInstance) {
    toolInstance.checkForFirstCrossing = checkForFirstCrossing.bind(toolInstance);
    toolInstance.removePointsUpUntilFirstCrossing =
        removePointsUpUntilFirstCrossing.bind(toolInstance);
    toolInstance.checkForSecondCrossing =
        checkForSecondCrossing.bind(toolInstance);
    toolInstance.findSnapIndex = findSnapIndex.bind(toolInstance);
    toolInstance.removePointsAfterSecondCrossing =
        removePointsAfterSecondCrossing.bind(toolInstance);
    toolInstance.checkAndRemoveCrossesOnEditLine =
        checkAndRemoveCrossesOnEditLine.bind(toolInstance);
}
/* export default */ const __rspack_default_export = (registerEditLoopCommon);


},
57210(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  J1: () => (resolveVectorToPeakOnRender),
  aV: () => (resolveVectorToPeak)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);

function findOpenUShapedContourVectorToPeak(canvasPoints, viewport) {
    const first = canvasPoints[0];
    const last = canvasPoints[canvasPoints.length - 1];
    const firstToLastUnitVector = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(firstToLastUnitVector, last[0] - first[0], last[1] - first[1]);
    gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(firstToLastUnitVector, firstToLastUnitVector);
    const normalVector1 = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
    const normalVector2 = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(normalVector1, -firstToLastUnitVector[1], firstToLastUnitVector[0]);
    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(normalVector2, firstToLastUnitVector[1], -firstToLastUnitVector[0]);
    const centerOfFirstToLast = [
        (first[0] + last[0]) / 2,
        (first[1] + last[1]) / 2,
    ];
    const furthest = {
        dist: 0,
        index: null,
    };
    for (let i = 0; i < canvasPoints.length; i++) {
        const canvasPoint = canvasPoints[i];
        const distance = gl_matrix__rspack_import_0/* .vec2.dist */.Zc.xg(canvasPoint, centerOfFirstToLast);
        if (distance > furthest.dist) {
            furthest.dist = distance;
            furthest.index = i;
        }
    }
    const toFurthest = [
        canvasPoints[furthest.index],
        centerOfFirstToLast,
    ];
    const toFurthestWorld = toFurthest.map(viewport.canvasToWorld);
    return toFurthestWorld;
}
function resolveVectorToPeak(canvasPoints, viewport, variant) {
    if (variant === 'orthogonalT') {
        return findOpenUShapedContourVectorToPeakOrthogonal(canvasPoints, viewport);
    }
    if (variant === 'lineSegment') {
        return null;
    }
    if (variant) {
        return findOpenUShapedContourVectorToPeak(canvasPoints, viewport);
    }
    return null;
}
function resolveVectorToPeakOnRender(enabledElement, annotation) {
    const { viewport } = enabledElement;
    const canvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    return resolveVectorToPeak(canvasPoints, viewport, annotation.data.isOpenUShapeContour);
}
function findOpenUShapedContourVectorToPeakOrthogonal(canvasPoints, viewport) {
    const first = canvasPoints[0];
    const last = canvasPoints[canvasPoints.length - 1];
    const firstToLastUnitVector = gl_matrix__rspack_import_0/* .vec2.sub */.Zc.jb(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), last, first);
    gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(firstToLastUnitVector, firstToLastUnitVector);
    const chordDir = [
        firstToLastUnitVector[0],
        firstToLastUnitVector[1],
    ];
    const centerOfFirstToLast = [
        (first[0] + last[0]) / 2,
        (first[1] + last[1]) / 2,
    ];
    const delta = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
    let prevDp = null;
    let prevPoint = null;
    let orthogonalPoint = null;
    for (const p of canvasPoints) {
        gl_matrix__rspack_import_0/* .vec2.sub */.Zc.jb(delta, p, centerOfFirstToLast);
        const dp = gl_matrix__rspack_import_0/* .vec2.dot */.Zc.Om(chordDir, delta);
        if (prevDp !== null && prevDp * dp < 0) {
            const t = Math.abs(prevDp) / (Math.abs(prevDp) + Math.abs(dp));
            orthogonalPoint = [
                prevPoint[0] + t * (p[0] - prevPoint[0]),
                prevPoint[1] + t * (p[1] - prevPoint[1]),
            ];
            break;
        }
        if (Math.abs(dp) < 1e-10) {
            orthogonalPoint = p;
            break;
        }
        prevDp = dp;
        prevPoint = p;
    }
    if (!orthogonalPoint) {
        console.warn('No orthogonal intersection found for open U-shaped contour');
        return null;
    }
    const toOrthogonal = [
        orthogonalPoint,
        centerOfFirstToLast,
    ];
    const toOrthogonalWorld = toOrthogonal.map(viewport.canvasToWorld);
    return toOrthogonalWorld;
}


},
91368(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _store_state_js__rspack_import_2 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_3 = __webpack_require__(53870);
/* import */ var _cursors_elementCursor_js__rspack_import_4 = __webpack_require__(45128);
/* import */ var _utilities_math_index_js__rspack_import_5 = __webpack_require__(44292);
/* import */ var _utilities_planarFreehandROITool_smoothPoints_js__rspack_import_6 = __webpack_require__(9578);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7 = __webpack_require__(85321);
/* import */ var _utilities_contours_updateContourPolyline_js__rspack_import_8 = __webpack_require__(25732);
/* import */ var _findOpenUShapedContourVectorToPeak_js__rspack_import_9 = __webpack_require__(57210);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_10 = __webpack_require__(34350);











const { addCanvasPointsToArray, getSubPixelSpacingAndXYDirections } = _utilities_math_index_js__rspack_import_5.polyline;
function activateOpenContourEdit(evt, annotation, viewportIdsToRender) {
    this.isEditingOpen = true;
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    this.doneEditMemo();
    const prevCanvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution);
    this.editData = {
        prevCanvasPoints,
        editCanvasPoints: [canvasPos],
        startCrossingIndex: undefined,
        editIndex: 0,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox: false,
    };
    _store_state_js__rspack_import_2/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
    element.addEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_UP, this.mouseUpOpenContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_DRAG, this.mouseDragOpenContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_CLICK, this.mouseUpOpenContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_END, this.mouseUpOpenContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_DRAG, this.mouseDragOpenContourEditCallback);
    element.addEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_TAP, this.mouseUpOpenContourEditCallback);
    (0,_cursors_elementCursor_js__rspack_import_4.hideElementCursor)(element);
}
function deactivateOpenContourEdit(element) {
    _store_state_js__rspack_import_2/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_UP, this.mouseUpOpenContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_DRAG, this.mouseDragOpenContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.MOUSE_CLICK, this.mouseUpOpenContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_END, this.mouseUpOpenContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_DRAG, this.mouseDragOpenContourEditCallback);
    element.removeEventListener(_enums_index_js__rspack_import_3.Events.TOUCH_TAP, this.mouseUpOpenContourEditCallback);
    (0,_cursors_elementCursor_js__rspack_import_4.resetElementCursor)(element);
}
function mouseDragOpenContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { viewportIdsToRender, xDir, yDir, spacing } = this.commonData;
    const { editIndex, editCanvasPoints, startCrossingIndex } = this.editData;
    const lastCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const lastWorldPoint = viewport.canvasToWorld(lastCanvasPoint);
    const worldPosDiff = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    this.createMemo(element, this.commonData.annotation);
    gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(worldPosDiff, worldPos, lastWorldPoint);
    const xDist = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(worldPosDiff, yDir));
    if (xDist <= spacing[0] && yDist <= spacing[1]) {
        return;
    }
    if (startCrossingIndex !== undefined) {
        this.checkAndRemoveCrossesOnEditLine(evt);
    }
    const numPointsAdded = addCanvasPointsToArray(element, editCanvasPoints, canvasPos, this.commonData);
    const currentEditIndex = editIndex + numPointsAdded;
    this.editData.editIndex = currentEditIndex;
    if (startCrossingIndex === undefined && editCanvasPoints.length > 1) {
        this.checkForFirstCrossing(evt, false);
    }
    this.editData.snapIndex = this.findSnapIndex();
    this.editData.fusedCanvasPoints = this.fuseEditPointsWithOpenContour(evt);
    if (startCrossingIndex !== undefined &&
        this.checkForSecondCrossing(evt, false)) {
        this.removePointsAfterSecondCrossing(false);
        this.finishEditOpenOnSecondCrossing(evt);
    }
    else if (this.checkIfShouldOverwriteAnEnd(evt)) {
        this.openContourEditOverwriteEnd(evt);
    }
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
}
function openContourEditOverwriteEnd(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    const fusedCanvasPoints = this.fuseEditPointsForOpenContourEndEdit();
    (0,_utilities_contours_updateContourPolyline_js__rspack_import_8/* ["default"] */.A)(annotation, {
        points: fusedCanvasPoints,
        closed: false,
    }, viewport);
    const worldPoints = annotation.data.contour.polyline;
    annotation.data.handles.points = [
        worldPoints[0],
        worldPoints[worldPoints.length - 1],
    ];
    annotation.data.handles.activeHandleIndex = 1;
    (0,_stateManagement_annotation_helpers_state_js__rspack_import_10.triggerAnnotationModified)(annotation, element);
    this.isEditingOpen = false;
    this.editData = undefined;
    this.commonData = undefined;
    this.doneEditMemo();
    this.deactivateOpenContourEdit(element);
    this.activateOpenContourEndEdit(evt, annotation, viewportIdsToRender, null);
}
function checkIfShouldOverwriteAnEnd(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPos = lastPoints.canvas;
    const { snapIndex, prevCanvasPoints, startCrossingIndex } = this.editData;
    if (startCrossingIndex === undefined || snapIndex === undefined) {
        return false;
    }
    if (snapIndex === -1) {
        return true;
    }
    if (snapIndex !== 0 && snapIndex !== prevCanvasPoints.length - 1) {
        return false;
    }
    const p1 = canvasPos;
    const p2 = lastCanvasPos;
    const p3 = prevCanvasPoints[snapIndex];
    const a = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
    const b = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(a, p1[0] - p2[0], p1[1] - p2[1]);
    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(b, p1[0] - p3[0], p1[1] - p3[1]);
    const aDotb = gl_matrix__rspack_import_0/* .vec2.dot */.Zc.Om(a, b);
    const magA = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    const magB = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
    const theta = Math.acos(aDotb / (magA * magB));
    if (theta < Math.PI / 2) {
        return true;
    }
    return false;
}
function fuseEditPointsForOpenContourEndEdit() {
    const { snapIndex, prevCanvasPoints, editCanvasPoints, startCrossingIndex } = this.editData;
    const newCanvasPoints = [];
    if (snapIndex === 0) {
        for (let i = prevCanvasPoints.length - 1; i >= startCrossingIndex; i--) {
            const canvasPoint = prevCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = 0; i < startCrossingIndex; i++) {
            const canvasPoint = prevCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    const distanceBetweenCrossingIndexAndFirstPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[startCrossingIndex], editCanvasPoints[0]);
    const distanceBetweenCrossingIndexAndLastPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[startCrossingIndex], editCanvasPoints[editCanvasPoints.length - 1]);
    if (distanceBetweenCrossingIndexAndFirstPoint <
        distanceBetweenCrossingIndexAndLastPoint) {
        for (let i = 0; i < editCanvasPoints.length; i++) {
            const canvasPoint = editCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = editCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = editCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    return newCanvasPoints;
}
function fuseEditPointsWithOpenContour(evt) {
    const { prevCanvasPoints, editCanvasPoints, startCrossingIndex, snapIndex } = this.editData;
    if (startCrossingIndex === undefined || snapIndex === undefined) {
        return undefined;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const augmentedEditCanvasPoints = [...editCanvasPoints];
    addCanvasPointsToArray(element, augmentedEditCanvasPoints, prevCanvasPoints[snapIndex], this.commonData);
    if (augmentedEditCanvasPoints.length > editCanvasPoints.length) {
        augmentedEditCanvasPoints.pop();
    }
    let lowIndex;
    let highIndex;
    if (startCrossingIndex > snapIndex) {
        lowIndex = snapIndex;
        highIndex = startCrossingIndex;
    }
    else {
        lowIndex = startCrossingIndex;
        highIndex = snapIndex;
    }
    const distanceBetweenLowAndFirstPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenLowAndLastPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const distanceBetweenHighAndFirstPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenHighAndLastPoint = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const pointsToRender = [];
    for (let i = 0; i < lowIndex; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
    }
    const inPlaceDistance = distanceBetweenLowAndFirstPoint + distanceBetweenHighAndLastPoint;
    const reverseDistance = distanceBetweenLowAndLastPoint + distanceBetweenHighAndFirstPoint;
    if (inPlaceDistance < reverseDistance) {
        for (let i = 0; i < augmentedEditCanvasPoints.length; i++) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = augmentedEditCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    for (let i = highIndex; i < prevCanvasPoints.length; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
    }
    return pointsToRender;
}
function finishEditOpenOnSecondCrossing(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport, renderingEngine } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    const { fusedCanvasPoints, editCanvasPoints } = this.editData;
    (0,_utilities_contours_updateContourPolyline_js__rspack_import_8/* ["default"] */.A)(annotation, {
        points: fusedCanvasPoints,
        closed: false,
    }, viewport);
    const worldPoints = annotation.data.contour.polyline;
    annotation.data.handles.points = [
        worldPoints[0],
        worldPoints[worldPoints.length - 1],
    ];
    (0,_stateManagement_annotation_helpers_state_js__rspack_import_10.triggerAnnotationModified)(annotation, element);
    const lastEditCanvasPoint = editCanvasPoints.pop();
    this.editData = {
        prevCanvasPoints: fusedCanvasPoints,
        editCanvasPoints: [lastEditCanvasPoint],
        startCrossingIndex: undefined,
        editIndex: 0,
    };
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
}
function mouseUpOpenContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    this.completeOpenContourEdit(element);
}
function completeOpenContourEdit(element) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    this.doneEditMemo();
    const { fusedCanvasPoints, prevCanvasPoints } = this.editData;
    if (fusedCanvasPoints) {
        const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_6/* .shouldSmooth */.Q)(this.configuration)
            ? (0,_utilities_planarFreehandROITool_smoothPoints_js__rspack_import_6/* .getInterpolatedPoints */.p)(this.configuration, fusedCanvasPoints, prevCanvasPoints)
            : fusedCanvasPoints;
        const decimateConfig = this.configuration?.decimate || {};
        (0,_utilities_contours_updateContourPolyline_js__rspack_import_8/* ["default"] */.A)(annotation, {
            points: updatedPoints,
            closed: false,
        }, viewport, {
            decimate: {
                enabled: !!decimateConfig.enabled,
                epsilon: decimateConfig.epsilon,
            },
        });
        const worldPoints = annotation.data.contour.polyline;
        annotation.data.handles.points = [
            worldPoints[0],
            worldPoints[worldPoints.length - 1],
        ];
        if (annotation.data.isOpenUShapeContour) {
            annotation.data.openUShapeContourVectorToPeak = (0,_findOpenUShapedContourVectorToPeak_js__rspack_import_9/* .resolveVectorToPeak */.aV)(fusedCanvasPoints, viewport, annotation.data.isOpenUShapeContour);
        }
        (0,_stateManagement_annotation_helpers_state_js__rspack_import_10.triggerAnnotationModified)(annotation, element);
    }
    this.isEditingOpen = false;
    this.editData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
    this.deactivateOpenContourEdit(element);
}
function cancelOpenContourEdit(element) {
    this.completeOpenContourEdit(element);
}
function registerOpenContourEditLoop(toolInstance) {
    toolInstance.activateOpenContourEdit =
        activateOpenContourEdit.bind(toolInstance);
    toolInstance.deactivateOpenContourEdit =
        deactivateOpenContourEdit.bind(toolInstance);
    toolInstance.mouseDragOpenContourEditCallback =
        mouseDragOpenContourEditCallback.bind(toolInstance);
    toolInstance.mouseUpOpenContourEditCallback =
        mouseUpOpenContourEditCallback.bind(toolInstance);
    toolInstance.fuseEditPointsWithOpenContour =
        fuseEditPointsWithOpenContour.bind(toolInstance);
    toolInstance.finishEditOpenOnSecondCrossing =
        finishEditOpenOnSecondCrossing.bind(toolInstance);
    toolInstance.checkIfShouldOverwriteAnEnd =
        checkIfShouldOverwriteAnEnd.bind(toolInstance);
    toolInstance.fuseEditPointsForOpenContourEndEdit =
        fuseEditPointsForOpenContourEndEdit.bind(toolInstance);
    toolInstance.openContourEditOverwriteEnd =
        openContourEditOverwriteEnd.bind(toolInstance);
    toolInstance.cancelOpenContourEdit = cancelOpenContourEdit.bind(toolInstance);
    toolInstance.completeOpenContourEdit =
        completeOpenContourEdit.bind(toolInstance);
}
/* export default */ const __rspack_default_export = (registerOpenContourEditLoop);


},
69423(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _store_state_js__rspack_import_1 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_2 = __webpack_require__(53870);
/* import */ var _cursors_elementCursor_js__rspack_import_3 = __webpack_require__(45128);
/* import */ var _utilities_math_index_js__rspack_import_4 = __webpack_require__(44292);





const { getSubPixelSpacingAndXYDirections } = _utilities_math_index_js__rspack_import_4.polyline;
function activateOpenContourEndEdit(evt, annotation, viewportIdsToRender, handle) {
    this.isDrawing = true;
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution);
    const canvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    const handleIndexGrabbed = annotation.data.handles.activeHandleIndex;
    if (handleIndexGrabbed === 0) {
        canvasPoints.reverse();
    }
    let movingTextBox = false;
    if (handle?.worldPosition) {
        movingTextBox = true;
    }
    this.drawData = {
        canvasPoints: canvasPoints,
        polylineIndex: canvasPoints.length - 1,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox,
    };
    _store_state_js__rspack_import_1/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
    element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_UP, this.mouseUpDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_CLICK, this.mouseUpDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_END, this.mouseUpDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums_index_js__rspack_import_2.Events.TOUCH_TAP, this.mouseUpDrawCallback);
    (0,_cursors_elementCursor_js__rspack_import_3.hideElementCursor)(element);
}
function registerOpenContourEndEditLoop(toolInstance) {
    toolInstance.activateOpenContourEndEdit =
        activateOpenContourEndEdit.bind(toolInstance);
}
/* export default */ const __rspack_default_export = (registerOpenContourEndEditLoop);


},
80326(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _drawingSvg_index_js__rspack_import_0 = __webpack_require__(21566);
/* import */ var _utilities_math_index_js__rspack_import_1 = __webpack_require__(44292);
/* import */ var _findOpenUShapedContourVectorToPeak_js__rspack_import_2 = __webpack_require__(57210);
/* import */ var _utilities_contours_getContourHolesDataCanvas_js__rspack_import_3 = __webpack_require__(66128);




const { pointsAreWithinCloseContourProximity } = _utilities_math_index_js__rspack_import_1.polyline;
function _getRenderingOptions(enabledElement, annotation) {
    const styleSpecifier = {
        toolGroupId: this.toolGroupId,
        toolName: this.getToolName(),
        viewportId: enabledElement.viewport.id,
        annotationUID: annotation.annotationUID,
    };
    const { lineWidth, lineDash, color, fillColor, fillOpacity } = this.getAnnotationStyle({
        annotation,
        styleSpecifier,
    });
    const { closed: isClosedContour } = annotation.data.contour;
    const options = {
        color,
        width: lineWidth,
        lineDash,
        fillColor,
        fillOpacity: this.configuration?.fillOpacity !== undefined
            ? this.configuration.fillOpacity
            : fillOpacity,
        closePath: isClosedContour,
    };
    return options;
}
function renderContour(enabledElement, svgDrawingHelper, annotation) {
    if (!enabledElement?.viewport?.getImageData()) {
        return;
    }
    if (annotation.data.contour.closed) {
        this.renderClosedContour(enabledElement, svgDrawingHelper, annotation);
    }
    else {
        if (annotation.data.isOpenUShapeContour) {
            if (annotation.data.isOpenUShapeContour !== 'lineSegment') {
                calculateUShapeContourVectorToPeakIfNotPresent(enabledElement, annotation);
            }
            this.renderOpenUShapedContour(enabledElement, svgDrawingHelper, annotation);
        }
        else {
            this.renderOpenContour(enabledElement, svgDrawingHelper, annotation);
        }
    }
}
function calculateUShapeContourVectorToPeakIfNotPresent(enabledElement, annotation) {
    if (!annotation.data.openUShapeContourVectorToPeak) {
        annotation.data.openUShapeContourVectorToPeak = (0,_findOpenUShapedContourVectorToPeak_js__rspack_import_2/* .resolveVectorToPeakOnRender */.J1)(enabledElement, annotation);
    }
}
function renderClosedContour(enabledElement, svgDrawingHelper, annotation) {
    if (annotation.parentAnnotationUID) {
        return;
    }
    const { viewport } = enabledElement;
    const options = this._getRenderingOptions(enabledElement, annotation);
    const canvasPolyline = annotation.data.contour.polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
    const childContours = (0,_utilities_contours_getContourHolesDataCanvas_js__rspack_import_3/* ["default"] */.A)(annotation, viewport);
    const allContours = [canvasPolyline, ...childContours];
    const polylineUID = '1';
    (0,_drawingSvg_index_js__rspack_import_0.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID, allContours, options);
}
function renderOpenContour(enabledElement, svgDrawingHelper, annotation) {
    const { viewport } = enabledElement;
    const options = this._getRenderingOptions(enabledElement, annotation);
    const canvasPoints = annotation.data.contour.polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
    const polylineUID = '1';
    (0,_drawingSvg_index_js__rspack_import_0.drawPolyline)(svgDrawingHelper, annotation.annotationUID, polylineUID, canvasPoints, options);
    const activeHandleIndex = annotation.data.handles.activeHandleIndex;
    if (this.configuration.alwaysRenderOpenContourHandles?.enabled === true) {
        const radius = this.configuration.alwaysRenderOpenContourHandles.radius;
        const handleGroupUID = '0';
        const handlePoints = [
            canvasPoints[0],
            canvasPoints[canvasPoints.length - 1],
        ];
        if (activeHandleIndex === 0) {
            handlePoints.shift();
        }
        else if (activeHandleIndex === 1) {
            handlePoints.pop();
        }
        (0,_drawingSvg_index_js__rspack_import_0.drawHandles)(svgDrawingHelper, annotation.annotationUID, handleGroupUID, handlePoints, {
            color: options.color,
            handleRadius: radius,
        });
    }
    if (activeHandleIndex !== null) {
        const handleGroupUID = '1';
        const indexOfCanvasPoints = activeHandleIndex === 0 ? 0 : canvasPoints.length - 1;
        const handlePoint = canvasPoints[indexOfCanvasPoints];
        (0,_drawingSvg_index_js__rspack_import_0.drawHandles)(svgDrawingHelper, annotation.annotationUID, handleGroupUID, [handlePoint], { color: options.color });
    }
}
function renderOpenUShapedContour(enabledElement, svgDrawingHelper, annotation) {
    const { viewport } = enabledElement;
    const { openUShapeContourVectorToPeak } = annotation.data;
    const { polyline } = annotation.data.contour;
    this.renderOpenContour(enabledElement, svgDrawingHelper, annotation);
    const isLineSegmentOnly = annotation.data.isOpenUShapeContour === 'lineSegment';
    if (!isLineSegmentOnly && !openUShapeContourVectorToPeak) {
        return;
    }
    const firstCanvasPoint = viewport.worldToCanvas(polyline[0]);
    const lastCanvasPoint = viewport.worldToCanvas(polyline[polyline.length - 1]);
    const options = this._getRenderingOptions(enabledElement, annotation);
    (0,_drawingSvg_index_js__rspack_import_0.drawPolyline)(svgDrawingHelper, annotation.annotationUID, 'first-to-last', [firstCanvasPoint, lastCanvasPoint], {
        color: options.color,
        width: options.width,
        closePath: false,
        lineDash: '2,2',
    });
    if (!isLineSegmentOnly) {
        const openUShapeContourVectorToPeakCanvas = [
            viewport.worldToCanvas(openUShapeContourVectorToPeak[0]),
            viewport.worldToCanvas(openUShapeContourVectorToPeak[1]),
        ];
        (0,_drawingSvg_index_js__rspack_import_0.drawPolyline)(svgDrawingHelper, annotation.annotationUID, 'midpoint-to-open-contour', [
            openUShapeContourVectorToPeakCanvas[0],
            openUShapeContourVectorToPeakCanvas[1],
        ], {
            color: options.color,
            width: options.width,
            closePath: false,
            lineDash: '2,2',
        });
    }
    if (options.fillOpacity > 0) {
        const canvasPolyline = polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
        (0,_drawingSvg_index_js__rspack_import_0.drawPath)(svgDrawingHelper, annotation.annotationUID, 'u-shape-fill', [[...canvasPolyline, firstCanvasPoint]], {
            color: options.fillColor || options.color,
            fillColor: options.fillColor || options.color,
            fillOpacity: options.fillOpacity,
            closePath: true,
            width: 0,
        });
    }
}
function renderContourBeingDrawn(enabledElement, svgDrawingHelper, annotation) {
    const options = this._getRenderingOptions(enabledElement, annotation);
    const { allowOpenContours } = this.configuration;
    const { canvasPoints } = this.drawData;
    options.closePath = false;
    (0,_drawingSvg_index_js__rspack_import_0.drawPolyline)(svgDrawingHelper, annotation.annotationUID, '1', canvasPoints, options);
    if (allowOpenContours) {
        const firstPoint = canvasPoints[0];
        const lastPoint = canvasPoints[canvasPoints.length - 1];
        if (pointsAreWithinCloseContourProximity(firstPoint, lastPoint, this.configuration.closeContourProximity)) {
            (0,_drawingSvg_index_js__rspack_import_0.drawPolyline)(svgDrawingHelper, annotation.annotationUID, '2', [lastPoint, firstPoint], options);
        }
        else {
            const handleGroupUID = '0';
            (0,_drawingSvg_index_js__rspack_import_0.drawHandles)(svgDrawingHelper, annotation.annotationUID, handleGroupUID, [firstPoint], { color: options.color, handleRadius: 2 });
        }
    }
}
function renderClosedContourBeingEdited(enabledElement, svgDrawingHelper, annotation) {
    const { viewport } = enabledElement;
    const { fusedCanvasPoints } = this.editData;
    if (fusedCanvasPoints === undefined) {
        this.renderClosedContour(enabledElement, svgDrawingHelper, annotation);
        return;
    }
    const childContours = (0,_utilities_contours_getContourHolesDataCanvas_js__rspack_import_3/* ["default"] */.A)(annotation, viewport);
    const allContours = [fusedCanvasPoints, ...childContours];
    const options = this._getRenderingOptions(enabledElement, annotation);
    const polylineUIDToRender = 'preview-1';
    if (annotation.parentAnnotationUID && options.fillOpacity) {
        options.fillOpacity = 0;
    }
    (0,_drawingSvg_index_js__rspack_import_0.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUIDToRender, allContours, options);
}
function renderOpenContourBeingEdited(enabledElement, svgDrawingHelper, annotation) {
    const { fusedCanvasPoints } = this.editData;
    if (fusedCanvasPoints === undefined) {
        this.renderOpenContour(enabledElement, svgDrawingHelper, annotation);
        return;
    }
    const options = this._getRenderingOptions(enabledElement, annotation);
    const polylineUIDToRender = 'preview-1';
    (0,_drawingSvg_index_js__rspack_import_0.drawPolyline)(svgDrawingHelper, annotation.annotationUID, polylineUIDToRender, fusedCanvasPoints, options);
}
function renderPointContourWithMarker(enabledElement, svgDrawingHelper, annotation) {
    if (annotation.parentAnnotationUID) {
        return;
    }
    const { viewport } = enabledElement;
    const options = this._getRenderingOptions(enabledElement, annotation);
    const canvasPolyline = annotation.data.contour.polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
    const childContours = (0,_utilities_contours_getContourHolesDataCanvas_js__rspack_import_3/* ["default"] */.A)(annotation, viewport);
    const polylineUID = '1';
    const center = canvasPolyline[0];
    const radius = 6;
    const numberOfPoints = 100;
    const circlePoints = [];
    for (let i = 0; i < numberOfPoints; i++) {
        const angle = (i / numberOfPoints) * 2 * Math.PI;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        circlePoints.push([x, y]);
    }
    const crosshair = [
        [center[0] - radius * 2, center[1]],
        [center[0] + radius * 2, center[1]],
        [center[0], center[1] - radius * 2],
        [center[0], center[1] + radius * 2],
    ];
    (0,_drawingSvg_index_js__rspack_import_0.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID + '-crosshair_v', [crosshair[0], crosshair[1]], options);
    (0,_drawingSvg_index_js__rspack_import_0.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID + '-crosshair_h', [crosshair[2], crosshair[3]], options);
    const allContours = [circlePoints, ...childContours];
    (0,_drawingSvg_index_js__rspack_import_0.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID, allContours, options);
}
function registerRenderMethods(toolInstance) {
    toolInstance.renderContour = renderContour.bind(toolInstance);
    toolInstance.renderClosedContour = renderClosedContour.bind(toolInstance);
    toolInstance.renderOpenContour = renderOpenContour.bind(toolInstance);
    toolInstance.renderPointContourWithMarker =
        renderPointContourWithMarker.bind(toolInstance);
    toolInstance.renderOpenUShapedContour =
        renderOpenUShapedContour.bind(toolInstance);
    toolInstance.renderContourBeingDrawn =
        renderContourBeingDrawn.bind(toolInstance);
    toolInstance.renderClosedContourBeingEdited =
        renderClosedContourBeingEdited.bind(toolInstance);
    toolInstance.renderOpenContourBeingEdited =
        renderOpenContourBeingEdited.bind(toolInstance);
    toolInstance._getRenderingOptions = _getRenderingOptions.bind(toolInstance);
}
/* export default */ const __rspack_default_export = (registerRenderMethods);


},
26947(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ ContourSegmentationBaseTool)
});

// UNUSED EXPORTS: ContourSegmentationBaseTool

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState.js
var annotationState = __webpack_require__(44627);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/index.js + 4 modules
var drawingSvg = __webpack_require__(21566);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/base/AnnotationTool.js
var AnnotationTool = __webpack_require__(36379);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/updateContourPolyline.js
var updateContourPolyline = __webpack_require__(25732);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/getContourHolesDataCanvas.js
var getContourHolesDataCanvas = __webpack_require__(66128);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/base/ContourBaseTool.js





class ContourBaseTool extends AnnotationTool/* ["default"] */.A {
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
    }
    static getContourSequence(toolData, metadataProvider) {
        const { data } = toolData;
        const ContourData = [];
        for (const point of data.contour.polyline) {
            for (const v of point) {
                ContourData.push(v.toFixed(2));
            }
        }
        const { referencedImageId } = toolData.metadata;
        const ContourImageSequence = metadataProvider.get('ImageSopInstanceReference', referencedImageId);
        return {
            NumberOfContourPoints: ContourData.length / 3,
            ContourImageSequence,
            ContourGeometricType: 'CLOSED_PLANAR',
            ContourData,
        };
    }
    renderAnnotation(enabledElement, svgDrawingHelper) {
        let renderStatus = false;
        const { viewport } = enabledElement;
        const { element } = viewport;
        if (!viewport.getRenderingEngine()) {
            console.warn('Rendering Engine has been destroyed');
            return renderStatus;
        }
        let annotations = (0,annotationState.getAnnotations)(this.getToolName(), element);
        if (!annotations?.length) {
            return renderStatus;
        }
        annotations = this.filterInteractableAnnotationsForElement(element, annotations);
        if (!annotations?.length) {
            return renderStatus;
        }
        const targetId = this.getTargetId(viewport);
        const styleSpecifier = {
            toolGroupId: this.toolGroupId,
            toolName: this.getToolName(),
            viewportId: enabledElement.viewport.id,
        };
        for (let i = 0; i < annotations.length; i++) {
            const annotation = annotations[i];
            styleSpecifier.annotationUID = annotation.annotationUID;
            const annotationStyle = this.getAnnotationStyle({
                annotation,
                styleSpecifier,
            });
            if (!annotationStyle.visibility) {
                continue;
            }
            const annotationRendered = this.renderAnnotationInstance({
                enabledElement,
                targetId,
                annotation,
                annotationStyle,
                svgDrawingHelper,
            });
            renderStatus ||= annotationRendered;
            annotation.invalidated = false;
        }
        return renderStatus;
    }
    createAnnotation(evt) {
        const annotation = super.createAnnotation(evt);
        Object.assign(annotation.data, {
            contour: {
                polyline: [],
                closed: false,
            },
        });
        Object.assign(annotation, {
            interpolationUID: '',
            autoGenerated: false,
        });
        return annotation;
    }
    addAnnotation(annotation, element) {
        return (0,annotationState.addAnnotation)(annotation, element);
    }
    cancelAnnotation(annotation) {
    }
    moveAnnotation(annotation, worldPosDelta) {
        const { points } = annotation.data.handles;
        for (let i = 0, numPoints = points.length; i < numPoints; i++) {
            const point = points[i];
            point[0] += worldPosDelta[0];
            point[1] += worldPosDelta[1];
            point[2] += worldPosDelta[2];
        }
        annotation.invalidated = true;
        (0,annotationState.getChildAnnotations)(annotation).forEach((childAnnotation) => this.moveAnnotation(childAnnotation, worldPosDelta));
    }
    updateContourPolyline(annotation, polylineData, transforms, options) {
        const decimateConfig = this.configuration?.decimate || {};
        (0,updateContourPolyline/* ["default"] */.A)(annotation, polylineData, transforms, {
            decimate: {
                enabled: !!decimateConfig.enabled,
                epsilon: decimateConfig.epsilon,
            },
            updateWindingDirection: options?.updateWindingDirection,
        });
    }
    getPolylinePoints(annotation) {
        return annotation.data.contour?.polyline ?? annotation.data.polyline;
    }
    renderAnnotationInstance(renderContext) {
        const { enabledElement, annotationStyle, svgDrawingHelper } = renderContext;
        const annotation = renderContext.annotation;
        if (annotation.parentAnnotationUID) {
            return;
        }
        const { annotationUID } = annotation;
        const { viewport } = enabledElement;
        const { worldToCanvas } = viewport;
        const polylineCanvasPoints = this.getPolylinePoints(annotation).map((point) => worldToCanvas(point));
        const { lineWidth, lineDash, color, fillColor, fillOpacity } = annotationStyle;
        const childContours = (0,getContourHolesDataCanvas/* ["default"] */.A)(annotation, viewport);
        const allContours = [polylineCanvasPoints, ...childContours];
        (0,drawingSvg.drawPath)(svgDrawingHelper, annotationUID, 'contourPolyline', allContours, {
            color: color,
            lineDash: lineDash,
            lineWidth: Math.max(0.1, lineWidth),
            fillColor: fillColor,
            fillOpacity: fillOpacity,
        });
        return true;
    }
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js + 4 modules
var triggerSegmentationEvents = __webpack_require__(49256);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/InterpolationManager/InterpolationManager.js
var InterpolationManager = __webpack_require__(81391);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/index.js
var contourSegmentation = __webpack_require__(67846);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/triggerAnnotationRenderForToolGroupIds.js
var triggerAnnotationRenderForToolGroupIds = __webpack_require__(70208);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 5 modules
var ToolGroupManager = __webpack_require__(72314);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(54869);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentation.js
var getActiveSegmentation = __webpack_require__(7342);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportIdsWithSegmentation.js
var getViewportIdsWithSegmentation = __webpack_require__(83470);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentIndex.js
var getActiveSegmentIndex = __webpack_require__(61395);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentLocking.js
var segmentLocking = __webpack_require__(60606);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSVGStyleForSegment.js
var getSVGStyleForSegment = __webpack_require__(91707);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(86706);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/base/ContourSegmentationBaseTool.js















class ContourSegmentationBaseTool extends ContourBaseTool {
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
        if (this.configuration.interpolation?.enabled) {
            InterpolationManager/* ["default"].addTool */.A.addTool(this.getToolName());
        }
    }
    onSetToolConfiguration() {
        if (this.configuration.interpolation?.enabled) {
            InterpolationManager/* ["default"].addTool */.A.addTool(this.getToolName());
        }
        else {
            InterpolationManager/* ["default"].removeTool */.A.removeTool(this.getToolName());
        }
    }
    isContourSegmentationTool() {
        return true;
    }
    createAnnotation(evt) {
        const eventDetail = evt.detail;
        const { element } = eventDetail;
        const enabledElement = (0,esm.getEnabledElement)(element);
        if (!enabledElement) {
            return;
        }
        const { viewport } = enabledElement;
        const contourAnnotation = super.createAnnotation(evt);
        if (!this.isContourSegmentationTool()) {
            return contourAnnotation;
        }
        const activeSeg = (0,getActiveSegmentation/* .getActiveSegmentation */.T)(viewport.id);
        if (!activeSeg) {
            throw new Error('No active segmentation detected, create one before using scissors tool');
        }
        if (!activeSeg.representationData.Contour) {
            throw new Error(`A contour segmentation must be active`);
        }
        const { segmentationId } = activeSeg;
        const segmentIndex = (0,getActiveSegmentIndex/* .getActiveSegmentIndex */.Q)(segmentationId);
        return esm.utilities.deepMerge(contourAnnotation, {
            data: {
                segmentation: {
                    segmentationId,
                    segmentIndex,
                },
            },
        });
    }
    addAnnotation(annotation, element) {
        const annotationUID = super.addAnnotation(annotation, element);
        if (this.isContourSegmentationTool()) {
            const contourSegAnnotation = annotation;
            (0,contourSegmentation.addContourSegmentationAnnotation)(contourSegAnnotation);
        }
        return annotationUID;
    }
    cancelAnnotation(annotation) {
        if (this.isContourSegmentationTool()) {
            (0,contourSegmentation.removeContourSegmentationAnnotation)(annotation);
        }
        super.cancelAnnotation(annotation);
    }
    getAnnotationStyle(context) {
        const annotationStyle = super.getAnnotationStyle(context);
        if (!this.isContourSegmentationTool()) {
            return annotationStyle;
        }
        const contourSegmentationStyle = this._getContourSegmentationStyle(context);
        return esm.utilities.deepMerge(annotationStyle, contourSegmentationStyle);
    }
    renderAnnotationInstance(renderContext) {
        const { annotation } = renderContext;
        const { invalidated } = annotation;
        const renderResult = super.renderAnnotationInstance(renderContext);
        if (invalidated && this.isContourSegmentationTool()) {
            const { segmentationId } = (annotation).data.segmentation;
            (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
            const viewportIds = (0,getViewportIdsWithSegmentation/* .getViewportIdsWithSegmentation */.P)(segmentationId);
            const toolGroupIds = viewportIds
                .map((viewportId) => {
                const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId);
                return toolGroup?.id;
            })
                .filter((toolGroupId) => toolGroupId != null);
            (0,triggerAnnotationRenderForToolGroupIds/* .triggerAnnotationRenderForToolGroupIds */._)(toolGroupIds);
        }
        return renderResult;
    }
    filterInteractableAnnotationsForElement(element, annotations) {
        if (!annotations || !annotations.length) {
            return;
        }
        const baseFilteredAnnotations = super.filterInteractableAnnotationsForElement(element, annotations);
        if (!baseFilteredAnnotations || !baseFilteredAnnotations.length) {
            return;
        }
        const enabledElement = (0,esm.getEnabledElement)(element);
        const { viewport } = enabledElement;
        return baseFilteredAnnotations.filter((annotation) => {
            const segmentationId = annotation?.data
                ?.segmentation?.segmentationId;
            if (!segmentationId) {
                return true;
            }
            return !!SegmentationStateManager/* .defaultSegmentationStateManager.getSegmentationRepresentation */._6.getSegmentationRepresentation(viewport.id, {
                segmentationId,
                type: enums.SegmentationRepresentations.Contour,
            });
        });
    }
    _getContourSegmentationStyle(context) {
        const annotation = context.annotation;
        const { segmentationId, segmentIndex } = annotation.data.segmentation;
        const { viewportId } = context.styleSpecifier;
        const segmentationRepresentations = (0,getSegmentationRepresentation/* .getSegmentationRepresentations */.r$)(viewportId, { segmentationId });
        if (!segmentationRepresentations?.length) {
            return {};
        }
        let segmentationRepresentation;
        if (segmentationRepresentations.length > 1) {
            segmentationRepresentation = segmentationRepresentations.find((rep) => rep.segmentationId === segmentationId &&
                rep.type === enums.SegmentationRepresentations.Contour);
        }
        else {
            segmentationRepresentation = segmentationRepresentations[0];
        }
        const { autoGenerated } = annotation;
        const segmentsLocked = (0,segmentLocking.getLockedSegmentIndices)(segmentationId);
        const annotationLocked = segmentsLocked.includes(segmentIndex);
        const { color, fillColor, lineWidth, fillOpacity, lineDash, visibility } = (0,getSVGStyleForSegment/* .getSVGStyleForSegment */.u)({
            segmentationId,
            segmentIndex,
            viewportId,
            autoGenerated,
        });
        return {
            color,
            fillColor,
            lineWidth,
            fillOpacity,
            lineDash,
            textbox: {
                color,
            },
            visibility,
            locked: annotationLocked,
        };
    }
}
ContourSegmentationBaseTool.PreviewSegmentIndex = 255;



},
83596(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (__rspack_default_export)
});
const NON_PIXEL_DATA_MODALITIES = [
    'SEG',
    'RTSTRUCT',
    'RTPLAN',
    'SR',
    'PR',
    'KO',
];
const isPixelData = ({ modality, representationUID, }) => !representationUID &&
    (!modality || !NON_PIXEL_DATA_MODALITIES.includes(modality));
function isEligible(candidate, options) {
    if (!isPixelData(candidate, options)) {
        return false;
    }
    const { targetPredicate } = options?.configuration ?? {};
    return targetPredicate ? targetPredicate(candidate, options) : true;
}
const firstPixelData = (candidates, options) => {
    const match = candidates.find((candidate) => isEligible(candidate, options));
    return match ? [match] : [];
};
const allPixelData = (candidates, options) => candidates.filter((candidate) => isEligible(candidate, options));
const first = (candidates) => candidates.length ? [candidates[0]] : [];
const all = (candidates) => candidates;
const forModality = (...modalities) => ({ modality }) => modalities.includes(modality);
const forId = (id) => ({ displaySetUID, referencedId, targetId }) => displaySetUID?.includes(id) ||
    referencedId?.includes(id) ||
    targetId.includes(id);
const measurementTargetFilters = {
    isPixelData,
    firstPixelData,
    allPixelData,
    first,
    all,
    forModality,
    forId,
};
/* export default */ const __rspack_default_export = (measurementTargetFilters);


},
21379(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const defaultContourConfig = {
    renderOutline: true,
    outlineWidthAutoGenerated: 3,
    outlineWidth: 1,
    outlineWidthInactive: 1,
    outlineOpacity: 1,
    outlineOpacityInactive: 0.85,
    outlineDash: undefined,
    outlineDashInactive: undefined,
    outlineDashAutoGenerated: '5,3',
    activeSegmentOutlineWidthDelta: 0,
    renderFill: true,
    fillAlpha: 0.5,
    fillAlphaInactive: 0.3,
    fillAlphaAutoGenerated: 0.3,
};
function getDefaultContourStyle() {
    return defaultContourConfig;
}
/* export default */ const __rspack_default_export = (getDefaultContourStyle);


},
55873(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const defaultLabelmapConfig = {
    renderOutline: true,
    renderOutlineInactive: true,
    outlineWidth: 3,
    outlineWidthInactive: 2,
    activeSegmentOutlineWidthDelta: 0,
    renderFill: true,
    renderFillInactive: true,
    fillAlpha: 0.5,
    fillAlphaInactive: 0.4,
    outlineOpacity: 1,
    outlineOpacityInactive: 0.85,
};
function getDefaultLabelmapStyle() {
    return defaultLabelmapConfig;
}
/* export default */ const __rspack_default_export = (getDefaultLabelmapStyle);


},
75639(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ strategies_BrushStrategy)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js + 4 modules
var triggerSegmentationEvents = __webpack_require__(49256);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/index.js + 11 modules
var compositions = __webpack_require__(30207);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/utils/getStrategyData.js
var getStrategyData = __webpack_require__(66340);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createLabelmapMemo.js
var createLabelmapMemo = __webpack_require__(1732);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var segmentation_getSegmentation = __webpack_require__(99212);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/labelmapSegmentationState.js
var labelmapSegmentationState = __webpack_require__(89615);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/utils/crossLayerErase.js



function collectCrossLayerEraseBindingsForOperation(operationData) {
    const { segmentationId, labelmapId, overwriteSegmentIndices } = operationData;
    const segmentation = getSegmentation(segmentationId);
    operationData.crossLayerEraseBindings = segmentation
        ? collectCrossLayerEraseBindings(segmentation, labelmapId, overwriteSegmentIndices)
        : [];
}
function eraseCrossLayerOverwrites(operationData) {
    const segmentation = (0,segmentation_getSegmentation/* .getSegmentation */.T)(operationData.segmentationId);
    if (!segmentation) {
        return [];
    }
    const { memo } = operationData;
    return (0,labelmapSegmentationState/* .eraseLabelmapEditTransactionOverwrites */.Ry)(segmentation, operationData.labelmapEditTransaction, {
        viewport: operationData.viewport,
        referenceImageData: operationData.segmentationImageData,
        isInObject: operationData.isInObject,
        isInObjectBoundsIJK: operationData.isInObjectBoundsIJK,
        imageId: operationData.imageId,
        crossLayerEraseCallback: memo
            ? ({ voxelManager, labelValue, indices }) => {
                (memo.postSteps ||= []).push({
                    undo: () => {
                        for (const index of indices) {
                            voxelManager.setAtIndex(index, labelValue);
                        }
                        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(operationData.segmentationId);
                    },
                    redo: () => {
                        for (const index of indices) {
                            voxelManager.setAtIndex(index, 0);
                        }
                        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(operationData.segmentationId);
                    },
                });
            }
            : undefined,
    });
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/config.js
var config = __webpack_require__(2782);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(54869);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/utils/overwritePolicy.js




function resolveOverwriteSegmentIndices(operationData) {
    const { segmentationId, segmentIndex, segmentsLocked, viewport } = operationData;
    const segmentation = (0,segmentation_getSegmentation/* .getSegmentation */.T)(segmentationId);
    if (!segmentation || segmentIndex === 0) {
        return [];
    }
    const overwriteMode = (0,config/* .getConfig */.zj)().segmentation?.overwriteMode ?? 'all';
    if (overwriteMode === 'none') {
        return [];
    }
    const allSegmentIndices = Object.keys(segmentation.segments)
        .map(Number)
        .filter((candidateSegmentIndex) => candidateSegmentIndex !== segmentIndex &&
        !segmentsLocked.includes(candidateSegmentIndex));
    if (overwriteMode === 'all') {
        return allSegmentIndices;
    }
    const representation = (0,getSegmentationRepresentation/* .getSegmentationRepresentation */.Ut)(viewport.id, {
        segmentationId,
        type: enums.SegmentationRepresentations.Labelmap,
    });
    if (!representation?.visible) {
        return [];
    }
    return allSegmentIndices.filter((candidateSegmentIndex) => representation.segments[candidateSegmentIndex]?.visible !== false);
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/utils/labelmapOverlap.js




function prepareOverlapOperationData(operationData) {
    const segmentation = (0,segmentation_getSegmentation/* .getSegmentation */.T)(operationData.segmentationId);
    if (!segmentation) {
        return;
    }
    operationData.overwriteSegmentIndices =
        resolveOverwriteSegmentIndices(operationData);
    const transaction = (0,labelmapSegmentationState/* .beginLabelmapEditTransaction */.Qk)(segmentation, {
        segmentIndex: operationData.segmentIndex,
        overwriteSegmentIndices: operationData.overwriteSegmentIndices,
        segmentationVoxelManager: operationData.segmentationVoxelManager,
        segmentationImageData: operationData.segmentationImageData,
        isInObject: operationData.isInObject,
        isInObjectBoundsIJK: operationData.isInObjectBoundsIJK,
    });
    operationData.labelmapEditTransaction = transaction;
    operationData.labelValue = transaction.labelValue;
    operationData.labelmapId = transaction.labelmapId;
    operationData.crossLayerEraseBindings = transaction.crossLayerEraseBindings;
    if (transaction.movedSegment && transaction.activeLayer) {
        const target = (0,labelmapSegmentationState/* .resolveLabelmapLayerEditTarget */.VQ)(transaction.activeLayer, {
            viewport: operationData.viewport,
            imageId: operationData.imageId,
            sourceLayer: transaction.sourceLayer,
        });
        if (target.imageId) {
            operationData.imageId = target.imageId;
        }
        if (target.imageData) {
            operationData.segmentationImageData = target.imageData;
        }
        if (target.voxelManager) {
            operationData.segmentationVoxelManager = target.voxelManager;
        }
    }
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/utils/shouldUseLazyLabelmapEditing.js
var shouldUseLazyLabelmapEditing = __webpack_require__(46787);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/BrushStrategy.js







class BrushStrategy {
    constructor(name, ...initializers) {
        this._initialize = [];
        this._fill = [];
        this._onInteractionStart = [];
        this.fill = (enabledElement, operationData) => {
            const initializedData = this.initialize(enabledElement, operationData, enums.StrategyCallbacks.Fill);
            if (!initializedData) {
                return;
            }
            const isLazyLabelmapEditing = (0,shouldUseLazyLabelmapEditing/* .shouldUseLazyLabelmapEditing */.v)(initializedData.viewport);
            const shouldPrepareOverlap = !isLazyLabelmapEditing || !initializedData.previewOnHover;
            const originalSegmentationVoxelManager = initializedData.segmentationVoxelManager;
            const originalSegmentationImageData = initializedData.segmentationImageData;
            if (shouldPrepareOverlap) {
                prepareOverlapOperationData(initializedData);
            }
            if (initializedData.memo?.segmentationVoxelManager !==
                initializedData.segmentationVoxelManager) {
                const previousMemo = initializedData.memo;
                initializedData.memo = initializedData.createMemo(initializedData.segmentationId, initializedData.segmentationVoxelManager);
                if (previousMemo &&
                    previousMemo !== initializedData.memo &&
                    previousMemo.commitMemo?.()) {
                    (initializedData.memo.priorSteps ||= []).push((0,createLabelmapMemo.memoAsStep)(previousMemo));
                }
            }
            const moveStep = initializedData.labelmapEditTransaction?.moveStep;
            if (moveStep && initializedData.memo) {
                const { segmentationId } = initializedData;
                (initializedData.memo.priorSteps ||= []).push({
                    undo: () => {
                        moveStep.undo();
                        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
                    },
                    redo: () => {
                        moveStep.redo();
                        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
                    },
                });
            }
            if (initializedData.segmentationVoxelManager !==
                originalSegmentationVoxelManager ||
                initializedData.segmentationImageData !== originalSegmentationImageData) {
                this._initialize.forEach((func) => func(initializedData));
            }
            this._fill.forEach((func) => func(initializedData));
            const { segmentationVoxelManager, segmentIndex } = initializedData;
            const crossLayerModifiedSlices = eraseCrossLayerOverwrites(initializedData);
            const modifiedSlices = new Set([
                ...(segmentationVoxelManager.getArrayOfModifiedSlices() ?? []),
                ...crossLayerModifiedSlices,
            ]);
            (0,triggerSegmentationEvents.triggerSegmentationDataModified)(initializedData.segmentationId, Array.from(modifiedSlices), segmentIndex);
            return initializedData;
        };
        this.onInteractionStart = (enabledElement, operationData) => {
            const initializedData = this.initialize(enabledElement, operationData);
            if (!initializedData) {
                return;
            }
            this._onInteractionStart.forEach((func) => func.call(this, initializedData));
        };
        this.addPreview = (enabledElement, operationData) => {
            const initializedData = this.initialize(enabledElement, operationData, enums.StrategyCallbacks.AddPreview);
            if (!initializedData) {
                return;
            }
            return initializedData;
        };
        this.configurationName = name;
        const cursorGeometryInitializer = initializers.find((init) => init.hasOwnProperty(enums.StrategyCallbacks.CalculateCursorGeometry));
        const renderCursorInitializer = initializers.find((init) => init.hasOwnProperty(enums.StrategyCallbacks.RenderCursor));
        if (!cursorGeometryInitializer) {
            initializers.push({
                [enums.StrategyCallbacks.CalculateCursorGeometry]: compositions/* ["default"].circularCursor.calculateCursorGeometry */.A.circularCursor.calculateCursorGeometry,
            });
        }
        if (!renderCursorInitializer) {
            initializers.push({
                [enums.StrategyCallbacks.RenderCursor]: compositions/* ["default"].circularCursor.renderCursor */.A.circularCursor.renderCursor,
            });
        }
        this.compositions = initializers;
        initializers.forEach((initializer) => {
            const result = typeof initializer === 'function' ? initializer() : initializer;
            if (!result) {
                return;
            }
            for (const key in result) {
                if (!BrushStrategy.childFunctions[key]) {
                    throw new Error(`Didn't find ${key} as a brush strategy`);
                }
                BrushStrategy.childFunctions[key](this, result[key]);
            }
        });
        this.strategyFunction = (enabledElement, operationData) => {
            return this.fill(enabledElement, operationData);
        };
        for (const key of Object.keys(BrushStrategy.childFunctions)) {
            this.strategyFunction[key] = this[key];
        }
    }
    initialize(enabledElement, operationData, operationName) {
        const { viewport } = enabledElement;
        const data = (0,getStrategyData/* .getStrategyData */.S)({ operationData, viewport, strategy: this });
        if (!data ||
            !data.imageVoxelManager ||
            !data.segmentationVoxelManager ||
            !data.segmentationImageData) {
            return null;
        }
        const { imageVoxelManager, segmentationVoxelManager, segmentationImageData, } = data;
        const memo = operationData.createMemo(operationData.segmentationId, segmentationVoxelManager);
        const initializedData = {
            operationName,
            ...operationData,
            segmentIndex: operationData.segmentIndex,
            enabledElement,
            imageVoxelManager,
            segmentationVoxelManager,
            segmentationImageData,
            viewport,
            centerWorld: null,
            isInObject: null,
            isInObjectBoundsIJK: null,
            brushStrategy: this,
            memo,
        };
        this._initialize.forEach((func) => func(initializedData));
        return initializedData;
    }
}
BrushStrategy.COMPOSITIONS = compositions/* ["default"] */.A;
BrushStrategy.childFunctions = {
    [enums.StrategyCallbacks.OnInteractionStart]: addListMethod(enums.StrategyCallbacks.OnInteractionStart, enums.StrategyCallbacks.Initialize),
    [enums.StrategyCallbacks.OnInteractionEnd]: addListMethod(enums.StrategyCallbacks.OnInteractionEnd, enums.StrategyCallbacks.Initialize),
    [enums.StrategyCallbacks.Fill]: addListMethod(enums.StrategyCallbacks.Fill),
    [enums.StrategyCallbacks.Initialize]: addListMethod(enums.StrategyCallbacks.Initialize),
    [enums.StrategyCallbacks.CreateIsInThreshold]: addSingletonMethod(enums.StrategyCallbacks.CreateIsInThreshold),
    [enums.StrategyCallbacks.Interpolate]: addListMethod(enums.StrategyCallbacks.Interpolate, enums.StrategyCallbacks.Initialize),
    [enums.StrategyCallbacks.AcceptPreview]: addListMethod(enums.StrategyCallbacks.AcceptPreview, enums.StrategyCallbacks.Initialize),
    [enums.StrategyCallbacks.RejectPreview]: addListMethod(enums.StrategyCallbacks.RejectPreview, enums.StrategyCallbacks.Initialize),
    [enums.StrategyCallbacks.INTERNAL_setValue]: addSingletonMethod(enums.StrategyCallbacks.INTERNAL_setValue),
    [enums.StrategyCallbacks.Preview]: addSingletonMethod(enums.StrategyCallbacks.Preview, false),
    [enums.StrategyCallbacks.ComputeInnerCircleRadius]: addListMethod(enums.StrategyCallbacks.ComputeInnerCircleRadius),
    [enums.StrategyCallbacks.EnsureSegmentationVolumeFor3DManipulation]: addListMethod(enums.StrategyCallbacks.EnsureSegmentationVolumeFor3DManipulation),
    [enums.StrategyCallbacks.EnsureImageVolumeFor3DManipulation]: addListMethod(enums.StrategyCallbacks.EnsureImageVolumeFor3DManipulation),
    [enums.StrategyCallbacks.AddPreview]: addListMethod(enums.StrategyCallbacks.AddPreview),
    [enums.StrategyCallbacks.GetStatistics]: addSingletonMethod(enums.StrategyCallbacks.GetStatistics),
    [enums.StrategyCallbacks.CalculateCursorGeometry]: addSingletonMethod(enums.StrategyCallbacks.CalculateCursorGeometry, true),
    [enums.StrategyCallbacks.RenderCursor]: addSingletonMethod(enums.StrategyCallbacks.RenderCursor, true),
    compositions: null,
};
/* export default */ const strategies_BrushStrategy = (BrushStrategy);
function addListMethod(name, createInitialized) {
    const listName = `_${name}`;
    return (brushStrategy, func) => {
        brushStrategy[listName] ||= [];
        brushStrategy[listName].push(func);
        brushStrategy[name] ||= createInitialized
            ? (enabledElement, operationData, ...args) => {
                const initializedData = brushStrategy[createInitialized](enabledElement, operationData, name);
                let returnValue;
                brushStrategy[listName].forEach((func) => {
                    const value = func.call(brushStrategy, initializedData, ...args);
                    returnValue ||= value;
                });
                return returnValue;
            }
            : (operationData, ...args) => {
                brushStrategy[listName].forEach((func) => func.call(brushStrategy, operationData, ...args));
            };
    };
}
function addSingletonMethod(name, isInitialized = true) {
    return (brushStrategy, func) => {
        if (brushStrategy[name]) {
            throw new Error(`The singleton method ${name} already exists`);
        }
        brushStrategy[name] = isInitialized
            ? func
            : (enabledElement, operationData, ...args) => {
                operationData.enabledElement = enabledElement;
                return func.call(brushStrategy, operationData, ...args);
            };
    };
}


},
30207(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ compositions)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/StrategyCallbacks.js
var StrategyCallbacks = __webpack_require__(86460);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/determineSegmentIndex.js

/* export default */ const determineSegmentIndex = ({
    [StrategyCallbacks/* ["default"].OnInteractionStart */.A.OnInteractionStart]: (operationData) => {
        const { segmentIndex, labelValue, previewSegmentIndex, segmentationVoxelManager, centerIJK, viewPlaneNormal, segmentationImageData, configuration, } = operationData;
        if (!configuration?.useCenterSegmentIndex) {
            operationData.centerSegmentIndexInfo.segmentIndex = null;
            operationData.centerSegmentIndexInfo.hasSegmentIndex = false;
            operationData.centerSegmentIndexInfo.hasPreviewIndex = false;
            return;
        }
        let hasSegmentIndex = false;
        let hasPreviewIndex = false;
        const nestedBounds = [
            ...segmentationVoxelManager.getBoundsIJK(),
        ];
        if (Math.abs(viewPlaneNormal[0]) > 0.8) {
            nestedBounds[0] = [centerIJK[0], centerIJK[0]];
        }
        else if (Math.abs(viewPlaneNormal[1]) > 0.8) {
            nestedBounds[1] = [centerIJK[1], centerIJK[1]];
        }
        else if (Math.abs(viewPlaneNormal[2]) > 0.8) {
            nestedBounds[2] = [centerIJK[2], centerIJK[2]];
        }
        const callback = ({ value }) => {
            hasSegmentIndex ||= value === (labelValue ?? segmentIndex);
            hasPreviewIndex ||= value === previewSegmentIndex;
        };
        segmentationVoxelManager.forEach(callback, {
            imageData: segmentationImageData,
            isInObject: operationData.isInObject,
            boundsIJK: nestedBounds,
        });
        if (!hasSegmentIndex && !hasPreviewIndex) {
            operationData.centerSegmentIndexInfo.segmentIndex = null;
            return;
        }
        const existingValue = segmentationVoxelManager.getAtIJKPoint(centerIJK);
        operationData.centerSegmentIndexInfo.segmentIndex = existingValue;
        operationData.centerSegmentIndexInfo.hasSegmentIndex = hasSegmentIndex;
        operationData.centerSegmentIndexInfo.hasPreviewIndex = hasPreviewIndex;
    },
});

// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var esm = __webpack_require__(40230);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/getViewportICamera.js
var getViewportICamera = __webpack_require__(41891);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/dynamicThreshold.js



/* export default */ const dynamicThreshold = ({
    [StrategyCallbacks/* ["default"].Initialize */.A.Initialize]: (operationData) => {
        const { operationName, centerIJK, segmentationVoxelManager, imageVoxelManager, configuration, segmentIndex, viewport, } = operationData;
        if (!configuration?.threshold?.isDynamic || !centerIJK || !segmentIndex) {
            return;
        }
        if (operationName === StrategyCallbacks/* ["default"].RejectPreview */.A.RejectPreview ||
            operationName === StrategyCallbacks/* ["default"].OnInteractionEnd */.A.OnInteractionEnd) {
            return;
        }
        const boundsIJK = segmentationVoxelManager.getBoundsIJK();
        const { range: oldThreshold, dynamicRadius = 0 } = configuration.threshold;
        const useDelta = oldThreshold ? 0 : dynamicRadius;
        const { viewPlaneNormal } = (0,getViewportICamera/* ["default"] */.A)(viewport);
        if (!viewPlaneNormal) {
            return;
        }
        const nestedBounds = boundsIJK.map((ijk, idx) => {
            const [min, max] = ijk;
            return [
                Math.max(min, centerIJK[idx] - useDelta),
                Math.min(max, centerIJK[idx] + useDelta),
            ];
        });
        if (Math.abs(viewPlaneNormal[0]) > 0.8) {
            nestedBounds[0] = [centerIJK[0], centerIJK[0]];
        }
        else if (Math.abs(viewPlaneNormal[1]) > 0.8) {
            nestedBounds[1] = [centerIJK[1], centerIJK[1]];
        }
        else if (Math.abs(viewPlaneNormal[2]) > 0.8) {
            nestedBounds[2] = [centerIJK[2], centerIJK[2]];
        }
        const threshold = oldThreshold || [Infinity, -Infinity];
        const useDeltaSqr = useDelta * useDelta;
        const callback = ({ value, pointIJK }) => {
            const distance = esm/* .vec3.sqrDist */.eR.lo(centerIJK, pointIJK);
            if (distance > useDeltaSqr) {
                return;
            }
            const gray = Array.isArray(value) ? esm/* .vec3.len */.eR.Il(value) : value;
            threshold[0] = Math.min(gray, threshold[0]);
            threshold[1] = Math.max(gray, threshold[1]);
        };
        imageVoxelManager.forEach(callback, { boundsIJK: nestedBounds });
        configuration.threshold.range = threshold;
    },
    [StrategyCallbacks/* ["default"].OnInteractionStart */.A.OnInteractionStart]: (operationData) => {
        const { configuration } = operationData;
        if (!configuration?.threshold?.isDynamic) {
            return;
        }
        configuration.threshold.range = null;
    },
    [StrategyCallbacks/* ["default"].ComputeInnerCircleRadius */.A.ComputeInnerCircleRadius]: (operationData) => {
        const { configuration, viewport } = operationData;
        const thresholdConfig = configuration?.threshold;
        if (!thresholdConfig) {
            return;
        }
        const { dynamicRadius = 0, isDynamic } = thresholdConfig;
        if (!isDynamic) {
            thresholdConfig.dynamicRadiusInCanvas = 0;
            return;
        }
        if (dynamicRadius === 0) {
            return;
        }
        const imageData = viewport.getImageData();
        if (!imageData) {
            return;
        }
        const { spacing } = imageData;
        const centerCanvas = [
            viewport.element.clientWidth / 2,
            viewport.element.clientHeight / 2,
        ];
        const radiusInWorld = dynamicRadius * spacing[0];
        const centerCursorInWorld = viewport.canvasToWorld(centerCanvas);
        const offSetCenterInWorld = centerCursorInWorld.map((coord) => coord + radiusInWorld);
        const offSetCenterCanvas = viewport.worldToCanvas(offSetCenterInWorld);
        const dynamicRadiusInCanvas = Math.abs(centerCanvas[0] - offSetCenterCanvas[0]);
        if (!thresholdConfig.dynamicRadiusInCanvas) {
            thresholdConfig.dynamicRadiusInCanvas = 0;
        }
        thresholdConfig.dynamicRadiusInCanvas = 3 + dynamicRadiusInCanvas;
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/erase.js

/* export default */ const erase = ({
    [StrategyCallbacks/* ["default"].Initialize */.A.Initialize]: (operationData) => {
        operationData.segmentIndex = 0;
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js + 4 modules
var triggerSegmentationEvents = __webpack_require__(49256);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/islandRemoval.js
var segmentation_islandRemoval = __webpack_require__(29827);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/islandRemovalComposition.js



/* export default */ const islandRemovalComposition = ({
    [StrategyCallbacks/* ["default"].OnInteractionEnd */.A.OnInteractionEnd]: (operationData) => {
        const { previewSegmentIndex, segmentIndex, labelValue, viewport, segmentationVoxelManager, activeStrategy, memo, } = operationData;
        if (activeStrategy !== 'THRESHOLD_INSIDE_SPHERE_WITH_ISLAND_REMOVAL' ||
            segmentIndex === null) {
            return;
        }
        const islandRemoval = new segmentation_islandRemoval/* ["default"] */.A();
        const voxelManager = memo?.voxelManager || segmentationVoxelManager;
        if (!islandRemoval.initialize(viewport, voxelManager, {
            previewSegmentIndex,
            segmentIndex: labelValue ?? segmentIndex,
        })) {
            return;
        }
        islandRemoval.floodFillSegmentIsland();
        islandRemoval.removeExternalIslands();
        islandRemoval.removeInternalIslands();
        const arrayOfSlices = voxelManager.getArrayOfModifiedSlices();
        if (!arrayOfSlices) {
            return;
        }
        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(operationData.segmentationId, arrayOfSlices, previewSegmentIndex);
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/events/triggerSegmentationDataModified.js
var triggerSegmentationDataModified = __webpack_require__(70467);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/config/segmentationColor.js
var segmentationColor = __webpack_require__(46692);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportIdsWithSegmentation.js
var getViewportIdsWithSegmentation = __webpack_require__(83470);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/preview.js





/* export default */ const compositions_preview = ({
    [StrategyCallbacks/* ["default"].Preview */.A.Preview]: function (operationData) {
        const { previewSegmentIndex, configuration, enabledElement } = operationData;
        if (!previewSegmentIndex || !configuration) {
            return;
        }
        this.onInteractionStart?.(enabledElement, operationData);
        const preview = this.fill(enabledElement, operationData);
        if (preview) {
            this.onInteractionEnd?.(enabledElement, operationData);
        }
        return preview;
    },
    [StrategyCallbacks/* ["default"].Initialize */.A.Initialize]: (operationData) => {
        const { segmentIndex, previewColor, previewSegmentIndex } = operationData;
        operationData.modified = false;
        if (previewSegmentIndex == null || segmentIndex == null) {
            return;
        }
        const viewportIds = (0,getViewportIdsWithSegmentation/* .getViewportIdsWithSegmentation */.P)(operationData.segmentationId);
        viewportIds?.forEach((viewportId) => {
            (0,segmentationColor.setSegmentIndexColor)(viewportId, operationData.segmentationId, previewSegmentIndex, previewColor);
        });
        operationData.modified = true;
    },
    [StrategyCallbacks/* ["default"].AcceptPreview */.A.AcceptPreview]: (operationData) => {
        const { previewSegmentIndex, segmentationVoxelManager, memo, segmentIndex, labelValue, centerSegmentIndexInfo, } = operationData || {};
        const { changedIndices } = centerSegmentIndexInfo || {};
        const labelmapMemo = memo;
        const callback = ({ index }) => {
            const oldValue = segmentationVoxelManager.getAtIndex(index);
            if (changedIndices?.length > 0) {
                if (changedIndices.includes(index)) {
                    labelmapMemo.voxelManager.setAtIndex(index, 0);
                }
            }
            else {
                if (oldValue === previewSegmentIndex) {
                    labelmapMemo.voxelManager.setAtIndex(index, labelValue ?? segmentIndex);
                }
            }
        };
        segmentationVoxelManager.forEach(callback);
        (0,triggerSegmentationDataModified/* .triggerSegmentationDataModified */.Q)(operationData.segmentationId, segmentationVoxelManager.getArrayOfModifiedSlices(), segmentIndex);
        operationData.centerSegmentIndexInfo.changedIndices = [];
    },
    [StrategyCallbacks/* ["default"].RejectPreview */.A.RejectPreview]: (operationData) => {
        if (!operationData) {
            return;
        }
        dist_esm.utilities.HistoryMemo.DefaultHistoryMemo.undoIf((memo) => {
            const labelmapMemo = memo;
            if (!labelmapMemo?.voxelManager) {
                return false;
            }
            const { segmentationVoxelManager } = labelmapMemo;
            let hasPreviewSegmentIndex = false;
            const callback = ({ value }) => {
                if (value === operationData.previewSegmentIndex) {
                    hasPreviewSegmentIndex = true;
                }
            };
            segmentationVoxelManager.forEach(callback);
            return hasPreviewSegmentIndex;
        });
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/regionFill.js

/* export default */ const regionFill = ({
    [StrategyCallbacks/* ["default"].Fill */.A.Fill]: (operationData) => {
        const { segmentsLocked, segmentationImageData, segmentationVoxelManager, brushStrategy, centerIJK, } = operationData;
        const isWithinThreshold = brushStrategy.createIsInThreshold?.(operationData);
        const { setValue } = brushStrategy;
        const callback = isWithinThreshold
            ? (data) => {
                const { value, index } = data;
                if (segmentsLocked.includes(value) || !isWithinThreshold(index)) {
                    return;
                }
                setValue(operationData, data);
            }
            : (data) => setValue(operationData, data);
        segmentationVoxelManager.forEach(callback, {
            imageData: segmentationImageData,
            isInObject: operationData.isInObject,
            boundsIJK: operationData.isInObjectBoundsIJK,
        });
        segmentationVoxelManager.addPoint(centerIJK);
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/utils/handleUseSegmentCenterIndex.js
function handleUseSegmentCenterIndex({ operationData, existingValue, index, }) {
    const { previewSegmentIndex, memo, centerSegmentIndexInfo, previewOnHover, segmentIndex, labelValue, } = operationData;
    const activeLabelValue = labelValue ?? segmentIndex;
    const { hasPreviewIndex, hasSegmentIndex, segmentIndex: centerSegmentIndex, } = centerSegmentIndexInfo;
    if (centerSegmentIndex === 0 && hasSegmentIndex && hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        if (previewOnHover) {
            return;
        }
        if (existingValue === previewSegmentIndex) {
            memo.voxelManager.setAtIndex(index, 0);
            return;
        }
        return;
    }
    if (centerSegmentIndex === 0 && hasSegmentIndex && !hasPreviewIndex) {
        if (existingValue === 0 || existingValue !== activeLabelValue) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        centerSegmentIndexInfo.changedIndices.push(index);
        return;
    }
    if (centerSegmentIndex === 0 && !hasSegmentIndex && hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        if (previewOnHover) {
            return;
        }
        if (existingValue === previewSegmentIndex) {
            memo.voxelManager.setAtIndex(index, 0);
            return;
        }
        return;
    }
    if (centerSegmentIndex === 0 && !hasSegmentIndex && !hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        if (existingValue === previewSegmentIndex) {
            memo.voxelManager.setAtIndex(index, previewSegmentIndex);
            return;
        }
        return;
    }
    if (centerSegmentIndex === previewSegmentIndex &&
        hasSegmentIndex &&
        hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
    if (centerSegmentIndex === previewSegmentIndex &&
        !hasSegmentIndex &&
        hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
    if (centerSegmentIndex === activeLabelValue &&
        hasSegmentIndex &&
        hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
    if (centerSegmentIndex === activeLabelValue &&
        hasSegmentIndex &&
        !hasPreviewIndex) {
        if (existingValue === activeLabelValue) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var getSegmentation = __webpack_require__(99212);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/labelmapSegmentationState.js
var labelmapSegmentationState = __webpack_require__(89615);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/setValue.js




/* export default */ const compositions_setValue = ({
    [StrategyCallbacks/* ["default"].INTERNAL_setValue */.A.INTERNAL_setValue]: (operationData, { value, index }) => {
        const { segmentsLocked, previewSegmentIndex, memo, segmentationVoxelManager, centerSegmentIndexInfo, segmentIndex, labelValue, labelmapId, segmentationId, } = operationData;
        const existingValue = segmentationVoxelManager.getAtIndex(index);
        const segmentation = (0,getSegmentation/* .getSegmentation */.T)(segmentationId);
        const existingSegmentIndex = segmentation && labelmapId
            ? (0,labelmapSegmentationState/* .getSegmentIndexForLabelValue */.Mx)(segmentation, labelmapId, existingValue)
            : existingValue;
        const writeValue = previewSegmentIndex ?? labelValue ?? segmentIndex;
        if (segmentsLocked.includes(existingSegmentIndex)) {
            return;
        }
        if (!centerSegmentIndexInfo &&
            existingValue === (labelValue ?? segmentIndex)) {
            return;
        }
        if (centerSegmentIndexInfo?.segmentIndex !== 0 &&
            existingValue === (labelValue ?? segmentIndex)) {
            return;
        }
        if (centerSegmentIndexInfo?.segmentIndex === null) {
            memo.voxelManager.setAtIndex(index, writeValue);
            return;
        }
        if (!previewSegmentIndex) {
            let useSegmentIndex = labelValue ?? segmentIndex;
            if (centerSegmentIndexInfo) {
                useSegmentIndex = centerSegmentIndexInfo.segmentIndex;
            }
            memo.voxelManager.setAtIndex(index, useSegmentIndex);
            return;
        }
        handleUseSegmentCenterIndex({
            operationData,
            existingValue,
            index,
        });
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/threshold.js


/* export default */ const compositions_threshold = ({
    [StrategyCallbacks/* ["default"].CreateIsInThreshold */.A.CreateIsInThreshold]: (operationData) => {
        const { imageVoxelManager, segmentIndex, configuration } = operationData;
        if (!configuration || !segmentIndex) {
            return;
        }
        return (index) => {
            const voxelValue = imageVoxelManager.getAtIndex(index);
            const gray = Array.isArray(voxelValue)
                ? esm/* .vec3.length */.eR.Bw(voxelValue)
                : voxelValue;
            const { threshold } = configuration || {};
            if (!threshold?.range?.length) {
                return true;
            }
            return threshold.range[0] <= gray && gray <= threshold.range[1];
        };
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getStatistics.js
var getStatistics = __webpack_require__(99891);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/labelmapStatistics.js


/* export default */ const labelmapStatistics = ({
    [StrategyCallbacks/* ["default"].GetStatistics */.A.GetStatistics]: function (enabledElement, operationData, options) {
        const { indices } = options;
        const { segmentationId, viewport } = operationData;
        (0,getStatistics/* ["default"] */.A)({
            segmentationId,
            segmentIndices: indices,
        });
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/ensureSegmentationVolume.js
var ensureSegmentationVolume = __webpack_require__(22081);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/ensureImageVolume.js
var ensureImageVolume = __webpack_require__(31326);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/index.js + 4 modules
var drawingSvg = __webpack_require__(21566);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/circularCursor.js




/* export default */ const circularCursor = ({
    [StrategyCallbacks/* ["default"].CalculateCursorGeometry */.A.CalculateCursorGeometry]: function (enabledElement, operationData) {
        if (!operationData) {
            return;
        }
        const { configuration, activeStrategy, hoverData } = operationData;
        const { viewport } = enabledElement;
        const camera = (0,getViewportICamera/* ["default"] */.A)(viewport);
        const { brushSize } = configuration;
        if (!camera.viewUp || !camera.viewPlaneNormal) {
            return;
        }
        const viewUp = esm/* .vec3.fromValues */.eR.fA(camera.viewUp[0], camera.viewUp[1], camera.viewUp[2]);
        const viewPlaneNormal = esm/* .vec3.fromValues */.eR.fA(camera.viewPlaneNormal[0], camera.viewPlaneNormal[1], camera.viewPlaneNormal[2]);
        const viewRight = esm/* .vec3.create */.eR.vt();
        esm/* .vec3.cross */.eR.$A(viewRight, viewUp, viewPlaneNormal);
        const { canvasToWorld } = viewport;
        const { centerCanvas } = hoverData;
        const centerCursorInWorld = canvasToWorld([
            centerCanvas[0],
            centerCanvas[1],
        ]);
        const bottomCursorInWorld = esm/* .vec3.create */.eR.vt();
        const topCursorInWorld = esm/* .vec3.create */.eR.vt();
        const leftCursorInWorld = esm/* .vec3.create */.eR.vt();
        const rightCursorInWorld = esm/* .vec3.create */.eR.vt();
        for (let i = 0; i <= 2; i++) {
            bottomCursorInWorld[i] = centerCursorInWorld[i] - viewUp[i] * brushSize;
            topCursorInWorld[i] = centerCursorInWorld[i] + viewUp[i] * brushSize;
            leftCursorInWorld[i] = centerCursorInWorld[i] - viewRight[i] * brushSize;
            rightCursorInWorld[i] = centerCursorInWorld[i] + viewRight[i] * brushSize;
        }
        if (!hoverData) {
            return;
        }
        const { brushCursor } = hoverData;
        const { data } = brushCursor;
        if (data.handles === undefined) {
            data.handles = {};
        }
        data.handles.points = [
            bottomCursorInWorld,
            topCursorInWorld,
            leftCursorInWorld,
            rightCursorInWorld,
        ];
        data.editPoints = [...data.handles.points];
        const strategy = configuration.strategies[activeStrategy];
        if (typeof strategy?.computeInnerCircleRadius === 'function') {
            strategy.computeInnerCircleRadius({
                configuration,
                viewport,
            });
        }
        data.invalidated = false;
    },
    [StrategyCallbacks/* ["default"].RenderCursor */.A.RenderCursor]: function (enabledElement, operationData, svgDrawingHelper) {
        if (!operationData) {
            return;
        }
        const { configuration, hoverData } = operationData;
        const { viewport } = enabledElement;
        const { brushCursor } = hoverData;
        const toolMetadata = brushCursor.metadata;
        if (!toolMetadata) {
            return;
        }
        const annotationUID = toolMetadata.brushCursorUID || 'brushCursor';
        const data = brushCursor.data;
        const color = `rgb(${toolMetadata.segmentColor?.slice(0, 3) || [0, 0, 0]})`;
        if (!viewport.getRenderingEngine()) {
            console.warn('Rendering Engine has been destroyed');
            return;
        }
        const points = data.handles?.points || [];
        const totalCircles = Math.floor((points?.length || 0) / 4);
        const circleGeometries = [];
        for (let i = 0; i < points.length; i += 4) {
            const circlePoints = points.slice(i, i + 4);
            if (circlePoints.length < 2) {
                continue;
            }
            const canvasCoordinates = circlePoints.map((p) => viewport.worldToCanvas(p));
            const bottom = canvasCoordinates[0];
            const top = canvasCoordinates[1];
            const center = [
                Math.floor((bottom[0] + top[0]) / 2),
                Math.floor((bottom[1] + top[1]) / 2),
            ];
            const radius = Math.round(Math.abs(bottom[1] - center[1]));
            circleGeometries.push({ center, radius });
        }
        const currentCircle = circleGeometries[circleGeometries.length - 1];
        if (circleGeometries.length > 1) {
            (0,drawingSvg.drawPath)(svgDrawingHelper, annotationUID, 'stroke-preview', circleGeometries.map((circle) => circle.center), {
                color,
                lineWidth: currentCircle.radius * 2,
                strokeOpacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
                lineDash: this.centerSegmentIndexInfo.segmentIndex === 0 ? '6,4' : undefined,
            });
        }
        if (currentCircle) {
            (0,drawingSvg.drawCircle)(svgDrawingHelper, annotationUID, 'current-circle', currentCircle.center, currentCircle.radius, {
                color,
                lineWidth: 2,
                strokeOpacity: 1,
                lineDash: this.centerSegmentIndexInfo.segmentIndex === 0 ? [1, 2] : null,
            }, 'brush-cursor');
        }
        const { dynamicRadiusInCanvas } = configuration?.threshold || {
            dynamicRadiusInCanvas: 0,
        };
        if (dynamicRadiusInCanvas && currentCircle) {
            const circleUID1 = 'dynamic-radius';
            (0,drawingSvg.drawCircle)(svgDrawingHelper, annotationUID, circleUID1, currentCircle.center, dynamicRadiusInCanvas, {
                color,
            }, 'brush-cursor');
        }
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/index.js












/* export default */ const compositions = ({
    determineSegmentIndex: determineSegmentIndex,
    dynamicThreshold: dynamicThreshold,
    erase: erase,
    islandRemoval: islandRemovalComposition,
    preview: compositions_preview,
    regionFill: regionFill,
    setValue: compositions_setValue,
    threshold: compositions_threshold,
    labelmapStatistics: labelmapStatistics,
    ensureSegmentationVolumeFor3DManipulation: ensureSegmentationVolume/* ["default"] */.A,
    ensureImageVolumeFor3DManipulation: ensureImageVolume/* ["default"] */.A,
    circularCursor: circularCursor
});


},
72857(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  r: () => (eraseInsideCircle)
});
/* import */ var _BrushStrategy_js__rspack_import_0 = __webpack_require__(75639);
/* import */ var _fillCircle_js__rspack_import_1 = __webpack_require__(55314);
/* import */ var _compositions_index_js__rspack_import_2 = __webpack_require__(30207);



const ERASE_CIRCLE_STRATEGY = new _BrushStrategy_js__rspack_import_0/* ["default"] */.A('EraseCircle', _compositions_index_js__rspack_import_2/* ["default"].erase */.A.erase, ..._fillCircle_js__rspack_import_1/* .CIRCLE_STRATEGY.compositions */.pB.compositions);
const eraseInsideCircle = ERASE_CIRCLE_STRATEGY.strategyFunction;



},
6184(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  _: () => (eraseInsideSphere)
});
/* import */ var _BrushStrategy_js__rspack_import_0 = __webpack_require__(75639);
/* import */ var _fillSphere_js__rspack_import_1 = __webpack_require__(79911);
/* import */ var _compositions_index_js__rspack_import_2 = __webpack_require__(30207);



const ERASE_SPHERE_STRATEGY = new _BrushStrategy_js__rspack_import_0/* ["default"] */.A('EraseSphere', _compositions_index_js__rspack_import_2/* ["default"].erase */.A.erase, ..._fillSphere_js__rspack_import_1/* .SPHERE_STRATEGY.compositions */.u8.compositions);
const eraseInsideSphere = ERASE_SPHERE_STRATEGY.strategyFunction;



},
79911(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Jq: () => (fillInsideSphere),
  Sw: () => (thresholdInsideSphereIsland),
  rd: () => (thresholdInsideSphere),
  u8: () => (SPHERE_STRATEGY)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);
/* import */ var _BrushStrategy_js__rspack_import_2 = __webpack_require__(75639);
/* import */ var _compositions_index_js__rspack_import_3 = __webpack_require__(30207);
/* import */ var _enums_StrategyCallbacks_js__rspack_import_4 = __webpack_require__(86460);
/* import */ var _fillCircle_js__rspack_import_5 = __webpack_require__(55314);
/* import */ var _utilities_getSphereBoundsInfo_js__rspack_import_6 = __webpack_require__(95009);






const { transformWorldToIndex, getNormalizedAspectRatio } = _cornerstonejs_core__rspack_import_0.utilities;

const sphereComposition = {
    [_enums_StrategyCallbacks_js__rspack_import_4/* ["default"].Initialize */.A.Initialize]: (operationData) => {
        const { points, viewport, segmentationImageData } = operationData;
        if (!points) {
            return;
        }
        const center = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
        if (points.length >= 2) {
            gl_matrix__rspack_import_1/* .vec3.add */.eR.WQ(center, points[0], points[1]);
            gl_matrix__rspack_import_1/* .vec3.scale */.eR.hs(center, center, 0.5);
        }
        else {
            gl_matrix__rspack_import_1/* .vec3.copy */.eR.C(center, points[0]);
        }
        operationData.centerWorld = center;
        operationData.centerIJK = transformWorldToIndex(segmentationImageData, center);
        const baseExtent = (0,_utilities_getSphereBoundsInfo_js__rspack_import_6/* .getSphereBoundsInfoFromViewport */.l)(points.slice(0, 2), segmentationImageData, viewport);
        const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
        const corners = (0,_fillCircle_js__rspack_import_5/* .getEllipseCornersFromCanvasCoordinates */.C$)(canvasCoordinates);
        const cornersInWorld = corners.map((corner) => viewport.canvasToWorld(corner));
        const aspectRatio = getNormalizedAspectRatio(viewport.getAspectRatio());
        const yRadius = points.length >= 2
            ? gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(points[0], points[1]) / 2 / aspectRatio[1]
            : 0;
        const xRadius = points.length >= 2
            ? gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(points[2], points[3]) / 2 / aspectRatio[0]
            : 0;
        const strokeCenters = operationData.strokePointsWorld &&
            operationData.strokePointsWorld.length > 0
            ? operationData.strokePointsWorld
            : [operationData.centerWorld];
        const baseBounds = baseExtent.boundsIJK;
        const baseCenterIJK = operationData.centerIJK;
        const boundsForStroke = strokeCenters.reduce((acc, centerPoint) => {
            if (!centerPoint) {
                return acc;
            }
            const translatedCenterIJK = transformWorldToIndex(segmentationImageData, centerPoint);
            const deltaIJK = [
                translatedCenterIJK[0] - baseCenterIJK[0],
                translatedCenterIJK[1] - baseCenterIJK[1],
                translatedCenterIJK[2] - baseCenterIJK[2],
            ];
            const translatedBounds = [
                [baseBounds[0][0] + deltaIJK[0], baseBounds[0][1] + deltaIJK[0]],
                [baseBounds[1][0] + deltaIJK[1], baseBounds[1][1] + deltaIJK[1]],
                [baseBounds[2][0] + deltaIJK[2], baseBounds[2][1] + deltaIJK[2]],
            ];
            if (!acc) {
                return translatedBounds;
            }
            return [
                [
                    Math.min(acc[0][0], translatedBounds[0][0]),
                    Math.max(acc[0][1], translatedBounds[0][1]),
                ],
                [
                    Math.min(acc[1][0], translatedBounds[1][0]),
                    Math.max(acc[1][1], translatedBounds[1][1]),
                ],
                [
                    Math.min(acc[2][0], translatedBounds[2][0]),
                    Math.max(acc[2][1], translatedBounds[2][1]),
                ],
            ];
        }, null);
        const boundsToUse = boundsForStroke ?? baseExtent.boundsIJK;
        if (segmentationImageData) {
            const dimensions = segmentationImageData.getDimensions();
            operationData.isInObjectBoundsIJK = [
                [
                    Math.max(0, Math.min(boundsToUse[0][0], dimensions[0] - 1)),
                    Math.max(0, Math.min(boundsToUse[0][1], dimensions[0] - 1)),
                ],
                [
                    Math.max(0, Math.min(boundsToUse[1][0], dimensions[1] - 1)),
                    Math.max(0, Math.min(boundsToUse[1][1], dimensions[1] - 1)),
                ],
                [
                    Math.max(0, Math.min(boundsToUse[2][0], dimensions[2] - 1)),
                    Math.max(0, Math.min(boundsToUse[2][1], dimensions[2] - 1)),
                ],
            ];
        }
        else {
            operationData.isInObjectBoundsIJK = boundsToUse;
        }
        operationData.isInObject = (0,_fillCircle_js__rspack_import_5/* .createEllipseInPoint */.mu)(cornersInWorld, {
            strokePointsWorld: operationData.strokePointsWorld,
            segmentationImageData,
            xRadius,
            yRadius,
            aspectRatio,
        });
    },
};
const SPHERE_STRATEGY = new _BrushStrategy_js__rspack_import_2/* ["default"] */.A('Sphere', _compositions_index_js__rspack_import_3/* ["default"].regionFill */.A.regionFill, _compositions_index_js__rspack_import_3/* ["default"].setValue */.A.setValue, sphereComposition, _compositions_index_js__rspack_import_3/* ["default"].determineSegmentIndex */.A.determineSegmentIndex, _compositions_index_js__rspack_import_3/* ["default"].preview */.A.preview, _compositions_index_js__rspack_import_3/* ["default"].labelmapStatistics */.A.labelmapStatistics, _compositions_index_js__rspack_import_3/* ["default"].ensureSegmentationVolumeFor3DManipulation */.A.ensureSegmentationVolumeFor3DManipulation);
const fillInsideSphere = SPHERE_STRATEGY.strategyFunction;
const SPHERE_THRESHOLD_STRATEGY = new _BrushStrategy_js__rspack_import_2/* ["default"] */.A('SphereThreshold', ...SPHERE_STRATEGY.compositions, _compositions_index_js__rspack_import_3/* ["default"].dynamicThreshold */.A.dynamicThreshold, _compositions_index_js__rspack_import_3/* ["default"].threshold */.A.threshold, _compositions_index_js__rspack_import_3/* ["default"].ensureSegmentationVolumeFor3DManipulation */.A.ensureSegmentationVolumeFor3DManipulation, _compositions_index_js__rspack_import_3/* ["default"].ensureImageVolumeFor3DManipulation */.A.ensureImageVolumeFor3DManipulation);
const SPHERE_THRESHOLD_STRATEGY_ISLAND = new _BrushStrategy_js__rspack_import_2/* ["default"] */.A('SphereThreshold', ...SPHERE_STRATEGY.compositions, _compositions_index_js__rspack_import_3/* ["default"].dynamicThreshold */.A.dynamicThreshold, _compositions_index_js__rspack_import_3/* ["default"].threshold */.A.threshold, _compositions_index_js__rspack_import_3/* ["default"].islandRemoval */.A.islandRemoval, _compositions_index_js__rspack_import_3/* ["default"].ensureSegmentationVolumeFor3DManipulation */.A.ensureSegmentationVolumeFor3DManipulation, _compositions_index_js__rspack_import_3/* ["default"].ensureImageVolumeFor3DManipulation */.A.ensureImageVolumeFor3DManipulation);
const thresholdInsideSphere = SPHERE_THRESHOLD_STRATEGY.strategyFunction;
const thresholdInsideSphereIsland = SPHERE_THRESHOLD_STRATEGY_ISLAND.strategyFunction;
function fillOutsideSphere() {
    throw new Error('fill outside sphere not implemented');
}



},
47678(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ utils_LazyBrushEditController)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/utils/lazyBrushPreview.js
const EPSILON = 1e-3;
function clonePoint(point) {
    return [point[0], point[1], point[2]];
}
function isSamePoint(a, b) {
    return (Math.abs(a[0] - b[0]) < EPSILON &&
        Math.abs(a[1] - b[1]) < EPSILON &&
        Math.abs(a[2] - b[2]) < EPSILON);
}
function appendLazyBrushStrokePoint(points = [], point) {
    if (!point) {
        return points;
    }
    if (points.length && isSamePoint(points[points.length - 1], point)) {
        return points;
    }
    return [...points, clonePoint(point)];
}
function appendLazyBrushPreviewCircle(existingPoints = [], circlePoints = []) {
    if (!circlePoints.length) {
        return existingPoints;
    }
    const nextCircle = circlePoints.map((point) => clonePoint(point));
    if (!existingPoints.length) {
        return nextCircle;
    }
    const previousCircle = existingPoints.slice(-nextCircle.length);
    const isDuplicateCircle = previousCircle.length === nextCircle.length &&
        previousCircle.every((point, index) => isSamePoint(point, nextCircle[index]));
    if (isDuplicateCircle) {
        return existingPoints;
    }
    return [...existingPoints, ...nextCircle];
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/utils/LazyBrushEditController.js



class LazyBrushEditController {
    constructor() {
        this.strokePointsWorld = [];
        this.previewPoints = [];
        this.pendingPreviewCleanup = null;
    }
    reset() {
        this.strokePointsWorld = [];
        this.previewPoints = [];
    }
    clearPendingCleanup() {
        if (!this.pendingPreviewCleanup) {
            return;
        }
        esm.eventTarget.removeEventListener(enums.Events.SEGMENTATION_RENDERED, this.pendingPreviewCleanup.listener);
        this.pendingPreviewCleanup = null;
    }
    appendStrokePoint(worldPoint) {
        this.strokePointsWorld = appendLazyBrushStrokePoint(this.strokePointsWorld, worldPoint);
    }
    getStrokePointsWorld() {
        return this.strokePointsWorld;
    }
    capturePreviewCircle(hoverData) {
        if (!hoverData) {
            return;
        }
        const circlePoints = hoverData.brushCursor?.data?.editPoints;
        this.previewPoints = appendLazyBrushPreviewCircle(this.previewPoints, circlePoints);
        hoverData.brushCursor.data.handles.points = this.previewPoints;
    }
    scheduleCleanup({ element, centerCanvas, viewportId, segmentationId, refreshCursor, }) {
        this.clearPendingCleanup();
        const listener = ((evt) => {
            const detail = evt.detail;
            if (detail.viewportId !== viewportId ||
                detail.segmentationId !== segmentationId) {
                return;
            }
            this.clearPendingCleanup();
            this.reset();
            refreshCursor(element, centerCanvas);
        });
        this.pendingPreviewCleanup = {
            viewportId,
            segmentationId,
            listener,
        };
        esm.eventTarget.addEventListener(enums.Events.SEGMENTATION_RENDERED, listener);
    }
}
/* export default */ const utils_LazyBrushEditController = (LazyBrushEditController);


},
46787(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  v: () => (shouldUseLazyLabelmapEditing)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _config_js__rspack_import_1 = __webpack_require__(2782);


const CPU_RENDER_MODES = new Set([
    _cornerstonejs_core__rspack_import_0.ActorRenderMode.CPU_IMAGE,
    _cornerstonejs_core__rspack_import_0.ActorRenderMode.CPU_VOLUME,
]);
function getDefaultActor(viewport) {
    try {
        return viewport.getDefaultActor?.();
    }
    catch {
        return;
    }
}
function isCPUViewport(viewport) {
    if (!viewport) {
        return (0,_cornerstonejs_core__rspack_import_0.getShouldUseCPURendering)();
    }
    const cpuViewport = viewport;
    if (cpuViewport.useCPURendering === true) {
        return true;
    }
    if (cpuViewport._cpuFallbackEnabledElement) {
        return true;
    }
    const defaultActor = getDefaultActor(viewport);
    const renderMode = defaultActor?.actorMapper?.renderMode;
    if (renderMode && CPU_RENDER_MODES.has(renderMode)) {
        return true;
    }
    const actorClassName = typeof defaultActor?.actor?.getClassName === 'function'
        ? defaultActor.actor.getClassName()
        : undefined;
    if (actorClassName === 'CanvasActor') {
        return true;
    }
    return (0,_cornerstonejs_core__rspack_import_0.getShouldUseCPURendering)();
}
function shouldUseLazyLabelmapEditing(viewport) {
    return ((0,_config_js__rspack_import_1/* .getConfig */.zj)().segmentation?.overwriteMode !== undefined ||
        isCPUViewport(viewport));
}


},
12967(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  W: () => (ContourWindingDirection)
});
var ContourWindingDirection;
(function (ContourWindingDirection) {
    ContourWindingDirection[ContourWindingDirection["CounterClockwise"] = -1] = "CounterClockwise";
    ContourWindingDirection[ContourWindingDirection["Unknown"] = 0] = "Unknown";
    ContourWindingDirection[ContourWindingDirection["Clockwise"] = 1] = "Clockwise";
})(ContourWindingDirection || (ContourWindingDirection = {}));


},
45112(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  V: () => (addContourSegmentationAnnotation)
});
/* import */ var _stateManagement_annotation_annotationLocking_js__rspack_import_0 = __webpack_require__(3043);
/* import */ var _stateManagement_segmentation_getSegmentation_js__rspack_import_1 = __webpack_require__(99212);


function addContourSegmentationAnnotation(annotation) {
    if (annotation.parentAnnotationUID) {
        return;
    }
    if (!annotation.data.segmentation) {
        throw new Error('addContourSegmentationAnnotation: annotation does not have a segmentation data');
    }
    const { segmentationId, segmentIndex } = annotation.data.segmentation;
    const segmentation = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_1/* .getSegmentation */.T)(segmentationId);
    if (!segmentation.representationData.Contour) {
        segmentation.representationData.Contour = { annotationUIDsMap: new Map() };
    }
    let { annotationUIDsMap } = segmentation.representationData.Contour;
    if (!annotationUIDsMap) {
        annotationUIDsMap = new Map();
    }
    let annotationsUIDsSet = annotationUIDsMap?.get(segmentIndex);
    if (!annotationsUIDsSet) {
        annotationsUIDsSet = new Set();
        annotationUIDsMap.set(segmentIndex, annotationsUIDsSet);
    }
    if (segmentation.segments[segmentIndex].locked) {
        (0,_stateManagement_annotation_annotationLocking_js__rspack_import_0.setAnnotationLocked)(annotation.annotationUID, true);
    }
    annotationUIDsMap.set(segmentIndex, annotationsUIDsSet.add(annotation.annotationUID));
}


},
13127(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  M: () => (removeContourSegmentationAnnotation)
});
/* import */ var _stateManagement_segmentation_getSegmentation_js__rspack_import_0 = __webpack_require__(99212);

function removeContourSegmentationAnnotation(annotation) {
    if (!annotation.data.segmentation) {
        throw new Error('removeContourSegmentationAnnotation: annotation does not have a segmentation data');
    }
    const { segmentationId, segmentIndex } = annotation.data.segmentation;
    const segmentation = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_0/* .getSegmentation */.T)(segmentationId);
    const { annotationUIDsMap } = segmentation?.representationData.Contour || {};
    const annotationsUIDsSet = annotationUIDsMap?.get(segmentIndex);
    if (!annotationsUIDsSet) {
        return;
    }
    annotationsUIDsSet.delete(annotation.annotationUID);
    if (!annotationsUIDsSet.size) {
        annotationUIDsMap.delete(segmentIndex);
    }
}


},
32578(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ contours_AnnotationToPointData)
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/RectangleROIStartEndThreshold.js
class RectangleROIStartEndThreshold {
    constructor() {
    }
    static getContourSequence(toolData, metadataProvider) {
        const { data } = toolData;
        const { projectionPoints, projectionPointsImageIds } = data.cachedStats;
        return projectionPoints.map((point, index) => {
            const ContourData = getPointData(point);
            const ContourImageSequence = getContourImageSequence(projectionPointsImageIds[index], metadataProvider);
            return {
                NumberOfContourPoints: ContourData.length / 3,
                ContourImageSequence,
                ContourGeometricType: 'CLOSED_PLANAR',
                ContourData,
            };
        });
    }
}
RectangleROIStartEndThreshold.toolName = 'RectangleROIStartEndThreshold';
function getPointData(points) {
    const orderedPoints = [
        ...points[0],
        ...points[1],
        ...points[3],
        ...points[2],
    ];
    const pointsArray = orderedPoints.flat();
    const pointsArrayWithPrecision = pointsArray.map((point) => {
        return point.toFixed(2);
    });
    return pointsArrayWithPrecision;
}
function getContourImageSequence(imageId, metadataProvider) {
    const sopCommon = metadataProvider.get('sopCommonModule', imageId);
    return {
        ReferencedSOPClassUID: sopCommon.sopClassUID,
        ReferencedSOPInstanceUID: sopCommon.sopInstanceUID,
    };
}
/* export default */ const contours_RectangleROIStartEndThreshold = (RectangleROIStartEndThreshold);

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/AnnotationToPointData.js

function validateAnnotation(annotation) {
    if (!annotation?.data) {
        throw new Error('Tool data is empty');
    }
    if (!annotation.metadata || !annotation.metadata.referencedImageId) {
        throw new Error('Tool data is not associated with any imageId');
    }
}
class AnnotationToPointData {
    constructor() {
    }
    static convert(annotation, segment, metadataProvider) {
        validateAnnotation(annotation);
        const { toolName } = annotation.metadata;
        const toolClass = AnnotationToPointData.TOOL_NAMES[toolName];
        if (!toolClass) {
            throw new Error(`Unknown tool type: ${toolName}, cannot convert to RTSSReport`);
        }
        const contourSequence = toolClass.getContourSequence(annotation, metadataProvider);
        const color = segment.color?.slice(0, 3) || [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        ];
        return {
            ReferencedROINumber: segment.segmentIndex,
            ROIDisplayColor: color,
            ContourSequence: Array.isArray(contourSequence)
                ? contourSequence
                : [contourSequence],
        };
    }
    static register(toolClass) {
        AnnotationToPointData.TOOL_NAMES[toolClass.toolName] = toolClass;
    }
}
AnnotationToPointData.TOOL_NAMES = {};
AnnotationToPointData.register(contours_RectangleROIStartEndThreshold);
/* export default */ const contours_AnnotationToPointData = (AnnotationToPointData);


},
66128(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getContourHolesDataCanvas)
});
/* import */ var _getContourHolesDataWorld_js__rspack_import_0 = __webpack_require__(77734);

function getContourHolesDataCanvas(annotation, viewport) {
    const worldHoleContours = (0,_getContourHolesDataWorld_js__rspack_import_0/* ["default"] */.A)(annotation);
    const canvasHoleContours = [];
    worldHoleContours.forEach((worldHoleContour) => {
        const numPoints = worldHoleContour.length;
        const canvasHoleContour = new Array(numPoints);
        for (let i = 0; i < numPoints; i++) {
            canvasHoleContour[i] = viewport.worldToCanvas(worldHoleContour[i]);
        }
        canvasHoleContours.push(canvasHoleContour);
    });
    return canvasHoleContours;
}


},
77734(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getContourHolesDataWorld)
});
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_0 = __webpack_require__(44627);

function getContourHolesDataWorld(annotation) {
    const childAnnotationUIDs = annotation.childAnnotationUIDs ?? [];
    return childAnnotationUIDs.map((uid) => (0,_stateManagement_annotation_annotationState_js__rspack_import_0.getAnnotation)(uid).data.contour.polyline);
}


},
97836(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getInterpolationData)
});
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_0 = __webpack_require__(44627);

const DEFAULT_CONTOUR_SEG_TOOLNAME = 'PlanarFreehandContourSegmentationTool';
function getInterpolationData(viewportData, filterParams = []) {
    const { viewport, sliceData, annotation } = viewportData;
    const interpolationDatas = new Map();
    const { toolName, originalToolName } = annotation.metadata;
    const testToolName = originalToolName || toolName;
    const annotations = ((0,_stateManagement_annotation_annotationState_js__rspack_import_0.getAnnotations)(testToolName, viewport.element) || []).filter((annotation) => !annotation.metadata.originalToolName ||
        annotation.metadata.originalToolName === testToolName);
    if (testToolName !== DEFAULT_CONTOUR_SEG_TOOLNAME) {
        const modifiedAnnotations = (0,_stateManagement_annotation_annotationState_js__rspack_import_0.getAnnotations)(DEFAULT_CONTOUR_SEG_TOOLNAME, viewport.element);
        if (modifiedAnnotations?.length) {
            modifiedAnnotations.forEach((annotation) => {
                const { metadata } = annotation;
                if (metadata.originalToolName === testToolName &&
                    metadata.originalToolName !== metadata.toolName) {
                    annotations.push(annotation);
                }
            });
        }
    }
    if (!annotations?.length) {
        return interpolationDatas;
    }
    for (let i = 0; i < sliceData.numberOfSlices; i++) {
        const imageAnnotations = annotations.filter((x) => x.metadata.sliceIndex === i);
        if (!imageAnnotations?.length) {
            continue;
        }
        const filteredInterpolatedAnnotations = imageAnnotations.filter((imageAnnotation) => {
            return filterParams.every((x) => {
                const parent = x.parentKey
                    ? x.parentKey(imageAnnotation)
                    : imageAnnotation;
                const value = parent?.[x.key];
                if (Array.isArray(value)) {
                    return value.every((item, index) => item === x.value[index]);
                }
                return value === x.value;
            });
        });
        if (filteredInterpolatedAnnotations.length) {
            interpolationDatas.set(i, filteredInterpolatedAnnotations);
        }
    }
    return interpolationDatas;
}


},
8932(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getInterpolationDataCollection)
});
/* import */ var _getInterpolationData_js__rspack_import_0 = __webpack_require__(97836);

function getInterpolationDataCollection(viewportData, filterParams) {
    const imageAnnotations = (0,_getInterpolationData_js__rspack_import_0/* ["default"] */.A)(viewportData, filterParams);
    const interpolatedDataCollection = [];
    if (!imageAnnotations?.size) {
        return interpolatedDataCollection;
    }
    for (const annotations of imageAnnotations.values()) {
        annotations.forEach((annotation) => {
            interpolatedDataCollection.push(annotation);
        });
    }
    return interpolatedDataCollection;
}


},
37521(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ interpolation_interpolate)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var gl_matrix_esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/createPolylineToolData.js

function createPolylineToolData(polyline, handlePoints, referencedToolData) {
    const annotation = esm.utilities.deepMerge({
        data: {},
        metadata: {},
    }, referencedToolData);
    Object.assign(annotation, {
        highlighted: false,
        invalidated: true,
        autoGenerated: true,
        annotationUID: undefined,
        cachedStats: {},
        childAnnotationUIDs: [],
        parentAnnotationUID: undefined,
    });
    Object.assign(annotation.data, {
        handles: {
            points: handlePoints.points || handlePoints || [],
            interpolationSources: handlePoints.sources,
            activeHandleIndex: null,
            textBox: {
                hasMoved: false,
                worldPosition: [0, 0, 0],
                worldBoundingBox: {
                    topLeft: [0, 0, 0],
                    topRight: [0, 0, 0],
                    bottomLeft: [0, 0, 0],
                    bottomRight: [0, 0, 0],
                },
            },
        },
        contour: {
            ...referencedToolData.data.contour,
            polyline,
        },
    });
    return annotation;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/getInterpolationData.js
var getInterpolationData = __webpack_require__(97836);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/findAnnotationForInterpolation.js

function findAnnotationsForInterpolation(toolData, viewportData) {
    const interpolationData = (0,getInterpolationData/* ["default"] */.A)(viewportData, [
        {
            key: 'interpolationUID',
            value: viewportData.interpolationUID,
        },
    ]);
    const rangeToInterpolate = getRangeToInterpolate(interpolationData);
    if (!rangeToInterpolate) {
        console.warn('No annotations found to interpolate', interpolationData);
        return;
    }
    const sliceEdited = _getSlicePositionOfToolData(interpolationData, toolData.annotationUID);
    const interpolationList = [];
    for (let i = rangeToInterpolate[0] + 1; i < rangeToInterpolate[1]; i++) {
        if (_sliceNeedsInterpolating(interpolationData, i)) {
            const contourPair = _getBoundingPair(i, rangeToInterpolate, interpolationData);
            if (contourPair?.[0] === sliceEdited ||
                contourPair?.[1] === sliceEdited) {
                _appendInterpolationList(contourPair, interpolationList, i);
            }
        }
    }
    return {
        interpolationData,
        interpolationList,
    };
}
function getRangeToInterpolate(interpolationData) {
    let first = Infinity;
    let last = -Infinity;
    let found = false;
    for (const [sliceIndex, annotations] of interpolationData.entries()) {
        if (annotations.length) {
            first = Math.min(sliceIndex, first);
            last = Math.max(sliceIndex, last);
            found = true;
        }
    }
    if (!found) {
        return;
    }
    return [first, last];
}
function _getSlicePositionOfToolData(interpolationData, annotationUID) {
    for (const [sliceIndex, annotations] of interpolationData) {
        for (let j = 0; j < annotations.length; j++) {
            if (annotations[j].annotationUID === annotationUID) {
                return sliceIndex;
            }
        }
    }
    return;
}
function _sliceNeedsInterpolating(interpolationData, sliceIndex) {
    const annotations = interpolationData.get(sliceIndex);
    return (!annotations?.length ||
        (annotations.length === 1 && annotations[0].autoGenerated));
}
function _appendInterpolationList(contourPair, interpolationList, itemIndex) {
    const [startIndex] = contourPair;
    interpolationList[startIndex] ||= {
        pair: contourPair,
        list: [],
    };
    interpolationList[startIndex].list.push(itemIndex);
}
function _getBoundingPair(sliceIndex, sliceRange, interpolationData) {
    const annotationPair = [];
    let canInterpolate = true;
    for (let i = sliceIndex - 1; i >= sliceRange[0]; i--) {
        const annotations = interpolationData.get(i);
        if (annotations?.length) {
            if (annotations[0].autoGenerated) {
                continue;
            }
            if (annotations.length > 1) {
                canInterpolate = false;
            }
            annotationPair.push(i);
            break;
        }
    }
    if (!canInterpolate || !annotationPair.length) {
        return;
    }
    for (let i = sliceIndex + 1; i <= sliceRange[1]; i++) {
        const annotations = interpolationData.get(i);
        if (annotations?.length) {
            if (annotations[0].autoGenerated) {
                continue;
            }
            if (annotations.length > 1) {
                canInterpolate = false;
            }
            annotationPair.push(i);
            break;
        }
    }
    if (!canInterpolate || annotationPair.length < 2) {
        return;
    }
    return annotationPair;
}
/* export default */ const findAnnotationForInterpolation = (findAnnotationsForInterpolation);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Events.js
var Events = __webpack_require__(57290);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/index.js + 1 modules
var stateManagement_annotation = __webpack_require__(75995);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/selectHandles.js


const { PointsManager } = esm.utilities;
function selectHandles(polyline, options = {}) {
    const { handleCount = 12, isOpenUShapeContour } = options;
    const handles = PointsManager.create3(handleCount);
    handles.sources = [];
    const { sources: destPoints } = handles;
    const { length, sources: sourcePoints = [] } = polyline;
    const distance = 5;
    if (isOpenUShapeContour) {
        const handles = polyline.subselect(handleCount);
        handles.push(polyline.getPoint(polyline.length - 1));
        return handles;
    }
    if (length < distance * 3) {
        return polyline.subselect(handleCount);
    }
    const interval = Math.floor(Math.max((2 * length) / handleCount, distance * 2));
    sourcePoints.forEach(() => destPoints.push(PointsManager.create3(handleCount)));
    const dotValues = createDotValues(polyline, distance);
    const minimumRegions = findMinimumRegions(dotValues, handleCount);
    const indices = [];
    if (minimumRegions?.length > 2) {
        let lastHandle = -1;
        const thirdInterval = interval / 3;
        minimumRegions.forEach((region) => {
            const [start, , end] = region;
            const midIndex = Math.ceil((start + end) / 2);
            if (end - lastHandle < thirdInterval) {
                return;
            }
            if (midIndex - start > 2 * thirdInterval) {
                addInterval(indices, lastHandle, start, interval, length);
                lastHandle = addInterval(indices, start, midIndex, interval, length);
            }
            else {
                lastHandle = addInterval(indices, lastHandle, midIndex, interval, length);
            }
            if (end - lastHandle > thirdInterval) {
                lastHandle = addInterval(indices, lastHandle, end, interval, length);
            }
        });
        const firstHandle = indices[0];
        const lastDistance = indexValue(firstHandle + length - lastHandle, length);
        if (lastDistance > 2 * thirdInterval) {
            addInterval(indices, lastHandle, firstHandle - thirdInterval, interval, length);
        }
    }
    else {
        const interval = Math.floor(length / handleCount);
        addInterval(indices, -1, length - interval, interval, length);
    }
    indices.forEach((index) => {
        const point = polyline.getPointArray(index);
        handles.push(point);
        sourcePoints.forEach((source, destSourceIndex) => destPoints[destSourceIndex].push(source.getPoint(index)));
    });
    return handles;
}
function createDotValues(polyline, distance = 6) {
    const { length } = polyline;
    const prevVec3 = gl_matrix_esm/* .vec3.create */.eR.vt();
    const nextVec3 = gl_matrix_esm/* .vec3.create */.eR.vt();
    const dotValues = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        const point = polyline.getPoint(i);
        const prevPoint = polyline.getPoint(i - distance);
        const nextPoint = polyline.getPoint((i + distance) % length);
        gl_matrix_esm/* .vec3.sub */.eR.jb(prevVec3, point, prevPoint);
        gl_matrix_esm/* .vec3.sub */.eR.jb(nextVec3, nextPoint, point);
        const dot = gl_matrix_esm/* .vec3.dot */.eR.Om(prevVec3, nextVec3) / (gl_matrix_esm/* .vec3.len */.eR.Il(prevVec3) * gl_matrix_esm/* .vec3.len */.eR.Il(nextVec3));
        dotValues[i] = dot;
    }
    return dotValues;
}
function findMinimumRegions(dotValues, handleCount) {
    const { max, deviation } = getStats(dotValues);
    const { length } = dotValues;
    if (deviation < 0.01 || length < handleCount * 3) {
        return [];
    }
    const inflection = [];
    let pair = null;
    let minValue;
    let minIndex = 0;
    for (let i = 0; i < length; i++) {
        const dot = dotValues[i];
        if (dot < max - deviation) {
            if (pair) {
                pair[2] = i;
                if (dot < minValue) {
                    minValue = dot;
                    minIndex = i;
                }
                pair[1] = minIndex;
            }
            else {
                minValue = dot;
                minIndex = i;
                pair = [i, i, i];
            }
        }
        else {
            if (pair) {
                inflection.push(pair);
                pair = null;
            }
        }
    }
    if (pair) {
        if (inflection[0][0] === 0) {
            inflection[0][0] = pair[0];
        }
        else {
            pair[1] = minIndex;
            pair[2] = length - 1;
            inflection.push(pair);
        }
    }
    return inflection;
}
function addInterval(indices, start, finish, interval, length) {
    if (finish < start) {
        finish += length;
    }
    const distance = finish - start;
    const count = Math.ceil(distance / interval);
    if (count <= 0) {
        if (indices[indices.length - 1] !== finish) {
            indices.push(indexValue(finish, length));
        }
        return finish;
    }
    for (let i = 1; i <= count; i++) {
        const index = indexValue(start + (i * distance) / count, length);
        indices.push(index);
    }
    return indices[indices.length - 1];
}
function indexValue(v, length) {
    return (Math.round(v) + length) % length;
}
function getStats(dotValues) {
    const { length } = dotValues;
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    let sumSq = 0;
    for (let i = 0; i < length; i++) {
        const dot = dotValues[i];
        sum += dot;
        min = Math.min(min, dot);
        max = Math.max(max, dot);
    }
    const mean = sum / length;
    for (let i = 0; i < length; i++) {
        const valueDiff = dotValues[i] - mean;
        sumSq += valueDiff * valueDiff;
    }
    return {
        mean,
        max,
        min,
        sumSq,
        deviation: Math.sqrt(sumSq / length),
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/updateChildInterpolationUID.js

function updateChildInterpolationUID(annotation) {
    const { parentAnnotationUID, annotationUID } = annotation;
    if (!parentAnnotationUID) {
        return annotation.interpolationUID;
    }
    const parentAnnotation = stateManagement_annotation.state.getAnnotation(parentAnnotationUID);
    const { interpolationUID } = parentAnnotation;
    const index = parentAnnotation.childAnnotationUIDs.indexOf(annotationUID);
    annotation.interpolationUID = `${interpolationUID}-${index}`;
    return annotation.interpolationUID;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/index.js
var contourSegmentation = __webpack_require__(67846);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/interpolate.js









const { PointsManager: interpolate_PointsManager } = esm.utilities;
const dP = 0.2;
function interpolate(viewportData) {
    if (!viewportData.annotation) {
        return;
    }
    const { isInterpolationUpdate, annotation } = viewportData;
    queueMicrotask(() => {
        try {
            if (isInterpolationUpdate) {
                annotation.isInterpolationUpdate = true;
                annotation.autoGenerated = false;
            }
            startInterpolation(viewportData);
        }
        finally {
            if (isInterpolationUpdate) {
                annotation.autoGenerated = true;
            }
        }
    });
}
function startInterpolation(viewportData) {
    const { annotation: toolData } = viewportData;
    updateChildInterpolationUID(toolData);
    const { interpolationData, interpolationList } = findAnnotationForInterpolation(toolData, viewportData) || {};
    if (!interpolationData || !interpolationList) {
        return;
    }
    const eventData = {
        toolName: toolData.metadata.toolName,
        toolType: toolData.metadata.toolName,
        viewport: viewportData.viewport,
    };
    for (let i = 0; i < interpolationList.length; i++) {
        if (interpolationList[i]) {
            _linearlyInterpolateBetween(interpolationList[i].list, interpolationList[i].pair, interpolationData, eventData);
        }
    }
    const { id, renderingEngineId, element } = viewportData.viewport;
    const eventDetails = {
        annotation: toolData,
        element,
        viewportId: id,
        renderingEngineId,
    };
    if (interpolationList.length) {
        (0,esm.triggerEvent)(viewportData.viewport.element, Events/* ["default"].ANNOTATION_INTERPOLATION_PROCESS_COMPLETED */.A.ANNOTATION_INTERPOLATION_PROCESS_COMPLETED, eventDetails);
        (0,esm.triggerEvent)(esm.eventTarget, Events/* ["default"].ANNOTATION_INTERPOLATION_PROCESS_COMPLETED */.A.ANNOTATION_INTERPOLATION_PROCESS_COMPLETED, eventDetails);
    }
}
function _linearlyInterpolateBetween(indices, annotationPair, interpolationData, eventData) {
    const annotation0 = interpolationData.get(annotationPair[0])[0];
    const annotation1 = interpolationData.get(annotationPair[1])[0];
    const c1 = _generateClosedContour(annotation0.data.contour.polyline);
    const c2 = _generateClosedContour(annotation1.data.contour.polyline);
    console.warn('annotation0=', annotation0);
    const { c1Interp, c2Interp } = _generateInterpolationContourPair(c1, c2);
    c1Interp.kIndex = annotationPair[0];
    c2Interp.kIndex = annotationPair[1];
    indices.forEach(function (index) {
        _linearlyInterpolateContour(c1Interp, c2Interp, index, annotationPair, interpolationData, c1.x.length > c2.x.length, eventData);
    });
}
function _linearlyInterpolateContour(c1Interp, c2Interp, sliceIndex, annotationPair, interpolationData, c1HasMoreNodes, eventData) {
    const [startIndex, endIndex] = annotationPair;
    const zInterp = (sliceIndex - startIndex) / (endIndex - startIndex);
    const annotation0 = interpolationData.get(startIndex)[0];
    const annotation1 = interpolationData.get(endIndex)[0];
    const interpolated3DPoints = _generateInterpolatedOpenContour(c1Interp, c2Interp, zInterp, c1HasMoreNodes);
    const nearestAnnotation = zInterp > 0.5 ? annotation1 : annotation0;
    const isOpenUShapeContour = nearestAnnotation.data.isOpenUShapeContour;
    const handlePoints = selectHandles(interpolated3DPoints, {
        isOpenUShapeContour,
    });
    if (interpolationData.has(sliceIndex)) {
        _editInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, nearestAnnotation, eventData);
    }
    else {
        _addInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, nearestAnnotation, eventData);
    }
}
function _addInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, referencedToolData, eventData) {
    const points = interpolated3DPoints.points;
    const { viewport } = eventData;
    const interpolatedAnnotation = createPolylineToolData(points, handlePoints, referencedToolData);
    const viewRef = viewport.getViewReference({ sliceIndex });
    if (!viewRef) {
        throw new Error(`Can't find slice ${sliceIndex}`);
    }
    Object.assign(interpolatedAnnotation.metadata, viewRef);
    stateManagement_annotation.state.addAnnotation(interpolatedAnnotation, viewport.element);
    referencedToolData.onInterpolationComplete?.(interpolatedAnnotation, referencedToolData);
    const { parentAnnotationUID } = referencedToolData;
    if (parentAnnotationUID) {
        const parentReferenced = stateManagement_annotation.state.getAnnotation(parentAnnotationUID);
        const parentAnnotation = _findExistingAnnotation(parentReferenced, sliceIndex, eventData);
        (0,contourSegmentation.createPolylineHole)(viewport, parentAnnotation, interpolatedAnnotation);
    }
}
function _findExistingAnnotation(referencedToolData, sliceIndex, eventData) {
    const { viewport } = eventData;
    const annotations = stateManagement_annotation.state.getAnnotations(referencedToolData.metadata.toolName, viewport.element);
    for (let i = 0; i < annotations.length; i++) {
        const annotation = annotations[i];
        if (annotation.interpolationUID === referencedToolData.interpolationUID &&
            annotation.metadata.sliceIndex === sliceIndex) {
            return annotation;
        }
    }
}
function _editInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, referencedToolData, eventData) {
    const oldAnnotationData = _findExistingAnnotation(referencedToolData, sliceIndex, eventData);
    const points = interpolated3DPoints.points;
    const interpolatedAnnotation = createPolylineToolData(points, handlePoints, oldAnnotationData);
    Object.assign(oldAnnotationData, {
        metadata: interpolatedAnnotation.metadata,
        data: interpolatedAnnotation.data,
    });
}
function _generateInterpolatedOpenContour(c1ir, c2ir, zInterp, c1HasMoreNodes) {
    const indices = c1HasMoreNodes ? c1ir.I : c2ir.I;
    const c1 = interpolate_PointsManager.fromXYZ(c1ir);
    const c2 = interpolate_PointsManager.fromXYZ(c2ir);
    const { length } = c1;
    const cInterp = interpolate_PointsManager.create3(length);
    const vecSubtract = gl_matrix_esm/* .vec3.create */.eR.vt();
    const vecResult = gl_matrix_esm/* .vec3.create */.eR.vt();
    const c1Source = interpolate_PointsManager.create3(length);
    c1Source.kIndex = c1ir.kIndex;
    const c2Source = interpolate_PointsManager.create3(length);
    c2Source.kIndex = c2ir.kIndex;
    for (let i = 0; i < c1ir.x.length; i++) {
        if (indices[i]) {
            const c1point = c1.getPoint(i);
            const c2point = c2.getPoint(i);
            c1Source.push(c1point);
            c2Source.push(c2point);
            gl_matrix_esm/* .vec3.sub */.eR.jb(vecSubtract, c2point, c1point);
            cInterp.push(gl_matrix_esm/* .vec3.scaleAndAdd */.eR.Ln(vecResult, c1point, vecSubtract, zInterp));
        }
    }
    cInterp.sources = [c1Source, c2Source];
    return cInterp;
}
function _generateInterpolationContourPair(c1, c2) {
    const cumPerim1 = _getCumulativePerimeter(c1);
    const cumPerim2 = _getCumulativePerimeter(c2);
    const interpNodes = Math.max(Math.ceil(cumPerim1[cumPerim1.length - 1] / dP), Math.ceil(cumPerim2[cumPerim2.length - 1] / dP));
    const cumPerim1Norm = _normalisedCumulativePerimeter(cumPerim1);
    const cumPerim2Norm = _normalisedCumulativePerimeter(cumPerim2);
    const numNodes1 = interpNodes + c2.x.length;
    const numNodes2 = interpNodes + c1.x.length;
    const perim1Interp = _getInterpolatedPerim(numNodes1, cumPerim1Norm);
    const perim2Interp = _getInterpolatedPerim(numNodes2, cumPerim2Norm);
    const perim1Ind = _getIndicatorArray(numNodes1 - 2, c1.x.length);
    const perim2Ind = _getIndicatorArray(numNodes2 - 2, c2.x.length);
    const nodesPerSegment1 = _getNodesPerSegment(perim1Interp, perim1Ind);
    const nodesPerSegment2 = _getNodesPerSegment(perim2Interp, perim2Ind);
    const c1i = _getSuperSampledContour(c1, nodesPerSegment1);
    const c2i = _getSuperSampledContour(c2, nodesPerSegment2);
    _shiftSuperSampledContourInPlace(c1i, c2i);
    return _reduceContoursToOriginNodes(c1i, c2i);
}
function _reduceContoursToOriginNodes(c1i, c2i) {
    const c1Interp = {
        x: [],
        y: [],
        z: [],
        I: [],
    };
    const c2Interp = {
        x: [],
        y: [],
        z: [],
        I: [],
    };
    for (let i = 0; i < c1i.x.length; i++) {
        if (c1i.I[i] || c2i.I[i]) {
            c1Interp.x.push(c1i.x[i]);
            c1Interp.y.push(c1i.y[i]);
            c1Interp.z.push(c1i.z[i]);
            c1Interp.I.push(c1i.I[i]);
            c2Interp.x.push(c2i.x[i]);
            c2Interp.y.push(c2i.y[i]);
            c2Interp.z.push(c2i.z[i]);
            c2Interp.I.push(c2i.I[i]);
        }
    }
    return {
        c1Interp,
        c2Interp,
    };
}
function _shiftSuperSampledContourInPlace(c1i, c2i) {
    const c1iLength = c1i.x.length;
    const optimal = {
        startingNode: 0,
        totalSquaredXYLengths: Infinity,
    };
    for (let startingNode = 0; startingNode < c1iLength; startingNode++) {
        let node = startingNode;
        let totalSquaredXYLengths = 0;
        for (let iteration = 0; iteration < c1iLength; iteration++) {
            totalSquaredXYLengths +=
                (c1i.x[node] - c2i.x[iteration]) ** 2 +
                    (c1i.y[node] - c2i.y[iteration]) ** 2 +
                    (c1i.z[node] - c2i.z[iteration]) ** 2;
            node++;
            if (node === c1iLength) {
                node = 0;
            }
        }
        if (totalSquaredXYLengths < optimal.totalSquaredXYLengths) {
            optimal.totalSquaredXYLengths = totalSquaredXYLengths;
            optimal.startingNode = startingNode;
        }
    }
    const node = optimal.startingNode;
    _shiftCircularArray(c1i.x, node);
    _shiftCircularArray(c1i.y, node);
    _shiftCircularArray(c1i.z, node);
    _shiftCircularArray(c1i.I, node);
}
function _shiftCircularArray(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    const slicedArray = arr.splice(0, count);
    arr.push(...slicedArray);
    return arr;
}
function _getSuperSampledContour(c, nodesPerSegment) {
    const ci = {
        x: [],
        y: [],
        z: [],
        I: [],
    };
    for (let n = 0; n < c.x.length - 1; n++) {
        ci.x.push(c.x[n]);
        ci.y.push(c.y[n]);
        ci.z.push(c.z[n]);
        ci.I.push(true);
        const xSpacing = (c.x[n + 1] - c.x[n]) / (nodesPerSegment[n] + 1);
        const ySpacing = (c.y[n + 1] - c.y[n]) / (nodesPerSegment[n] + 1);
        const zSpacing = (c.z[n + 1] - c.z[n]) / (nodesPerSegment[n] + 1);
        for (let i = 0; i < nodesPerSegment[n] - 1; i++) {
            ci.x.push(ci.x[ci.x.length - 1] + xSpacing);
            ci.y.push(ci.y[ci.y.length - 1] + ySpacing);
            ci.z.push(ci.z[ci.z.length - 1] + zSpacing);
            ci.I.push(false);
        }
    }
    return ci;
}
function _getNodesPerSegment(perimInterp, perimInd) {
    const idx = [];
    for (let i = 0; i < perimInterp.length; ++i) {
        idx[i] = i;
    }
    idx.sort(function (a, b) {
        return perimInterp[a] < perimInterp[b] ? -1 : 1;
    });
    const perimIndSorted = [];
    for (let i = 0; i < perimInd.length; i++) {
        perimIndSorted.push(perimInd[idx[i]]);
    }
    const indicesOfOriginNodes = perimIndSorted.reduce(function (arr, elementValue, i) {
        if (elementValue) {
            arr.push(i);
        }
        return arr;
    }, []);
    const nodesPerSegment = [];
    for (let i = 0; i < indicesOfOriginNodes.length - 1; i++) {
        nodesPerSegment.push(indicesOfOriginNodes[i + 1] - indicesOfOriginNodes[i]);
    }
    return nodesPerSegment;
}
function _getIndicatorArray(numFalse, numTrue) {
    const perimInd = new Array(numFalse + numTrue);
    perimInd.fill(false, 0, numFalse);
    perimInd.fill(true, numFalse, numFalse + numTrue);
    return perimInd;
}
function _getInterpolatedPerim(numNodes, cumPerimNorm) {
    const diff = 1 / (numNodes - 1);
    const linspace = [diff];
    for (let i = 1; i < numNodes - 2; i++) {
        linspace.push(linspace[linspace.length - 1] + diff);
    }
    return linspace.concat(cumPerimNorm);
}
function _normalisedCumulativePerimeter(cumPerim) {
    const cumPerimNorm = [];
    for (let i = 0; i < cumPerim.length; i++) {
        cumPerimNorm.push(cumPerim[i] / cumPerim[cumPerim.length - 1]);
    }
    return cumPerimNorm;
}
function _getCumulativePerimeter(contour) {
    const cumulativePerimeter = [0];
    for (let i = 1; i < contour.x.length; i++) {
        const lengthOfSegment = Math.sqrt((contour.x[i] - contour.x[i - 1]) ** 2 +
            (contour.y[i] - contour.y[i - 1]) ** 2 +
            (contour.z[i] - contour.z[i - 1]) ** 2);
        cumulativePerimeter.push(cumulativePerimeter[i - 1] + lengthOfSegment);
    }
    return cumulativePerimeter;
}
function _generateClosedContour(points) {
    const c = {
        x: [],
        y: [],
        z: [],
    };
    for (let i = 0; i < points.length; i++) {
        c.x[i] = points[i][0];
        c.y[i] = points[i][1];
        c.z[i] = points[i][2];
    }
    c.x.push(c.x[0]);
    c.y.push(c.y[0]);
    c.z.push(c.z[0]);
    return c;
}
/* export default */ const interpolation_interpolate = (interpolate);


},
25732(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (updateContourPolyline)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _math_index_js__rspack_import_1 = __webpack_require__(44292);
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_2 = __webpack_require__(44627);



function updateContourPolyline(annotation, polylineData, transforms, options) {
    const { canvasToWorld, worldToCanvas } = transforms;
    const { data } = annotation;
    const { targetWindingDirection } = polylineData;
    let { points: polyline } = polylineData;
    let windingDirection = _math_index_js__rspack_import_1.polyline.getWindingDirection(polyline);
    if (options?.decimate?.enabled) {
        polyline = _math_index_js__rspack_import_1.polyline.decimate(polylineData.points, options?.decimate?.epsilon);
    }
    let { closed } = polylineData;
    const numPoints = polyline.length;
    const polylineWorldPoints = new Array(numPoints);
    const currentPolylineWindingDirection = _math_index_js__rspack_import_1.polyline.getWindingDirection(polyline);
    const parentAnnotation = (0,_stateManagement_annotation_annotationState_js__rspack_import_2.getParentAnnotation)(annotation);
    if (closed === undefined) {
        let currentClosedState = false;
        if (polyline.length > 3) {
            const lastToFirstDist = _math_index_js__rspack_import_1.point.distanceToPointSquared(polyline[0], polyline[numPoints - 1]);
            currentClosedState = _cornerstonejs_core__rspack_import_0.utilities.isEqual(0, lastToFirstDist);
        }
        closed = currentClosedState;
    }
    if (options?.updateWindingDirection !== false) {
        let updatedWindingDirection = parentAnnotation
            ? parentAnnotation.data.contour.windingDirection * -1
            : targetWindingDirection;
        if (updatedWindingDirection === undefined) {
            updatedWindingDirection = windingDirection;
        }
        if (updatedWindingDirection !== windingDirection) {
            polyline.reverse();
        }
        const handlePoints = (data.handles?.points ?? []).map(worldToCanvas);
        if (handlePoints.length > 2) {
            const currentHandlesWindingDirection = _math_index_js__rspack_import_1.polyline.getWindingDirection(handlePoints);
            if (currentHandlesWindingDirection !== updatedWindingDirection) {
                data.handles.points.reverse();
            }
        }
        windingDirection = updatedWindingDirection;
    }
    for (let i = 0; i < numPoints; i++) {
        polylineWorldPoints[i] = canvasToWorld(polyline[i]);
    }
    data.contour.polyline = polylineWorldPoints;
    data.contour.closed = closed;
    data.contour.windingDirection = windingDirection;
    (0,_stateManagement_annotation_annotationState_js__rspack_import_2.invalidateAnnotation)(annotation);
}


},
40865(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  N: () => (getPixelValueUnitsImageId),
  j: () => (getPixelValueUnits)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function getPixelValueUnitsImageId(imageId, options) {
    const generalSeriesModule = _cornerstonejs_core__rspack_import_0.metaData.get('generalSeriesModule', imageId);
    return getPixelValueUnits(generalSeriesModule.modality, imageId, options);
}
function getPixelValueUnits(modality, imageId, options) {
    if (modality === 'CT') {
        return 'HU';
    }
    else if (modality === 'PT') {
        return _handlePTModality(imageId, options);
    }
    else {
        return '';
    }
}
function _handlePTModality(imageId, options) {
    if (!options.isPreScaled) {
        return 'raw';
    }
    if (options.isSuvScaled) {
        return 'SUV';
    }
    const generalSeriesModule = _cornerstonejs_core__rspack_import_0.metaData.get('generalSeriesModule', imageId);
    if (generalSeriesModule?.modality === 'PT') {
        const petSeriesModule = _cornerstonejs_core__rspack_import_0.metaData.get('petSeriesModule', imageId);
        return petSeriesModule?.units || 'unitless';
    }
    return 'unknown';
}



},
41891(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getViewportICamera)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function getViewportICamera(viewport, viewReference = viewport.getViewReference()) {
    const camera = ((_cornerstonejs_core__rspack_import_0.utilities.isGenericViewport(viewport)
        ? viewport.getResolvedView()?.toICamera()
        : undefined) ||
        viewport.getCamera?.() ||
        {});
    const focalPoint = _cornerstonejs_core__rspack_import_0.utilities.clonePoint3(viewReference?.cameraFocalPoint || camera.focalPoint);
    const viewPlaneNormal = _cornerstonejs_core__rspack_import_0.utilities.clonePoint3(viewReference?.viewPlaneNormal || camera.viewPlaneNormal);
    const viewUp = _cornerstonejs_core__rspack_import_0.utilities.clonePoint3(viewReference?.viewUp || camera.viewUp);
    const position = _cornerstonejs_core__rspack_import_0.utilities.clonePoint3(camera.position ||
        (focalPoint &&
            viewPlaneNormal && [
            focalPoint[0] - viewPlaneNormal[0],
            focalPoint[1] - viewPlaneNormal[1],
            focalPoint[2] - viewPlaneNormal[2],
        ]));
    return {
        focalPoint,
        position,
        viewPlaneNormal,
        viewUp,
    };
}


},
69458(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getViewportsForAnnotation)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _getViewportICamera_js__rspack_import_1 = __webpack_require__(41891);


const { isEqual } = _cornerstonejs_core__rspack_import_0.utilities;
function getViewportsForAnnotation(annotation) {
    const { metadata } = annotation;
    return (0,_cornerstonejs_core__rspack_import_0.getEnabledElements)()
        .filter((enabledElement) => {
        if (enabledElement.FrameOfReferenceUID === metadata.FrameOfReferenceUID) {
            const viewport = enabledElement.viewport;
            const { viewPlaneNormal, viewUp } = (0,_getViewportICamera_js__rspack_import_1/* ["default"] */.A)(viewport);
            if (!viewPlaneNormal) {
                return false;
            }
            return (isEqual(viewPlaneNormal, metadata.viewPlaneNormal) &&
                (!metadata.viewUp || isEqual(viewUp, metadata.viewUp)));
        }
        return;
    })
        .map((enabledElement) => enabledElement.viewport);
}


},
75864(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (containsPoint)
});
/* import */ var _isClosed_js__rspack_import_0 = __webpack_require__(19977);

function containsPoint(polyline, point, options = {
    closed: undefined,
}) {
    if (polyline.length < 3) {
        return false;
    }
    const numPolylinePoints = polyline.length;
    let numIntersections = 0;
    const { closed, holes } = options;
    if (holes?.length) {
        for (const hole of holes) {
            if (containsPoint(hole, point)) {
                return false;
            }
        }
    }
    const shouldClose = !(closed === undefined ? (0,_isClosed_js__rspack_import_0/* ["default"] */.A)(polyline) : closed);
    const maxSegmentIndex = polyline.length - (shouldClose ? 1 : 2);
    for (let i = 0; i <= maxSegmentIndex; i++) {
        const p1 = polyline[i];
        const p2Index = i === numPolylinePoints - 1 ? 0 : i + 1;
        const p2 = polyline[p2Index];
        const maxX = p1[0] >= p2[0] ? p1[0] : p2[0];
        const maxY = p1[1] >= p2[1] ? p1[1] : p2[1];
        const minY = p1[1] <= p2[1] ? p1[1] : p2[1];
        const mayIntersectLineSegment = point[0] <= maxX && point[1] >= minY && point[1] < maxY;
        if (mayIntersectLineSegment) {
            const isVerticalLine = p1[0] === p2[0];
            let intersects = isVerticalLine;
            if (!intersects) {
                const xIntersection = ((point[1] - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]) + p1[0];
                intersects = point[0] <= xIntersection;
            }
            numIntersections += intersects ? 1 : 0;
        }
    }
    return !!(numIntersections % 2);
}


},
77360(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (getSignedArea)
});
function getSignedArea(polyline) {
    if (polyline.length < 3) {
        return 0;
    }
    const refPoint = polyline[0];
    let area = 0;
    for (let i = 0, len = polyline.length; i < len; i++) {
        const p1 = polyline[i];
        const p2Index = i === len - 1 ? 0 : i + 1;
        const p2 = polyline[p2Index];
        const aX = p1[0] - refPoint[0];
        const aY = p1[1] - refPoint[1];
        const bX = p2[0] - refPoint[0];
        const bY = p2[1] - refPoint[1];
        area += aX * bY - aY * bX;
    }
    area *= 0.5;
    return area;
}


},
19977(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (isClosed)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _point_index_js__rspack_import_1 = __webpack_require__(71659);


function isClosed(polyline) {
    if (polyline.length < 3) {
        return false;
    }
    const numPolylinePoints = polyline.length;
    const firstPoint = polyline[0];
    const lastPoint = polyline[numPolylinePoints - 1];
    const distFirstToLastPoints = (0,_point_index_js__rspack_import_1.distanceToPointSquared)(firstPoint, lastPoint);
    return gl_matrix__rspack_import_0/* .glMatrix.equals */.Fd.aI(0, distFirstToLastPoints);
}


},
40349(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (filterAnnotationsForDisplay)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _filterAnnotationsWithinSlice_js__rspack_import_1 = __webpack_require__(90947);
/* import */ var _getViewportICamera_js__rspack_import_2 = __webpack_require__(41891);



function filterAnnotationsForDisplay(viewport, annotations, filterOptions = {}) {
    const isLegacyVolume = viewport instanceof _cornerstonejs_core__rspack_import_0.VolumeViewport;
    const isNativeVolume = _cornerstonejs_core__rspack_import_0.utilities.getViewportContentMode(viewport) === 'volume';
    if (isLegacyVolume || isNativeVolume) {
        const camera = isLegacyVolume
            ? viewport.getCamera()
            : (0,_getViewportICamera_js__rspack_import_2/* ["default"] */.A)(viewport);
        const { spacingInNormalDirection } = _cornerstonejs_core__rspack_import_0.utilities.getTargetVolumeAndSpacingInNormalDir(viewport, camera);
        return (0,_filterAnnotationsWithinSlice_js__rspack_import_1/* ["default"] */.A)(annotations, camera, spacingInNormalDirection);
    }
    if (viewport instanceof _cornerstonejs_core__rspack_import_0.StackViewport) {
        const imageId = viewport.getCurrentImageId();
        if (!imageId) {
            return [];
        }
        const colonIndex = imageId.indexOf(':');
        filterOptions.imageURI = imageId.substring(colonIndex + 1);
    }
    return annotations.filter((annotation) => {
        if (!annotation.isVisible) {
            return false;
        }
        if (annotation.data.isCanvasAnnotation) {
            return true;
        }
        return viewport.isReferenceViewable(annotation.metadata, filterOptions);
    });
}


},
9578(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Q: () => (shouldSmooth),
  p: () => (getInterpolatedPoints)
});
/* import */ var _math_index_js__rspack_import_0 = __webpack_require__(44292);
/* import */ var _interpolation_interpolateSegmentPoints_js__rspack_import_1 = __webpack_require__(50627);


function shouldSmooth(configuration, annotation) {
    if (annotation?.autoGenerated) {
        return false;
    }
    const shouldSmooth = configuration?.smoothing?.smoothOnAdd === true ||
        configuration?.smoothing?.smoothOnEdit === true;
    return shouldSmooth;
}
function isEqualByProximity(pointA, pointB) {
    return _math_index_js__rspack_import_0.point.distanceToPoint(pointA, pointB) < 0.001;
}
function isEqual(pointA, pointB) {
    return _math_index_js__rspack_import_0.point.distanceToPoint(pointA, pointB) === 0;
}
function findMatchIndexes(points, otherPoints) {
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < otherPoints.length; j++) {
            if (isEqual(points[i], otherPoints[j])) {
                return [i, j];
            }
        }
    }
}
function followingIndex(index, size, direction) {
    return (index + size + direction) % size;
}
function circularFindNextIndexBy(listParams, otherListParams, criteria, direction) {
    const [, indexDelimiter, points] = listParams;
    const [, otherIndexDelimiter, otherPoints] = otherListParams;
    const pointsLength = points.length;
    const otherPointsLength = otherPoints.length;
    let startIndex = listParams[0];
    let otherStartIndex = otherListParams[0];
    if (!points[startIndex] ||
        !otherPoints[otherStartIndex] ||
        !points[indexDelimiter] ||
        !otherPoints[otherIndexDelimiter]) {
        return [undefined, undefined];
    }
    while (startIndex !== indexDelimiter &&
        otherStartIndex !== otherIndexDelimiter) {
        if (criteria(otherPoints[otherStartIndex], points[startIndex])) {
            return [startIndex, otherStartIndex];
        }
        startIndex = followingIndex(startIndex, pointsLength, direction);
        otherStartIndex = followingIndex(otherStartIndex, otherPointsLength, direction);
    }
    return [undefined, undefined];
}
function findChangedSegment(points, previousPoints) {
    const [firstMatchIndex, previousFirstMatchIndex] = findMatchIndexes(points, previousPoints) || [];
    const toBeNotEqualCriteria = (pointA, pointB) => isEqualByProximity(pointA, pointB) === false;
    const [lowDiffIndex, lowOtherDiffIndex] = circularFindNextIndexBy([
        followingIndex(firstMatchIndex, points.length, 1),
        firstMatchIndex,
        points,
    ], [
        followingIndex(previousFirstMatchIndex, previousPoints.length, 1),
        previousFirstMatchIndex,
        previousPoints,
    ], toBeNotEqualCriteria, 1);
    const [highIndex] = circularFindNextIndexBy([followingIndex(lowDiffIndex, points.length, -1), lowDiffIndex, points], [
        followingIndex(lowOtherDiffIndex, previousPoints.length, -1),
        lowOtherDiffIndex,
        previousPoints,
    ], toBeNotEqualCriteria, -1);
    return [lowDiffIndex, highIndex];
}
function getInterpolatedPoints(configuration, points, pointsOfReference) {
    const { interpolation, smoothing } = configuration;
    const result = points;
    if (interpolation) {
        const { knotsRatioPercentageOnAdd, knotsRatioPercentageOnEdit, smoothOnAdd = false, smoothOnEdit = false, } = smoothing;
        const knotsRatioPercentage = pointsOfReference
            ? knotsRatioPercentageOnEdit
            : knotsRatioPercentageOnAdd;
        const isEnabled = pointsOfReference ? smoothOnEdit : smoothOnAdd;
        if (isEnabled) {
            const [changedIniIndex, changedEndIndex] = pointsOfReference
                ? findChangedSegment(points, pointsOfReference)
                : [0, points.length - 1];
            if (!points[changedIniIndex] || !points[changedEndIndex]) {
                return points;
            }
            return ((0,_interpolation_interpolateSegmentPoints_js__rspack_import_1/* ["default"] */.A)(points, changedIniIndex, changedEndIndex, knotsRatioPercentage));
        }
    }
    return result;
}


},
44925(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  D: () => (registerComputeWorker)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _config_js__rspack_import_1 = __webpack_require__(2782);


let registered = false;
function registerComputeWorker() {
    if (registered) {
        return;
    }
    registered = true;
    const workerFn = () => {
        return new Worker(new URL(/* worker import */__webpack_require__.p + __webpack_require__.u(8547), __webpack_require__.b), Object.assign({}, {
            name: 'compute',
            type: 'module',
        }, { type: undefined }));
    };
    const workerManager = (0,_cornerstonejs_core__rspack_import_0.getWebWorkerManager)();
    const config = (0,_config_js__rspack_import_1/* .getConfig */.zj)();
    const computeWorkerConfig = config.computeWorker;
    const options = {
        maxWorkerInstances: 1,
        autoTerminateOnIdle: computeWorkerConfig?.autoTerminateOnIdle ?? {
            enabled: true,
            idleTimeThreshold: 2000,
        },
    };
    workerManager.registerWorker('compute', workerFn, options);
}


},
86198(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (deleteRelatedAnnotations)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _stateManagement_annotation_index_js__rspack_import_1 = __webpack_require__(75995);
/* import */ var _contours_interpolation_interpolate_js__rspack_import_2 = __webpack_require__(37521);
/* import */ var _contours_interpolation_getInterpolationData_js__rspack_import_3 = __webpack_require__(97836);
/* import */ var _enums_Events_js__rspack_import_4 = __webpack_require__(57290);





function deleteRelatedAnnotations(viewportData) {
    const { annotation } = viewportData;
    const interpolationAnnotations = (0,_contours_interpolation_getInterpolationData_js__rspack_import_3/* ["default"] */.A)(viewportData, [
        { key: 'interpolationUID', value: viewportData.interpolationUID },
    ]);
    const referencedSliceIndex = annotation.metadata.sliceIndex;
    let minInterpolation = -1;
    let maxInterpolation = viewportData.sliceData.numberOfSlices;
    for (const [sliceIndex, annotations] of interpolationAnnotations.entries()) {
        if (sliceIndex === referencedSliceIndex) {
            continue;
        }
        const nonInterpolated = annotations.find((annotation) => !annotation.autoGenerated);
        if (!nonInterpolated) {
            continue;
        }
        if (sliceIndex < referencedSliceIndex) {
            minInterpolation = Math.max(sliceIndex, minInterpolation);
        }
        else {
            maxInterpolation = Math.min(sliceIndex, maxInterpolation);
        }
    }
    const removedAnnotations = [];
    for (const [sliceIndex, annotations] of interpolationAnnotations.entries()) {
        if (sliceIndex <= minInterpolation ||
            sliceIndex >= maxInterpolation ||
            sliceIndex === referencedSliceIndex) {
            continue;
        }
        annotations.forEach((annotationToDelete) => {
            if (annotationToDelete.autoGenerated) {
                _stateManagement_annotation_index_js__rspack_import_1.state.removeAnnotation(annotationToDelete.annotationUID);
                removedAnnotations.push(annotationToDelete);
            }
        });
    }
    if (removedAnnotations.length) {
        const eventDetails = {
            annotations: removedAnnotations,
            element: viewportData.viewport.element,
            viewportId: viewportData.viewport.id,
            renderingEngineId: viewportData.viewport.getRenderingEngine().id,
        };
        (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(viewportData.viewport.element, _enums_Events_js__rspack_import_4/* ["default"].INTERPOLATED_ANNOTATIONS_REMOVED */.A.INTERPOLATED_ANNOTATIONS_REMOVED, eventDetails);
    }
    if (minInterpolation >= 0 &&
        maxInterpolation < viewportData.sliceData.numberOfSlices) {
        const nextAnnotation = interpolationAnnotations.get(maxInterpolation)[0];
        const viewportNewData = {
            viewport: viewportData.viewport,
            sliceData: {
                numberOfSlices: viewportData.sliceData.numberOfSlices,
                imageIndex: nextAnnotation.metadata.sliceIndex,
            },
            annotation: nextAnnotation,
            interpolationUID: nextAnnotation.interpolationUID,
        };
        (0,_contours_interpolation_interpolate_js__rspack_import_2/* ["default"] */.A)(viewportNewData);
    }
}


},
46450(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (__rspack_default_export),
  C3: () => (InstanceVolumetricCalculator)
});
/* import */ var _math_basic_BasicStatsCalculator_js__rspack_import_0 = __webpack_require__(14820);
/* import */ var _getCalibratedUnits_js__rspack_import_1 = __webpack_require__(3675);


const TEST_MAX_LOCATIONS = 10;
function createVolumetricState() {
    return {
        maxIJKs: [],
    };
}
function volumetricStatsCallback(state, data) {
    const { value } = data;
    const { maxIJKs } = state;
    const length = maxIJKs.length;
    if (typeof value !== 'number' ||
        (length >= TEST_MAX_LOCATIONS && value < maxIJKs[0].value)) {
        return;
    }
    const dataCopy = {
        value: data.value,
        pointLPS: data.pointLPS
            ? [data.pointLPS[0], data.pointLPS[1], data.pointLPS[2]]
            : undefined,
        pointIJK: data.pointIJK
            ? [data.pointIJK[0], data.pointIJK[1], data.pointIJK[2]]
            : undefined,
    };
    if (!length || value >= maxIJKs[length - 1].value) {
        maxIJKs.push(dataCopy);
    }
    else {
        for (let i = 0; i < length; i++) {
            if (value <= maxIJKs[i].value) {
                maxIJKs.splice(i, 0, dataCopy);
                break;
            }
        }
    }
    if (length >= TEST_MAX_LOCATIONS) {
        maxIJKs.splice(0, 1);
    }
}
function volumetricGetStatistics(state, stats, options) {
    const { spacing, calibration } = options;
    const { volumeUnit } = (0,_getCalibratedUnits_js__rspack_import_1/* .getCalibratedLengthUnitsAndScale */.Op)({
        calibration,
        hasPixelSpacing: true,
    }, []);
    const volumeScale = spacing ? spacing[0] * spacing[1] * spacing[2] : 1;
    stats.volume = {
        value: Array.isArray(stats.count.value)
            ? stats.count.value.map((v) => v * volumeScale)
            : stats.count.value * volumeScale,
        unit: volumeUnit,
        name: 'volume',
        label: 'Volume',
    };
    stats.maxIJKs = state.maxIJKs.filter((entry) => entry.pointIJK !== undefined);
    stats.array.push(stats.volume);
    state.maxIJKs = [];
    return stats;
}
class VolumetricCalculator extends _math_basic_BasicStatsCalculator_js__rspack_import_0/* .BasicStatsCalculator */.O {
    static statsInit(options) {
        super.statsInit(options);
        this.volumetricState = createVolumetricState();
    }
    static statsCallback(data) {
        super.statsCallback(data);
        volumetricStatsCallback(this.volumetricState, data);
    }
    static getStatistics(options) {
        const optionsWithUnit = {
            ...options,
            unit: options?.unit || 'none',
            calibration: options?.calibration,
            hasPixelSpacing: options?.hasPixelSpacing,
        };
        const stats = super.getStatistics(optionsWithUnit);
        return volumetricGetStatistics(this.volumetricState, stats, optionsWithUnit);
    }
}
VolumetricCalculator.volumetricState = createVolumetricState();
class InstanceVolumetricCalculator extends _math_basic_BasicStatsCalculator_js__rspack_import_0/* .InstanceBasicStatsCalculator */.B {
    constructor(options) {
        super(options);
        this.volumetricState = createVolumetricState();
    }
    statsInit(options) {
        super.statsInit(options);
        this.volumetricState = createVolumetricState();
    }
    statsCallback(data) {
        super.statsCallback(data);
        volumetricStatsCallback(this.volumetricState, data);
    }
    getStatistics(options) {
        const optionsWithUnit = {
            ...options,
            unit: options?.unit || 'none',
            calibration: options?.calibration,
            hasPixelSpacing: options?.hasPixelSpacing,
        };
        const stats = super.getStatistics(optionsWithUnit);
        return volumetricGetStatistics(this.volumetricState, stats, optionsWithUnit);
    }
}
/* export default */ const __rspack_default_export = (VolumetricCalculator);


},
2322(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function getOrCreateImageVolume(referencedImageIds) {
    if (!referencedImageIds?.length) {
        return;
    }
    const isValidVolume = _cornerstonejs_core__rspack_import_0.utilities.isValidVolume(referencedImageIds);
    if (!isValidVolume) {
        return;
    }
    const volumeId = _cornerstonejs_core__rspack_import_0.cache.generateVolumeId(referencedImageIds);
    let imageVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
    if (imageVolume) {
        return imageVolume;
    }
    imageVolume = _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheVolumeFromImagesSync(volumeId, referencedImageIds);
    return imageVolume;
}
/* export default */ const __rspack_default_export = (getOrCreateImageVolume);


},
22813(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _stateManagement_segmentation_getSegmentation_js__rspack_import_1 = __webpack_require__(99212);


function getOrCreateSegmentationVolume(segmentationId) {
    const { representationData } = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_1/* .getSegmentation */.T)(segmentationId);
    if (!representationData.Labelmap) {
        return;
    }
    let { volumeId } = representationData.Labelmap;
    let segVolume;
    if (volumeId) {
        segVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
        if (segVolume) {
            return segVolume;
        }
    }
    const { imageIds: labelmapImageIds } = representationData.Labelmap;
    volumeId = _cornerstonejs_core__rspack_import_0.cache.generateVolumeId(labelmapImageIds);
    if (!labelmapImageIds || labelmapImageIds.length === 0) {
        return;
    }
    const isValidVolume = _cornerstonejs_core__rspack_import_0.utilities.isValidVolume(labelmapImageIds);
    if (!isValidVolume) {
        return;
    }
    segVolume = _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheVolumeFromImagesSync(volumeId, labelmapImageIds);
    return segVolume;
}
/* export default */ const __rspack_default_export = (getOrCreateSegmentationVolume);


},
49562(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  b: () => (getReferenceVolumeForSegmentationVolume)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function getReferenceVolumeForSegmentationVolume(segmentationVolumeId) {
    const segmentationVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(segmentationVolumeId);
    if (!segmentationVolume) {
        return null;
    }
    const referencedVolumeId = segmentationVolume.referencedVolumeId;
    let imageVolume;
    if (referencedVolumeId) {
        imageVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(referencedVolumeId);
    }
    else {
        const imageIds = segmentationVolume.imageIds;
        const segmentationImageId = imageIds?.[0];
        if (!segmentationImageId) {
            return null;
        }
        const image = _cornerstonejs_core__rspack_import_0.cache.getImage(segmentationImageId);
        if (!image) {
            return null;
        }
        const referencedImageId = image.referencedImageId;
        let volumeInfo = referencedImageId
            ? _cornerstonejs_core__rspack_import_0.cache.getVolumeContainingImageId(referencedImageId)
            : undefined;
        if (!volumeInfo?.volume) {
            volumeInfo = _cornerstonejs_core__rspack_import_0.cache.getVolumeContainingImageId(image.imageId);
        }
        imageVolume = volumeInfo?.volume;
    }
    return imageVolume;
}


},
91707(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  u: () => (getSVGStyleForSegment)
});
/* import */ var _enums_index_js__rspack_import_0 = __webpack_require__(53870);
/* import */ var _stateManagement_segmentation_config_segmentationColor_js__rspack_import_1 = __webpack_require__(46692);
/* import */ var _stateManagement_segmentation_getActiveSegmentation_js__rspack_import_2 = __webpack_require__(7342);
/* import */ var _stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_3 = __webpack_require__(61395);
/* import */ var _stateManagement_segmentation_getSegmentationRepresentationVisibility_js__rspack_import_4 = __webpack_require__(7333);
/* import */ var _stateManagement_segmentation_helpers_internalGetHiddenSegmentIndices_js__rspack_import_5 = __webpack_require__(83789);
/* import */ var _stateManagement_segmentation_SegmentationStyle_js__rspack_import_6 = __webpack_require__(51933);







function getSVGStyleForSegment({ segmentationId, segmentIndex, viewportId, autoGenerated = false, }) {
    const segmentColor = (0,_stateManagement_segmentation_config_segmentationColor_js__rspack_import_1.getSegmentIndexColor)(viewportId, segmentationId, segmentIndex);
    const segmentationVisible = (0,_stateManagement_segmentation_getSegmentationRepresentationVisibility_js__rspack_import_4/* .getSegmentationRepresentationVisibility */.I)(viewportId, {
        segmentationId,
        type: _enums_index_js__rspack_import_0.SegmentationRepresentations.Contour,
    });
    const activeSegmentation = (0,_stateManagement_segmentation_getActiveSegmentation_js__rspack_import_2/* .getActiveSegmentation */.T)(viewportId);
    const isActive = activeSegmentation?.segmentationId === segmentationId;
    const inactiveSegmentationVisibility = _stateManagement_segmentation_SegmentationStyle_js__rspack_import_6/* .segmentationStyle.getRenderInactiveSegmentations */.Y.getRenderInactiveSegmentations(viewportId);
    const style = _stateManagement_segmentation_SegmentationStyle_js__rspack_import_6/* .segmentationStyle.getStyle */.Y.getStyle({
        viewportId,
        segmentationId,
        type: _enums_index_js__rspack_import_0.SegmentationRepresentations.Contour,
        segmentIndex,
    });
    const mergedConfig = style;
    let lineWidth = 1;
    let lineDash = undefined;
    let lineOpacity = 1;
    let fillOpacity = 0;
    let renderFill = mergedConfig.renderFill ?? true;
    let renderOutline = mergedConfig.renderOutline ?? true;
    if (autoGenerated) {
        lineWidth = mergedConfig.outlineWidthAutoGenerated ?? lineWidth;
        lineDash = mergedConfig.outlineDashAutoGenerated ?? lineDash;
        lineOpacity = mergedConfig.outlineOpacity ?? lineOpacity;
        fillOpacity = mergedConfig.fillAlphaAutoGenerated ?? fillOpacity;
    }
    else if (isActive) {
        lineWidth = mergedConfig.outlineWidth ?? lineWidth;
        lineDash = mergedConfig.outlineDash ?? lineDash;
        lineOpacity = mergedConfig.outlineOpacity ?? lineOpacity;
        fillOpacity = mergedConfig.fillAlpha ?? fillOpacity;
    }
    else {
        lineWidth = mergedConfig.outlineWidthInactive ?? lineWidth;
        lineDash = mergedConfig.outlineDashInactive ?? lineDash;
        lineOpacity = mergedConfig.outlineOpacityInactive ?? lineOpacity;
        fillOpacity = mergedConfig.fillAlphaInactive ?? fillOpacity;
        renderFill = mergedConfig.renderFillInactive ?? renderFill;
        renderOutline = mergedConfig.renderOutlineInactive ?? renderOutline;
    }
    if ((0,_stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_3/* .getActiveSegmentIndex */.Q)(segmentationId) === segmentIndex) {
        lineWidth += mergedConfig.activeSegmentOutlineWidthDelta;
    }
    lineWidth = renderOutline ? lineWidth : 0;
    fillOpacity = renderFill ? fillOpacity : 0;
    const color = `rgba(${segmentColor[0]}, ${segmentColor[1]}, ${segmentColor[2]}, ${lineOpacity})`;
    const fillColor = `rgb(${segmentColor[0]}, ${segmentColor[1]}, ${segmentColor[2]})`;
    const hiddenSegments = (0,_stateManagement_segmentation_helpers_internalGetHiddenSegmentIndices_js__rspack_import_5/* .internalGetHiddenSegmentIndices */.s)(viewportId, {
        segmentationId,
        type: _enums_index_js__rspack_import_0.SegmentationRepresentations.Contour,
    });
    const isVisible = !hiddenSegments.has(segmentIndex);
    return {
        color,
        fillColor,
        lineWidth,
        fillOpacity,
        lineDash,
        textbox: {
            color,
        },
        visibility: isActive
            ? segmentationVisible && isVisible
            : inactiveSegmentationVisibility,
    };
}


},
99891(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _utilsForWorker_js__rspack_import_1 = __webpack_require__(72788);
/* import */ var _getPixelValueUnits_js__rspack_import_2 = __webpack_require__(40865);
/* import */ var _VolumetricCalculator_js__rspack_import_3 = __webpack_require__(46450);
/* import */ var _enums_index_js__rspack_import_4 = __webpack_require__(53870);
/* import */ var _registerComputeWorker_js__rspack_import_5 = __webpack_require__(44925);






const radiusForVol1 = Math.pow((3 * 1000) / (4 * Math.PI), 1 / 3);
async function getStatistics({ segmentationId, segmentIndices, mode = 'collective', }) {
    (0,_registerComputeWorker_js__rspack_import_5/* .registerComputeWorker */.D)();
    (0,_utilsForWorker_js__rspack_import_1/* .triggerWorkerProgress */.sg)(_enums_index_js__rspack_import_4.WorkerTypes.COMPUTE_STATISTICS, 0);
    const segData = (0,_utilsForWorker_js__rspack_import_1/* .getSegmentationDataForWorker */.yR)(segmentationId, segmentIndices);
    if (!segData) {
        return;
    }
    const { operationData, segVolumeId, segImageIds, reconstructableVolume, indices, } = segData;
    const { refImageId, modalityUnitOptions } = (0,_utilsForWorker_js__rspack_import_1/* .getImageReferenceInfo */.FI)(segVolumeId, segImageIds);
    const unit = (0,_getPixelValueUnits_js__rspack_import_2/* .getPixelValueUnitsImageId */.N)(refImageId, modalityUnitOptions);
    const stats = reconstructableVolume
        ? await calculateVolumeStatistics({
            operationData,
            indices,
            unit,
            mode,
        })
        : await calculateStackStatistics({
            segImageIds,
            indices,
            unit,
            mode,
        });
    return stats;
}
async function calculateVolumeStatistics({ operationData, indices, unit, mode, }) {
    const strategyData = (0,_utilsForWorker_js__rspack_import_1/* .prepareVolumeStrategyDataForWorker */.o9)(operationData);
    if (!strategyData) {
        return;
    }
    const { segmentationVoxelManager, imageVoxelManager, segmentationImageData, imageData, } = strategyData;
    if (!segmentationVoxelManager || !segmentationImageData) {
        return;
    }
    const spacing = segmentationImageData.getSpacing();
    const { boundsIJK: boundsOrig } = segmentationVoxelManager;
    if (!boundsOrig) {
        return _VolumetricCalculator_js__rspack_import_3/* ["default"].getStatistics */.Ay.getStatistics({ spacing });
    }
    const segmentationScalarData = segmentationVoxelManager.getCompleteScalarDataArray();
    const segmentationInfo = {
        scalarData: segmentationScalarData,
        dimensions: segmentationImageData.getDimensions(),
        spacing: segmentationImageData.getSpacing(),
        origin: segmentationImageData.getOrigin(),
        direction: segmentationImageData.getDirection(),
    };
    const imageInfo = {
        scalarData: imageVoxelManager.getCompleteScalarDataArray(),
        dimensions: imageData.getDimensions(),
        spacing: imageData.getSpacing(),
        origin: imageData.getOrigin(),
        direction: imageData.getDirection(),
    };
    if (!imageInfo.scalarData?.length) {
        return;
    }
    const stats = await (0,_cornerstonejs_core__rspack_import_0.getWebWorkerManager)().executeTask('compute', 'calculateSegmentsStatisticsVolume', {
        segmentationInfo,
        imageInfo,
        indices,
        unit,
        mode,
    });
    (0,_utilsForWorker_js__rspack_import_1/* .triggerWorkerProgress */.sg)(_enums_index_js__rspack_import_4.WorkerTypes.COMPUTE_STATISTICS, 100);
    if (mode === 'collective') {
        return processSegmentationStatistics({
            stats,
            unit,
            spacing,
            segmentationImageData,
            imageVoxelManager,
        });
    }
    else {
        const finalStats = {};
        Object.entries(stats).forEach(([segmentIndex, stat]) => {
            finalStats[segmentIndex] = processSegmentationStatistics({
                stats: stat,
                unit,
                spacing,
                segmentationImageData,
                imageVoxelManager,
            });
        });
        return finalStats;
    }
}
const updateStatsArray = (stats, newStat) => {
    if (!stats.array) {
        return;
    }
    const existingIndex = stats.array.findIndex((stat) => stat.name === newStat.name);
    if (existingIndex !== -1) {
        stats.array[existingIndex] = newStat;
    }
    else {
        stats.array.push(newStat);
    }
};
const processSegmentationStatistics = ({ stats, unit, spacing, segmentationImageData, imageVoxelManager, }) => {
    stats.mean.unit = unit;
    stats.max.unit = unit;
    stats.min.unit = unit;
    if (unit !== 'SUV') {
        return stats;
    }
    const radiusIJK = spacing.map((s) => Math.max(1, Math.round((1.1 * radiusForVol1) / s)));
    for (const testMax of stats.maxIJKs) {
        const testStats = getSphereStats(testMax, radiusIJK, segmentationImageData, imageVoxelManager, spacing);
        if (!testStats) {
            continue;
        }
        const { mean } = testStats;
        if (!stats.peakValue || stats.peakValue.value <= mean.value) {
            stats.peakValue = {
                name: 'peakValue',
                label: 'Peak Value',
                value: mean.value,
                unit,
            };
            stats.peakPoint = {
                name: 'peakLPS',
                label: 'Peak SUV Point',
                value: testMax.pointLPS ? [...testMax.pointLPS] : null,
                unit: null,
            };
            updateStatsArray(stats, stats.peakValue);
            updateStatsArray(stats, stats.peakPoint);
        }
    }
    if (stats.volume && stats.mean) {
        const mtv = stats.volume.value;
        const suvMean = stats.mean.value;
        stats.lesionGlycolysis = {
            name: 'lesionGlycolysis',
            label: 'Lesion Glycolysis',
            value: mtv * suvMean,
            unit: `${stats.volume.unit}·${unit}`,
        };
        updateStatsArray(stats, stats.lesionGlycolysis);
    }
    return stats;
};
async function calculateStackStatistics({ segImageIds, indices, unit, mode }) {
    (0,_utilsForWorker_js__rspack_import_1/* .triggerWorkerProgress */.sg)(_enums_index_js__rspack_import_4.WorkerTypes.COMPUTE_STATISTICS, 0);
    const { segmentationInfo, imageInfo } = (0,_utilsForWorker_js__rspack_import_1/* .prepareStackDataForWorker */.Dn)(segImageIds);
    const stats = await (0,_cornerstonejs_core__rspack_import_0.getWebWorkerManager)().executeTask('compute', 'calculateSegmentsStatisticsStack', {
        segmentationInfo,
        imageInfo,
        indices,
        mode,
    });
    (0,_utilsForWorker_js__rspack_import_1/* .triggerWorkerProgress */.sg)(_enums_index_js__rspack_import_4.WorkerTypes.COMPUTE_STATISTICS, 100);
    const spacing = segmentationInfo[0].spacing;
    const segmentationImageData = segmentationInfo[0];
    const imageVoxelManager = imageInfo[0].voxelManager;
    if (mode === 'collective') {
        return processSegmentationStatistics({
            stats,
            unit,
            spacing,
            segmentationImageData,
            imageVoxelManager,
        });
    }
    else {
        const finalStats = {};
        Object.entries(stats).forEach(([segmentIndex, stat]) => {
            finalStats[segmentIndex] = processSegmentationStatistics({
                stats: stat,
                unit,
                spacing,
                segmentationImageData,
                imageVoxelManager,
            });
        });
        return finalStats;
    }
}
function getSphereStats(testMax, radiusIJK, segData, imageVoxels, spacing) {
    const { pointIJK: centerIJK, pointLPS: centerLPS } = testMax;
    if (!centerIJK) {
        return;
    }
    const boundsIJK = centerIJK.map((ijk, idx) => [
        ijk - radiusIJK[idx],
        ijk + radiusIJK[idx],
    ]);
    const testFunction = (_pointLPS, pointIJK) => {
        const i = (pointIJK[0] - centerIJK[0]) / radiusIJK[0];
        const j = (pointIJK[1] - centerIJK[1]) / radiusIJK[1];
        const k = (pointIJK[2] - centerIJK[2]) / radiusIJK[2];
        const radius = i * i + j * j + k * k;
        return radius <= 1;
    };
    const statsFunction = ({ pointIJK, pointLPS }) => {
        const value = imageVoxels.getAtIJKPoint(pointIJK);
        if (value === undefined) {
            return;
        }
        _VolumetricCalculator_js__rspack_import_3/* ["default"].statsCallback */.Ay.statsCallback({ value, pointLPS, pointIJK });
    };
    _VolumetricCalculator_js__rspack_import_3/* ["default"].statsInit */.Ay.statsInit({ storePointData: false });
    _cornerstonejs_core__rspack_import_0.utilities.pointInShapeCallback(segData, {
        pointInShapeFn: testFunction,
        callback: statsFunction,
        boundsIJK,
    });
    return _VolumetricCalculator_js__rspack_import_3/* ["default"].getStatistics */.Ay.getStatistics({ spacing });
}
/* export default */ const __rspack_default_export = (getStatistics);


},
72788(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Dn: () => (prepareStackDataForWorker),
  FI: () => (getImageReferenceInfo),
  o9: () => (prepareVolumeStrategyDataForWorker),
  sg: () => (triggerWorkerProgress),
  yR: () => (getSegmentationDataForWorker)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_1 = __webpack_require__(61395);
/* import */ var _stateManagement_segmentation_getSegmentation_js__rspack_import_2 = __webpack_require__(99212);
/* import */ var _tools_segmentation_strategies_utils_getStrategyData_js__rspack_import_3 = __webpack_require__(66340);
/* import */ var _tools_segmentation_strategies_compositions_ensureSegmentationVolume_js__rspack_import_4 = __webpack_require__(22081);
/* import */ var _tools_segmentation_strategies_compositions_ensureImageVolume_js__rspack_import_5 = __webpack_require__(31326);






const triggerWorkerProgress = (workerType, progress) => {
    (0,_cornerstonejs_core__rspack_import_0.triggerEvent)(_cornerstonejs_core__rspack_import_0.eventTarget, _cornerstonejs_core__rspack_import_0.Enums.Events.WEB_WORKER_PROGRESS, {
        progress,
        type: workerType,
    });
};
const getSegmentationDataForWorker = (segmentationId, segmentIndices) => {
    const segmentation = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_2/* .getSegmentation */.T)(segmentationId);
    if (!segmentation?.representationData) {
        console.debug('getSegmentationDataForWorker: segmentation missing or not ready', segmentationId);
        return null;
    }
    const { representationData } = segmentation;
    const { Labelmap } = representationData;
    if (!Labelmap) {
        console.debug('No labelmap found for segmentation', segmentationId);
        return null;
    }
    const segVolumeId = Labelmap.volumeId;
    const segImageIds = Labelmap.imageIds;
    const operationData = {
        segmentationId,
        volumeId: segVolumeId,
        imageIds: segImageIds,
    };
    let reconstructableVolume = Boolean(segVolumeId);
    if (!reconstructableVolume && segImageIds) {
        const refImageIds = segImageIds.map((imageId) => {
            const image = _cornerstonejs_core__rspack_import_0.cache.getImage(imageId);
            return image.referencedImageId;
        });
        reconstructableVolume = _cornerstonejs_core__rspack_import_0.utilities.isValidVolume(refImageIds);
    }
    let indices = segmentIndices;
    if (!indices) {
        indices = [(0,_stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_1/* .getActiveSegmentIndex */.Q)(segmentationId)];
    }
    else if (!Array.isArray(indices)) {
        indices = [indices, 255];
    }
    return {
        operationData,
        segVolumeId,
        segImageIds,
        reconstructableVolume,
        indices,
    };
};
const prepareVolumeStrategyDataForWorker = (operationData) => {
    return (0,_tools_segmentation_strategies_utils_getStrategyData_js__rspack_import_3/* .getStrategyData */.S)({
        operationData,
        strategy: {
            ensureSegmentationVolumeFor3DManipulation: _tools_segmentation_strategies_compositions_ensureSegmentationVolume_js__rspack_import_4/* ["default"].ensureSegmentationVolumeFor3DManipulation */.A.ensureSegmentationVolumeFor3DManipulation,
            ensureImageVolumeFor3DManipulation: _tools_segmentation_strategies_compositions_ensureImageVolume_js__rspack_import_5/* ["default"].ensureImageVolumeFor3DManipulation */.A.ensureImageVolumeFor3DManipulation,
        },
    });
};
const prepareImageInfo = (imageVoxelManager, imageData) => {
    const imageScalarData = imageVoxelManager.getCompleteScalarDataArray();
    return {
        scalarData: imageScalarData,
        dimensions: imageData.getDimensions(),
        spacing: imageData.getSpacing(),
        origin: imageData.getOrigin(),
        direction: imageData.getDirection(),
    };
};
const prepareStackDataForWorker = (segImageIds) => {
    const segmentationInfo = [];
    const imageInfo = [];
    for (const segImageId of segImageIds) {
        const segImage = _cornerstonejs_core__rspack_import_0.cache.getImage(segImageId);
        const segPixelData = segImage.getPixelData();
        const { origin, direction, spacing, dimensions } = _cornerstonejs_core__rspack_import_0.utilities.getImageDataMetadata(segImage);
        segmentationInfo.push({
            scalarData: segPixelData,
            dimensions,
            spacing,
            origin,
            direction,
        });
        const refImageId = segImage.referencedImageId;
        if (refImageId) {
            const refImage = _cornerstonejs_core__rspack_import_0.cache.getImage(refImageId);
            if (!refImage) {
                continue;
            }
            const refPixelData = refImage.getPixelData();
            const refVoxelManager = refImage.voxelManager;
            const refSpacing = [
                refImage.rowPixelSpacing,
                refImage.columnPixelSpacing,
            ];
            imageInfo.push({
                scalarData: refPixelData,
                dimensions: refVoxelManager
                    ? refVoxelManager.dimensions
                    : [refImage.columns, refImage.rows, 1],
                spacing: refSpacing,
            });
        }
    }
    return { segmentationInfo, imageInfo };
};
const getImageReferenceInfo = (segVolumeId, segImageIds) => {
    let refImageId;
    if (segVolumeId) {
        const segmentationVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(segVolumeId);
        const imageIds = segmentationVolume.imageIds;
        const cachedImage = _cornerstonejs_core__rspack_import_0.cache.getImage(imageIds[0]);
        if (cachedImage) {
            refImageId = cachedImage.referencedImageId;
        }
    }
    else if (segImageIds?.length) {
        const segImage = _cornerstonejs_core__rspack_import_0.cache.getImage(segImageIds[0]);
        refImageId = segImage.referencedImageId;
    }
    const refImage = _cornerstonejs_core__rspack_import_0.cache.getImage(refImageId);
    const scalingModule = _cornerstonejs_core__rspack_import_0.metaData.get('scalingModule', refImageId);
    const modalityUnitOptions = {
        isPreScaled: Boolean(refImage?.preScale?.scaled),
        isSuvScaled: typeof scalingModule?.suvbw === 'number',
    };
    return { refImageId, modalityUnitOptions };
};


},
36420(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _stateManagement_annotation_AnnotationRenderingEngine_js__rspack_import_0 = __webpack_require__(89412);

function triggerAnnotationRender(element) {
    _stateManagement_annotation_AnnotationRenderingEngine_js__rspack_import_0/* .annotationRenderingEngine.renderViewport */.o.renderViewport(element);
}
/* export default */ const __rspack_default_export = (triggerAnnotationRender);


},
12499(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  nQ: () => (/* reexport */ Core_ClipType),
  Qw: () => (/* reexport */ Clipper_Clipper),
  gY: () => (/* reexport */ Core_FillRule),
  nF: () => (/* reexport */ PolyTreeD)
});

// UNUSED EXPORTS: Active, Clipper64, ClipperBase, ClipperD, ClipperEngine, ClipperOffset, Delaunay, EndType, HorzJoin, HorzPosition, HorzSegment, InternalClipper, InvalidRect64, InvalidRectD, JoinType, JoinWith, LocalMinima, Minkowski, OutPt, OutPt2, OutRec, PathType, PathUtils, PathsUtils, Point64Utils, PointDUtils, PointInPolygonResult, PolyPath64, PolyPathBase, PolyPathD, PolyTree64, Rect64Utils, RectClip64, RectClipLines64, RectDUtils, ReuseableDataContainer64, TriangulateResult, Vertex, VertexFlags, area, areaD, areaPaths, areaPathsD, booleanOp, booleanOpD, booleanOpDWithPolyTree, booleanOpWithPolyTree, createIntersectNode, createLocalMinima, difference, differenceD, ellipse, ellipseD, getBounds, getBoundsD, getBoundsPaths, getBoundsPathsD, inflatePaths, inflatePathsD, intersect, intersectD, isPositive, isPositiveD, makePath, makePathD, minkowskiDiff, minkowskiDiffD, minkowskiSum, minkowskiSumD, pointInPolygon, pointInPolygonD, ramerDouglasPeucker, ramerDouglasPeuckerD, ramerDouglasPeuckerPaths, ramerDouglasPeuckerPathsD, rectClip, rectClipLines, reversePath, reversePathD, reversePaths, reversePathsD, scalePath64, scalePathD, scalePaths64, scalePathsD, simplifyPath, simplifyPathD, simplifyPaths, simplifyPathsD, stripDuplicates, translatePath, translatePathD, translatePaths, translatePathsD, triangulate, triangulateD, trimCollinear, trimCollinearD, union, unionD, xor, xorD

;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/Core.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  12 December 2025                                                *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2025                                         *
* Purpose   :  Core structures and functions for the Clipper Library           *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/
// Note: all clipping operations except for Difference are commutative.
var Core_ClipType;
(function (ClipType) {
    ClipType[ClipType["NoClip"] = 0] = "NoClip";
    ClipType[ClipType["Intersection"] = 1] = "Intersection";
    ClipType[ClipType["Union"] = 2] = "Union";
    ClipType[ClipType["Difference"] = 3] = "Difference";
    ClipType[ClipType["Xor"] = 4] = "Xor";
})(Core_ClipType || (Core_ClipType = {}));
var Core_PathType;
(function (PathType) {
    PathType[PathType["Subject"] = 0] = "Subject";
    PathType[PathType["Clip"] = 1] = "Clip";
})(Core_PathType || (Core_PathType = {}));
// By far the most widely used filling rules for polygons are EvenOdd
// and NonZero, sometimes called Alternate and Winding respectively.
// https://en.wikipedia.org/wiki/Nonzero-rule
var Core_FillRule;
(function (FillRule) {
    FillRule[FillRule["EvenOdd"] = 0] = "EvenOdd";
    FillRule[FillRule["NonZero"] = 1] = "NonZero";
    FillRule[FillRule["Positive"] = 2] = "Positive";
    FillRule[FillRule["Negative"] = 3] = "Negative";
})(Core_FillRule || (Core_FillRule = {}));
// PointInPolygon
var Core_PointInPolygonResult;
(function (PointInPolygonResult) {
    PointInPolygonResult[PointInPolygonResult["IsOn"] = 0] = "IsOn";
    PointInPolygonResult[PointInPolygonResult["IsInside"] = 1] = "IsInside";
    PointInPolygonResult[PointInPolygonResult["IsOutside"] = 2] = "IsOutside";
})(Core_PointInPolygonResult || (Core_PointInPolygonResult = {}));
var Core_InternalClipper;
(function (InternalClipper) {
    InternalClipper.MaxInt64 = 9223372036854775807n;
    InternalClipper.MaxCoord = Number(InternalClipper.MaxInt64 / 4n);
    InternalClipper.max_coord = InternalClipper.MaxCoord;
    InternalClipper.min_coord = -InternalClipper.MaxCoord;
    InternalClipper.Invalid64 = Number(InternalClipper.MaxInt64);
    InternalClipper.floatingPointTolerance = 1E-12;
    InternalClipper.defaultMinimumEdgeLength = 0.1;
    function crossProduct(pt1, pt2, pt3) {
        // typecast to avoid potential int overflow
        return ((pt2.x - pt1.x) * (pt3.y - pt2.y) -
            (pt2.y - pt1.y) * (pt3.x - pt2.x));
    }
    InternalClipper.crossProduct = crossProduct;
    function crossProductSign(pt1, pt2, pt3) {
        const a = pt2.x - pt1.x;
        const b = pt3.y - pt2.y;
        const c = pt2.y - pt1.y;
        const d = pt3.x - pt2.x;
        // Fast check for safe integer range (approx 9.4e7)
        // Using Math.abs inline allows short-circuiting
        if (Math.abs(a) < 9e7 && Math.abs(b) < 9e7 && Math.abs(c) < 9e7 && Math.abs(d) < 9e7) {
            const prod1 = a * b;
            const prod2 = c * d;
            return (prod1 > prod2) ? 1 : (prod1 < prod2) ? -1 : 0;
        }
        // Optimization: Check signs first!
        // This often avoids large number multiplication entirely.
        const signA = (a < 0 ? -1 : (a > 0 ? 1 : 0));
        const signB = (b < 0 ? -1 : (b > 0 ? 1 : 0));
        const signC = (c < 0 ? -1 : (c > 0 ? 1 : 0));
        const signD = (d < 0 ? -1 : (d > 0 ? 1 : 0));
        const signAB = signA * signB;
        const signCD = signC * signD;
        if (signAB !== signCD) {
            return signAB > signCD ? 1 : -1;
        }
        if (signAB === 0)
            return 0; // both 0 because signs equal
        const bigA = BigInt(a);
        const bigB = BigInt(b);
        const bigC = BigInt(c);
        const bigD = BigInt(d);
        const prod1 = bigA * bigB;
        const prod2 = bigC * bigD;
        if (prod1 === prod2)
            return 0;
        return (prod1 > prod2) ? 1 : -1;
    }
    InternalClipper.crossProductSign = crossProductSign;
    function checkPrecision(precision) {
        if (precision < -8 || precision > 8) {
            throw new Error("Error: Precision is out of range.");
        }
    }
    InternalClipper.checkPrecision = checkPrecision;
    function isAlmostZero(value) {
        return Math.abs(value) <= InternalClipper.floatingPointTolerance;
    }
    InternalClipper.isAlmostZero = isAlmostZero;
    function triSign(x) {
        return (x < 0) ? -1 : (x > 0) ? 1 : 0;
    }
    InternalClipper.triSign = triSign;
    function multiplyUInt64(a, b) {
        // Fix: a and b might be larger than 2^32, so don't use >>> 0
        const aBig = BigInt(a);
        const bBig = BigInt(b);
        const res = aBig * bBig;
        return {
            lo64: Number(res & 0xffffffffffffffffn),
            hi64: Number(res >> 64n)
        };
    }
    InternalClipper.multiplyUInt64 = multiplyUInt64;
    // returns true if (and only if) a * b == c * d
    function productsAreEqual(a, b, c, d) {
        const absA = Math.abs(a);
        const absB = Math.abs(b);
        const absC = Math.abs(c);
        const absD = Math.abs(d);
        // Fast path for typical coordinates
        if (absA < 46341 && absB < 46341 && absC < 46341 && absD < 46341) {
            return a * b === c * d;
        }
        // Extended fast path for safe integer range (approx 9.4e7)
        if (absA < 9e7 && absB < 9e7 && absC < 9e7 && absD < 9e7) {
            return a * b === c * d;
        }
        const signAb = (a < 0 ? -1 : (a > 0 ? 1 : 0)) * (b < 0 ? -1 : (b > 0 ? 1 : 0));
        const signCd = (c < 0 ? -1 : (c > 0 ? 1 : 0)) * (d < 0 ? -1 : (d > 0 ? 1 : 0));
        if (signAb !== signCd)
            return false;
        if (signAb === 0)
            return true;
        const bigA = BigInt(absA);
        const bigB = BigInt(absB);
        const bigC = BigInt(absC);
        const bigD = BigInt(absD);
        return (bigA * bigB) === (bigC * bigD);
    }
    InternalClipper.productsAreEqual = productsAreEqual;
    function isCollinear(pt1, sharedPt, pt2) {
        const a = sharedPt.x - pt1.x;
        const b = pt2.y - sharedPt.y;
        const c = sharedPt.y - pt1.y;
        const d = pt2.x - sharedPt.x;
        // When checking for collinearity with very large coordinate values
        // then ProductsAreEqual is more accurate than using CrossProduct.
        return productsAreEqual(a, b, c, d);
    }
    InternalClipper.isCollinear = isCollinear;
    function dotProduct(pt1, pt2, pt3) {
        // typecast to avoid potential int overflow
        return ((pt2.x - pt1.x) * (pt3.x - pt2.x) +
            (pt2.y - pt1.y) * (pt3.y - pt2.y));
    }
    InternalClipper.dotProduct = dotProduct;
    function crossProductD(vec1, vec2) {
        return (vec1.y * vec2.x - vec2.y * vec1.x);
    }
    InternalClipper.crossProductD = crossProductD;
    function dotProductD(vec1, vec2) {
        return (vec1.x * vec2.x + vec1.y * vec2.y);
    }
    InternalClipper.dotProductD = dotProductD;
    // Banker's rounding (round half to even) to match C# MidpointRounding.ToEven
    function roundToEven(value) {
        // Use the built-in behavior that's closer to C# MidpointRounding.ToEven
        // JavaScript's Math.round actually implements "round half away from zero"
        // but for most practical cases, the difference is minimal
        const floor = Math.floor(value);
        const diff = value - floor;
        if (Math.abs(diff - 0.5) < 1e-10) {
            // Exactly halfway - round to even
            return floor % 2 === 0 ? floor : floor + 1;
        }
        return Math.round(value);
    }
    InternalClipper.roundToEven = roundToEven;
    function checkCastInt64(val) {
        if ((val >= InternalClipper.max_coord) || (val <= InternalClipper.min_coord))
            return InternalClipper.Invalid64;
        return Math.round(val);
    }
    InternalClipper.checkCastInt64 = checkCastInt64;
    // GetLineIntersectPt - a 'true' result is non-parallel. The 'ip' will also
    // be constrained to seg1. However, it's possible that 'ip' won't be inside
    // seg2, even when 'ip' hasn't been constrained (ie 'ip' is inside seg1).
    function getLineIntersectPt(ln1a, ln1b, ln2a, ln2b) {
        const dy1 = (ln1b.y - ln1a.y);
        const dx1 = (ln1b.x - ln1a.x);
        const dy2 = (ln2b.y - ln2a.y);
        const dx2 = (ln2b.x - ln2a.x);
        const det = dy1 * dx2 - dy2 * dx1;
        if (det === 0.0) {
            return { intersects: false, point: { x: 0, y: 0, z: 0 } };
        }
        const t = ((ln1a.x - ln2a.x) * dy2 - (ln1a.y - ln2a.y) * dx2) / det;
        let ip;
        if (t <= 0.0) {
            ip = { x: ln1a.x, y: ln1a.y, z: 0 }; // Create a copy to avoid mutating original
        }
        else if (t >= 1.0) {
            ip = { x: ln1b.x, y: ln1b.y, z: 0 }; // Create a copy to avoid mutating original
        }
        else {
            // avoid using constructor (and rounding too) as they affect performance
            // Use Math.trunc to match C# (long) cast behavior which truncates towards zero
            const rawX = ln1a.x + t * dx1;
            const rawY = ln1a.y + t * dy1;
            ip = {
                x: Math.trunc(rawX),
                y: Math.trunc(rawY),
                z: 0
            };
        }
        return { intersects: true, point: ip };
    }
    InternalClipper.getLineIntersectPt = getLineIntersectPt;
    function getLineIntersectPtD(ln1a, ln1b, ln2a, ln2b) {
        const dy1 = ln1b.y - ln1a.y;
        const dx1 = ln1b.x - ln1a.x;
        const dy2 = ln2b.y - ln2a.y;
        const dx2 = ln2b.x - ln2a.x;
        const det = dy1 * dx2 - dy2 * dx1;
        if (det === 0.0) {
            return { success: false, ip: { x: 0, y: 0, z: 0 } };
        }
        const t = ((ln1a.x - ln2a.x) * dy2 - (ln1a.y - ln2a.y) * dx2) / det;
        let ip;
        if (t <= 0.0) {
            ip = { ...ln1a, z: 0 };
        }
        else if (t >= 1.0) {
            ip = { ...ln1b, z: 0 };
        }
        else {
            ip = {
                x: ln1a.x + t * dx1,
                y: ln1a.y + t * dy1,
                z: 0
            };
        }
        return { success: true, ip };
    }
    InternalClipper.getLineIntersectPtD = getLineIntersectPtD;
    function segsIntersect(seg1a, seg1b, seg2a, seg2b, inclusive = false) {
        if (!inclusive) {
            // Match C# fast path - use cross product multiplication
            // This avoids floating point equality checks (safer than === 0)
            return (crossProduct(seg1a, seg2a, seg2b) *
                crossProduct(seg1b, seg2a, seg2b) < 0) &&
                (crossProduct(seg2a, seg1a, seg1b) *
                    crossProduct(seg2b, seg1a, seg1b) < 0);
        }
        // Inclusive case - match C# implementation
        const res1 = crossProduct(seg1a, seg2a, seg2b);
        const res2 = crossProduct(seg1b, seg2a, seg2b);
        if (res1 * res2 > 0)
            return false;
        const res3 = crossProduct(seg2a, seg1a, seg1b);
        const res4 = crossProduct(seg2b, seg1a, seg1b);
        if (res3 * res4 > 0)
            return false;
        // ensure NOT collinear
        return (res1 !== 0 || res2 !== 0 || res3 !== 0 || res4 !== 0);
    }
    InternalClipper.segsIntersect = segsIntersect;
    function getBounds(path) {
        if (path.length === 0)
            return { left: 0, top: 0, right: 0, bottom: 0 };
        const result = {
            left: Number.MAX_SAFE_INTEGER,
            top: Number.MAX_SAFE_INTEGER,
            right: Number.MIN_SAFE_INTEGER,
            bottom: Number.MIN_SAFE_INTEGER
        };
        for (const pt of path) {
            if (pt.x < result.left)
                result.left = pt.x;
            if (pt.x > result.right)
                result.right = pt.x;
            if (pt.y < result.top)
                result.top = pt.y;
            if (pt.y > result.bottom)
                result.bottom = pt.y;
        }
        return result.left === Number.MAX_SAFE_INTEGER ?
            { left: 0, top: 0, right: 0, bottom: 0 } : result;
    }
    InternalClipper.getBounds = getBounds;
    function getClosestPtOnSegment(offPt, seg1, seg2) {
        if (seg1.x === seg2.x && seg1.y === seg2.y)
            return { x: seg1.x, y: seg1.y, z: 0 }; // Return copy, not reference
        const dx = (seg2.x - seg1.x);
        const dy = (seg2.y - seg1.y);
        const q = ((offPt.x - seg1.x) * dx + (offPt.y - seg1.y) * dy) / ((dx * dx) + (dy * dy));
        const qClamped = q < 0 ? 0 : (q > 1 ? 1 : q);
        return {
            // use Math.round to match the C# MidpointRounding.ToEven behavior
            x: Math.round(seg1.x + qClamped * dx),
            y: Math.round(seg1.y + qClamped * dy),
            z: 0
        };
    }
    InternalClipper.getClosestPtOnSegment = getClosestPtOnSegment;
    function pointInPolygon(pt, polygon) {
        const len = polygon.length;
        let start = 0;
        if (len < 3)
            return Core_PointInPolygonResult.IsOutside;
        while (start < len && polygon[start].y === pt.y)
            start++;
        if (start === len)
            return Core_PointInPolygonResult.IsOutside;
        let isAbove = polygon[start].y < pt.y;
        const startingAbove = isAbove;
        let val = 0;
        let i = start + 1;
        let end = len;
        while (true) {
            if (i === end) {
                if (end === 0 || start === 0)
                    break;
                end = start;
                i = 0;
            }
            if (isAbove) {
                while (i < end && polygon[i].y < pt.y)
                    i++;
            }
            else {
                while (i < end && polygon[i].y > pt.y)
                    i++;
            }
            if (i === end)
                continue;
            const curr = polygon[i];
            const prev = i > 0 ? polygon[i - 1] : polygon[len - 1];
            if (curr.y === pt.y) {
                if (curr.x === pt.x || (curr.y === prev.y &&
                    ((pt.x < prev.x) !== (pt.x < curr.x)))) {
                    return Core_PointInPolygonResult.IsOn;
                }
                i++;
                if (i === start)
                    break;
                continue;
            }
            if (pt.x < curr.x && pt.x < prev.x) {
                // we're only interested in edges crossing on the left
            }
            else if (pt.x > prev.x && pt.x > curr.x) {
                val = 1 - val; // toggle val
            }
            else {
                const cps = crossProductSign(prev, curr, pt);
                if (cps === 0)
                    return Core_PointInPolygonResult.IsOn;
                if ((cps < 0) === isAbove)
                    val = 1 - val;
            }
            isAbove = !isAbove;
            i++;
        }
        if (isAbove === startingAbove) {
            return val === 0 ? Core_PointInPolygonResult.IsOutside : Core_PointInPolygonResult.IsInside;
        }
        if (i === len)
            i = 0;
        const cps = i === 0 ?
            crossProductSign(polygon[len - 1], polygon[0], pt) :
            crossProductSign(polygon[i - 1], polygon[i], pt);
        if (cps === 0)
            return Core_PointInPolygonResult.IsOn;
        if ((cps < 0) === isAbove)
            val = 1 - val;
        return val === 0 ? Core_PointInPolygonResult.IsOutside : Core_PointInPolygonResult.IsInside;
    }
    InternalClipper.pointInPolygon = pointInPolygon;
    function path2ContainsPath1(path1, path2) {
        // we need to make some accommodation for rounding errors
        // so we won't jump if the first vertex is found outside
        let pip = Core_PointInPolygonResult.IsOn;
        for (const pt of path1) {
            switch (pointInPolygon(pt, path2)) {
                case Core_PointInPolygonResult.IsOutside:
                    if (pip === Core_PointInPolygonResult.IsOutside)
                        return false;
                    pip = Core_PointInPolygonResult.IsOutside;
                    break;
                case Core_PointInPolygonResult.IsInside:
                    if (pip === Core_PointInPolygonResult.IsInside)
                        return true;
                    pip = Core_PointInPolygonResult.IsInside;
                    break;
                default:
                    break;
            }
        }
        // since path1's location is still equivocal, check its midpoint
        const mp = getBounds(path1);
        const midPt = {
            x: Math.round((mp.left + mp.right) / 2),
            y: Math.round((mp.top + mp.bottom) / 2)
        };
        return pointInPolygon(midPt, path2) !== Core_PointInPolygonResult.IsOutside;
    }
    InternalClipper.path2ContainsPath1 = path2ContainsPath1;
})(Core_InternalClipper || (Core_InternalClipper = {}));
// Point64 utility functions
var Core_Point64Utils;
(function (Point64Utils) {
    function create(x = 0, y = 0, z = 0) {
        return { x: Math.round(x), y: Math.round(y), z };
    }
    Point64Utils.create = create;
    function fromPointD(pt) {
        return { x: Math.round(pt.x), y: Math.round(pt.y), z: pt.z || 0 };
    }
    Point64Utils.fromPointD = fromPointD;
    function scale(pt, scale) {
        return {
            x: Math.round(pt.x * scale),
            y: Math.round(pt.y * scale),
            z: pt.z || 0
        };
    }
    Point64Utils.scale = scale;
    function equals(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    Point64Utils.equals = equals;
    function add(a, b) {
        return { x: a.x + b.x, y: a.y + b.y, z: 0 };
    }
    Point64Utils.add = add;
    function subtract(a, b) {
        return { x: a.x - b.x, y: a.y - b.y, z: 0 };
    }
    Point64Utils.subtract = subtract;
    function toString(pt) {
        if (pt.z !== undefined && pt.z !== 0) {
            return `${pt.x},${pt.y},${pt.z} `;
        }
        return `${pt.x},${pt.y} `;
    }
    Point64Utils.toString = toString;
})(Core_Point64Utils || (Core_Point64Utils = {}));
// PointD utility functions
var Core_PointDUtils;
(function (PointDUtils) {
    function create(x = 0, y = 0, z = 0) {
        return { x, y, z };
    }
    PointDUtils.create = create;
    function fromPoint64(pt) {
        return { x: pt.x, y: pt.y, z: pt.z || 0 };
    }
    PointDUtils.fromPoint64 = fromPoint64;
    function scale(pt, scale) {
        return { x: pt.x * scale, y: pt.y * scale, z: pt.z || 0 };
    }
    PointDUtils.scale = scale;
    function equals(a, b) {
        return Core_InternalClipper.isAlmostZero(a.x - b.x) &&
            Core_InternalClipper.isAlmostZero(a.y - b.y);
    }
    PointDUtils.equals = equals;
    function negate(pt) {
        pt.x = -pt.x;
        pt.y = -pt.y;
    }
    PointDUtils.negate = negate;
    function toString(pt, precision = 2) {
        if (pt.z !== undefined && pt.z !== 0) {
            return `${pt.x.toFixed(precision)},${pt.y.toFixed(precision)},${pt.z}`;
        }
        return `${pt.x.toFixed(precision)},${pt.y.toFixed(precision)}`;
    }
    PointDUtils.toString = toString;
})(Core_PointDUtils || (Core_PointDUtils = {}));
// Rect64 utility functions
var Core_Rect64Utils;
(function (Rect64Utils) {
    function create(l = 0, t = 0, r = 0, b = 0) {
        return { left: l, top: t, right: r, bottom: b };
    }
    Rect64Utils.create = create;
    function createInvalid() {
        return {
            left: Number.MAX_SAFE_INTEGER,
            top: Number.MAX_SAFE_INTEGER,
            right: Number.MIN_SAFE_INTEGER,
            bottom: Number.MIN_SAFE_INTEGER
        };
    }
    Rect64Utils.createInvalid = createInvalid;
    function width(rect) {
        return rect.right - rect.left;
    }
    Rect64Utils.width = width;
    function height(rect) {
        return rect.bottom - rect.top;
    }
    Rect64Utils.height = height;
    function isEmpty(rect) {
        return rect.bottom <= rect.top || rect.right <= rect.left;
    }
    Rect64Utils.isEmpty = isEmpty;
    function isValid(rect) {
        return rect.left < Number.MAX_SAFE_INTEGER;
    }
    Rect64Utils.isValid = isValid;
    function midPoint(rect) {
        return {
            x: Math.round((rect.left + rect.right) / 2),
            y: Math.round((rect.top + rect.bottom) / 2)
        };
    }
    Rect64Utils.midPoint = midPoint;
    function contains(rect, pt) {
        return pt.x > rect.left && pt.x < rect.right &&
            pt.y > rect.top && pt.y < rect.bottom;
    }
    Rect64Utils.contains = contains;
    function containsRect(rect, rec) {
        return rec.left >= rect.left && rec.right <= rect.right &&
            rec.top >= rect.top && rec.bottom <= rect.bottom;
    }
    Rect64Utils.containsRect = containsRect;
    function intersects(rect, rec) {
        return (Math.max(rect.left, rec.left) <= Math.min(rect.right, rec.right)) &&
            (Math.max(rect.top, rec.top) <= Math.min(rect.bottom, rec.bottom));
    }
    Rect64Utils.intersects = intersects;
    function asPath(rect) {
        return [
            { x: rect.left, y: rect.top, z: 0 },
            { x: rect.right, y: rect.top, z: 0 },
            { x: rect.right, y: rect.bottom, z: 0 },
            { x: rect.left, y: rect.bottom, z: 0 }
        ];
    }
    Rect64Utils.asPath = asPath;
})(Core_Rect64Utils || (Core_Rect64Utils = {}));
// RectD utility functions
var Core_RectDUtils;
(function (RectDUtils) {
    function create(l = 0, t = 0, r = 0, b = 0) {
        return { left: l, top: t, right: r, bottom: b };
    }
    RectDUtils.create = create;
    function createInvalid() {
        return {
            left: Number.MAX_VALUE,
            top: Number.MAX_VALUE,
            right: -Number.MAX_VALUE,
            bottom: -Number.MAX_VALUE
        };
    }
    RectDUtils.createInvalid = createInvalid;
    function width(rect) {
        return rect.right - rect.left;
    }
    RectDUtils.width = width;
    function height(rect) {
        return rect.bottom - rect.top;
    }
    RectDUtils.height = height;
    function isEmpty(rect) {
        return rect.bottom <= rect.top || rect.right <= rect.left;
    }
    RectDUtils.isEmpty = isEmpty;
    function midPoint(rect) {
        return {
            x: (rect.left + rect.right) / 2,
            y: (rect.top + rect.bottom) / 2
        };
    }
    RectDUtils.midPoint = midPoint;
    function contains(rect, pt) {
        return pt.x > rect.left && pt.x < rect.right &&
            pt.y > rect.top && pt.y < rect.bottom;
    }
    RectDUtils.contains = contains;
    function containsRect(rect, rec) {
        return rec.left >= rect.left && rec.right <= rect.right &&
            rec.top >= rect.top && rec.bottom <= rect.bottom;
    }
    RectDUtils.containsRect = containsRect;
    function intersects(rect, rec) {
        return (Math.max(rect.left, rec.left) < Math.min(rect.right, rec.right)) &&
            (Math.max(rect.top, rec.top) < Math.min(rect.bottom, rec.bottom));
    }
    RectDUtils.intersects = intersects;
    function asPath(rect) {
        return [
            { x: rect.left, y: rect.top, z: 0 },
            { x: rect.right, y: rect.top, z: 0 },
            { x: rect.right, y: rect.bottom, z: 0 },
            { x: rect.left, y: rect.bottom, z: 0 }
        ];
    }
    RectDUtils.asPath = asPath;
})(Core_RectDUtils || (Core_RectDUtils = {}));
// Path utility functions
var Core_PathUtils;
(function (PathUtils) {
    function toString64(path) {
        let result = "";
        for (const pt of path) {
            result += Core_Point64Utils.toString(pt);
        }
        return result + '\n';
    }
    PathUtils.toString64 = toString64;
    function toStringD(path, precision = 2) {
        let result = "";
        for (const pt of path) {
            result += Core_PointDUtils.toString(pt, precision) + ", ";
        }
        if (result !== "")
            result = result.slice(0, -2);
        return result;
    }
    PathUtils.toStringD = toStringD;
    function reverse64(path) {
        return [...path].reverse();
    }
    PathUtils.reverse64 = reverse64;
    function reverseD(path) {
        return [...path].reverse();
    }
    PathUtils.reverseD = reverseD;
})(Core_PathUtils || (Core_PathUtils = {}));
var Core_PathsUtils;
(function (PathsUtils) {
    function toString64(paths) {
        let result = "";
        for (const path of paths) {
            result += Core_PathUtils.toString64(path);
        }
        return result;
    }
    PathsUtils.toString64 = toString64;
    function toStringD(paths, precision = 2) {
        let result = "";
        for (const path of paths) {
            result += Core_PathUtils.toStringD(path, precision) + "\n";
        }
        return result;
    }
    PathsUtils.toStringD = toStringD;
    function reverse64(paths) {
        return paths.map(path => Core_PathUtils.reverse64(path));
    }
    PathsUtils.reverse64 = reverse64;
    function reverseD(paths) {
        return paths.map(path => Core_PathUtils.reverseD(path));
    }
    PathsUtils.reverseD = reverseD;
})(Core_PathsUtils || (Core_PathsUtils = {}));
// Constants
const InvalidRect64 = Core_Rect64Utils.createInvalid();
const InvalidRectD = Core_RectDUtils.createInvalid();
//# sourceMappingURL=Core.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/Engine.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  11 October 2025                                                 *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2025                                         *
* Purpose   :  This is the main polygon clipping module                        *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/

// Vertex: a pre-clipping data structure. It is used to separate polygons
// into ascending and descending 'bounds' (or sides) that start at local
// minima and ascend to a local maxima, before descending again.
var Engine_VertexFlags;
(function (VertexFlags) {
    VertexFlags[VertexFlags["None"] = 0] = "None";
    VertexFlags[VertexFlags["OpenStart"] = 1] = "OpenStart";
    VertexFlags[VertexFlags["OpenEnd"] = 2] = "OpenEnd";
    VertexFlags[VertexFlags["LocalMax"] = 4] = "LocalMax";
    VertexFlags[VertexFlags["LocalMin"] = 8] = "LocalMin";
})(Engine_VertexFlags || (Engine_VertexFlags = {}));
// C# keeps scanlines in a sorted list; here we use a heap to avoid O(n) splices.
class ScanlineHeap {
    data = [];
    push(value) {
        this.data.push(value);
        this.siftUp(this.data.length - 1);
    }
    pop() {
        if (this.data.length === 0)
            return null;
        const max = this.data[0];
        const last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            this.siftDown(0);
        }
        return max;
    }
    clear() {
        this.data.length = 0;
    }
    siftUp(index) {
        while (index > 0) {
            const parent = (index - 1) >> 1;
            if (this.data[parent] >= this.data[index])
                break;
            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            index = parent;
        }
    }
    siftDown(index) {
        const length = this.data.length;
        while (true) {
            let largest = index;
            const left = (index << 1) + 1;
            const right = left + 1;
            if (left < length && this.data[left] > this.data[largest])
                largest = left;
            if (right < length && this.data[right] > this.data[largest])
                largest = right;
            if (largest === index)
                break;
            [this.data[index], this.data[largest]] = [this.data[largest], this.data[index]];
            index = largest;
        }
    }
}
class Vertex {
    pt;
    next = null;
    prev = null;
    flags;
    constructor(pt, flags, prev) {
        this.pt = pt;
        this.flags = flags;
        this.prev = prev;
    }
}
class LocalMinima {
    vertex;
    polytype;
    isOpen;
    constructor(vertex, polytype, isOpen = false) {
        this.vertex = vertex;
        this.polytype = polytype;
        this.isOpen = isOpen;
    }
    equals(other) {
        return other !== null && this.vertex === other.vertex;
    }
}
// deprecated: kept for backward compatibility, use new LocalMinima() directly
// (no longer used internally for performance)
function createLocalMinima(vertex, polytype, isOpen = false) {
    return new LocalMinima(vertex, polytype, isOpen);
}
function createIntersectNode(pt, edge1, edge2) {
    // Create a copy of pt to avoid reference sharing (C# uses struct which copies by value)
    return { pt: { x: pt.x, y: pt.y, z: pt.z || 0 }, edge1, edge2 };
}
// OutPt: vertex data structure for clipping solutions
class OutPt {
    static _nextId = 1;
    _debugId;
    pt;
    next;
    prev;
    outrec;
    horz;
    constructor(pt, outrec) {
        this._debugId = OutPt._nextId++;
        this.pt = pt;
        this.outrec = outrec;
        this.next = this;
        this.prev = this;
        this.horz = null;
    }
}
var Engine_JoinWith;
(function (JoinWith) {
    JoinWith[JoinWith["None"] = 0] = "None";
    JoinWith[JoinWith["Left"] = 1] = "Left";
    JoinWith[JoinWith["Right"] = 2] = "Right";
})(Engine_JoinWith || (Engine_JoinWith = {}));
var Engine_HorzPosition;
(function (HorzPosition) {
    HorzPosition[HorzPosition["Bottom"] = 0] = "Bottom";
    HorzPosition[HorzPosition["Middle"] = 1] = "Middle";
    HorzPosition[HorzPosition["Top"] = 2] = "Top";
})(Engine_HorzPosition || (Engine_HorzPosition = {}));
// OutRec: path data structure for clipping solutions
class OutRec {
    static _nextId = 1;
    _debugId;
    idx = 0;
    owner = null;
    frontEdge = null;
    backEdge = null;
    pts = null;
    polypath = null;
    bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    path = [];
    isOpen = false;
    splits = null;
    recursiveSplit = null;
    constructor() {
        this._debugId = OutRec._nextId++;
    }
}
class HorzSegment {
    leftOp;
    rightOp;
    leftToRight;
    constructor(op) {
        this.leftOp = op;
        this.rightOp = null;
        this.leftToRight = true;
    }
}
class HorzJoin {
    op1;
    op2;
    constructor(ltor, rtol) {
        this.op1 = ltor;
        this.op2 = rtol;
    }
}
///////////////////////////////////////////////////////////////////
// Important: UP and DOWN here are premised on Y-axis positive down
// displays, which is the orientation used in Clipper's development.
///////////////////////////////////////////////////////////////////
class Active {
    bot = { x: 0, y: 0, z: 0 };
    top = { x: 0, y: 0, z: 0 };
    curX = 0; // current (updated at every new scanline) - keep as number but ensure integer precision
    dx = 0;
    windDx = 0; // 1 or -1 depending on winding direction
    windCount = 0;
    windCount2 = 0; // winding count of the opposite polytype
    outrec = null;
    // AEL: 'active edge list' (Vatti's AET - active edge table)
    //     a linked list of all edges (from left to right) that are present
    //     (or 'active') within the current scanbeam (a horizontal 'beam' that
    //     sweeps from bottom to top over the paths in the clipping operation).
    prevInAEL = null;
    nextInAEL = null;
    // SEL: 'sorted edge list' (Vatti's ST - sorted table)
    //     linked list used when sorting edges into their new positions at the
    //     top of scanbeams, but also (re)used to process horizontals.
    prevInSEL = null;
    nextInSEL = null;
    jump = null;
    vertexTop = null;
    localMin = null; // the bottom of an edge 'bound' (also Vatti)
    isLeftBound = false;
    joinWith = Engine_JoinWith.None;
}
var Engine_ClipperEngine;
(function (ClipperEngine) {
    function addLocMin(vert, polytype, isOpen, minimaList) {
        // make sure the vertex is added only once ...
        if ((vert.flags & Engine_VertexFlags.LocalMin) !== Engine_VertexFlags.None)
            return;
        vert.flags |= Engine_VertexFlags.LocalMin;
        const lm = new LocalMinima(vert, polytype, isOpen);
        minimaList.push(lm);
    }
    ClipperEngine.addLocMin = addLocMin;
    function addPathsToVertexList(paths, polytype, isOpen, minimaList, vertexList) {
        for (let i = 0, len = paths.length; i < len; i++) {
            const path = paths[i];
            let v0 = null;
            let prevV = null;
            for (let j = 0, len2 = path.length; j < len2; j++) {
                const pt = path[j];
                if (v0 === null) {
                    v0 = new Vertex(pt, Engine_VertexFlags.None, null);
                    vertexList.push(v0);
                    prevV = v0;
                }
                else if (!(prevV.pt.x === pt.x && prevV.pt.y === pt.y)) { // ie skips duplicates
                    const currV = new Vertex(pt, Engine_VertexFlags.None, prevV);
                    vertexList.push(currV);
                    prevV.next = currV;
                    prevV = currV;
                }
            }
            if (prevV?.prev === null)
                continue;
            if (!isOpen && prevV.pt.x === v0.pt.x && prevV.pt.y === v0.pt.y)
                prevV = prevV.prev;
            prevV.next = v0;
            v0.prev = prevV;
            if (!isOpen && prevV.next === prevV)
                continue;
            // OK, we have a valid path
            let goingUp;
            if (isOpen) {
                let currV = v0.next;
                while (currV !== v0 && currV.pt.y === v0.pt.y)
                    currV = currV.next;
                goingUp = currV.pt.y <= v0.pt.y;
                if (goingUp) {
                    v0.flags = Engine_VertexFlags.OpenStart;
                    addLocMin(v0, polytype, true, minimaList);
                }
                else {
                    v0.flags = Engine_VertexFlags.OpenStart | Engine_VertexFlags.LocalMax;
                }
            }
            else { // closed path
                prevV = v0.prev;
                while (prevV !== v0 && prevV.pt.y === v0.pt.y)
                    prevV = prevV.prev;
                if (prevV === v0)
                    continue; // only open paths can be completely flat
                goingUp = prevV.pt.y > v0.pt.y;
            }
            const goingUp0 = goingUp;
            prevV = v0;
            let currV = v0.next;
            while (currV !== v0) {
                if (currV.pt.y > prevV.pt.y && goingUp) {
                    prevV.flags |= Engine_VertexFlags.LocalMax;
                    goingUp = false;
                }
                else if (currV.pt.y < prevV.pt.y && !goingUp) {
                    goingUp = true;
                    addLocMin(prevV, polytype, isOpen, minimaList);
                }
                prevV = currV;
                currV = currV.next;
            }
            if (isOpen) {
                prevV.flags |= Engine_VertexFlags.OpenEnd;
                if (goingUp)
                    prevV.flags |= Engine_VertexFlags.LocalMax;
                else
                    addLocMin(prevV, polytype, isOpen, minimaList);
            }
            else if (goingUp !== goingUp0) {
                if (goingUp0)
                    addLocMin(prevV, polytype, false, minimaList);
                else
                    prevV.flags |= Engine_VertexFlags.LocalMax;
            }
        }
    }
    ClipperEngine.addPathsToVertexList = addPathsToVertexList;
})(Engine_ClipperEngine || (Engine_ClipperEngine = {}));
class ReuseableDataContainer64 {
    minimaList;
    vertexList;
    constructor() {
        this.minimaList = [];
        this.vertexList = [];
    }
    clear() {
        this.minimaList.length = 0;
        this.vertexList.length = 0;
    }
    addPaths(paths, pt, isOpen) {
        Engine_ClipperEngine.addPathsToVertexList(paths, pt, isOpen, this.minimaList, this.vertexList);
    }
}
class PolyPathBase {
    parent;
    children = [];
    constructor(parent = null) {
        this.parent = parent;
    }
    get isHole() {
        return this.getIsHole();
    }
    getLevel() {
        let result = 0;
        let pp = this.parent;
        while (pp !== null) {
            ++result;
            pp = pp.parent;
        }
        return result;
    }
    get level() {
        return this.getLevel();
    }
    getIsHole() {
        const lvl = this.getLevel();
        return lvl !== 0 && (lvl & 1) === 0;
    }
    get count() {
        return this.children.length;
    }
    clear() {
        this.children.length = 0;
    }
    toStringInternal(idx, level) {
        let result = "";
        const padding = "  ".repeat(level);
        const plural = this.children.length === 1 ? "" : "s";
        if ((level & 1) === 0) {
            result += `${padding}+- hole (${idx}) contains ${this.children.length} nested polygon${plural}.\n`;
        }
        else {
            result += `${padding}+- polygon (${idx}) contains ${this.children.length} hole${plural}.\n`;
        }
        for (let i = 0; i < this.count; i++) {
            if (this.children[i].count > 0) {
                result += this.children[i].toStringInternal(i, level + 1);
            }
        }
        return result;
    }
    toString() {
        if (this.level > 0)
            return ""; // only accept tree root
        const plural = this.children.length === 1 ? "" : "s";
        let result = `Polytree with ${this.children.length} polygon${plural}.\n`;
        for (let i = 0; i < this.count; i++) {
            if (this.children[i].count > 0) {
                result += this.children[i].toStringInternal(i, 1);
            }
        }
        return result + '\n';
    }
}
class PolyPath64 extends PolyPathBase {
    polygon = null; // polytree root's polygon == null
    constructor(parent = null) {
        super(parent);
    }
    get poly() {
        return this.polygon;
    }
    addChild(p) {
        const newChild = new PolyPath64(this);
        newChild.polygon = p;
        this.children.push(newChild);
        return newChild;
    }
    child(index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error("Index out of range");
        }
        return this.children[index];
    }
    area() {
        let result = this.polygon === null ? 0 : Engine_Clipper.area(this.polygon);
        for (const child of this.children) {
            result += child.area();
        }
        return result;
    }
}
class PolyPathD extends PolyPathBase {
    scale = 1.0;
    polygon = null;
    constructor(parent = null) {
        super(parent);
    }
    get poly() {
        return this.polygon;
    }
    addChild(p) {
        const newChild = new PolyPathD(this);
        newChild.scale = this.scale;
        newChild.polygon = Engine_Clipper.scalePathD(p, 1 / this.scale);
        this.children.push(newChild);
        return newChild;
    }
    addChildD(p) {
        const newChild = new PolyPathD(this);
        newChild.scale = this.scale;
        newChild.polygon = p;
        this.children.push(newChild);
        return newChild;
    }
    child(index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error("Index out of range");
        }
        return this.children[index];
    }
    area() {
        let result = this.polygon === null ? 0 : Engine_Clipper.areaD(this.polygon);
        for (const child of this.children) {
            result += child.area();
        }
        return result;
    }
}
class PolyTree64 extends (/* unused pure expression or super */ null && (PolyPath64)) {
}
class PolyTreeD extends PolyPathD {
    get scaleValue() {
        return this.scale;
    }
}
class ClipperBase {
    cliptype = Core_ClipType.NoClip;
    fillrule = Core_FillRule.EvenOdd;
    actives = null;
    sel = null;
    minimaList = [];
    intersectList = [];
    vertexList = [];
    outrecList = [];
    scanlineHeap = new ScanlineHeap();
    scanlineSet = new Set();
    // For very small inputs, a heap + set can cost more than it saves.
    // Use an array-based scanline mode initially, and upgrade to heap+set
    // automatically if the scanline list grows beyond a threshold.
    scanlineArr = [];
    useScanlineArray = false;
    horzSegList = [];
    horzJoinList = [];
    currentLocMin = 0;
    currentBotY = 0;
    isSortedMinimaList = false;
    hasOpenPaths = false;
    usingPolytree = false;
    succeeded = false;
    preserveCollinear = true;
    reverseSolution = false;
    constructor() { }
    // Z-coordinate callback support
    // Override in subclasses (Clipper64/ClipperD) to provide callback
    getZCallback() {
        return undefined;
    }
    xyEqual(pt1, pt2) {
        return pt1.x === pt2.x && pt1.y === pt2.y;
    }
    setZ(ae1, ae2, intersectPt) {
        const zCallback = this.getZCallback();
        if (!zCallback)
            return;
        // prioritize subject vertices over clip vertices
        // and pass the subject vertices before clip vertices in the callback
        if (ClipperBase.getPolyType(ae1) === Core_PathType.Subject) {
            if (this.xyEqual(intersectPt, ae1.bot)) {
                intersectPt.z = ae1.bot.z;
            }
            else if (this.xyEqual(intersectPt, ae1.top)) {
                intersectPt.z = ae1.top.z;
            }
            else if (this.xyEqual(intersectPt, ae2.bot)) {
                intersectPt.z = ae2.bot.z;
            }
            else if (this.xyEqual(intersectPt, ae2.top)) {
                intersectPt.z = ae2.top.z;
            }
            else {
                intersectPt.z = 0; // DefaultZ
            }
            zCallback(ae1.bot, ae1.top, ae2.bot, ae2.top, intersectPt);
        }
        else {
            if (this.xyEqual(intersectPt, ae2.bot)) {
                intersectPt.z = ae2.bot.z;
            }
            else if (this.xyEqual(intersectPt, ae2.top)) {
                intersectPt.z = ae2.top.z;
            }
            else if (this.xyEqual(intersectPt, ae1.bot)) {
                intersectPt.z = ae1.bot.z;
            }
            else if (this.xyEqual(intersectPt, ae1.top)) {
                intersectPt.z = ae1.top.z;
            }
            else {
                intersectPt.z = 0; // DefaultZ
            }
            zCallback(ae2.bot, ae2.top, ae1.bot, ae1.top, intersectPt);
        }
    }
    // Helper functions
    static isOdd(val) {
        return (val & 1) !== 0;
    }
    static isHotEdge(ae) {
        return ae.outrec != null;
    }
    static isOpen(ae) {
        return ae.localMin.isOpen;
    }
    static isOpenEnd(ae) {
        return ae.localMin.isOpen && ClipperBase.isOpenEndVertex(ae.vertexTop);
    }
    static isOpenEndVertex(v) {
        return (v.flags & (Engine_VertexFlags.OpenStart | Engine_VertexFlags.OpenEnd)) !== Engine_VertexFlags.None;
    }
    static getPrevHotEdge(ae) {
        let prev = ae.prevInAEL;
        while (prev !== null && (ClipperBase.isOpen(prev) || !ClipperBase.isHotEdge(prev))) {
            prev = prev.prevInAEL;
        }
        return prev;
    }
    static isFront(ae) {
        return ae === ae.outrec.frontEdge;
    }
    /*******************************************************************************
    *  Dx:                             0(90deg)                                    *
    *                                  |                                           *
    *               +inf (180deg) <--- o ---> -inf (0deg)                          *
    *******************************************************************************/
    static getDx(pt1, pt2) {
        const dy = pt2.y - pt1.y;
        if (dy !== 0) {
            return (pt2.x - pt1.x) / dy;
        }
        return pt2.x > pt1.x ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    static topX(ae, currentY) {
        if ((currentY === ae.top.y) || (ae.top.x === ae.bot.x))
            return ae.top.x;
        if (currentY === ae.bot.y)
            return ae.bot.x;
        // use MidpointRounding.ToEven in order to explicitly match the nearbyint behaviour on the C++ side
        return Core_InternalClipper.roundToEven(ae.bot.x + ae.dx * (currentY - ae.bot.y));
    }
    static isHorizontal(ae) {
        return ae.top.y === ae.bot.y;
    }
    static isHeadingRightHorz(ae) {
        return ae.dx === Number.NEGATIVE_INFINITY;
    }
    static isHeadingLeftHorz(ae) {
        return ae.dx === Number.POSITIVE_INFINITY;
    }
    static swapActives(ae1, ae2) {
        return [ae2, ae1];
    }
    static getPolyType(ae) {
        return ae.localMin.polytype;
    }
    static isSamePolyType(ae1, ae2) {
        return ae1.localMin.polytype === ae2.localMin.polytype;
    }
    static setDx(ae) {
        ae.dx = ClipperBase.getDx(ae.bot, ae.top);
    }
    static nextVertex(ae) {
        return ae.windDx > 0 ? ae.vertexTop.next : ae.vertexTop.prev;
    }
    static prevPrevVertex(ae) {
        return ae.windDx > 0 ? ae.vertexTop.prev.prev : ae.vertexTop.next.next;
    }
    static isMaxima(vertexOrAe) {
        if ('flags' in vertexOrAe) {
            // It's a Vertex
            return (vertexOrAe.flags & Engine_VertexFlags.LocalMax) !== Engine_VertexFlags.None;
        }
        else {
            // It's an Active
            return ClipperBase.isMaxima(vertexOrAe.vertexTop);
        }
    }
    static getMaximaPair(ae) {
        let ae2 = ae.nextInAEL;
        while (ae2 !== null) {
            if (ae2.vertexTop === ae.vertexTop)
                return ae2; // Found!
            ae2 = ae2.nextInAEL;
        }
        return null;
    }
    // optimization (not in C# reference): fast bounding box overlap check for segment intersection
    boundingBoxesOverlap(p1, p2, p3, p4) {
        // segment 1: p1-p2, segment 2: p3-p4
        const min1x = Math.min(p1.x, p2.x);
        const max1x = Math.max(p1.x, p2.x);
        const min1y = Math.min(p1.y, p2.y);
        const max1y = Math.max(p1.y, p2.y);
        const min2x = Math.min(p3.x, p4.x);
        const max2x = Math.max(p3.x, p4.x);
        const min2y = Math.min(p3.y, p4.y);
        const max2y = Math.max(p3.y, p4.y);
        return !(max1x < min2x || max2x < min1x || max1y < min2y || max2y < min1y);
    }
    clearSolutionOnly() {
        while (this.actives !== null)
            this.deleteFromAEL(this.actives);
        this.scanlineHeap.clear();
        this.scanlineSet.clear();
        this.scanlineArr.length = 0;
        this.disposeIntersectNodes();
        this.outrecList.length = 0;
        this.horzSegList.length = 0;
        this.horzJoinList.length = 0;
    }
    clear() {
        this.clearSolutionOnly();
        this.minimaList.length = 0;
        this.vertexList.length = 0;
        this.currentLocMin = 0;
        this.isSortedMinimaList = false;
        this.hasOpenPaths = false;
    }
    reset() {
        if (!this.isSortedMinimaList) {
            this.minimaList.sort((a, b) => b.vertex.pt.y - a.vertex.pt.y);
            this.isSortedMinimaList = true;
        }
        this.scanlineHeap.clear();
        this.scanlineSet.clear();
        this.scanlineArr.length = 0;
        // Heuristic: local minima count correlates with number of scanlines and
        // scanline insert/pop activity. For glyph-like inputs, this is typically small.
        this.useScanlineArray = this.minimaList.length <= 16;
        for (let i = this.minimaList.length - 1; i >= 0; i--) {
            this.insertScanline(this.minimaList[i].vertex.pt.y);
        }
        this.currentBotY = 0;
        this.currentLocMin = 0;
        this.actives = null;
        this.sel = null;
        this.succeeded = true;
    }
    upgradeScanlineStructureFromArray() {
        // Convert scanlineArr -> scanlineSet + scanlineHeap
        // (scanlineArr is already unique by construction).
        const arr = this.scanlineArr;
        for (let i = 0, len = arr.length; i < len; i++) {
            const y = arr[i];
            this.scanlineSet.add(y);
            this.scanlineHeap.push(y);
        }
        arr.length = 0;
        this.useScanlineArray = false;
    }
    insertScanline(y) {
        if (this.useScanlineArray) {
            const arr = this.scanlineArr;
            for (let i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === y)
                    return;
            }
            arr.push(y);
            // Upgrade when scanline count grows beyond "small".
            // This keeps the small-case win while avoiding O(n) scans for large cases.
            if (arr.length > 64)
                this.upgradeScanlineStructureFromArray();
            return;
        }
        if (this.scanlineSet.has(y))
            return;
        this.scanlineSet.add(y);
        this.scanlineHeap.push(y);
    }
    popScanline() {
        if (this.useScanlineArray) {
            const arr = this.scanlineArr;
            const len = arr.length;
            if (len === 0)
                return { success: false, y: 0 };
            let bestIdx = 0;
            let bestY = arr[0];
            for (let i = 1; i < len; i++) {
                const v = arr[i];
                if (v > bestY) {
                    bestY = v;
                    bestIdx = i;
                }
            }
            arr[bestIdx] = arr[len - 1];
            arr.pop();
            return { success: true, y: bestY };
        }
        const y = this.scanlineHeap.pop();
        if (y === null)
            return { success: false, y: 0 };
        this.scanlineSet.delete(y);
        return { success: true, y };
    }
    hasLocMinAtY(y) {
        return this.currentLocMin < this.minimaList.length &&
            this.minimaList[this.currentLocMin].vertex.pt.y === y;
    }
    popLocalMinima() {
        return this.minimaList[this.currentLocMin++];
    }
    addPath(path, polytype, isOpen = false) {
        const tmp = [path];
        this.addPaths(tmp, polytype, isOpen);
    }
    addPaths(paths, polytype, isOpen = false) {
        if (isOpen)
            this.hasOpenPaths = true;
        this.isSortedMinimaList = false;
        Engine_ClipperEngine.addPathsToVertexList(paths, polytype, isOpen, this.minimaList, this.vertexList);
    }
    addReuseableData(reuseableData) {
        if (reuseableData['minimaList'].length === 0)
            return;
        // nb: reuseableData will continue to own the vertices, so it's important
        // that the reuseableData object isn't destroyed before the Clipper object
        // that's using the data.
        this.isSortedMinimaList = false;
        for (const lm of reuseableData['minimaList']) {
            this.minimaList.push(new LocalMinima(lm.vertex, lm.polytype, lm.isOpen));
            if (lm.isOpen)
                this.hasOpenPaths = true;
        }
    }
    deleteFromAEL(ae) {
        const prev = ae.prevInAEL;
        const next = ae.nextInAEL;
        if (prev === null && next === null && (ae !== this.actives))
            return; // already deleted
        if (prev !== null) {
            prev.nextInAEL = next;
        }
        else {
            this.actives = next;
        }
        if (next !== null)
            next.prevInAEL = prev;
        // delete ae;
    }
    getBounds() {
        const bounds = {
            left: Number.MAX_SAFE_INTEGER,
            top: Number.MAX_SAFE_INTEGER,
            right: Number.MIN_SAFE_INTEGER,
            bottom: Number.MIN_SAFE_INTEGER
        };
        for (const t of this.vertexList) {
            let v = t;
            do {
                if (v.pt.x < bounds.left)
                    bounds.left = v.pt.x;
                if (v.pt.x > bounds.right)
                    bounds.right = v.pt.x;
                if (v.pt.y < bounds.top)
                    bounds.top = v.pt.y;
                if (v.pt.y > bounds.bottom)
                    bounds.bottom = v.pt.y;
                v = v.next;
            } while (v !== t);
        }
        return Core_Rect64Utils.isEmpty(bounds) ? { left: 0, top: 0, right: 0, bottom: 0 } : bounds;
    }
    executeInternal(ct, fillRule) {
        if (ct === Core_ClipType.NoClip)
            return;
        this.fillrule = fillRule;
        this.cliptype = ct;
        this.reset();
        const scanResult = this.popScanline();
        if (!scanResult.success)
            return;
        let y = scanResult.y;
        while (this.succeeded) {
            this.insertLocalMinimaIntoAEL(y);
            let ae;
            while ((ae = this.popHorz()) !== null)
                this.doHorizontal(ae);
            if (this.horzSegList.length > 0) {
                this.convertHorzSegsToJoins();
                this.horzSegList.length = 0;
            }
            this.currentBotY = y; // bottom of scanbeam
            const nextScanResult = this.popScanline();
            if (!nextScanResult.success)
                break; // y new top of scanbeam
            y = nextScanResult.y;
            this.doIntersections(y);
            this.doTopOfScanbeam(y);
            while ((ae = this.popHorz()) !== null)
                this.doHorizontal(ae);
        }
        if (this.succeeded)
            this.processHorzJoins();
    }
    insertLocalMinimaIntoAEL(botY) {
        // Add any local minima (if any) at BotY ...
        // NB horizontal local minima edges should contain locMin.vertex.prev
        while (this.hasLocMinAtY(botY)) {
            const localMinima = this.popLocalMinima();
            let leftBound;
            if ((localMinima.vertex.flags & Engine_VertexFlags.OpenStart) !== Engine_VertexFlags.None) {
                leftBound = null;
            }
            else {
                leftBound = new Active();
                leftBound.bot = { x: localMinima.vertex.pt.x, y: localMinima.vertex.pt.y, z: localMinima.vertex.pt.z || 0 }; // Create copy
                leftBound.curX = localMinima.vertex.pt.x;
                leftBound.windDx = -1;
                leftBound.vertexTop = localMinima.vertex.prev;
                leftBound.top = { x: localMinima.vertex.prev.pt.x, y: localMinima.vertex.prev.pt.y, z: localMinima.vertex.prev.pt.z || 0 }; // Create copy
                leftBound.outrec = null;
                leftBound.localMin = localMinima;
                ClipperBase.setDx(leftBound);
            }
            let rightBound;
            if ((localMinima.vertex.flags & Engine_VertexFlags.OpenEnd) !== Engine_VertexFlags.None) {
                rightBound = null;
            }
            else {
                rightBound = new Active();
                rightBound.bot = { x: localMinima.vertex.pt.x, y: localMinima.vertex.pt.y, z: localMinima.vertex.pt.z || 0 }; // Create copy
                rightBound.curX = localMinima.vertex.pt.x;
                rightBound.windDx = 1;
                rightBound.vertexTop = localMinima.vertex.next; // i.e. ascending
                rightBound.top = { x: localMinima.vertex.next.pt.x, y: localMinima.vertex.next.pt.y, z: localMinima.vertex.next.pt.z || 0 }; // Create copy
                rightBound.outrec = null;
                rightBound.localMin = localMinima;
                ClipperBase.setDx(rightBound);
            }
            // Currently LeftB is just the descending bound and RightB is the ascending.
            // Now if the LeftB isn't on the left of RightB then we need swap them.
            if (leftBound !== null && rightBound !== null) {
                if (ClipperBase.isHorizontal(leftBound)) {
                    if (ClipperBase.isHeadingRightHorz(leftBound))
                        [leftBound, rightBound] = ClipperBase.swapActives(leftBound, rightBound);
                }
                else if (ClipperBase.isHorizontal(rightBound)) {
                    if (ClipperBase.isHeadingLeftHorz(rightBound))
                        [leftBound, rightBound] = ClipperBase.swapActives(leftBound, rightBound);
                }
                else if (leftBound.dx < rightBound.dx) {
                    [leftBound, rightBound] = ClipperBase.swapActives(leftBound, rightBound);
                }
            }
            else if (leftBound === null) {
                leftBound = rightBound;
                rightBound = null;
            }
            let contributing;
            leftBound.isLeftBound = true;
            this.insertLeftEdge(leftBound);
            if (ClipperBase.isOpen(leftBound)) {
                this.setWindCountForOpenPathEdge(leftBound);
                contributing = this.isContributingOpen(leftBound);
            }
            else {
                this.setWindCountForClosedPathEdge(leftBound);
                contributing = this.isContributingClosed(leftBound);
            }
            if (rightBound !== null) {
                rightBound.windCount = leftBound.windCount;
                rightBound.windCount2 = leftBound.windCount2;
                this.insertRightEdge(leftBound, rightBound);
                if (contributing) {
                    this.addLocalMinPoly(leftBound, rightBound, leftBound.bot, true);
                    if (!ClipperBase.isHorizontal(leftBound)) {
                        this.checkJoinLeft(leftBound, leftBound.bot);
                    }
                }
                while (rightBound.nextInAEL !== null &&
                    this.isValidAelOrder(rightBound.nextInAEL, rightBound)) {
                    this.intersectEdges(rightBound, rightBound.nextInAEL, rightBound.bot);
                    this.swapPositionsInAEL(rightBound, rightBound.nextInAEL);
                }
                if (ClipperBase.isHorizontal(rightBound)) {
                    this.pushHorz(rightBound);
                }
                else {
                    this.checkJoinRight(rightBound, rightBound.bot);
                    this.insertScanline(rightBound.top.y);
                }
            }
            else if (contributing) {
                this.startOpenPath(leftBound, leftBound.bot);
            }
            if (ClipperBase.isHorizontal(leftBound)) {
                this.pushHorz(leftBound);
            }
            else {
                this.insertScanline(leftBound.top.y);
            }
        }
    }
    pushHorz(ae) {
        ae.nextInSEL = this.sel;
        this.sel = ae;
    }
    popHorz() {
        const ae = this.sel;
        if (ae === null)
            return null;
        this.sel = this.sel.nextInSEL;
        return ae;
    }
    doHorizontal(horz) {
        const horzIsOpen = ClipperBase.isOpen(horz);
        const y = horz.bot.y;
        const vertexMax = horzIsOpen ?
            this.getCurrYMaximaVertexOpen(horz) :
            this.getCurrYMaximaVertex(horz);
        const { isLeftToRight, leftX, rightX } = this.resetHorzDirection(horz, vertexMax);
        let leftX2 = leftX;
        let rightX2 = rightX;
        if (ClipperBase.isHotEdge(horz)) {
            const op = this.addOutPt(horz, { x: horz.curX, y });
            this.addToHorzSegList(op);
        }
        while (true) {
            // loops through consec. horizontal edges (if open)
            let ae = isLeftToRight ? horz.nextInAEL : horz.prevInAEL;
            while (ae !== null) {
                if (ae.vertexTop === vertexMax) {
                    // do this first!!
                    if (ClipperBase.isHotEdge(horz) && this.isJoined(ae))
                        this.split(ae, ae.top);
                    if (ClipperBase.isHotEdge(horz)) {
                        while (horz.vertexTop !== vertexMax) {
                            this.addOutPt(horz, horz.top);
                            this.updateEdgeIntoAEL(horz);
                        }
                        if (isLeftToRight) {
                            this.addLocalMaxPoly(horz, ae, horz.top);
                        }
                        else {
                            this.addLocalMaxPoly(ae, horz, horz.top);
                        }
                    }
                    this.deleteFromAEL(ae);
                    this.deleteFromAEL(horz);
                    return;
                }
                // if horzEdge is a maxima, keep going until we reach
                // its maxima pair, otherwise check for break conditions
                if (vertexMax !== horz.vertexTop || ClipperBase.isOpenEnd(horz)) {
                    // otherwise stop when 'ae' is beyond the end of the horizontal line
                    if ((isLeftToRight && ae.curX > rightX2) ||
                        (!isLeftToRight && ae.curX < leftX2))
                        break;
                    if (ae.curX === horz.top.x && !ClipperBase.isHorizontal(ae)) {
                        const pt = ClipperBase.nextVertex(horz).pt;
                        // to maximize the possibility of putting open edges into
                        // solutions, we'll only break if it's past HorzEdge's end
                        if (ClipperBase.isOpen(ae) && !ClipperBase.isSamePolyType(ae, horz) && !ClipperBase.isHotEdge(ae)) {
                            if ((isLeftToRight && (ClipperBase.topX(ae, pt.y) > pt.x)) ||
                                (!isLeftToRight && (ClipperBase.topX(ae, pt.y) < pt.x)))
                                break;
                        }
                        // otherwise for edges at horzEdge's end, only stop when horzEdge's
                        // outslope is greater than e's slope when heading right or when
                        // horzEdge's outslope is less than e's slope when heading left.
                        else if ((isLeftToRight && (ClipperBase.topX(ae, pt.y) >= pt.x)) ||
                            (!isLeftToRight && (ClipperBase.topX(ae, pt.y) <= pt.x)))
                            break;
                    }
                }
                const pt = { x: ae.curX, y };
                if (isLeftToRight) {
                    this.intersectEdges(horz, ae, pt);
                    this.swapPositionsInAEL(horz, ae);
                    this.checkJoinLeft(ae, pt);
                    horz.curX = ae.curX;
                    ae = horz.nextInAEL;
                }
                else {
                    this.intersectEdges(ae, horz, pt);
                    this.swapPositionsInAEL(ae, horz);
                    this.checkJoinRight(ae, pt);
                    horz.curX = ae.curX;
                    ae = horz.prevInAEL;
                }
                if (ClipperBase.isHotEdge(horz)) {
                    this.addToHorzSegList(this.getLastOp(horz));
                }
            }
            // check if we've finished looping
            // through consecutive horizontals
            if (horzIsOpen && ClipperBase.isOpenEnd(horz)) { // ie open at top
                if (ClipperBase.isHotEdge(horz)) {
                    this.addOutPt(horz, horz.top);
                    if (ClipperBase.isFront(horz)) {
                        horz.outrec.frontEdge = null;
                    }
                    else {
                        horz.outrec.backEdge = null;
                    }
                    horz.outrec = null;
                }
                this.deleteFromAEL(horz);
                return;
            }
            if (ClipperBase.nextVertex(horz).pt.y !== horz.top.y) {
                break;
            }
            //still more horizontals in bound to process ...
            if (ClipperBase.isHotEdge(horz)) {
                this.addOutPt(horz, horz.top);
            }
            this.updateEdgeIntoAEL(horz);
            const resetResult = this.resetHorzDirection(horz, vertexMax);
            leftX2 = resetResult.leftX;
            rightX2 = resetResult.rightX;
        }
        if (ClipperBase.isHotEdge(horz)) {
            const op = this.addOutPt(horz, horz.top);
            this.addToHorzSegList(op);
        }
        this.updateEdgeIntoAEL(horz); // this is the end of an intermediate horiz.
    }
    convertHorzSegsToJoins() {
        let k = 0;
        for (const hs of this.horzSegList) {
            if (this.updateHorzSegment(hs))
                k++;
        }
        if (k < 2)
            return;
        this.horzSegList.sort((a, b) => this.horzSegSort(a, b));
        for (let i = 0; i < k - 1; i++) {
            const hs1 = this.horzSegList[i];
            // for each HorzSegment, find others that overlap
            for (let j = i + 1; j < k; j++) {
                const hs2 = this.horzSegList[j];
                if ((hs2.leftOp.pt.x >= hs1.rightOp.pt.x) ||
                    (hs2.leftToRight === hs1.leftToRight) ||
                    (hs2.rightOp.pt.x <= hs1.leftOp.pt.x))
                    continue;
                const currY = hs1.leftOp.pt.y;
                if (hs1.leftToRight) {
                    while (hs1.leftOp.next.pt.y === currY &&
                        hs1.leftOp.next.pt.x <= hs2.leftOp.pt.x)
                        hs1.leftOp = hs1.leftOp.next;
                    while (hs2.leftOp.prev.pt.y === currY &&
                        hs2.leftOp.prev.pt.x <= hs1.leftOp.pt.x)
                        hs2.leftOp = hs2.leftOp.prev;
                    const join = new HorzJoin(this.duplicateOp(hs1.leftOp, true), this.duplicateOp(hs2.leftOp, false));
                    this.horzJoinList.push(join);
                }
                else {
                    while (hs1.leftOp.prev.pt.y === currY &&
                        hs1.leftOp.prev.pt.x <= hs2.leftOp.pt.x)
                        hs1.leftOp = hs1.leftOp.prev;
                    while (hs2.leftOp.next.pt.y === currY &&
                        hs2.leftOp.next.pt.x <= hs1.leftOp.pt.x)
                        hs2.leftOp = hs2.leftOp.next;
                    const join = new HorzJoin(this.duplicateOp(hs2.leftOp, true), this.duplicateOp(hs1.leftOp, false));
                    this.horzJoinList.push(join);
                }
            }
        }
    }
    updateHorzSegment(hs) {
        const op = hs.leftOp;
        const outrec = this.getRealOutRec(op.outrec);
        const outrecHasEdges = outrec.frontEdge !== null;
        const currY = op.pt.y;
        let opP = op;
        let opN = op;
        if (outrecHasEdges) {
            const opA = outrec.pts;
            const opZ = opA.next;
            while (opP !== opZ && opP.prev.pt.y === currY)
                opP = opP.prev;
            while (opN !== opA && opN.next.pt.y === currY)
                opN = opN.next;
        }
        else {
            while (opP.prev !== opN && opP.prev.pt.y === currY)
                opP = opP.prev;
            while (opN.next !== opP && opN.next.pt.y === currY)
                opN = opN.next;
        }
        const result = this.setHorzSegHeadingForward(hs, opP, opN) && hs.leftOp.horz === null;
        if (result) {
            hs.leftOp.horz = hs;
        }
        else {
            hs.rightOp = null; // (for sorting)
        }
        return result;
    }
    setHorzSegHeadingForward(hs, opP, opN) {
        if (opP.pt.x === opN.pt.x)
            return false;
        if (opP.pt.x < opN.pt.x) {
            hs.leftOp = opP;
            hs.rightOp = opN;
            hs.leftToRight = true;
        }
        else {
            hs.leftOp = opN;
            hs.rightOp = opP;
            hs.leftToRight = false;
        }
        return true;
    }
    horzSegSort(hs1, hs2) {
        if (hs1.rightOp === null) {
            return hs2.rightOp === null ? 0 : 1;
        }
        if (hs2.rightOp === null)
            return -1;
        return hs1.leftOp.pt.x - hs2.leftOp.pt.x;
    }
    duplicateOp(op, insertAfter) {
        const result = new OutPt(op.pt, op.outrec);
        if (insertAfter) {
            result.next = op.next;
            result.next.prev = result;
            result.prev = op;
            op.next = result;
        }
        else {
            result.prev = op.prev;
            result.prev.next = result;
            result.next = op;
            op.prev = result;
        }
        return result;
    }
    getRealOutRec(outRec) {
        while (outRec !== null && outRec.pts === null) {
            outRec = outRec.owner;
        }
        return outRec;
    }
    doIntersections(y) {
        if (this.buildIntersectList(y)) {
            this.processIntersectList();
            this.disposeIntersectNodes();
        }
    }
    doTopOfScanbeam(y) {
        this.sel = null; // sel is reused to flag horizontals (see PushHorz below)
        let ae = this.actives;
        while (ae !== null) {
            // NB 'ae' will never be horizontal here
            if (ae.top.y === y) {
                ae.curX = ae.top.x;
                if (ClipperBase.isMaxima(ae)) {
                    ae = this.doMaxima(ae); // TOP OF BOUND (MAXIMA)
                    continue;
                }
                else {
                    // INTERMEDIATE VERTEX ...
                    if (ClipperBase.isHotEdge(ae))
                        this.addOutPt(ae, ae.top);
                    this.updateEdgeIntoAEL(ae);
                    if (ClipperBase.isHorizontal(ae)) {
                        this.pushHorz(ae); // horizontals are processed later
                    }
                }
            }
            else { // i.e. not the top of the edge
                ae.curX = ClipperBase.topX(ae, y); // TopX already returns correctly rounded integer
            }
            ae = ae.nextInAEL;
        }
    }
    processHorzJoins() {
        for (const j of this.horzJoinList) {
            const or1 = this.getRealOutRec(j.op1.outrec);
            const or2 = this.getRealOutRec(j.op2.outrec);
            const op1b = j.op1.next;
            const op2b = j.op2.prev;
            j.op1.next = j.op2;
            j.op2.prev = j.op1;
            op1b.prev = op2b;
            op2b.next = op1b;
            if (or1 === or2) { // 'join' is really a split
                const or2New = this.newOutRec();
                or2New.pts = op1b;
                this.fixOutRecPts(or2New);
                //if or1->pts has moved to or2 then update or1->pts!!
                if (or1.pts.outrec === or2New) {
                    or1.pts = j.op1;
                    or1.pts.outrec = or1;
                }
                if (this.usingPolytree) {
                    if (this.path1InsidePath2(or1.pts, or2New.pts)) {
                        //swap or1's & or2's pts
                        [or2New.pts, or1.pts] = [or1.pts, or2New.pts];
                        this.fixOutRecPts(or1);
                        this.fixOutRecPts(or2New);
                        //or2 is now inside or1
                        or2New.owner = or1;
                    }
                    else if (this.path1InsidePath2(or2New.pts, or1.pts)) {
                        or2New.owner = or1;
                    }
                    else {
                        or2New.owner = or1.owner;
                    }
                    if (or1.splits === null)
                        or1.splits = [];
                    or1.splits.push(or2New.idx);
                }
                else {
                    or2New.owner = or1;
                }
            }
            else {
                or2.pts = null;
                if (this.usingPolytree) {
                    this.setOwner(or2, or1);
                    this.moveSplits(or2, or1);
                }
                else {
                    or2.owner = or1;
                }
            }
        }
    }
    fixOutRecPts(outrec) {
        let op = outrec.pts;
        do {
            op.outrec = outrec;
            op = op.next;
        } while (op !== outrec.pts);
    }
    path1InsidePath2(op1, op2) {
        // we need to make some accommodation for rounding errors
        // so we won't jump if the first vertex is found outside
        let pip = Core_PointInPolygonResult.IsOn;
        let op = op1;
        do {
            switch (this.pointInOpPolygon(op.pt, op2)) {
                case Core_PointInPolygonResult.IsOutside:
                    if (pip === Core_PointInPolygonResult.IsOutside)
                        return false;
                    pip = Core_PointInPolygonResult.IsOutside;
                    break;
                case Core_PointInPolygonResult.IsInside:
                    if (pip === Core_PointInPolygonResult.IsInside)
                        return true;
                    pip = Core_PointInPolygonResult.IsInside;
                    break;
                default:
                    break;
            }
            op = op.next;
        } while (op !== op1);
        // result is unclear, so try again using cleaned paths
        return Core_InternalClipper.path2ContainsPath1(this.getCleanPath(op1), this.getCleanPath(op2)); // (#973)
    }
    pointInOpPolygon(pt, op) {
        if (op === op.next || op.prev === op.next) {
            return Core_PointInPolygonResult.IsOutside;
        }
        let op2 = op;
        do {
            if (op.pt.y !== pt.y)
                break;
            op = op.next;
        } while (op !== op2);
        if (op.pt.y === pt.y) // not a proper polygon
            return Core_PointInPolygonResult.IsOutside;
        // must be above or below to get here
        let isAbove = op.pt.y < pt.y;
        const startingAbove = isAbove;
        let val = 0;
        op2 = op.next;
        while (op2 !== op) {
            if (isAbove) {
                while (op2 !== op && op2.pt.y < pt.y)
                    op2 = op2.next;
            }
            else {
                while (op2 !== op && op2.pt.y > pt.y)
                    op2 = op2.next;
            }
            if (op2 === op)
                break;
            // must have touched or crossed the pt.Y horizontal
            // and this must happen an even number of times
            if (op2.pt.y === pt.y) { // touching the horizontal
                if (op2.pt.x === pt.x || (op2.pt.y === op2.prev.pt.y &&
                    (pt.x < op2.prev.pt.x) !== (pt.x < op2.pt.x)))
                    return Core_PointInPolygonResult.IsOn;
                op2 = op2.next;
                if (op2 === op)
                    break;
                continue;
            }
            if (op2.pt.x <= pt.x || op2.prev.pt.x <= pt.x) {
                if ((op2.prev.pt.x < pt.x && op2.pt.x < pt.x)) {
                    val = 1 - val; // toggle val
                }
                else {
                    const d = Core_InternalClipper.crossProduct(op2.prev.pt, op2.pt, pt);
                    if (d === 0)
                        return Core_PointInPolygonResult.IsOn;
                    if ((d < 0) === isAbove)
                        val = 1 - val;
                }
            }
            isAbove = !isAbove;
            op2 = op2.next;
        }
        if (isAbove === startingAbove)
            return val === 0 ? Core_PointInPolygonResult.IsOutside : Core_PointInPolygonResult.IsInside;
        {
            const d = Core_InternalClipper.crossProduct(op2.prev.pt, op2.pt, pt);
            if (d === 0)
                return Core_PointInPolygonResult.IsOn;
            if ((d < 0) === isAbove)
                val = 1 - val;
        }
        return val === 0 ? Core_PointInPolygonResult.IsOutside : Core_PointInPolygonResult.IsInside;
    }
    getCleanPath(op) {
        const result = [];
        let op2 = op;
        while (op2.next !== op &&
            ((op2.pt.x === op2.next.pt.x && op2.pt.x === op2.prev.pt.x) ||
                (op2.pt.y === op2.next.pt.y && op2.pt.y === op2.prev.pt.y)))
            op2 = op2.next;
        result.push(op2.pt);
        let prevOp = op2;
        op2 = op2.next;
        while (op2 !== op) {
            if ((op2.pt.x !== op2.next.pt.x || op2.pt.x !== prevOp.pt.x) &&
                (op2.pt.y !== op2.next.pt.y || op2.pt.y !== prevOp.pt.y)) {
                result.push(op2.pt);
                prevOp = op2;
            }
            op2 = op2.next;
        }
        return result;
    }
    moveSplits(fromOr, toOr) {
        if (fromOr.splits === null)
            return;
        if (toOr.splits === null)
            toOr.splits = [];
        for (const i of fromOr.splits) {
            if (i !== toOr.idx) {
                toOr.splits.push(i);
            }
        }
        fromOr.splits = null;
    }
    buildIntersectList(topY) {
        if (this.actives?.nextInAEL === null)
            return false;
        // Calculate edge positions at the top of the current scanbeam, and from this
        // we will determine the intersections required to reach these new positions.
        this.adjustCurrXAndCopyToSEL(topY);
        // Find all edge intersections in the current scanbeam using a stable merge
        // sort that ensures only adjacent edges are intersecting. Intersect info is
        // stored in intersectList ready to be processed in ProcessIntersectList.
        // Re merge sorts see https://stackoverflow.com/a/46319131/359538
        let left = this.sel;
        while (left !== null && left.jump !== null) {
            let prevBase = null;
            while (left !== null && left.jump !== null) {
                let currBase = left;
                let right = left.jump;
                let lEnd = right;
                const rEnd = right?.jump || null;
                left.jump = rEnd;
                while (left !== lEnd && right !== rEnd) {
                    if (right.curX < left.curX) {
                        let tmp = right.prevInSEL;
                        while (true) {
                            this.addNewIntersectNode(tmp, right, topY);
                            if (tmp === left)
                                break;
                            tmp = tmp.prevInSEL;
                        }
                        tmp = right;
                        right = this.extractFromSEL(tmp);
                        lEnd = right; // Update lEnd - this is the critical fix!
                        if (left !== null)
                            this.insert1Before2InSEL(tmp, left);
                        if (left !== currBase)
                            continue;
                        currBase = tmp;
                        currBase.jump = rEnd;
                        if (prevBase === null) {
                            this.sel = currBase;
                        }
                        else {
                            prevBase.jump = currBase;
                        }
                    }
                    else {
                        left = left.nextInSEL;
                    }
                }
                prevBase = currBase;
                left = rEnd;
            }
            left = this.sel;
        }
        return this.intersectList.length > 0;
    }
    processIntersectList() {
        // We now have a list of intersections required so that edges will be
        // correctly positioned at the top of the scanbeam. However, it's important
        // that edge intersections are processed from the bottom up, but it's also
        // crucial that intersections only occur between adjacent edges.
        // First we do a quicksort so intersections proceed in a bottom up order ...
        this.intersectList.sort((a, b) => {
            if (a.pt.y !== b.pt.y)
                return (a.pt.y > b.pt.y) ? -1 : 1;
            if (a.pt.x !== b.pt.x)
                return (a.pt.x < b.pt.x) ? -1 : 1;
            // Tiebreaker: when points are identical, sort by edge1's curX position
            // This provides deterministic ordering matching C# IntroSort behavior
            if (a.edge1.curX !== b.edge1.curX)
                return (a.edge1.curX < b.edge1.curX) ? -1 : 1;
            // Final tiebreaker: edge2's curX
            return (a.edge2.curX < b.edge2.curX) ? -1 : (a.edge2.curX > b.edge2.curX) ? 1 : 0;
        });
        // Now as we process these intersections, we must sometimes adjust the order
        // to ensure that intersecting edges are always adjacent ...
        for (let i = 0; i < this.intersectList.length; ++i) {
            if (!this.edgesAdjacentInAEL(this.intersectList[i])) {
                let j = i + 1;
                while (!this.edgesAdjacentInAEL(this.intersectList[j]))
                    j++;
                // swap
                [this.intersectList[j], this.intersectList[i]] = [this.intersectList[i], this.intersectList[j]];
            }
            const node = this.intersectList[i];
            this.intersectEdges(node.edge1, node.edge2, node.pt);
            this.swapPositionsInAEL(node.edge1, node.edge2);
            node.edge1.curX = node.pt.x;
            node.edge2.curX = node.pt.x;
            this.checkJoinLeft(node.edge2, node.pt, true);
            this.checkJoinRight(node.edge1, node.pt, true);
        }
    }
    edgesAdjacentInAEL(inode) {
        return (inode.edge1.nextInAEL === inode.edge2) || (inode.edge1.prevInAEL === inode.edge2);
    }
    adjustCurrXAndCopyToSEL(topY) {
        let ae = this.actives;
        this.sel = ae;
        while (ae !== null) {
            ae.prevInSEL = ae.prevInAEL;
            ae.nextInSEL = ae.nextInAEL;
            ae.jump = ae.nextInSEL;
            // it is safe to ignore 'joined' edges here because
            // if necessary they will be split in IntersectEdges()
            ae.curX = ClipperBase.topX(ae, topY);
            // NB don't update ae.curr.Y yet (see AddNewIntersectNode)
            ae = ae.nextInAEL;
        }
    }
    doMaxima(ae) {
        const prevE = ae.prevInAEL;
        let nextE = ae.nextInAEL;
        if (ClipperBase.isOpenEnd(ae)) {
            if (ClipperBase.isHotEdge(ae))
                this.addOutPt(ae, ae.top);
            if (ClipperBase.isHorizontal(ae))
                return nextE;
            if (ClipperBase.isHotEdge(ae)) {
                if (ClipperBase.isFront(ae)) {
                    ae.outrec.frontEdge = null;
                }
                else {
                    ae.outrec.backEdge = null;
                }
                ae.outrec = null;
            }
            this.deleteFromAEL(ae);
            return nextE;
        }
        const maxPair = ClipperBase.getMaximaPair(ae);
        if (maxPair === null)
            return nextE; // eMaxPair is horizontal
        if (this.isJoined(ae))
            this.split(ae, ae.top);
        if (this.isJoined(maxPair))
            this.split(maxPair, maxPair.top);
        // only non-horizontal maxima here.
        // process any edges between maxima pair ...
        while (nextE !== maxPair) {
            this.intersectEdges(ae, nextE, ae.top);
            this.swapPositionsInAEL(ae, nextE);
            nextE = ae.nextInAEL;
        }
        if (ClipperBase.isOpen(ae)) {
            if (ClipperBase.isHotEdge(ae)) {
                this.addLocalMaxPoly(ae, maxPair, ae.top);
            }
            this.deleteFromAEL(maxPair);
            this.deleteFromAEL(ae);
            return (prevE !== null ? prevE.nextInAEL : this.actives);
        }
        // here ae.nextInAel == ENext == EMaxPair ...
        if (ClipperBase.isHotEdge(ae)) {
            this.addLocalMaxPoly(ae, maxPair, ae.top);
        }
        this.deleteFromAEL(ae);
        this.deleteFromAEL(maxPair);
        return (prevE !== null ? prevE.nextInAEL : this.actives);
    }
    updateEdgeIntoAEL(ae) {
        ae.bot = { x: ae.top.x, y: ae.top.y, z: ae.top.z || 0 }; // Create copy
        ae.vertexTop = ClipperBase.nextVertex(ae);
        ae.top = { x: ae.vertexTop.pt.x, y: ae.vertexTop.pt.y, z: ae.vertexTop.pt.z || 0 }; // Create copy  
        ae.curX = ae.bot.x;
        ClipperBase.setDx(ae);
        if (this.isJoined(ae))
            this.split(ae, ae.bot);
        if (ClipperBase.isHorizontal(ae)) {
            if (!ClipperBase.isOpen(ae))
                this.trimHorz(ae, this.preserveCollinear);
            return;
        }
        this.insertScanline(ae.top.y);
        this.checkJoinLeft(ae, ae.bot);
        this.checkJoinRight(ae, ae.bot, true); // (#500)
    }
    trimHorz(horzEdge, preserveCollinear) {
        let wasTrimmed = false;
        let pt = ClipperBase.nextVertex(horzEdge).pt;
        while (pt.y === horzEdge.top.y) {
            // always trim 180 deg. spikes (in closed paths)
            // but otherwise break if preserveCollinear = true
            if (preserveCollinear &&
                (pt.x < horzEdge.top.x) !== (horzEdge.bot.x < horzEdge.top.x)) {
                break;
            }
            horzEdge.vertexTop = ClipperBase.nextVertex(horzEdge);
            horzEdge.top = pt;
            wasTrimmed = true;
            if (ClipperBase.isMaxima(horzEdge))
                break;
            pt = ClipperBase.nextVertex(horzEdge).pt;
        }
        if (wasTrimmed)
            ClipperBase.setDx(horzEdge); // +/-infinity
    }
    addToHorzSegList(op) {
        if (op.outrec.isOpen)
            return;
        this.horzSegList.push(new HorzSegment(op));
    }
    addNewIntersectNode(ae1, ae2, topY) {
        const intersectResult = Core_InternalClipper.getLineIntersectPt(ae1.bot, ae1.top, ae2.bot, ae2.top);
        let ip;
        if (!intersectResult.intersects) {
            ip = { x: ae1.curX, y: topY, z: 0 }; // parallel edges
        }
        else {
            ip = intersectResult.point;
        }
        if (ip.y > this.currentBotY || ip.y < topY) {
            const absDx1 = Math.abs(ae1.dx);
            const absDx2 = Math.abs(ae2.dx);
            if (absDx1 > 100 && absDx2 > 100) {
                if (absDx1 > absDx2) {
                    ip = Core_InternalClipper.getClosestPtOnSegment(ip, ae1.bot, ae1.top);
                }
                else {
                    ip = Core_InternalClipper.getClosestPtOnSegment(ip, ae2.bot, ae2.top);
                }
            }
            else if (absDx1 > 100) {
                ip = Core_InternalClipper.getClosestPtOnSegment(ip, ae1.bot, ae1.top);
            }
            else if (absDx2 > 100) {
                ip = Core_InternalClipper.getClosestPtOnSegment(ip, ae2.bot, ae2.top);
            }
            else {
                if (ip.y < topY)
                    ip.y = topY;
                else
                    ip.y = this.currentBotY;
                if (absDx1 < absDx2)
                    ip.x = ClipperBase.topX(ae1, ip.y);
                else
                    ip.x = ClipperBase.topX(ae2, ip.y);
            }
        }
        const node = createIntersectNode(ip, ae1, ae2);
        this.intersectList.push(node);
    }
    extractFromSEL(ae) {
        const res = ae.nextInSEL;
        if (res !== null) {
            res.prevInSEL = ae.prevInSEL;
        }
        ae.prevInSEL.nextInSEL = res;
        return res;
    }
    insert1Before2InSEL(ae1, ae2) {
        ae1.prevInSEL = ae2.prevInSEL;
        if (ae1.prevInSEL !== null) {
            ae1.prevInSEL.nextInSEL = ae1;
        }
        ae1.nextInSEL = ae2;
        ae2.prevInSEL = ae1;
    }
    getCurrYMaximaVertexOpen(ae) {
        let result = ae.vertexTop;
        if (ae.windDx > 0) {
            while (result.next.pt.y === result.pt.y &&
                ((result.flags & (Engine_VertexFlags.OpenEnd | Engine_VertexFlags.LocalMax)) === Engine_VertexFlags.None))
                result = result.next;
        }
        else {
            while (result.prev.pt.y === result.pt.y &&
                ((result.flags & (Engine_VertexFlags.OpenEnd | Engine_VertexFlags.LocalMax)) === Engine_VertexFlags.None))
                result = result.prev;
        }
        if (!ClipperBase.isMaxima(result))
            result = null; // not a maxima
        return result;
    }
    getCurrYMaximaVertex(ae) {
        let result = ae.vertexTop;
        if (ae.windDx > 0) {
            while (result.next.pt.y === result.pt.y)
                result = result.next;
        }
        else {
            while (result.prev.pt.y === result.pt.y)
                result = result.prev;
        }
        if (!ClipperBase.isMaxima(result))
            result = null; // not a maxima
        return result;
    }
    resetHorzDirection(horz, vertexMax) {
        if (horz.bot.x === horz.top.x) {
            // the horizontal edge is going nowhere ...
            const leftX = horz.curX;
            const rightX = horz.curX;
            let ae = horz.nextInAEL;
            while (ae !== null && ae.vertexTop !== vertexMax)
                ae = ae.nextInAEL;
            return { isLeftToRight: ae !== null, leftX, rightX };
        }
        if (horz.curX < horz.top.x) {
            return { isLeftToRight: true, leftX: horz.curX, rightX: horz.top.x };
        }
        else {
            return { isLeftToRight: false, leftX: horz.top.x, rightX: horz.curX };
        }
    }
    getLastOp(hotEdge) {
        const outrec = hotEdge.outrec;
        return (hotEdge === outrec.frontEdge) ?
            outrec.pts : outrec.pts.next;
    }
    insertLeftEdge(ae) {
        if (this.actives === null) {
            ae.prevInAEL = null;
            ae.nextInAEL = null;
            this.actives = ae;
        }
        else if (!this.isValidAelOrder(this.actives, ae)) {
            ae.prevInAEL = null;
            ae.nextInAEL = this.actives;
            this.actives.prevInAEL = ae;
            this.actives = ae;
        }
        else {
            let ae2 = this.actives;
            while (ae2.nextInAEL !== null && this.isValidAelOrder(ae2.nextInAEL, ae)) {
                ae2 = ae2.nextInAEL;
            }
            //don't separate joined edges
            if (ae2.joinWith === Engine_JoinWith.Right)
                ae2 = ae2.nextInAEL;
            ae.nextInAEL = ae2.nextInAEL;
            if (ae2.nextInAEL !== null)
                ae2.nextInAEL.prevInAEL = ae;
            ae.prevInAEL = ae2;
            ae2.nextInAEL = ae;
        }
    }
    insertRightEdge(ae1, ae2) {
        ae2.nextInAEL = ae1.nextInAEL;
        if (ae1.nextInAEL !== null)
            ae1.nextInAEL.prevInAEL = ae2;
        ae2.prevInAEL = ae1;
        ae1.nextInAEL = ae2;
    }
    setWindCountForOpenPathEdge(ae) {
        let ae2 = this.actives;
        if (this.fillrule === Core_FillRule.EvenOdd) {
            let cnt1 = 0, cnt2 = 0;
            while (ae2 !== ae) {
                if (ClipperBase.getPolyType(ae2) === Core_PathType.Clip) {
                    cnt2++;
                }
                else if (!ClipperBase.isOpen(ae2)) {
                    cnt1++;
                }
                ae2 = ae2.nextInAEL;
            }
            ae.windCount = (ClipperBase.isOdd(cnt1) ? 1 : 0);
            ae.windCount2 = (ClipperBase.isOdd(cnt2) ? 1 : 0);
        }
        else {
            while (ae2 !== ae) {
                if (ClipperBase.getPolyType(ae2) === Core_PathType.Clip) {
                    ae.windCount2 += ae2.windDx;
                }
                else if (!ClipperBase.isOpen(ae2)) {
                    ae.windCount += ae2.windDx;
                }
                ae2 = ae2.nextInAEL;
            }
        }
    }
    setWindCountForClosedPathEdge(ae) {
        // Wind counts refer to polygon regions not edges, so here an edge's WindCnt
        // indicates the higher of the wind counts for the two regions touching the
        // edge. (nb: Adjacent regions can only ever have their wind counts differ by
        // one. Also, open paths have no meaningful wind directions or counts.)
        let ae2 = ae.prevInAEL;
        // find the nearest closed path edge of the same PolyType in AEL (heading left)
        const pt = ClipperBase.getPolyType(ae);
        while (ae2 !== null && (ClipperBase.getPolyType(ae2) !== pt || ClipperBase.isOpen(ae2)))
            ae2 = ae2.prevInAEL;
        if (ae2 === null) {
            ae.windCount = ae.windDx;
            ae2 = this.actives;
        }
        else if (this.fillrule === Core_FillRule.EvenOdd) {
            ae.windCount = ae.windDx;
            ae.windCount2 = ae2.windCount2;
            ae2 = ae2.nextInAEL;
        }
        else {
            // NonZero, positive, or negative filling here ...
            // when e2's WindCnt is in the SAME direction as its WindDx,
            // then polygon will fill on the right of 'e2' (and 'e' will be inside)
            // nb: neither e2.WindCnt nor e2.WindDx should ever be 0.
            if (ae2.windCount * ae2.windDx < 0) {
                // opposite directions so 'ae' is outside 'ae2' ...
                if (Math.abs(ae2.windCount) > 1) {
                    // outside prev poly but still inside another.
                    if (ae2.windDx * ae.windDx < 0) {
                        // reversing direction so use the same WC
                        ae.windCount = ae2.windCount;
                    }
                    else {
                        // otherwise keep 'reducing' the WC by 1 (i.e. towards 0) ...
                        ae.windCount = ae2.windCount + ae.windDx;
                    }
                }
                else {
                    // now outside all polys of same polytype so set own WC ...
                    ae.windCount = (ClipperBase.isOpen(ae) ? 1 : ae.windDx);
                }
            }
            else {
                //'ae' must be inside 'ae2'
                if (ae2.windDx * ae.windDx < 0) {
                    // reversing direction so use the same WC
                    ae.windCount = ae2.windCount;
                }
                else {
                    // otherwise keep 'increasing' the WC by 1 (i.e. away from 0) ...
                    ae.windCount = ae2.windCount + ae.windDx;
                }
            }
            ae.windCount2 = ae2.windCount2;
            ae2 = ae2.nextInAEL; // i.e. get ready to calc WindCnt2
        }
        // update windCount2 ...
        if (this.fillrule === Core_FillRule.EvenOdd) {
            while (ae2 !== ae) {
                if (ClipperBase.getPolyType(ae2) !== pt && !ClipperBase.isOpen(ae2)) {
                    ae.windCount2 = (ae.windCount2 === 0 ? 1 : 0);
                }
                ae2 = ae2.nextInAEL;
            }
        }
        else {
            while (ae2 !== ae) {
                if (ClipperBase.getPolyType(ae2) !== pt && !ClipperBase.isOpen(ae2)) {
                    ae.windCount2 += ae2.windDx;
                }
                ae2 = ae2.nextInAEL;
            }
        }
    }
    isContributingOpen(ae) {
        let isInClip, isInSubj;
        switch (this.fillrule) {
            case Core_FillRule.Positive:
                isInSubj = ae.windCount > 0;
                isInClip = ae.windCount2 > 0;
                break;
            case Core_FillRule.Negative:
                isInSubj = ae.windCount < 0;
                isInClip = ae.windCount2 < 0;
                break;
            default:
                isInSubj = ae.windCount !== 0;
                isInClip = ae.windCount2 !== 0;
                break;
        }
        switch (this.cliptype) {
            case Core_ClipType.Intersection: return isInClip;
            case Core_ClipType.Union: return !isInSubj && !isInClip;
            default: return !isInClip;
        }
    }
    isContributingClosed(ae) {
        switch (this.fillrule) {
            case Core_FillRule.Positive:
                if (ae.windCount !== 1)
                    return false;
                break;
            case Core_FillRule.Negative:
                if (ae.windCount !== -1)
                    return false;
                break;
            case Core_FillRule.NonZero:
                if (Math.abs(ae.windCount) !== 1)
                    return false;
                break;
        }
        switch (this.cliptype) {
            case Core_ClipType.Intersection:
                return this.fillrule === Core_FillRule.Positive ? ae.windCount2 > 0 :
                    this.fillrule === Core_FillRule.Negative ? ae.windCount2 < 0 :
                        ae.windCount2 !== 0;
            case Core_ClipType.Union:
                return this.fillrule === Core_FillRule.Positive ? ae.windCount2 <= 0 :
                    this.fillrule === Core_FillRule.Negative ? ae.windCount2 >= 0 :
                        ae.windCount2 === 0;
            case Core_ClipType.Difference:
                const result = this.fillrule === Core_FillRule.Positive ? (ae.windCount2 <= 0) :
                    this.fillrule === Core_FillRule.Negative ? (ae.windCount2 >= 0) :
                        (ae.windCount2 === 0);
                return (ClipperBase.getPolyType(ae) === Core_PathType.Subject) ? result : !result;
            case Core_ClipType.Xor:
                return true; // XOr is always contributing unless open
            default:
                return false;
        }
    }
    addLocalMinPoly(ae1, ae2, pt, isNew = false) {
        const outrec = this.newOutRec();
        ae1.outrec = outrec;
        ae2.outrec = outrec;
        if (ClipperBase.isOpen(ae1)) {
            outrec.owner = null;
            outrec.isOpen = true;
            if (ae1.windDx > 0) {
                this.setSides(outrec, ae1, ae2);
            }
            else {
                this.setSides(outrec, ae2, ae1);
            }
        }
        else {
            outrec.isOpen = false;
            const prevHotEdge = ClipperBase.getPrevHotEdge(ae1);
            // e.windDx is the winding direction of the **input** paths
            // and unrelated to the winding direction of output polygons.
            // Output orientation is determined by e.outrec.frontE which is
            // the ascending edge (see AddLocalMinPoly).
            if (prevHotEdge !== null) {
                if (this.usingPolytree) {
                    this.setOwner(outrec, prevHotEdge.outrec);
                }
                outrec.owner = prevHotEdge.outrec;
                if (this.outrecIsAscending(prevHotEdge) === isNew) {
                    this.setSides(outrec, ae2, ae1);
                }
                else {
                    this.setSides(outrec, ae1, ae2);
                }
            }
            else {
                outrec.owner = null;
                if (isNew) {
                    this.setSides(outrec, ae1, ae2);
                }
                else {
                    this.setSides(outrec, ae2, ae1);
                }
            }
        }
        const op = new OutPt(pt, outrec);
        outrec.pts = op;
        return op;
    }
    outrecIsAscending(hotEdge) {
        return hotEdge === hotEdge.outrec.frontEdge;
    }
    newOutRec() {
        const result = new OutRec();
        result.idx = this.outrecList.length;
        this.outrecList.push(result);
        return result;
    }
    startOpenPath(ae, pt) {
        const outrec = this.newOutRec();
        outrec.isOpen = true;
        if (ae.windDx > 0) {
            outrec.frontEdge = ae;
            outrec.backEdge = null;
        }
        else {
            outrec.frontEdge = null;
            outrec.backEdge = ae;
        }
        ae.outrec = outrec;
        const op = new OutPt(pt, outrec);
        outrec.pts = op;
        return op;
    }
    checkJoinLeft(ae, pt, checkCurrX = false) {
        const prev = ae.prevInAEL;
        if (prev === null ||
            !ClipperBase.isHotEdge(ae) || !ClipperBase.isHotEdge(prev) ||
            ClipperBase.isHorizontal(ae) || ClipperBase.isHorizontal(prev) ||
            ClipperBase.isOpen(ae) || ClipperBase.isOpen(prev))
            return;
        if ((pt.y < ae.top.y + 2 || pt.y < prev.top.y + 2) && // avoid trivial joins
            ((ae.bot.y > pt.y) || (prev.bot.y > pt.y)))
            return; // (#490)
        if (checkCurrX) {
            if (this.perpendicDistFromLineSqrd(pt, prev.bot, prev.top) > 0.25)
                return;
        }
        else if (ae.curX !== prev.curX)
            return;
        if (!Core_InternalClipper.isCollinear(ae.top, pt, prev.top))
            return;
        if (ae.outrec.idx === prev.outrec.idx) {
            this.addLocalMaxPoly(prev, ae, pt);
        }
        else if (ae.outrec.idx < prev.outrec.idx) {
            this.joinOutrecPaths(ae, prev);
        }
        else {
            this.joinOutrecPaths(prev, ae);
        }
        prev.joinWith = Engine_JoinWith.Right;
        ae.joinWith = Engine_JoinWith.Left;
    }
    checkJoinRight(ae, pt, checkCurrX = false) {
        const next = ae.nextInAEL;
        if (next === null ||
            !ClipperBase.isHotEdge(ae) || !ClipperBase.isHotEdge(next) ||
            ClipperBase.isHorizontal(ae) || ClipperBase.isHorizontal(next) ||
            ClipperBase.isOpen(ae) || ClipperBase.isOpen(next))
            return;
        if ((pt.y < ae.top.y + 2 || pt.y < next.top.y + 2) && // avoid trivial joins
            ((ae.bot.y > pt.y) || (next.bot.y > pt.y)))
            return; // (#490)
        if (checkCurrX) {
            if (this.perpendicDistFromLineSqrd(pt, next.bot, next.top) > 0.25)
                return;
        }
        else if (ae.curX !== next.curX)
            return;
        if (!Core_InternalClipper.isCollinear(ae.top, pt, next.top))
            return;
        if (ae.outrec.idx === next.outrec.idx) {
            this.addLocalMaxPoly(ae, next, pt);
        }
        else if (ae.outrec.idx < next.outrec.idx) {
            this.joinOutrecPaths(ae, next);
        }
        else {
            this.joinOutrecPaths(next, ae);
        }
        ae.joinWith = Engine_JoinWith.Right;
        next.joinWith = Engine_JoinWith.Left;
    }
    perpendicDistFromLineSqrd(pt, line1, line2) {
        const a = pt.x - line1.x;
        const b = pt.y - line1.y;
        const c = line2.x - line1.x;
        const d = line2.y - line1.y;
        if (c === 0 && d === 0)
            return 0;
        return ((a * d - c * b) * (a * d - c * b)) / (c * c + d * d);
    }
    intersectEdges(ae1, ae2, pt) {
        let resultOp = null;
        // MANAGE OPEN PATH INTERSECTIONS SEPARATELY ...
        if (this.hasOpenPaths && (ClipperBase.isOpen(ae1) || ClipperBase.isOpen(ae2))) {
            if (ClipperBase.isOpen(ae1) && ClipperBase.isOpen(ae2))
                return;
            // the following line avoids duplicating quite a bit of code
            if (ClipperBase.isOpen(ae2))
                [ae1, ae2] = ClipperBase.swapActives(ae1, ae2);
            if (this.isJoined(ae2))
                this.split(ae2, pt); // needed for safety
            if (this.cliptype === Core_ClipType.Union) {
                if (!ClipperBase.isHotEdge(ae2))
                    return;
            }
            else if (ae2.localMin.polytype === Core_PathType.Subject)
                return;
            switch (this.fillrule) {
                case Core_FillRule.Positive:
                    if (ae2.windCount !== 1)
                        return;
                    break;
                case Core_FillRule.Negative:
                    if (ae2.windCount !== -1)
                        return;
                    break;
                default:
                    if (Math.abs(ae2.windCount) !== 1)
                        return;
                    break;
            }
            // toggle contribution ...
            if (ClipperBase.isHotEdge(ae1)) {
                resultOp = this.addOutPt(ae1, pt);
                this.setZ(ae1, ae2, resultOp.pt);
                if (ClipperBase.isFront(ae1)) {
                    ae1.outrec.frontEdge = null;
                }
                else {
                    ae1.outrec.backEdge = null;
                }
                ae1.outrec = null;
            }
            // horizontal edges can pass under open paths at a LocMins
            else if (pt.x === ae1.localMin.vertex.pt.x && pt.y === ae1.localMin.vertex.pt.y &&
                !ClipperBase.isOpenEndVertex(ae1.localMin.vertex)) {
                // find the other side of the LocMin and
                // if it's 'hot' join up with it ...
                const ae3 = this.findEdgeWithMatchingLocMin(ae1);
                if (ae3 !== null && ClipperBase.isHotEdge(ae3)) {
                    ae1.outrec = ae3.outrec;
                    if (ae1.windDx > 0) {
                        this.setSides(ae3.outrec, ae1, ae3);
                    }
                    else {
                        this.setSides(ae3.outrec, ae3, ae1);
                    }
                    return;
                }
                resultOp = this.startOpenPath(ae1, pt);
            }
            else {
                resultOp = this.startOpenPath(ae1, pt);
            }
            this.setZ(ae1, ae2, resultOp.pt);
            return;
        }
        // MANAGING CLOSED PATHS FROM HERE ON
        if (this.isJoined(ae1))
            this.split(ae1, pt);
        if (this.isJoined(ae2))
            this.split(ae2, pt);
        // UPDATE WINDING COUNTS...
        let oldE1WindCount, oldE2WindCount;
        if (ae1.localMin.polytype === ae2.localMin.polytype) {
            if (this.fillrule === Core_FillRule.EvenOdd) {
                oldE1WindCount = ae1.windCount;
                ae1.windCount = ae2.windCount;
                ae2.windCount = oldE1WindCount;
            }
            else {
                if (ae1.windCount + ae2.windDx === 0) {
                    ae1.windCount = -ae1.windCount;
                }
                else {
                    ae1.windCount += ae2.windDx;
                }
                if (ae2.windCount - ae1.windDx === 0) {
                    ae2.windCount = -ae2.windCount;
                }
                else {
                    ae2.windCount -= ae1.windDx;
                }
            }
        }
        else {
            if (this.fillrule !== Core_FillRule.EvenOdd) {
                ae1.windCount2 += ae2.windDx;
            }
            else {
                ae1.windCount2 = (ae1.windCount2 === 0 ? 1 : 0);
            }
            if (this.fillrule !== Core_FillRule.EvenOdd) {
                ae2.windCount2 -= ae1.windDx;
            }
            else {
                ae2.windCount2 = (ae2.windCount2 === 0 ? 1 : 0);
            }
        }
        switch (this.fillrule) {
            case Core_FillRule.Positive:
                oldE1WindCount = ae1.windCount;
                oldE2WindCount = ae2.windCount;
                break;
            case Core_FillRule.Negative:
                oldE1WindCount = -ae1.windCount;
                oldE2WindCount = -ae2.windCount;
                break;
            default:
                oldE1WindCount = Math.abs(ae1.windCount);
                oldE2WindCount = Math.abs(ae2.windCount);
                break;
        }
        const e1WindCountIs0or1 = oldE1WindCount === 0 || oldE1WindCount === 1;
        const e2WindCountIs0or1 = oldE2WindCount === 0 || oldE2WindCount === 1;
        if ((!ClipperBase.isHotEdge(ae1) && !e1WindCountIs0or1) ||
            (!ClipperBase.isHotEdge(ae2) && !e2WindCountIs0or1))
            return;
        // NOW PROCESS THE INTERSECTION ...
        // if both edges are 'hot' ...
        if (ClipperBase.isHotEdge(ae1) && ClipperBase.isHotEdge(ae2)) {
            if ((oldE1WindCount !== 0 && oldE1WindCount !== 1) || (oldE2WindCount !== 0 && oldE2WindCount !== 1) ||
                (ae1.localMin.polytype !== ae2.localMin.polytype && this.cliptype !== Core_ClipType.Xor)) {
                resultOp = this.addLocalMaxPoly(ae1, ae2, pt);
                if (resultOp)
                    this.setZ(ae1, ae2, resultOp.pt);
            }
            else if (ClipperBase.isFront(ae1) || (ae1.outrec === ae2.outrec)) {
                // this 'else if' condition isn't strictly needed but
                // it's sensible to split polygons that only touch at
                // a common vertex (not at common edges).
                resultOp = this.addLocalMaxPoly(ae1, ae2, pt);
                if (resultOp)
                    this.setZ(ae1, ae2, resultOp.pt);
                const op2 = this.addLocalMinPoly(ae1, ae2, pt);
                this.setZ(ae1, ae2, op2.pt);
            }
            else {
                // can't treat as maxima & minima
                resultOp = this.addOutPt(ae1, pt);
                this.setZ(ae1, ae2, resultOp.pt);
                const op2 = this.addOutPt(ae2, pt);
                this.setZ(ae1, ae2, op2.pt);
                this.swapOutrecs(ae1, ae2);
            }
        }
        // if one or other edge is 'hot' ...
        else if (ClipperBase.isHotEdge(ae1)) {
            resultOp = this.addOutPt(ae1, pt);
            this.setZ(ae1, ae2, resultOp.pt);
            this.swapOutrecs(ae1, ae2);
        }
        else if (ClipperBase.isHotEdge(ae2)) {
            resultOp = this.addOutPt(ae2, pt);
            this.setZ(ae1, ae2, resultOp.pt);
            this.swapOutrecs(ae1, ae2);
        }
        // neither edge is 'hot'
        else {
            let e1Wc2, e2Wc2;
            switch (this.fillrule) {
                case Core_FillRule.Positive:
                    e1Wc2 = ae1.windCount2;
                    e2Wc2 = ae2.windCount2;
                    break;
                case Core_FillRule.Negative:
                    e1Wc2 = -ae1.windCount2;
                    e2Wc2 = -ae2.windCount2;
                    break;
                default:
                    e1Wc2 = Math.abs(ae1.windCount2);
                    e2Wc2 = Math.abs(ae2.windCount2);
                    break;
            }
            if (!ClipperBase.isSamePolyType(ae1, ae2)) {
                resultOp = this.addLocalMinPoly(ae1, ae2, pt);
                this.setZ(ae1, ae2, resultOp.pt);
            }
            else if (oldE1WindCount === 1 && oldE2WindCount === 1) {
                resultOp = null;
                switch (this.cliptype) {
                    case Core_ClipType.Union:
                        if (e1Wc2 > 0 && e2Wc2 > 0)
                            return;
                        resultOp = this.addLocalMinPoly(ae1, ae2, pt);
                        break;
                    case Core_ClipType.Difference:
                        if (((ClipperBase.getPolyType(ae1) === Core_PathType.Clip) && (e1Wc2 > 0) && (e2Wc2 > 0)) ||
                            ((ClipperBase.getPolyType(ae1) === Core_PathType.Subject) && (e1Wc2 <= 0) && (e2Wc2 <= 0))) {
                            resultOp = this.addLocalMinPoly(ae1, ae2, pt);
                        }
                        break;
                    case Core_ClipType.Xor:
                        resultOp = this.addLocalMinPoly(ae1, ae2, pt);
                        break;
                    default: // ClipType.Intersection:
                        if (e1Wc2 <= 0 || e2Wc2 <= 0)
                            return;
                        resultOp = this.addLocalMinPoly(ae1, ae2, pt);
                        break;
                }
                if (resultOp)
                    this.setZ(ae1, ae2, resultOp.pt);
            }
        }
    }
    swapPositionsInAEL(ae1, ae2) {
        // preconditon: ae1 must be immediately to the left of ae2
        const next = ae2.nextInAEL;
        if (next !== null)
            next.prevInAEL = ae1;
        const prev = ae1.prevInAEL;
        if (prev !== null)
            prev.nextInAEL = ae2;
        ae2.prevInAEL = prev;
        ae2.nextInAEL = ae1;
        ae1.prevInAEL = ae2;
        ae1.nextInAEL = next;
        if (ae2.prevInAEL === null)
            this.actives = ae2;
    }
    isValidAelOrder(resident, newcomer) {
        if (newcomer.curX !== resident.curX) {
            return newcomer.curX > resident.curX;
        }
        // get the turning direction  a1.top, a2.bot, a2.top
        const d = Core_InternalClipper.crossProduct(resident.top, newcomer.bot, newcomer.top);
        if (d !== 0)
            return d < 0;
        // edges must be collinear to get here
        // for starting open paths, place them according to
        // the direction they're about to turn
        if (!ClipperBase.isMaxima(resident) && (resident.top.y > newcomer.top.y)) {
            return Core_InternalClipper.crossProduct(newcomer.bot, resident.top, ClipperBase.nextVertex(resident).pt) <= 0;
        }
        if (!ClipperBase.isMaxima(newcomer) && (newcomer.top.y > resident.top.y)) {
            return Core_InternalClipper.crossProduct(newcomer.bot, newcomer.top, ClipperBase.nextVertex(newcomer).pt) >= 0;
        }
        const y = newcomer.bot.y;
        const newcomerIsLeft = newcomer.isLeftBound;
        if (resident.bot.y !== y || resident.localMin.vertex.pt.y !== y) {
            return newcomer.isLeftBound;
        }
        // resident must also have just been inserted
        if (resident.isLeftBound !== newcomerIsLeft) {
            return newcomerIsLeft;
        }
        if (Core_InternalClipper.isCollinear(ClipperBase.prevPrevVertex(resident).pt, resident.bot, resident.top))
            return true;
        // compare turning direction of the alternate bound
        return (Core_InternalClipper.crossProduct(ClipperBase.prevPrevVertex(resident).pt, newcomer.bot, ClipperBase.prevPrevVertex(newcomer).pt) > 0) === newcomerIsLeft;
    }
    isJoined(e) {
        return e.joinWith !== Engine_JoinWith.None;
    }
    split(e, currPt) {
        if (e.joinWith === Engine_JoinWith.Right) {
            e.joinWith = Engine_JoinWith.None;
            e.nextInAEL.joinWith = Engine_JoinWith.None;
            this.addLocalMinPoly(e, e.nextInAEL, currPt, true);
        }
        else {
            e.joinWith = Engine_JoinWith.None;
            e.prevInAEL.joinWith = Engine_JoinWith.None;
            this.addLocalMinPoly(e.prevInAEL, e, currPt, true);
        }
    }
    setSides(outrec, startEdge, endEdge) {
        outrec.frontEdge = startEdge;
        outrec.backEdge = endEdge;
    }
    findEdgeWithMatchingLocMin(e) {
        let result = e.nextInAEL;
        while (result !== null) {
            if (result.localMin?.equals(e.localMin))
                return result;
            if (!ClipperBase.isHorizontal(result) && !(e.bot.x === result.bot.x && e.bot.y === result.bot.y))
                result = null;
            else
                result = result.nextInAEL;
        }
        result = e.prevInAEL;
        while (result !== null) {
            if (result.localMin?.equals(e.localMin))
                return result;
            if (!ClipperBase.isHorizontal(result) && !(e.bot.x === result.bot.x && e.bot.y === result.bot.y))
                return null;
            result = result.prevInAEL;
        }
        return result;
    }
    addOutPt(ae, pt) {
        // Outrec.OutPts: a circular doubly-linked-list of POutPt where ...
        // opFront[.Prev]* ~~~> opBack & opBack == opFront.Next
        const outrec = ae.outrec;
        const toFront = ClipperBase.isFront(ae);
        const opFront = outrec.pts;
        const opBack = opFront.next;
        if (toFront && pt.x === opFront.pt.x && pt.y === opFront.pt.y) {
            return opFront;
        }
        else if (!toFront && pt.x === opBack.pt.x && pt.y === opBack.pt.y) {
            return opBack;
        }
        const newOp = new OutPt(pt, outrec);
        opBack.prev = newOp;
        newOp.prev = opFront;
        newOp.next = opBack;
        opFront.next = newOp;
        if (toFront)
            outrec.pts = newOp;
        return newOp;
    }
    addLocalMaxPoly(ae1, ae2, pt) {
        if (this.isJoined(ae1))
            this.split(ae1, pt);
        if (this.isJoined(ae2))
            this.split(ae2, pt);
        if (ClipperBase.isFront(ae1) === ClipperBase.isFront(ae2)) {
            if (ClipperBase.isOpenEnd(ae1)) {
                this.swapFrontBackSides(ae1.outrec);
            }
            else if (ClipperBase.isOpenEnd(ae2)) {
                this.swapFrontBackSides(ae2.outrec);
            }
            else {
                this.succeeded = false;
                return null;
            }
        }
        const result = this.addOutPt(ae1, pt);
        if (ae1.outrec === ae2.outrec) {
            const outrec = ae1.outrec;
            outrec.pts = result;
            if (this.usingPolytree) {
                const e = ClipperBase.getPrevHotEdge(ae1);
                if (e === null) {
                    outrec.owner = null;
                }
                else {
                    this.setOwner(outrec, e.outrec);
                }
                // nb: outRec.owner here is likely NOT the real
                // owner but this will be fixed in DeepCheckOwner()
            }
            this.uncoupleOutRec(ae1);
        }
        // and to preserve the winding orientation of outrec ...
        else if (ClipperBase.isOpen(ae1)) {
            if (ae1.windDx < 0) {
                this.joinOutrecPaths(ae1, ae2);
            }
            else {
                this.joinOutrecPaths(ae2, ae1);
            }
        }
        else if (ae1.outrec.idx < ae2.outrec.idx) {
            this.joinOutrecPaths(ae1, ae2);
        }
        else {
            this.joinOutrecPaths(ae2, ae1);
        }
        return result;
    }
    swapFrontBackSides(outrec) {
        // while this proc. is needed for open paths
        // it's almost never needed for closed paths
        const ae2 = outrec.frontEdge;
        outrec.frontEdge = outrec.backEdge;
        outrec.backEdge = ae2;
        outrec.pts = outrec.pts.next;
    }
    setOwner(outrec, newOwner) {
        //precondition1: new_owner is never null
        while (newOwner.owner !== null && newOwner.owner.pts === null) {
            newOwner.owner = newOwner.owner.owner;
        }
        //make sure that outrec isn't an owner of newOwner
        let tmp = newOwner;
        while (tmp !== null && tmp !== outrec) {
            tmp = tmp.owner;
        }
        if (tmp !== null) {
            newOwner.owner = outrec.owner;
        }
        outrec.owner = newOwner;
    }
    uncoupleOutRec(ae) {
        const outrec = ae.outrec;
        if (outrec === null)
            return;
        outrec.frontEdge.outrec = null;
        outrec.backEdge.outrec = null;
        outrec.frontEdge = null;
        outrec.backEdge = null;
    }
    joinOutrecPaths(ae1, ae2) {
        // join ae2 outrec path onto ae1 outrec path and then delete ae2 outrec path
        // pointers. (NB Only very rarely do the joining ends share the same coords.)
        const p1Start = ae1.outrec.pts;
        const p2Start = ae2.outrec.pts;
        const p1End = p1Start.next;
        const p2End = p2Start.next;
        if (ClipperBase.isFront(ae1)) {
            p2End.prev = p1Start;
            p1Start.next = p2End;
            p2Start.next = p1End;
            p1End.prev = p2Start;
            ae1.outrec.pts = p2Start;
            // nb: if IsOpen(e1) then e1 & e2 must be a 'maximaPair'
            ae1.outrec.frontEdge = ae2.outrec.frontEdge;
            if (ae1.outrec.frontEdge !== null) {
                ae1.outrec.frontEdge.outrec = ae1.outrec;
            }
        }
        else {
            p1End.prev = p2Start;
            p2Start.next = p1End;
            p1Start.next = p2End;
            p2End.prev = p1Start;
            ae1.outrec.backEdge = ae2.outrec.backEdge;
            if (ae1.outrec.backEdge !== null) {
                ae1.outrec.backEdge.outrec = ae1.outrec;
            }
        }
        // after joining, the ae2.OutRec must contains no vertices ...
        ae2.outrec.frontEdge = null;
        ae2.outrec.backEdge = null;
        ae2.outrec.pts = null;
        this.setOwner(ae2.outrec, ae1.outrec);
        if (ClipperBase.isOpenEnd(ae1)) {
            ae2.outrec.pts = ae1.outrec.pts;
            ae1.outrec.pts = null;
        }
        // and ae1 and ae2 are maxima and are about to be dropped from the Actives list.
        ae1.outrec = null;
        ae2.outrec = null;
    }
    swapOutrecs(ae1, ae2) {
        const or1 = ae1.outrec; // at least one edge has 
        const or2 = ae2.outrec; // an assigned outrec
        if (or1 === or2) {
            const ae = or1.frontEdge;
            or1.frontEdge = or1.backEdge;
            or1.backEdge = ae;
            return;
        }
        if (or1 !== null) {
            if (ae1 === or1.frontEdge) {
                or1.frontEdge = ae2;
            }
            else {
                or1.backEdge = ae2;
            }
        }
        if (or2 !== null) {
            if (ae2 === or2.frontEdge) {
                or2.frontEdge = ae1;
            }
            else {
                or2.backEdge = ae1;
            }
        }
        ae1.outrec = or2;
        ae2.outrec = or1;
    }
    disposeIntersectNodes() {
        this.intersectList.length = 0;
    }
    static ptsReallyClose(pt1, pt2) {
        return (Math.abs(pt1.x - pt2.x) < 2) && (Math.abs(pt1.y - pt2.y) < 2);
    }
    static isVerySmallTriangle(op) {
        return op.next.next === op.prev &&
            (ClipperBase.ptsReallyClose(op.prev.pt, op.next.pt) ||
                ClipperBase.ptsReallyClose(op.pt, op.next.pt) ||
                ClipperBase.ptsReallyClose(op.pt, op.prev.pt));
    }
    static buildPath(op, reverse, isOpen, path) {
        if (op === null || op.next === op || (!isOpen && op.next === op.prev))
            return false;
        path.length = 0;
        let lastPt;
        let op2;
        if (reverse) {
            lastPt = op.pt;
            op2 = op.prev;
        }
        else {
            op = op.next;
            lastPt = op.pt;
            op2 = op.next;
        }
        path.push(lastPt);
        while (op2 !== op) {
            if (!(op2.pt.x === lastPt.x && op2.pt.y === lastPt.y)) {
                lastPt = op2.pt;
                path.push(lastPt);
            }
            if (reverse) {
                op2 = op2.prev;
            }
            else {
                op2 = op2.next;
            }
        }
        return path.length !== 3 || isOpen || !ClipperBase.isVerySmallTriangle(op2);
    }
    buildPaths(solutionClosed, solutionOpen) {
        solutionClosed.length = 0;
        solutionOpen.length = 0;
        let i = 0;
        // outrecList.length is not static here because
        // CleanCollinear can indirectly add additional OutRec
        while (i < this.outrecList.length) {
            const outrec = this.outrecList[i++];
            if (outrec.pts === null)
                continue;
            const path = [];
            if (outrec.isOpen) {
                if (ClipperBase.buildPath(outrec.pts, this.reverseSolution, true, path)) {
                    solutionOpen.push(path);
                }
            }
            else {
                this.cleanCollinear(outrec);
                // closed paths should always return a Positive orientation
                // except when ReverseSolution == true
                if (ClipperBase.buildPath(outrec.pts, this.reverseSolution, false, path)) {
                    solutionClosed.push(path);
                }
            }
        }
        return true;
    }
    buildTree(polytree, solutionOpen) {
        polytree.clear();
        solutionOpen.length = 0;
        let i = 0;
        // outrecList.length is not static here because
        // checkBounds below can indirectly add additional
        // OutRec (via FixOutRecPts & CleanCollinear)
        while (i < this.outrecList.length) {
            const outrec = this.outrecList[i++];
            if (outrec.pts === null)
                continue;
            if (outrec.isOpen) {
                const openPath = [];
                if (ClipperBase.buildPath(outrec.pts, this.reverseSolution, true, openPath)) {
                    solutionOpen.push(openPath);
                }
                continue;
            }
            if (this.checkBounds(outrec)) {
                this.recursiveCheckOwners(outrec, polytree);
            }
        }
    }
    checkBounds(outrec) {
        if (outrec.pts === null)
            return false;
        if (!Core_Rect64Utils.isEmpty(outrec.bounds))
            return true;
        this.cleanCollinear(outrec);
        if (outrec.pts === null ||
            !ClipperBase.buildPath(outrec.pts, this.reverseSolution, false, outrec.path)) {
            return false;
        }
        outrec.bounds = Core_InternalClipper.getBounds(outrec.path);
        return true;
    }
    recursiveCheckOwners(outrec, polypath) {
        // pre-condition: outrec will have valid bounds
        // post-condition: if a valid path, outrec will have a polypath
        if (outrec.polypath !== null || Core_Rect64Utils.isEmpty(outrec.bounds))
            return;
        while (outrec.owner !== null) {
            if (outrec.owner.splits !== null &&
                this.checkSplitOwner(outrec, outrec.owner.splits))
                break;
            if (outrec.owner.pts !== null && this.checkBounds(outrec.owner) &&
                // Fast reject: a container must contain the child's bounds.
                this.containsRect(outrec.owner.bounds, outrec.bounds) &&
                this.path1InsidePath2(outrec.pts, outrec.owner.pts))
                break;
            outrec.owner = outrec.owner.owner;
        }
        if (outrec.owner !== null) {
            if (outrec.owner.polypath === null) {
                this.recursiveCheckOwners(outrec.owner, polypath);
            }
            outrec.polypath = outrec.owner.polypath.addChild(outrec.path);
        }
        else {
            outrec.polypath = polypath.addChild(outrec.path);
        }
    }
    cleanCollinear(outrec) {
        outrec = this.getRealOutRec(outrec);
        if (outrec === null || outrec.isOpen)
            return;
        if (!this.isValidClosedPath(outrec.pts)) {
            outrec.pts = null;
            return;
        }
        let startOp = outrec.pts;
        let op2 = startOp;
        while (true) {
            // NB if preserveCollinear == true, then only remove 180 deg. spikes
            if (op2 !== null && Core_InternalClipper.isCollinear(op2.prev.pt, op2.pt, op2.next.pt) &&
                ((op2.pt.x === op2.prev.pt.x && op2.pt.y === op2.prev.pt.y) ||
                    (op2.pt.x === op2.next.pt.x && op2.pt.y === op2.next.pt.y) ||
                    !this.preserveCollinear ||
                    Core_InternalClipper.dotProduct(op2.prev.pt, op2.pt, op2.next.pt) < 0)) {
                if (op2 === outrec.pts) {
                    outrec.pts = op2.prev;
                }
                op2 = this.disposeOutPt(op2);
                if (!this.isValidClosedPath(op2)) {
                    outrec.pts = null;
                    return;
                }
                startOp = op2;
                continue;
            }
            if (op2 === null)
                break;
            op2 = op2.next;
            if (op2 === startOp)
                break;
        }
        this.fixSelfIntersects(outrec);
    }
    isValidClosedPath(op) {
        return op !== null && op.next !== op &&
            (op.next !== op.prev || !ClipperBase.isVerySmallTriangle(op));
    }
    disposeOutPt(op) {
        const result = (op.next === op ? null : op.next);
        op.prev.next = op.next;
        op.next.prev = op.prev;
        return result;
    }
    fixSelfIntersects(outrec) {
        let op2 = outrec.pts;
        if (op2.prev === op2.next.next) {
            return; // because triangles can't self-intersect
        }
        while (true) {
            if (op2.next && op2.next.next &&
                // optimization (not in C# reference): bbox check before segsIntersect  
                this.boundingBoxesOverlap(op2.prev.pt, op2.pt, op2.next.pt, op2.next.next.pt) && // TEST: Bbox only
                Core_InternalClipper.segsIntersect(op2.prev.pt, op2.pt, op2.next.pt, op2.next.next.pt)) {
                if (op2.next.next.next &&
                    // optimization (not in C# reference): bbox check before segsIntersect
                    this.boundingBoxesOverlap(op2.prev.pt, op2.pt, op2.next.next.pt, op2.next.next.next.pt) && // TEST: Bbox only
                    Core_InternalClipper.segsIntersect(op2.prev.pt, op2.pt, op2.next.next.pt, op2.next.next.next.pt)) {
                    // adjacent intersections (ie a micro self-intersection)
                    op2 = this.duplicateOp(op2, false);
                    op2.pt = op2.next.next.next.pt;
                    op2 = op2.next;
                }
                else {
                    if (op2 === outrec.pts || op2.next === outrec.pts) {
                        outrec.pts = outrec.pts.prev;
                    }
                    this.doSplitOp(outrec, op2);
                    if (outrec.pts === null)
                        return;
                    op2 = outrec.pts;
                    // triangles can't self-intersect
                    if (op2.prev === op2.next.next)
                        break;
                    continue;
                }
            }
            op2 = op2.next;
            if (op2 === outrec.pts)
                break;
        }
    }
    doSplitOp(outrec, splitOp) {
        // splitOp.prev <=> splitOp &&
        // splitOp.next <=> splitOp.next.next are intersecting
        const prevOp = splitOp.prev;
        const nextNextOp = splitOp.next.next;
        outrec.pts = prevOp;
        const intersectResult = Core_InternalClipper.getLineIntersectPt(prevOp.pt, splitOp.pt, splitOp.next.pt, nextNextOp.pt);
        const ip = intersectResult.point;
        const area1 = ClipperBase.areaOutPt(prevOp);
        const absArea1 = Math.abs(area1);
        if (absArea1 < 2) {
            outrec.pts = null;
            return;
        }
        const area2 = this.areaTriangle(ip, splitOp.pt, splitOp.next.pt);
        const absArea2 = Math.abs(area2);
        // de-link splitOp and splitOp.next from the path
        // while inserting the intersection point
        if ((ip.x === prevOp.pt.x && ip.y === prevOp.pt.y) || (ip.x === nextNextOp.pt.x && ip.y === nextNextOp.pt.y)) {
            nextNextOp.prev = prevOp;
            prevOp.next = nextNextOp;
        }
        else {
            const newOp2 = new OutPt(ip, outrec);
            newOp2.prev = prevOp;
            newOp2.next = nextNextOp;
            nextNextOp.prev = newOp2;
            prevOp.next = newOp2;
        }
        if (!(absArea2 > 1) ||
            (!(absArea2 > absArea1) &&
                ((area2 > 0) !== (area1 > 0))))
            return;
        const newOutRec = this.newOutRec();
        newOutRec.owner = outrec.owner;
        splitOp.outrec = newOutRec;
        splitOp.next.outrec = newOutRec;
        const newOp = new OutPt(ip, newOutRec);
        newOp.prev = splitOp.next;
        newOp.next = splitOp;
        newOutRec.pts = newOp;
        splitOp.prev = newOp;
        splitOp.next.next = newOp;
        if (!this.usingPolytree)
            return;
        if (this.path1InsidePath2(prevOp, newOp)) {
            if (newOutRec.splits === null)
                newOutRec.splits = [];
            newOutRec.splits.push(outrec.idx);
        }
        else {
            if (outrec.splits === null)
                outrec.splits = [];
            outrec.splits.push(newOutRec.idx);
        }
    }
    static areaOutPt(op) {
        // https://en.wikipedia.org/wiki/Shoelace_formula
        let area = 0.0;
        let op2 = op;
        do {
            area += (op2.prev.pt.y + op2.pt.y) * (op2.prev.pt.x - op2.pt.x);
            op2 = op2.next;
        } while (op2 !== op);
        return area * 0.5;
    }
    areaTriangle(pt1, pt2, pt3) {
        return ((pt3.y + pt1.y) * (pt3.x - pt1.x) +
            (pt1.y + pt2.y) * (pt1.x - pt2.x) +
            (pt2.y + pt3.y) * (pt2.x - pt3.x));
    }
    isValidOwner(outRec, testOwner) {
        while (testOwner !== null && testOwner !== outRec) {
            testOwner = testOwner.owner;
        }
        return testOwner === null;
    }
    containsRect(rect, rec) {
        return rec.left >= rect.left && rec.right <= rect.right &&
            rec.top >= rect.top && rec.bottom <= rect.bottom;
    }
    checkSplitOwner(outrec, splits) {
        // nb: use indexing (not an iterator) in case 'splits' is modified inside this loop (#1029)
        for (let i = 0; i < splits.length; i++) {
            let split = this.outrecList[splits[i]];
            if (split.pts === null && split.splits !== null &&
                this.checkSplitOwner(outrec, split.splits))
                return true; // #942
            split = this.getRealOutRec(split);
            if (split === null || split === outrec || split.recursiveSplit === outrec)
                continue;
            split.recursiveSplit = outrec; // #599
            if (split.splits !== null && this.checkSplitOwner(outrec, split.splits))
                return true;
            if (!this.checkBounds(split) ||
                !this.containsRect(split.bounds, outrec.bounds) ||
                !this.path1InsidePath2(outrec.pts, split.pts))
                continue;
            if (!this.isValidOwner(outrec, split)) { // split is owned by outrec (#957)
                split.owner = outrec.owner;
            }
            outrec.owner = split; // found in split
            return true;
        }
        return false;
    }
}
class Clipper64 extends ClipperBase {
    zCallback;
    getZCallback() {
        return this.zCallback;
    }
    addPath(path, polytype, isOpen = false) {
        super.addPath(path, polytype, isOpen);
    }
    addReuseableData(reuseableData) {
        super.addReuseableData(reuseableData);
    }
    addPaths(paths, polytype, isOpen = false) {
        super.addPaths(paths, polytype, isOpen);
    }
    addSubject(paths) {
        this.addPaths(paths, Core_PathType.Subject);
    }
    addOpenSubject(paths) {
        this.addPaths(paths, Core_PathType.Subject, true);
    }
    addClip(paths) {
        this.addPaths(paths, Core_PathType.Clip);
    }
    execute(clipType, fillRule, solutionOrTree, openPathsOrSolutionOpen) {
        if (Array.isArray(solutionOrTree)) {
            // Paths64 version
            const solutionClosed = solutionOrTree;
            const solutionOpen = openPathsOrSolutionOpen;
            solutionClosed.length = 0;
            if (solutionOpen)
                solutionOpen.length = 0;
            try {
                this.executeInternal(clipType, fillRule);
                this.buildPaths(solutionClosed, solutionOpen || []);
            }
            catch {
                this.succeeded = false;
            }
            this.clearSolutionOnly();
            return this.succeeded;
        }
        else {
            // PolyTree64 version
            const polytree = solutionOrTree;
            const openPaths = openPathsOrSolutionOpen;
            polytree.clear();
            if (openPaths)
                openPaths.length = 0;
            this.usingPolytree = true;
            try {
                this.executeInternal(clipType, fillRule);
                this.buildTree(polytree, openPaths || []);
            }
            catch {
                this.succeeded = false;
            }
            this.clearSolutionOnly();
            return this.succeeded;
        }
    }
}
class ClipperD extends ClipperBase {
    zCallback;
    scale;
    invScale;
    constructor(roundingDecimalPrecision = 2) {
        super();
        Core_InternalClipper.checkPrecision(roundingDecimalPrecision);
        this.scale = Math.pow(10, roundingDecimalPrecision);
        this.invScale = 1 / this.scale;
    }
    getZCallback() {
        return this.zCallback;
    }
    scalePathDFromInt(path, scale) {
        const result = [];
        for (const pt of path) {
            result.push({
                x: pt.x * scale,
                y: pt.y * scale,
                z: pt.z || 0
            });
        }
        return result;
    }
    buildPathsD(solutionClosed, solutionOpen) {
        solutionClosed.length = 0;
        solutionOpen.length = 0;
        let i = 0;
        // outrecList.length is not static here because
        // CleanCollinear can indirectly add additional OutRec
        while (i < this.outrecList.length) {
            const outrec = this.outrecList[i++];
            if (outrec.pts === null)
                continue;
            const path = [];
            if (outrec.isOpen) {
                if (ClipperBase.buildPath(outrec.pts, this.reverseSolution, true, path)) {
                    solutionOpen.push(this.scalePathDFromInt(path, this.invScale));
                }
            }
            else {
                this.cleanCollinear(outrec);
                // closed paths should always return a Positive orientation
                // except when ReverseSolution == true
                if (ClipperBase.buildPath(outrec.pts, this.reverseSolution, false, path)) {
                    solutionClosed.push(this.scalePathDFromInt(path, this.invScale));
                }
            }
        }
        return true;
    }
    buildTreeD(polytree, solutionOpen) {
        polytree.clear();
        solutionOpen.length = 0;
        let i = 0;
        // outrecList.length is not static here because
        // BuildPathD below can indirectly add additional OutRec
        while (i < this.outrecList.length) {
            const outrec = this.outrecList[i++];
            if (outrec.pts === null)
                continue;
            if (outrec.isOpen) {
                const openPath = [];
                if (ClipperBase.buildPath(outrec.pts, this.reverseSolution, true, openPath)) {
                    solutionOpen.push(this.scalePathDFromInt(openPath, this.invScale));
                }
                continue;
            }
            if (this.checkBounds(outrec)) {
                this.recursiveCheckOwners(outrec, polytree);
            }
        }
    }
    addPath(path, polytype, isOpen = false) {
        super.addPath(Engine_Clipper.scalePath64(path, this.scale), polytype, isOpen);
    }
    addPaths(paths, polytype, isOpen = false) {
        super.addPaths(Engine_Clipper.scalePaths64(paths, this.scale), polytype, isOpen);
    }
    addSubject(path) {
        this.addPath(path, Core_PathType.Subject);
    }
    addOpenSubject(path) {
        this.addPath(path, Core_PathType.Subject, true);
    }
    addClip(path) {
        this.addPath(path, Core_PathType.Clip);
    }
    addSubjectPaths(paths) {
        this.addPaths(paths, Core_PathType.Subject);
    }
    addOpenSubjectPaths(paths) {
        this.addPaths(paths, Core_PathType.Subject, true);
    }
    addClipPaths(paths) {
        this.addPaths(paths, Core_PathType.Clip);
    }
    execute(clipType, fillRule, solutionOrTree, openPathsOrSolutionOpen) {
        if (Array.isArray(solutionOrTree)) {
            // PathsD version - match C# implementation exactly
            const solutionClosed = solutionOrTree;
            const solutionOpen = openPathsOrSolutionOpen;
            // Use Paths64 internally like C# does
            const solClosed64 = [];
            const solOpen64 = [];
            solutionClosed.length = 0;
            if (solutionOpen)
                solutionOpen.length = 0;
            let success = true;
            try {
                this.executeInternal(clipType, fillRule);
                // Call regular buildPaths which includes cleanCollinear and fixSelfIntersects
                this.buildPaths(solClosed64, solOpen64);
            }
            catch {
                success = false;
            }
            this.clearSolutionOnly();
            if (!success)
                return false;
            // Convert Paths64 to PathsD
            for (const path of solClosed64) {
                solutionClosed.push(this.scalePathDFromInt(path, this.invScale));
            }
            if (solutionOpen) {
                for (const path of solOpen64) {
                    solutionOpen.push(this.scalePathDFromInt(path, this.invScale));
                }
            }
            return true;
        }
        else {
            // PolyTreeD version
            const polytree = solutionOrTree;
            const openPaths = openPathsOrSolutionOpen;
            polytree.clear();
            if (openPaths)
                openPaths.length = 0;
            this.usingPolytree = true;
            polytree.scale = this.scale;
            let success = true;
            try {
                this.executeInternal(clipType, fillRule);
                this.buildTreeD(polytree, openPaths || []);
            }
            catch {
                success = false;
            }
            this.clearSolutionOnly();
            return success;
        }
    }
}
// Forward declaration for Clipper class
var Engine_Clipper;
(function (Clipper) {
    function area(path) {
        // https://en.wikipedia.org/wiki/Shoelace_formula
        let a = 0.0;
        const cnt = path.length;
        if (cnt < 3)
            return 0.0;
        let prevPt = path[cnt - 1];
        for (const pt of path) {
            a += (prevPt.y + pt.y) * (prevPt.x - pt.x);
            prevPt = pt;
        }
        return a * 0.5;
    }
    Clipper.area = area;
    function areaD(path) {
        let a = 0.0;
        const cnt = path.length;
        if (cnt < 3)
            return 0.0;
        let prevPt = path[cnt - 1];
        for (const pt of path) {
            a += (prevPt.y + pt.y) * (prevPt.x - pt.x);
            prevPt = pt;
        }
        return a * 0.5;
    }
    Clipper.areaD = areaD;
    function scalePath64(path, scale) {
        const result = [];
        for (const pt of path) {
            result.push({
                x: Math.round(pt.x * scale),
                y: Math.round(pt.y * scale)
            });
        }
        return result;
    }
    Clipper.scalePath64 = scalePath64;
    function scalePaths64(paths, scale) {
        const result = [];
        for (const path of paths) {
            result.push(scalePath64(path, scale));
        }
        return result;
    }
    Clipper.scalePaths64 = scalePaths64;
    function scalePathD(path, scale) {
        const result = [];
        for (const pt of path) {
            result.push({
                x: pt.x * scale,
                y: pt.y * scale
            });
        }
        return result;
    }
    Clipper.scalePathD = scalePathD;
    function scalePathsD(paths, scale) {
        const result = [];
        for (const path of paths) {
            result.push(scalePathD(path, scale));
        }
        return result;
    }
    Clipper.scalePathsD = scalePathsD;
})(Engine_Clipper || (Engine_Clipper = {}));
//# sourceMappingURL=Engine.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/Offset.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  11 October 2025                                                 *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2025                                         *
* Purpose   :  Path Offset (Inflate/Shrink)                                    *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/


var Offset_JoinType;
(function (JoinType) {
    JoinType[JoinType["Miter"] = 0] = "Miter";
    JoinType[JoinType["Square"] = 1] = "Square";
    JoinType[JoinType["Bevel"] = 2] = "Bevel";
    JoinType[JoinType["Round"] = 3] = "Round";
})(Offset_JoinType || (Offset_JoinType = {}));
var Offset_EndType;
(function (EndType) {
    EndType[EndType["Polygon"] = 0] = "Polygon";
    EndType[EndType["Joined"] = 1] = "Joined";
    EndType[EndType["Butt"] = 2] = "Butt";
    EndType[EndType["Square"] = 3] = "Square";
    EndType[EndType["Round"] = 4] = "Round";
})(Offset_EndType || (Offset_EndType = {}));
class Group {
    inPaths;
    joinType;
    endType;
    pathsReversed;
    lowestPathIdx;
    constructor(paths, joinType, endType = Offset_EndType.Polygon) {
        this.joinType = joinType;
        this.endType = endType;
        const isJoined = (endType === Offset_EndType.Polygon) || (endType === Offset_EndType.Joined);
        this.inPaths = [];
        for (const path of paths) {
            this.inPaths.push(ClipperOffset.stripDuplicates(path, isJoined));
        }
        if (endType === Offset_EndType.Polygon) {
            const lowestInfo = ClipperOffset.getLowestPathInfo(this.inPaths);
            this.lowestPathIdx = lowestInfo.idx;
            // the lowermost path must be an outer path, so if its orientation is negative,
            // then flag that the whole group is 'reversed' (will negate delta etc.)
            // as this is much more efficient than reversing every path.
            this.pathsReversed = (this.lowestPathIdx >= 0) && lowestInfo.isNegArea;
        }
        else {
            this.lowestPathIdx = -1;
            this.pathsReversed = false;
        }
    }
}
class ClipperOffset {
    static Tolerance = 1.0E-12;
    // Clipper2 approximates arcs by using series of relatively short straight
    //line segments. And logically, shorter line segments will produce better arc
    // approximations. But very short segments can degrade performance, usually
    // with little or no discernable improvement in curve quality. Very short
    // segments can even detract from curve quality, due to the effects of integer
    // rounding. Since there isn't an optimal number of line segments for any given
    // arc radius (that perfectly balances curve approximation with performance),
    // arc tolerance is user defined. Nevertheless, when the user doesn't define
    // an arc tolerance (ie leaves alone the 0 default value), the calculated
    // default arc tolerance (offset_radius / 500) generally produces good (smooth)
    // arc approximations without producing excessively small segment lengths.
    // See also: https://www.angusj.com/clipper2/Docs/Trigonometry.htm
    static arc_const = 0.002; // <-- 1/500
    groupList = [];
    pathOut = [];
    normals = [];
    solution = [];
    solutionTree = null;
    groupDelta = 0; //*0.5 for open paths; *-1.0 for negative areas
    delta = 0;
    mitLimSqr = 0;
    stepsPerRad = 0;
    stepSin = 0;
    stepCos = 0;
    joinType = Offset_JoinType.Bevel;
    endType = Offset_EndType.Polygon;
    arcTolerance = 0;
    mergeGroups = true;
    miterLimit = 2.0;
    preserveCollinear = false;
    reverseSolution = false;
    zCallback;
    deltaCallback = null;
    constructor(miterLimit = 2.0, arcTolerance = 0.0, preserveCollinear = false, reverseSolution = false) {
        this.miterLimit = miterLimit;
        this.arcTolerance = arcTolerance;
        this.mergeGroups = true;
        this.preserveCollinear = preserveCollinear;
        this.reverseSolution = reverseSolution;
    }
    clear() {
        this.groupList.length = 0;
    }
    // Internal Z callback that implements default Z handling before calling user callback
    ZCB = (bot1, top1, bot2, top2, intersectPt) => {
        // Default Z handling: if endpoints share a Z value, use it
        if ((bot1.z || 0) !== 0 && ((bot1.z === bot2.z) || (bot1.z === top2.z))) {
            intersectPt.z = bot1.z;
        }
        else if ((bot2.z || 0) !== 0 && bot2.z === top1.z) {
            intersectPt.z = bot2.z;
        }
        else if ((top1.z || 0) !== 0 && top1.z === top2.z) {
            intersectPt.z = top1.z;
        }
        else if (this.zCallback) {
            // Fall back to user callback if no default applies
            this.zCallback(bot1, top1, bot2, top2, intersectPt);
        }
    };
    addPath(path, joinType, endType) {
        if (path.length === 0)
            return;
        const pp = [path];
        this.addPaths(pp, joinType, endType);
    }
    addPaths(paths, joinType, endType) {
        if (paths.length === 0)
            return;
        this.groupList.push(new Group(paths, joinType, endType));
    }
    calcSolutionCapacity() {
        let result = 0;
        for (const g of this.groupList) {
            result += (g.endType === Offset_EndType.Joined) ? g.inPaths.length * 2 : g.inPaths.length;
        }
        return result;
    }
    checkPathsReversed() {
        let result = false;
        for (const g of this.groupList) {
            if (g.endType === Offset_EndType.Polygon) {
                result = g.pathsReversed;
                break;
            }
        }
        return result;
    }
    executeInternal(delta) {
        if (this.groupList.length === 0)
            return;
        // make sure the offset delta is significant
        if (Math.abs(delta) < 0.5) {
            for (const group of this.groupList) {
                for (const path of group.inPaths) {
                    this.solution.push(path);
                }
            }
            return;
        }
        this.delta = delta;
        this.mitLimSqr = (this.miterLimit <= 1 ?
            2.0 : 2.0 / ClipperOffset.sqr(this.miterLimit));
        for (const group of this.groupList) {
            this.doGroupOffset(group);
        }
        if (this.groupList.length === 0)
            return;
        const pathsReversed = this.checkPathsReversed();
        const fillRule = pathsReversed ? Core_FillRule.Negative : Core_FillRule.Positive;
        // clean up self-intersections ...
        const c = new Clipper64();
        c.preserveCollinear = this.preserveCollinear;
        c.reverseSolution = this.reverseSolution !== pathsReversed;
        c.zCallback = this.ZCB;
        c.addSubject(this.solution);
        if (this.solutionTree !== null) {
            c.execute(Core_ClipType.Union, fillRule, this.solutionTree);
        }
        else {
            c.execute(Core_ClipType.Union, fillRule, this.solution);
        }
    }
    execute(delta, solutionOrTree) {
        if (Array.isArray(solutionOrTree)) {
            // Paths64 version
            const solution = solutionOrTree;
            solution.length = 0;
            this.solution = solution;
            this.executeInternal(delta);
        }
        else {
            // PolyTree64 version
            const solutionTree = solutionOrTree;
            solutionTree.clear();
            this.solutionTree = solutionTree;
            this.solution = [];
            this.executeInternal(delta);
        }
    }
    executeWithCallback(deltaCallback, solution) {
        this.deltaCallback = deltaCallback;
        this.execute(1.0, solution);
    }
    static getUnitNormal(pt1, pt2) {
        const dx = (pt2.x - pt1.x);
        const dy = (pt2.y - pt1.y);
        if ((dx === 0) && (dy === 0))
            return { x: 0, y: 0 };
        const f = 1.0 / Math.sqrt(dx * dx + dy * dy);
        return {
            x: dy * f,
            y: -dx * f
        };
    }
    static getLowestPathInfo(paths) {
        let idx = -1;
        let isNegArea = false;
        let botPt = { x: Number.MAX_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER };
        for (let i = 0; i < paths.length; ++i) {
            let a = Number.MAX_VALUE;
            for (const pt of paths[i]) {
                if ((pt.y < botPt.y) || ((pt.y === botPt.y) && (pt.x >= botPt.x)))
                    continue;
                if (a === Number.MAX_VALUE) {
                    a = ClipperOffset.area(paths[i]);
                    if (a === 0)
                        break; // invalid closed path so break from inner loop
                    isNegArea = a < 0;
                }
                idx = i;
                botPt.x = pt.x;
                botPt.y = pt.y;
            }
        }
        return { idx, isNegArea };
    }
    static translatePoint(pt, dx, dy) {
        return { x: pt.x + dx, y: pt.y + dy };
    }
    static reflectPoint(pt, pivot) {
        return { x: pivot.x + (pivot.x - pt.x), y: pivot.y + (pivot.y - pt.y) };
    }
    static almostZero(value, epsilon = 0.001) {
        return Math.abs(value) < epsilon;
    }
    static hypotenuse(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    static normalizeVector(vec) {
        const h = ClipperOffset.hypotenuse(vec.x, vec.y);
        if (ClipperOffset.almostZero(h))
            return { x: 0, y: 0 };
        const inverseHypot = 1 / h;
        return { x: vec.x * inverseHypot, y: vec.y * inverseHypot };
    }
    static getAvgUnitVector(vec1, vec2) {
        return ClipperOffset.normalizeVector({ x: vec1.x + vec2.x, y: vec1.y + vec2.y });
    }
    static intersectPoint(pt1a, pt1b, pt2a, pt2b) {
        if (Core_InternalClipper.isAlmostZero(pt1a.x - pt1b.x)) { // vertical
            if (Core_InternalClipper.isAlmostZero(pt2a.x - pt2b.x))
                return { x: 0, y: 0 };
            const m2 = (pt2b.y - pt2a.y) / (pt2b.x - pt2a.x);
            const b2 = pt2a.y - m2 * pt2a.x;
            return { x: pt1a.x, y: m2 * pt1a.x + b2 };
        }
        if (Core_InternalClipper.isAlmostZero(pt2a.x - pt2b.x)) { // vertical
            const m1 = (pt1b.y - pt1a.y) / (pt1b.x - pt1a.x);
            const b1 = pt1a.y - m1 * pt1a.x;
            return { x: pt2a.x, y: m1 * pt2a.x + b1 };
        }
        else {
            const m1 = (pt1b.y - pt1a.y) / (pt1b.x - pt1a.x);
            const b1 = pt1a.y - m1 * pt1a.x;
            const m2 = (pt2b.y - pt2a.y) / (pt2b.x - pt2a.x);
            const b2 = pt2a.y - m2 * pt2a.x;
            if (Core_InternalClipper.isAlmostZero(m1 - m2))
                return { x: 0, y: 0 };
            const x = (b2 - b1) / (m1 - m2);
            return { x: x, y: m1 * x + b1 };
        }
    }
    getPerpendic(pt, norm) {
        return {
            x: Math.round(pt.x + norm.x * this.groupDelta),
            y: Math.round(pt.y + norm.y * this.groupDelta)
        };
    }
    getPerpendicD(pt, norm) {
        return {
            x: pt.x + norm.x * this.groupDelta,
            y: pt.y + norm.y * this.groupDelta
        };
    }
    doBevel(path, j, k) {
        let pt1, pt2;
        if (j === k) {
            const absDelta = Math.abs(this.groupDelta);
            pt1 = {
                x: Math.round(path[j].x - absDelta * this.normals[j].x),
                y: Math.round(path[j].y - absDelta * this.normals[j].y)
            };
            pt2 = {
                x: Math.round(path[j].x + absDelta * this.normals[j].x),
                y: Math.round(path[j].y + absDelta * this.normals[j].y)
            };
        }
        else {
            pt1 = {
                x: Math.round(path[j].x + this.groupDelta * this.normals[k].x),
                y: Math.round(path[j].y + this.groupDelta * this.normals[k].y)
            };
            pt2 = {
                x: Math.round(path[j].x + this.groupDelta * this.normals[j].x),
                y: Math.round(path[j].y + this.groupDelta * this.normals[j].y)
            };
        }
        this.pathOut.push(pt1);
        this.pathOut.push(pt2);
    }
    doSquare(path, j, k) {
        let vec;
        if (j === k) {
            vec = { x: this.normals[j].y, y: -this.normals[j].x };
        }
        else {
            vec = ClipperOffset.getAvgUnitVector({ x: -this.normals[k].y, y: this.normals[k].x }, { x: this.normals[j].y, y: -this.normals[j].x });
        }
        const absDelta = Math.abs(this.groupDelta);
        // now offset the original vertex delta units along unit vector
        let ptQ = { x: path[j].x, y: path[j].y };
        ptQ = ClipperOffset.translatePoint(ptQ, absDelta * vec.x, absDelta * vec.y);
        // get perpendicular vertices
        const pt1 = ClipperOffset.translatePoint(ptQ, this.groupDelta * vec.y, this.groupDelta * -vec.x);
        const pt2 = ClipperOffset.translatePoint(ptQ, this.groupDelta * -vec.y, this.groupDelta * vec.x);
        // get 2 vertices along one edge offset
        const pt3 = this.getPerpendicD(path[k], this.normals[k]);
        if (j === k) {
            const pt4 = {
                x: pt3.x + vec.x * this.groupDelta,
                y: pt3.y + vec.y * this.groupDelta
            };
            const pt = ClipperOffset.intersectPoint(pt1, pt2, pt3, pt4);
            //get the second intersect point through reflecion
            this.pathOut.push(Core_Point64Utils.fromPointD(ClipperOffset.reflectPoint(pt, ptQ)));
            this.pathOut.push(Core_Point64Utils.fromPointD(pt));
        }
        else {
            const pt4 = this.getPerpendicD(path[j], this.normals[k]);
            const pt = ClipperOffset.intersectPoint(pt1, pt2, pt3, pt4);
            this.pathOut.push(Core_Point64Utils.fromPointD(pt));
            //get the second intersect point through reflecion
            this.pathOut.push(Core_Point64Utils.fromPointD(ClipperOffset.reflectPoint(pt, ptQ)));
        }
    }
    doMiter(path, j, k, cosA) {
        const q = this.groupDelta / (cosA + 1);
        this.pathOut.push({
            x: Math.round(path[j].x + (this.normals[k].x + this.normals[j].x) * q),
            y: Math.round(path[j].y + (this.normals[k].y + this.normals[j].y) * q)
        });
    }
    doRound(path, j, k, angle) {
        if (this.deltaCallback !== null) {
            // when deltaCallback is assigned, groupDelta won't be constant,
            // so we'll need to do the following calculations for *every* vertex.
            const absDelta = Math.abs(this.groupDelta);
            const arcTol = this.arcTolerance > 0.01 ? this.arcTolerance : absDelta * ClipperOffset.arc_const;
            const stepsPer360 = Math.PI / Math.acos(1 - arcTol / absDelta);
            this.stepSin = Math.sin((2 * Math.PI) / stepsPer360);
            this.stepCos = Math.cos((2 * Math.PI) / stepsPer360);
            if (this.groupDelta < 0.0)
                this.stepSin = -this.stepSin;
            this.stepsPerRad = stepsPer360 / (2 * Math.PI);
        }
        const pt = path[j];
        let offsetVec = { x: this.normals[k].x * this.groupDelta, y: this.normals[k].y * this.groupDelta };
        if (j === k)
            Core_PointDUtils.negate(offsetVec);
        this.pathOut.push({
            x: Math.round(pt.x + offsetVec.x),
            y: Math.round(pt.y + offsetVec.y)
        });
        const steps = Math.ceil(this.stepsPerRad * Math.abs(angle));
        for (let i = 1; i < steps; i++) { // ie 1 less than steps
            offsetVec = {
                x: offsetVec.x * this.stepCos - this.stepSin * offsetVec.y,
                y: offsetVec.x * this.stepSin + offsetVec.y * this.stepCos
            };
            this.pathOut.push({
                x: Math.round(pt.x + offsetVec.x),
                y: Math.round(pt.y + offsetVec.y)
            });
        }
        this.pathOut.push(this.getPerpendic(path[j], this.normals[j]));
    }
    buildNormals(path) {
        const cnt = path.length;
        this.normals.length = 0;
        if (cnt === 0)
            return;
        for (let i = 0; i < cnt - 1; i++) {
            this.normals.push(ClipperOffset.getUnitNormal(path[i], path[i + 1]));
        }
        this.normals.push(ClipperOffset.getUnitNormal(path[cnt - 1], path[0]));
    }
    offsetPoint(group, path, j, k) {
        if (Core_Point64Utils.equals(path[j], path[k]))
            return;
        // Let A = change in angle where edges join
        // A == 0: ie no change in angle (flat join)
        // A == PI: edges 'spike'
        // sin(A) < 0: right turning
        // cos(A) < 0: change in angle is more than 90 degree
        let sinA = Core_InternalClipper.crossProductD(this.normals[j], this.normals[k]);
        const cosA = Core_InternalClipper.dotProductD(this.normals[j], this.normals[k]);
        if (sinA > 1.0)
            sinA = 1.0;
        else if (sinA < -1.0)
            sinA = -1.0;
        if (this.deltaCallback !== null) {
            this.groupDelta = this.deltaCallback(path, this.normals, j, k);
            if (group.pathsReversed)
                this.groupDelta = -this.groupDelta;
        }
        if (Math.abs(this.groupDelta) < ClipperOffset.Tolerance) {
            this.pathOut.push(path[j]);
            return;
        }
        if (cosA > -0.999 && (sinA * this.groupDelta < 0)) { // test for concavity first (#593)
            // is concave
            // by far the simplest way to construct concave joins, especially those joining very 
            // short segments, is to insert 3 points that produce negative regions. These regions 
            // will be removed later by the finishing union operation. This is also the best way 
            // to ensure that path reversals (ie over-shrunk paths) are removed.
            this.pathOut.push(this.getPerpendic(path[j], this.normals[k]));
            this.pathOut.push(path[j]); // (#405, #873, #916)
            this.pathOut.push(this.getPerpendic(path[j], this.normals[j]));
        }
        else if ((cosA > 0.999) && (this.joinType !== Offset_JoinType.Round)) {
            // almost straight - less than 2.5 degree (#424, #482, #526 & #724) 
            this.doMiter(path, j, k, cosA);
        }
        else {
            switch (this.joinType) {
                // miter unless the angle is sufficiently acute to exceed ML
                case Offset_JoinType.Miter:
                    if (cosA > this.mitLimSqr - 1) {
                        this.doMiter(path, j, k, cosA);
                    }
                    else {
                        this.doSquare(path, j, k);
                    }
                    break;
                case Offset_JoinType.Round:
                    this.doRound(path, j, k, Math.atan2(sinA, cosA));
                    break;
                case Offset_JoinType.Bevel:
                    this.doBevel(path, j, k);
                    break;
                default:
                    this.doSquare(path, j, k);
                    break;
            }
        }
    }
    offsetPolygon(group, path) {
        this.pathOut = [];
        const cnt = path.length;
        let prev = cnt - 1;
        for (let i = 0; i < cnt; i++) {
            this.offsetPoint(group, path, i, prev);
            prev = i;
        }
        this.solution.push([...this.pathOut]);
    }
    offsetOpenJoined(group, path) {
        this.offsetPolygon(group, path);
        const reversePath = [...path].reverse();
        this.buildNormals(reversePath);
        this.offsetPolygon(group, reversePath);
    }
    offsetOpenPath(group, path) {
        this.pathOut = [];
        const highI = path.length - 1;
        if (this.deltaCallback !== null) {
            this.groupDelta = this.deltaCallback(path, this.normals, 0, 0);
        }
        // do the line start cap
        if (Math.abs(this.groupDelta) < ClipperOffset.Tolerance) {
            this.pathOut.push(path[0]);
        }
        else {
            switch (this.endType) {
                case Offset_EndType.Butt:
                    this.doBevel(path, 0, 0);
                    break;
                case Offset_EndType.Round:
                    this.doRound(path, 0, 0, Math.PI);
                    break;
                default:
                    this.doSquare(path, 0, 0);
                    break;
            }
        }
        // offset the left side going forward
        for (let i = 1, k = 0; i < highI; i++) {
            this.offsetPoint(group, path, i, k);
            k = i;
        }
        // reverse normals ...
        for (let i = highI; i > 0; i--) {
            this.normals[i] = { x: -this.normals[i - 1].x, y: -this.normals[i - 1].y };
        }
        this.normals[0] = this.normals[highI];
        if (this.deltaCallback !== null) {
            this.groupDelta = this.deltaCallback(path, this.normals, highI, highI);
        }
        // do the line end cap
        if (Math.abs(this.groupDelta) < ClipperOffset.Tolerance) {
            this.pathOut.push(path[highI]);
        }
        else {
            switch (this.endType) {
                case Offset_EndType.Butt:
                    this.doBevel(path, highI, highI);
                    break;
                case Offset_EndType.Round:
                    this.doRound(path, highI, highI, Math.PI);
                    break;
                default:
                    this.doSquare(path, highI, highI);
                    break;
            }
        }
        // offset the left side going back
        for (let i = highI - 1, k = highI; i > 0; i--) {
            this.offsetPoint(group, path, i, k);
            k = i;
        }
        this.solution.push([...this.pathOut]);
    }
    doGroupOffset(group) {
        if (group.endType === Offset_EndType.Polygon) {
            // a straight path (2 points) can now also be 'polygon' offset 
            // where the ends will be treated as (180 deg.) joins
            if (group.lowestPathIdx < 0)
                this.delta = Math.abs(this.delta);
            this.groupDelta = group.pathsReversed ? -this.delta : this.delta;
        }
        else {
            this.groupDelta = Math.abs(this.delta);
        }
        const absDelta = Math.abs(this.groupDelta);
        this.joinType = group.joinType;
        this.endType = group.endType;
        if (group.joinType === Offset_JoinType.Round || group.endType === Offset_EndType.Round) {
            const arcTol = this.arcTolerance > 0.01 ? this.arcTolerance : absDelta * ClipperOffset.arc_const;
            const stepsPer360 = Math.PI / Math.acos(1 - arcTol / absDelta);
            this.stepSin = Math.sin((2 * Math.PI) / stepsPer360);
            this.stepCos = Math.cos((2 * Math.PI) / stepsPer360);
            if (this.groupDelta < 0.0)
                this.stepSin = -this.stepSin;
            this.stepsPerRad = stepsPer360 / (2 * Math.PI);
        }
        for (const pathIn of group.inPaths) {
            this.pathOut = [];
            const cnt = pathIn.length;
            if (cnt === 1) {
                // single point
                const pt = pathIn[0];
                if (this.deltaCallback !== null) {
                    this.groupDelta = this.deltaCallback(pathIn, this.normals, 0, 0);
                    if (group.pathsReversed)
                        this.groupDelta = -this.groupDelta;
                }
                // single vertex so build a circle or square ...
                if (group.endType === Offset_EndType.Round) {
                    const steps = Math.ceil(this.stepsPerRad * 2 * Math.PI);
                    this.pathOut = ClipperOffset.ellipse(pt, Math.abs(this.groupDelta), Math.abs(this.groupDelta), steps);
                }
                else {
                    const d = Math.ceil(Math.abs(this.groupDelta));
                    const r = { left: pt.x - d, top: pt.y - d, right: pt.x + d, bottom: pt.y + d };
                    this.pathOut = [
                        { x: r.left, y: r.top },
                        { x: r.right, y: r.top },
                        { x: r.right, y: r.bottom },
                        { x: r.left, y: r.bottom }
                    ];
                }
                this.solution.push([...this.pathOut]);
                continue; // end of offsetting a single point
            }
            if (cnt === 2 && group.endType === Offset_EndType.Joined) {
                this.endType = (group.joinType === Offset_JoinType.Round) ?
                    Offset_EndType.Round :
                    Offset_EndType.Square;
            }
            this.buildNormals(pathIn);
            switch (this.endType) {
                case Offset_EndType.Polygon:
                    this.offsetPolygon(group, pathIn);
                    break;
                case Offset_EndType.Joined:
                    this.offsetOpenJoined(group, pathIn);
                    break;
                default:
                    this.offsetOpenPath(group, pathIn);
                    break;
            }
        }
    }
    static stripDuplicates(path, isClosedPath) {
        const cnt = path.length;
        const result = [];
        if (cnt === 0)
            return result;
        let lastPt = path[0];
        result.push(lastPt);
        for (let i = 1; i < cnt; i++) {
            if (!Core_Point64Utils.equals(lastPt, path[i])) {
                lastPt = path[i];
                result.push(lastPt);
            }
        }
        if (isClosedPath && Core_Point64Utils.equals(lastPt, result[0])) {
            result.pop();
        }
        return result;
    }
    static area(path) {
        // https://en.wikipedia.org/wiki/Shoelace_formula
        let a = 0.0;
        const cnt = path.length;
        if (cnt < 3)
            return 0.0;
        let prevPt = path[cnt - 1];
        for (const pt of path) {
            a += (prevPt.y + pt.y) * (prevPt.x - pt.x);
            prevPt = pt;
        }
        return a * 0.5;
    }
    static sqr(val) {
        return val * val;
    }
    static ellipse(center, radiusX, radiusY = 0, steps = 0) {
        if (radiusX <= 0)
            return [];
        if (radiusY <= 0)
            radiusY = radiusX;
        if (steps <= 2) {
            steps = Math.ceil(Math.PI * Math.sqrt((radiusX + radiusY) / 2));
        }
        const si = Math.sin(2 * Math.PI / steps);
        const co = Math.cos(2 * Math.PI / steps);
        let dx = co;
        let dy = si;
        const result = [{ x: Math.round(center.x + radiusX), y: center.y }];
        for (let i = 1; i < steps; ++i) {
            result.push({
                x: Math.round(center.x + radiusX * dx),
                y: Math.round(center.y + radiusY * dy)
            });
            const x = dx * co - dy * si;
            dy = dy * co + dx * si;
            dx = x;
        }
        return result;
    }
}
//# sourceMappingURL=Offset.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/RectClip.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  11 October 2025                                                 *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2025                                         *
* Purpose   :  FAST rectangular clipping                                       *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/

class OutPt2 {
    next = null;
    prev = null;
    pt;
    ownerIdx = 0;
    edge = null;
    constructor(pt) {
        this.pt = pt;
    }
}
var RectClip_Location;
(function (Location) {
    Location[Location["left"] = 0] = "left";
    Location[Location["top"] = 1] = "top";
    Location[Location["right"] = 2] = "right";
    Location[Location["bottom"] = 3] = "bottom";
    Location[Location["inside"] = 4] = "inside";
})(RectClip_Location || (RectClip_Location = {}));
class RectClip64 {
    rect;
    mp;
    rectPath;
    pathBounds = { left: 0, top: 0, right: 0, bottom: 0 };
    results = [];
    edges = [];
    currIdx = -1;
    constructor(rect) {
        this.currIdx = -1;
        this.rect = rect;
        this.mp = Core_Rect64Utils.midPoint(rect);
        this.rectPath = Core_Rect64Utils.asPath(this.rect);
        this.results = [];
        this.edges = [];
        for (let i = 0; i < 8; i++) {
            this.edges[i] = [];
        }
    }
    add(pt, startingNewPath = false) {
        // this method is only called by InternalExecute.
        // Later splitting and rejoining won't create additional op's,
        // though they will change the (non-storage) fResults count.
        let currIdx = this.results.length;
        let result;
        if ((currIdx === 0) || startingNewPath) {
            result = new OutPt2(pt);
            this.results.push(result);
            result.ownerIdx = currIdx;
            result.prev = result;
            result.next = result;
        }
        else {
            currIdx--;
            const prevOp = this.results[currIdx];
            if (prevOp && Core_Point64Utils.equals(prevOp.pt, pt))
                return prevOp;
            result = new OutPt2(pt);
            result.ownerIdx = currIdx;
            result.next = prevOp.next;
            prevOp.next.prev = result;
            prevOp.next = result;
            result.prev = prevOp;
            this.results[currIdx] = result;
        }
        return result;
    }
    static path1ContainsPath2(path1, path2) {
        // nb: occasionally, due to rounding, path1 may 
        // appear (momentarily) inside or outside path2.
        let ioCount = 0;
        for (const pt of path2) {
            const pip = Core_InternalClipper.pointInPolygon(pt, path1);
            switch (pip) {
                case Core_PointInPolygonResult.IsInside:
                    ioCount--;
                    break;
                case Core_PointInPolygonResult.IsOutside:
                    ioCount++;
                    break;
            }
            if (Math.abs(ioCount) > 1)
                break;
        }
        return ioCount <= 0;
    }
    static isClockwise(prev, curr, prevPt, currPt, rectMidPoint) {
        if (RectClip64.areOpposites(prev, curr)) {
            return Core_InternalClipper.crossProduct(prevPt, rectMidPoint, currPt) < 0;
        }
        return RectClip64.headingClockwise(prev, curr);
    }
    static areOpposites(prev, curr) {
        return Math.abs(prev - curr) === 2;
    }
    static headingClockwise(prev, curr) {
        return (prev + 1) % 4 === curr;
    }
    static getAdjacentLocation(loc, isClockwise) {
        const delta = isClockwise ? 1 : 3;
        return (loc + delta) % 4;
    }
    static unlinkOp(op) {
        if (op.next === op)
            return null;
        op.prev.next = op.next;
        op.next.prev = op.prev;
        return op.next;
    }
    static unlinkOpBack(op) {
        if (op.next === op)
            return null;
        op.prev.next = op.next;
        op.next.prev = op.prev;
        return op.prev;
    }
    static getEdgesForPt(pt, rec) {
        let result = 0;
        if (pt.x === rec.left)
            result = 1;
        else if (pt.x === rec.right)
            result = 4;
        if (pt.y === rec.top)
            result += 2;
        else if (pt.y === rec.bottom)
            result += 8;
        return result;
    }
    static isHeadingClockwise(pt1, pt2, edgeIdx) {
        switch (edgeIdx) {
            case 0: return pt2.y < pt1.y;
            case 1: return pt2.x > pt1.x;
            case 2: return pt2.y > pt1.y;
            default: return pt2.x < pt1.x;
        }
    }
    static hasHorzOverlap(left1, right1, left2, right2) {
        return (left1.x < right2.x) && (right1.x > left2.x);
    }
    static hasVertOverlap(top1, bottom1, top2, bottom2) {
        return (top1.y < bottom2.y) && (bottom1.y > top2.y);
    }
    static addToEdge(edge, op) {
        if (op.edge !== null)
            return;
        op.edge = edge;
        edge.push(op);
    }
    static uncoupleEdge(op) {
        if (op.edge === null)
            return;
        for (let i = 0; i < op.edge.length; i++) {
            const op2 = op.edge[i];
            if (op2 === op) {
                op.edge[i] = null;
                break;
            }
        }
        op.edge = null;
    }
    static setNewOwner(op, newIdx) {
        op.ownerIdx = newIdx;
        let op2 = op.next;
        while (op2 !== op) {
            op2.ownerIdx = newIdx;
            op2 = op2.next;
        }
    }
    addCorner(prev, curr) {
        this.add(RectClip64.headingClockwise(prev, curr) ?
            this.rectPath[prev] : this.rectPath[curr]);
    }
    addCornerWithDirection(loc, isClockwise) {
        if (isClockwise) {
            this.add(this.rectPath[loc]);
            return RectClip64.getAdjacentLocation(loc, true);
        }
        else {
            const newLoc = RectClip64.getAdjacentLocation(loc, false);
            this.add(this.rectPath[newLoc]);
            return newLoc;
        }
    }
    static getLocation(rec, pt) {
        if (pt.x === rec.left && pt.y >= rec.top && pt.y <= rec.bottom) {
            return { location: RectClip_Location.left, isOnRect: true };
        }
        if (pt.x === rec.right && pt.y >= rec.top && pt.y <= rec.bottom) {
            return { location: RectClip_Location.right, isOnRect: true };
        }
        if (pt.y === rec.top && pt.x >= rec.left && pt.x <= rec.right) {
            return { location: RectClip_Location.top, isOnRect: true };
        }
        if (pt.y === rec.bottom && pt.x >= rec.left && pt.x <= rec.right) {
            return { location: RectClip_Location.bottom, isOnRect: true };
        }
        let location;
        if (pt.x < rec.left)
            location = RectClip_Location.left;
        else if (pt.x > rec.right)
            location = RectClip_Location.right;
        else if (pt.y < rec.top)
            location = RectClip_Location.top;
        else if (pt.y > rec.bottom)
            location = RectClip_Location.bottom;
        else
            location = RectClip_Location.inside;
        return { location, isOnRect: false };
    }
    static isHorizontal(pt1, pt2) {
        return pt1.y === pt2.y;
    }
    static getSegmentIntersection(p1, p2, p3, p4) {
        const res1 = Core_InternalClipper.crossProduct(p1, p3, p4);
        const res2 = Core_InternalClipper.crossProduct(p2, p3, p4);
        if (res1 === 0) {
            const ip = p1;
            if (res2 === 0)
                return { intersects: false, point: ip }; // segments are collinear
            if (Core_Point64Utils.equals(p1, p3) || Core_Point64Utils.equals(p1, p4))
                return { intersects: true, point: ip };
            if (RectClip64.isHorizontal(p3, p4)) {
                return { intersects: (p1.x > p3.x) === (p1.x < p4.x), point: ip };
            }
            return { intersects: (p1.y > p3.y) === (p1.y < p4.y), point: ip };
        }
        if (res2 === 0) {
            const ip = p2;
            if (Core_Point64Utils.equals(p2, p3) || Core_Point64Utils.equals(p2, p4))
                return { intersects: true, point: ip };
            if (RectClip64.isHorizontal(p3, p4)) {
                return { intersects: (p2.x > p3.x) === (p2.x < p4.x), point: ip };
            }
            return { intersects: (p2.y > p3.y) === (p2.y < p4.y), point: ip };
        }
        if ((res1 > 0) === (res2 > 0)) {
            return { intersects: false, point: { x: 0, y: 0 } };
        }
        const res3 = Core_InternalClipper.crossProduct(p3, p1, p2);
        const res4 = Core_InternalClipper.crossProduct(p4, p1, p2);
        if (res3 === 0) {
            const ip = p3;
            if (Core_Point64Utils.equals(p3, p1) || Core_Point64Utils.equals(p3, p2))
                return { intersects: true, point: ip };
            if (RectClip64.isHorizontal(p1, p2)) {
                return { intersects: (p3.x > p1.x) === (p3.x < p2.x), point: ip };
            }
            return { intersects: (p3.y > p1.y) === (p3.y < p2.y), point: ip };
        }
        if (res4 === 0) {
            const ip = p4;
            if (Core_Point64Utils.equals(p4, p1) || Core_Point64Utils.equals(p4, p2))
                return { intersects: true, point: ip };
            if (RectClip64.isHorizontal(p1, p2)) {
                return { intersects: (p4.x > p1.x) === (p4.x < p2.x), point: ip };
            }
            return { intersects: (p4.y > p1.y) === (p4.y < p2.y), point: ip };
        }
        if ((res3 > 0) === (res4 > 0)) {
            return { intersects: false, point: { x: 0, y: 0 } };
        }
        // segments must intersect to get here
        return Core_InternalClipper.getLineIntersectPt(p1, p2, p3, p4);
    }
    static getIntersection(rectPath, p, p2, loc) {
        // gets the pt of intersection between rectPath and segment(p, p2) that's closest to 'p'
        // when result == false, loc will remain unchanged
        let ip = { x: 0, y: 0 };
        let newLocation = loc;
        switch (loc) {
            case RectClip_Location.left:
                {
                    const result1 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[3]);
                    if (result1.intersects) {
                        ip = result1.point;
                        return { intersects: true, point: ip, newLocation };
                    }
                    if (p.y < rectPath[0].y) {
                        const result2 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[1]);
                        if (result2.intersects) {
                            newLocation = RectClip_Location.top;
                            return { intersects: true, point: result2.point, newLocation };
                        }
                    }
                    const result3 = RectClip64.getSegmentIntersection(p, p2, rectPath[2], rectPath[3]);
                    if (result3.intersects) {
                        newLocation = RectClip_Location.bottom;
                        return { intersects: true, point: result3.point, newLocation };
                    }
                    return { intersects: false, point: ip, newLocation };
                }
            case RectClip_Location.right:
                {
                    const result1 = RectClip64.getSegmentIntersection(p, p2, rectPath[1], rectPath[2]);
                    if (result1.intersects) {
                        return { intersects: true, point: result1.point, newLocation };
                    }
                    if (p.y < rectPath[0].y) {
                        const result2 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[1]);
                        if (result2.intersects) {
                            newLocation = RectClip_Location.top;
                            return { intersects: true, point: result2.point, newLocation };
                        }
                    }
                    const result3 = RectClip64.getSegmentIntersection(p, p2, rectPath[2], rectPath[3]);
                    if (result3.intersects) {
                        newLocation = RectClip_Location.bottom;
                        return { intersects: true, point: result3.point, newLocation };
                    }
                    return { intersects: false, point: ip, newLocation };
                }
            case RectClip_Location.top:
                {
                    const result1 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[1]);
                    if (result1.intersects) {
                        return { intersects: true, point: result1.point, newLocation };
                    }
                    if (p.x < rectPath[0].x) {
                        const result2 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[3]);
                        if (result2.intersects) {
                            newLocation = RectClip_Location.left;
                            return { intersects: true, point: result2.point, newLocation };
                        }
                    }
                    if (p.x <= rectPath[1].x) {
                        return { intersects: false, point: ip, newLocation };
                    }
                    const result3 = RectClip64.getSegmentIntersection(p, p2, rectPath[1], rectPath[2]);
                    if (result3.intersects) {
                        newLocation = RectClip_Location.right;
                        return { intersects: true, point: result3.point, newLocation };
                    }
                    return { intersects: false, point: ip, newLocation };
                }
            case RectClip_Location.bottom:
                {
                    const result1 = RectClip64.getSegmentIntersection(p, p2, rectPath[2], rectPath[3]);
                    if (result1.intersects) {
                        return { intersects: true, point: result1.point, newLocation };
                    }
                    if (p.x < rectPath[3].x) {
                        const result2 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[3]);
                        if (result2.intersects) {
                            newLocation = RectClip_Location.left;
                            return { intersects: true, point: result2.point, newLocation };
                        }
                    }
                    if (p.x <= rectPath[2].x) {
                        return { intersects: false, point: ip, newLocation };
                    }
                    const result3 = RectClip64.getSegmentIntersection(p, p2, rectPath[1], rectPath[2]);
                    if (result3.intersects) {
                        newLocation = RectClip_Location.right;
                        return { intersects: true, point: result3.point, newLocation };
                    }
                    return { intersects: false, point: ip, newLocation };
                }
            default:
                {
                    const result1 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[3]);
                    if (result1.intersects) {
                        newLocation = RectClip_Location.left;
                        return { intersects: true, point: result1.point, newLocation };
                    }
                    const result2 = RectClip64.getSegmentIntersection(p, p2, rectPath[0], rectPath[1]);
                    if (result2.intersects) {
                        newLocation = RectClip_Location.top;
                        return { intersects: true, point: result2.point, newLocation };
                    }
                    const result3 = RectClip64.getSegmentIntersection(p, p2, rectPath[1], rectPath[2]);
                    if (result3.intersects) {
                        newLocation = RectClip_Location.right;
                        return { intersects: true, point: result3.point, newLocation };
                    }
                    const result4 = RectClip64.getSegmentIntersection(p, p2, rectPath[2], rectPath[3]);
                    if (result4.intersects) {
                        newLocation = RectClip_Location.bottom;
                        return { intersects: true, point: result4.point, newLocation };
                    }
                    return { intersects: false, point: ip, newLocation };
                }
        }
    }
    getNextLocation(path, loc, i, highI) {
        let newI = i;
        let newLoc = loc;
        switch (loc) {
            case RectClip_Location.left:
                while (newI <= highI && path[newI].x <= this.rect.left)
                    newI++;
                if (newI > highI)
                    break;
                if (path[newI].x >= this.rect.right)
                    newLoc = RectClip_Location.right;
                else if (path[newI].y <= this.rect.top)
                    newLoc = RectClip_Location.top;
                else if (path[newI].y >= this.rect.bottom)
                    newLoc = RectClip_Location.bottom;
                else
                    newLoc = RectClip_Location.inside;
                break;
            case RectClip_Location.top:
                while (newI <= highI && path[newI].y <= this.rect.top)
                    newI++;
                if (newI > highI)
                    break;
                if (path[newI].y >= this.rect.bottom)
                    newLoc = RectClip_Location.bottom;
                else if (path[newI].x <= this.rect.left)
                    newLoc = RectClip_Location.left;
                else if (path[newI].x >= this.rect.right)
                    newLoc = RectClip_Location.right;
                else
                    newLoc = RectClip_Location.inside;
                break;
            case RectClip_Location.right:
                while (newI <= highI && path[newI].x >= this.rect.right)
                    newI++;
                if (newI > highI)
                    break;
                if (path[newI].x <= this.rect.left)
                    newLoc = RectClip_Location.left;
                else if (path[newI].y <= this.rect.top)
                    newLoc = RectClip_Location.top;
                else if (path[newI].y >= this.rect.bottom)
                    newLoc = RectClip_Location.bottom;
                else
                    newLoc = RectClip_Location.inside;
                break;
            case RectClip_Location.bottom:
                while (newI <= highI && path[newI].y >= this.rect.bottom)
                    newI++;
                if (newI > highI)
                    break;
                if (path[newI].y <= this.rect.top)
                    newLoc = RectClip_Location.top;
                else if (path[newI].x <= this.rect.left)
                    newLoc = RectClip_Location.left;
                else if (path[newI].x >= this.rect.right)
                    newLoc = RectClip_Location.right;
                else
                    newLoc = RectClip_Location.inside;
                break;
            case RectClip_Location.inside:
                while (newI <= highI) {
                    if (path[newI].x < this.rect.left)
                        newLoc = RectClip_Location.left;
                    else if (path[newI].x > this.rect.right)
                        newLoc = RectClip_Location.right;
                    else if (path[newI].y > this.rect.bottom)
                        newLoc = RectClip_Location.bottom;
                    else if (path[newI].y < this.rect.top)
                        newLoc = RectClip_Location.top;
                    else {
                        this.add(path[newI]);
                        newI++;
                        continue;
                    }
                    break;
                }
                break;
        }
        return { location: newLoc, index: newI };
    }
    static startLocsAreClockwise(startLocs) {
        let result = 0;
        for (let i = 1; i < startLocs.length; i++) {
            const d = startLocs[i] - startLocs[i - 1];
            switch (d) {
                case -1:
                    result -= 1;
                    break;
                case 1:
                    result += 1;
                    break;
                case -3:
                    result += 1;
                    break;
                case 3:
                    result -= 1;
                    break;
            }
        }
        return result > 0;
    }
    executeInternal(path) {
        if (path.length < 3 || Core_Rect64Utils.isEmpty(this.rect))
            return;
        const startLocs = [];
        let firstCross = RectClip_Location.inside;
        let crossingLoc = firstCross;
        let prev = firstCross;
        const highI = path.length - 1;
        const lastLocResult = RectClip64.getLocation(this.rect, path[highI]);
        let loc = lastLocResult.location;
        if (lastLocResult.isOnRect) {
            let i = highI - 1;
            while (i >= 0) {
                const prevLocResult = RectClip64.getLocation(this.rect, path[i]);
                if (!prevLocResult.isOnRect) {
                    prev = prevLocResult.location;
                    break;
                }
                i--;
            }
            if (i < 0) {
                for (const pt of path) {
                    this.add(pt);
                }
                return;
            }
            if (prev === RectClip_Location.inside)
                loc = RectClip_Location.inside;
        }
        const startingLoc = loc;
        ///////////////////////////////////////////////////
        let i = 0;
        while (i <= highI) {
            prev = loc;
            const prevCrossLoc = crossingLoc;
            const nextLocResult = this.getNextLocation(path, loc, i, highI);
            loc = nextLocResult.location;
            i = nextLocResult.index;
            if (i > highI)
                break;
            const prevPt = (i === 0) ? path[highI] : path[i - 1];
            crossingLoc = loc;
            const intersectionResult = RectClip64.getIntersection(this.rectPath, path[i], prevPt, crossingLoc);
            if (!intersectionResult.intersects) {
                // ie remaining outside
                if (prevCrossLoc === RectClip_Location.inside) {
                    const isClockw = RectClip64.isClockwise(prev, loc, prevPt, path[i], this.mp);
                    do {
                        startLocs.push(prev);
                        prev = RectClip64.getAdjacentLocation(prev, isClockw);
                    } while (prev !== loc);
                    crossingLoc = prevCrossLoc; // still not crossed
                }
                else if (prev !== RectClip_Location.inside && prev !== loc) {
                    const isClockw = RectClip64.isClockwise(prev, loc, prevPt, path[i], this.mp);
                    do {
                        prev = this.addCornerWithDirection(prev, isClockw);
                    } while (prev !== loc);
                }
                ++i;
                continue;
            }
            const ip = intersectionResult.point;
            crossingLoc = intersectionResult.newLocation;
            ////////////////////////////////////////////////////
            // we must be crossing the rect boundary to get here
            ////////////////////////////////////////////////////
            if (loc === RectClip_Location.inside) { // path must be entering rect
                if (firstCross === RectClip_Location.inside) {
                    firstCross = crossingLoc;
                    startLocs.push(prev);
                }
                else if (prev !== crossingLoc) {
                    const isClockw = RectClip64.isClockwise(prev, crossingLoc, prevPt, path[i], this.mp);
                    do {
                        prev = this.addCornerWithDirection(prev, isClockw);
                    } while (prev !== crossingLoc);
                }
            }
            else if (prev !== RectClip_Location.inside) {
                // passing right through rect. 'ip' here will be the second 
                // intersect pt but we'll also need the first intersect pt (ip2)
                loc = prev;
                const intersection2Result = RectClip64.getIntersection(this.rectPath, prevPt, path[i], loc);
                const ip2 = intersection2Result.point;
                if (prevCrossLoc !== RectClip_Location.inside && prevCrossLoc !== loc) { //#597
                    this.addCorner(prevCrossLoc, loc);
                }
                if (firstCross === RectClip_Location.inside) {
                    firstCross = loc;
                    startLocs.push(prev);
                }
                loc = crossingLoc;
                this.add(ip2);
                if (Core_Point64Utils.equals(ip, ip2)) {
                    // it's very likely that path[i] is on rect
                    const pathLocResult = RectClip64.getLocation(this.rect, path[i]);
                    loc = pathLocResult.location;
                    this.addCorner(crossingLoc, loc);
                    crossingLoc = loc;
                    continue;
                }
            }
            else { // path must be exiting rect
                loc = crossingLoc;
                if (firstCross === RectClip_Location.inside) {
                    firstCross = crossingLoc;
                }
            }
            this.add(ip);
        } //while i <= highI
        ///////////////////////////////////////////////////
        if (firstCross === RectClip_Location.inside) {
            // path never intersects
            if (startingLoc === RectClip_Location.inside)
                return;
            if (!Core_Rect64Utils.containsRect(this.pathBounds, this.rect) ||
                !RectClip64.path1ContainsPath2(path, this.rectPath))
                return;
            const startLocsClockwise = RectClip64.startLocsAreClockwise(startLocs);
            for (let j = 0; j < 4; j++) {
                const k = startLocsClockwise ? j : 3 - j; // ie reverse result path
                this.add(this.rectPath[k]);
                RectClip64.addToEdge(this.edges[k * 2], this.results[0]);
            }
        }
        else if (loc !== RectClip_Location.inside &&
            (loc !== firstCross || startLocs.length > 2)) {
            if (startLocs.length > 0) {
                prev = loc;
                for (const loc2 of startLocs) {
                    if (prev === loc2)
                        continue;
                    prev = this.addCornerWithDirection(prev, RectClip64.headingClockwise(prev, loc2));
                    prev = loc2;
                }
                loc = prev;
            }
            if (loc !== firstCross) {
                this.addCornerWithDirection(loc, RectClip64.headingClockwise(loc, firstCross));
            }
        }
    }
    execute(paths) {
        const result = [];
        if (Core_Rect64Utils.isEmpty(this.rect))
            return result;
        for (const path of paths) {
            if (path.length < 3)
                continue;
            this.pathBounds = Core_InternalClipper.getBounds(path);
            if (!Core_Rect64Utils.intersects(this.rect, this.pathBounds)) {
                continue; // the path must be completely outside rect
            }
            if (Core_Rect64Utils.containsRect(this.rect, this.pathBounds)) {
                // the path must be completely inside rect
                result.push(path);
                continue;
            }
            this.executeInternal(path);
            this.checkEdges();
            for (let i = 0; i < 4; ++i) {
                this.tidyEdgePair(i, this.edges[i * 2], this.edges[i * 2 + 1]);
            }
            for (const op of this.results) {
                const tmp = this.getPath(op);
                if (tmp.length > 0)
                    result.push(tmp);
            }
            //clean up after every loop
            this.results.length = 0;
            for (let i = 0; i < 8; i++) {
                this.edges[i].length = 0;
            }
        }
        return result;
    }
    checkEdges() {
        for (let i = 0; i < this.results.length; i++) {
            let op = this.results[i];
            let op2 = op;
            if (op === null)
                continue;
            do {
                if (Core_InternalClipper.isCollinear(op2.prev.pt, op2.pt, op2.next.pt)) {
                    if (op2 === op) {
                        op2 = RectClip64.unlinkOpBack(op2);
                        if (op2 === null)
                            break;
                        op = op2.prev;
                    }
                    else {
                        op2 = RectClip64.unlinkOpBack(op2);
                        if (op2 === null)
                            break;
                    }
                }
                else {
                    op2 = op2.next;
                }
            } while (op2 !== op);
            if (op2 === null) {
                this.results[i] = null;
                continue;
            }
            this.results[i] = op2; // safety first
            let edgeSet1 = RectClip64.getEdgesForPt(op.prev.pt, this.rect);
            op2 = op;
            do {
                const edgeSet2 = RectClip64.getEdgesForPt(op2.pt, this.rect);
                if (edgeSet2 !== 0 && op2.edge === null) {
                    const combinedSet = (edgeSet1 & edgeSet2);
                    for (let j = 0; j < 4; ++j) {
                        if ((combinedSet & (1 << j)) === 0)
                            continue;
                        if (RectClip64.isHeadingClockwise(op2.prev.pt, op2.pt, j)) {
                            RectClip64.addToEdge(this.edges[j * 2], op2);
                        }
                        else {
                            RectClip64.addToEdge(this.edges[j * 2 + 1], op2);
                        }
                    }
                }
                edgeSet1 = edgeSet2;
                op2 = op2.next;
            } while (op2 !== op);
        }
    }
    tidyEdgePair(idx, cw, ccw) {
        if (ccw.length === 0)
            return;
        const isHorz = ((idx === 1) || (idx === 3));
        const cwIsTowardLarger = ((idx === 1) || (idx === 2));
        let i = 0, j = 0;
        while (i < cw.length) {
            let p1 = cw[i];
            if (p1 === null || p1.next === p1.prev) {
                cw[i++] = null;
                j = 0;
                continue;
            }
            const jLim = ccw.length;
            while (j < jLim && (ccw[j] === null || ccw[j].next === ccw[j].prev))
                ++j;
            if (j === jLim) {
                ++i;
                j = 0;
                continue;
            }
            let p2;
            let p1a;
            let p2a;
            if (cwIsTowardLarger) {
                // p1 >>>> p1a;
                // p2 <<<< p2a;
                p1 = cw[i].prev;
                p1a = cw[i];
                p2 = ccw[j];
                p2a = ccw[j].prev;
            }
            else {
                // p1 <<<< p1a;
                // p2 >>>> p2a;
                p1 = cw[i];
                p1a = cw[i].prev;
                p2 = ccw[j].prev;
                p2a = ccw[j];
            }
            if ((isHorz && !RectClip64.hasHorzOverlap(p1.pt, p1a.pt, p2.pt, p2a.pt)) ||
                (!isHorz && !RectClip64.hasVertOverlap(p1.pt, p1a.pt, p2.pt, p2a.pt))) {
                ++j;
                continue;
            }
            // to get here we're either splitting or rejoining
            const isRejoining = cw[i].ownerIdx !== ccw[j].ownerIdx;
            if (isRejoining) {
                this.results[p2.ownerIdx] = null;
                RectClip64.setNewOwner(p2, p1.ownerIdx);
            }
            // do the split or re-join
            if (cwIsTowardLarger) {
                // p1 >> | >> p1a;
                // p2 << | << p2a;
                p1.next = p2;
                p2.prev = p1;
                p1a.prev = p2a;
                p2a.next = p1a;
            }
            else {
                // p1 << | << p1a;
                // p2 >> | >> p2a;
                p1.prev = p2;
                p2.next = p1;
                p1a.next = p2a;
                p2a.prev = p1a;
            }
            if (!isRejoining) {
                const newIdx = this.results.length;
                this.results.push(p1a);
                RectClip64.setNewOwner(p1a, newIdx);
            }
            let op;
            let op2;
            if (cwIsTowardLarger) {
                op = p2;
                op2 = p1a;
            }
            else {
                op = p1;
                op2 = p2a;
            }
            this.results[op.ownerIdx] = op;
            this.results[op2.ownerIdx] = op2;
            // and now lots of work to get ready for the next loop
            let opIsLarger, op2IsLarger;
            if (isHorz) { // X
                opIsLarger = op.pt.x > op.prev.pt.x;
                op2IsLarger = op2.pt.x > op2.prev.pt.x;
            }
            else { // Y
                opIsLarger = op.pt.y > op.prev.pt.y;
                op2IsLarger = op2.pt.y > op2.prev.pt.y;
            }
            if ((op.next === op.prev) || Core_Point64Utils.equals(op.pt, op.prev.pt)) {
                if (op2IsLarger === cwIsTowardLarger) {
                    cw[i] = op2;
                    ccw[j++] = null;
                }
                else {
                    ccw[j] = op2;
                    cw[i++] = null;
                }
            }
            else if ((op2.next === op2.prev) || Core_Point64Utils.equals(op2.pt, op2.prev.pt)) {
                if (opIsLarger === cwIsTowardLarger) {
                    cw[i] = op;
                    ccw[j++] = null;
                }
                else {
                    ccw[j] = op;
                    cw[i++] = null;
                }
            }
            else if (opIsLarger === op2IsLarger) {
                if (opIsLarger === cwIsTowardLarger) {
                    cw[i] = op;
                    RectClip64.uncoupleEdge(op2);
                    RectClip64.addToEdge(cw, op2);
                    ccw[j++] = null;
                }
                else {
                    cw[i++] = null;
                    ccw[j] = op2;
                    RectClip64.uncoupleEdge(op);
                    RectClip64.addToEdge(ccw, op);
                    j = 0;
                }
            }
            else {
                if (opIsLarger === cwIsTowardLarger) {
                    cw[i] = op;
                }
                else {
                    ccw[j] = op;
                }
                if (op2IsLarger === cwIsTowardLarger) {
                    cw[i] = op2;
                }
                else {
                    ccw[j] = op2;
                }
            }
        }
    }
    getPath(op) {
        const result = [];
        if (op === null || op.prev === op.next)
            return result;
        let op2 = op.next;
        while (op2 !== null && op2 !== op) {
            if (Core_InternalClipper.isCollinear(op2.prev.pt, op2.pt, op2.next.pt)) {
                op = op2.prev;
                op2 = RectClip64.unlinkOp(op2);
            }
            else {
                op2 = op2.next;
            }
        }
        if (op2 === null)
            return [];
        result.push(op.pt);
        op2 = op.next;
        while (op2 !== op) {
            result.push(op2.pt);
            op2 = op2.next;
        }
        return result;
    }
}
class RectClipLines64 extends RectClip64 {
    constructor(rect) {
        super(rect);
    }
    execute(paths) {
        const result = [];
        if (Core_Rect64Utils.isEmpty(this.rect))
            return result;
        for (const path of paths) {
            if (path.length < 2)
                continue;
            this.pathBounds = Core_InternalClipper.getBounds(path);
            if (!Core_Rect64Utils.intersects(this.rect, this.pathBounds)) {
                continue; // the path must be completely outside rect
            }
            // Apart from that, we can't be sure whether the path
            // is completely outside or completed inside or intersects
            // rect, simply by comparing path bounds with rect.
            this.executeInternalLines(path);
            for (const op of this.results) {
                const tmp = this.getPathLines(op);
                if (tmp.length > 0)
                    result.push(tmp);
            }
            //clean up after every loop
            this.results.length = 0;
            for (let i = 0; i < 8; i++) {
                this.edges[i].length = 0;
            }
        }
        return result;
    }
    getPathLines(op) {
        const result = [];
        if (op === null || op === op.next)
            return result;
        op = op.next; // starting at path beginning 
        result.push(op.pt);
        let op2 = op.next;
        while (op2 !== op) {
            result.push(op2.pt);
            op2 = op2.next;
        }
        return result;
    }
    executeInternalLines(path) {
        this.results.length = 0;
        if (path.length < 2 || Core_Rect64Utils.isEmpty(this.rect))
            return;
        let prev = RectClip_Location.inside;
        let i = 1;
        const highI = path.length - 1;
        const firstLocResult = RectClip64.getLocation(this.rect, path[0]);
        let loc = firstLocResult.location;
        if (firstLocResult.isOnRect) {
            while (i <= highI) {
                const prevLocResult = RectClip64.getLocation(this.rect, path[i]);
                if (!prevLocResult.isOnRect) {
                    prev = prevLocResult.location;
                    break;
                }
                i++;
            }
            if (i > highI) {
                for (const pt of path) {
                    this.add(pt);
                }
                return;
            }
            if (prev === RectClip_Location.inside)
                loc = RectClip_Location.inside;
            i = 1;
        }
        if (loc === RectClip_Location.inside)
            this.add(path[0]);
        ///////////////////////////////////////////////////
        while (i <= highI) {
            prev = loc;
            const nextLocResult = this.getNextLocation(path, loc, i, highI);
            loc = nextLocResult.location;
            i = nextLocResult.index;
            if (i > highI)
                break;
            const prevPt = path[i - 1];
            let crossingLoc = loc;
            const intersectionResult = RectClip64.getIntersection(this.rectPath, path[i], prevPt, crossingLoc);
            if (!intersectionResult.intersects) {
                // ie remaining outside (& crossingLoc still == loc)
                ++i;
                continue;
            }
            const ip = intersectionResult.point;
            crossingLoc = intersectionResult.newLocation;
            ////////////////////////////////////////////////////
            // we must be crossing the rect boundary to get here
            ////////////////////////////////////////////////////
            if (loc === RectClip_Location.inside) { // path must be entering rect
                this.add(ip, true);
            }
            else if (prev !== RectClip_Location.inside) {
                // passing right through rect. 'ip' here will be the second 
                // intersect pt but we'll also need the first intersect pt (ip2)
                crossingLoc = prev;
                const intersection2Result = RectClip64.getIntersection(this.rectPath, prevPt, path[i], crossingLoc);
                const ip2 = intersection2Result.point;
                this.add(ip2, true);
                this.add(ip);
            }
            else { // path must be exiting rect
                this.add(ip);
            }
        } //while i <= highI
        ///////////////////////////////////////////////////
    }
}
//# sourceMappingURL=RectClip.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/Minkowski.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  10 October 2024                                                 *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2024                                         *
* Purpose   :  Minkowski Sum and Difference                                    *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/


var Minkowski_Minkowski;
(function (Minkowski) {
    function minkowskiInternal(pattern, path, isSum, isClosed) {
        const delta = isClosed ? 0 : 1;
        const patLen = pattern.length;
        const pathLen = path.length;
        const tmp = [];
        for (const pathPt of path) {
            const path2 = [];
            if (isSum) {
                for (const basePt of pattern) {
                    path2.push(Core_Point64Utils.add(pathPt, basePt));
                }
            }
            else {
                for (const basePt of pattern) {
                    path2.push(Core_Point64Utils.subtract(pathPt, basePt));
                }
            }
            tmp.push(path2);
        }
        const result = [];
        let g = isClosed ? pathLen - 1 : 0;
        let h = patLen - 1;
        for (let i = delta; i < pathLen; i++) {
            for (let j = 0; j < patLen; j++) {
                const quad = [
                    tmp[g][h],
                    tmp[i][h],
                    tmp[i][j],
                    tmp[g][j]
                ];
                if (!isPositive(quad)) {
                    result.push(reversePath(quad));
                }
                else {
                    result.push(quad);
                }
                h = j;
            }
            g = i;
        }
        return result;
    }
    function sum(pattern, path, isClosed) {
        return union(minkowskiInternal(pattern, path, true, isClosed), Core_FillRule.NonZero);
    }
    Minkowski.sum = sum;
    function sumD(pattern, path, isClosed, decimalPlaces = 2) {
        const scale = Math.pow(10, decimalPlaces);
        const tmp = union(minkowskiInternal(scalePath64(pattern, scale), scalePath64(path, scale), true, isClosed), Core_FillRule.NonZero);
        return scalePathsD(tmp, 1 / scale);
    }
    Minkowski.sumD = sumD;
    function diff(pattern, path, isClosed) {
        return union(minkowskiInternal(pattern, path, false, isClosed), Core_FillRule.NonZero);
    }
    Minkowski.diff = diff;
    function diffD(pattern, path, isClosed, decimalPlaces = 2) {
        const scale = Math.pow(10, decimalPlaces);
        const tmp = union(minkowskiInternal(scalePath64(pattern, scale), scalePath64(path, scale), false, isClosed), Core_FillRule.NonZero);
        return scalePathsD(tmp, 1 / scale);
    }
    Minkowski.diffD = diffD;
    // Helper functions (these would typically be imported from the main Clipper class)
    function isPositive(path) {
        return area(path) >= 0;
    }
    function area(path) {
        // https://en.wikipedia.org/wiki/Shoelace_formula
        let a = 0.0;
        const cnt = path.length;
        if (cnt < 3)
            return 0.0;
        let prevPt = path[cnt - 1];
        for (const pt of path) {
            a += (prevPt.y + pt.y) * (prevPt.x - pt.x);
            prevPt = pt;
        }
        return a * 0.5;
    }
    function reversePath(path) {
        return [...path].reverse();
    }
    function scalePath64(path, scale) {
        const result = [];
        for (const pt of path) {
            result.push({
                x: Core_InternalClipper.roundToEven(pt.x * scale),
                y: Core_InternalClipper.roundToEven(pt.y * scale)
            });
        }
        return result;
    }
    function scalePathsD(paths, scale) {
        const result = [];
        for (const path of paths) {
            const pathD = [];
            for (const pt of path) {
                pathD.push({
                    x: pt.x * scale,
                    y: pt.y * scale
                });
            }
            result.push(pathD);
        }
        return result;
    }
    // Local union implementation to avoid circular dependency
    function union(paths, fillRule) {
        const solution = [];
        const c = new Clipper64();
        c.addPaths(paths, Core_PathType.Subject);
        c.execute(Core_ClipType.Union, fillRule, solution);
        return solution;
    }
})(Minkowski_Minkowski || (Minkowski_Minkowski = {}));
//# sourceMappingURL=Minkowski.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/Triangulation.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  13 December 2025                                                *
* Release   :  BETA RELEASE                                                    *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2025                                         *
* Purpose   :  Constrained Delaunay Triangulation                              *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/

var Triangulation_TriangulateResult;
(function (TriangulateResult) {
    TriangulateResult[TriangulateResult["success"] = 0] = "success";
    TriangulateResult[TriangulateResult["fail"] = 1] = "fail";
    TriangulateResult[TriangulateResult["noPolygons"] = 2] = "noPolygons";
    TriangulateResult[TriangulateResult["pathsIntersect"] = 3] = "pathsIntersect";
})(Triangulation_TriangulateResult || (Triangulation_TriangulateResult = {}));
// -------------------------------------------------------------------------
// Internal triangulation helpers
// -------------------------------------------------------------------------
var Triangulation_EdgeKind;
(function (EdgeKind) {
    EdgeKind[EdgeKind["loose"] = 0] = "loose";
    EdgeKind[EdgeKind["ascend"] = 1] = "ascend";
    EdgeKind[EdgeKind["descend"] = 2] = "descend";
})(Triangulation_EdgeKind || (Triangulation_EdgeKind = {})); // ascend & descend are 'fixed' edges
var Triangulation_IntersectKind;
(function (IntersectKind) {
    IntersectKind[IntersectKind["none"] = 0] = "none";
    IntersectKind[IntersectKind["collinear"] = 1] = "collinear";
    IntersectKind[IntersectKind["intersect"] = 2] = "intersect";
})(Triangulation_IntersectKind || (Triangulation_IntersectKind = {}));
var Triangulation_EdgeContainsResult;
(function (EdgeContainsResult) {
    EdgeContainsResult[EdgeContainsResult["neither"] = 0] = "neither";
    EdgeContainsResult[EdgeContainsResult["left"] = 1] = "left";
    EdgeContainsResult[EdgeContainsResult["right"] = 2] = "right";
})(Triangulation_EdgeContainsResult || (Triangulation_EdgeContainsResult = {}));
class Vertex2 {
    pt;
    edges = [];
    innerLM = false;
    constructor(p64) {
        this.pt = p64;
    }
}
class Edge {
    vL = null;
    vR = null;
    vB = null;
    vT = null;
    kind = Triangulation_EdgeKind.loose;
    triA = null;
    triB = null;
    isActive = false;
    nextE = null;
    prevE = null;
}
class Triangle {
    edges = new Array(3);
    constructor(e1, e2, e3) {
        this.edges[0] = e1;
        this.edges[1] = e2;
        this.edges[2] = e3;
    }
}
// -------------------------------------------------------------------------
// Delaunay class declaration & implementation
// -------------------------------------------------------------------------
class Delaunay {
    allVertices = [];
    allEdges = [];
    allTriangles = [];
    pendingDelaunayStack = [];
    horzEdgeStack = [];
    locMinStack = [];
    useDelaunay;
    firstActive = null;
    lowermostVertex = null;
    constructor(delaunay = true) {
        this.useDelaunay = delaunay;
    }
    addPath(path) {
        const len = path.length;
        if (len === 0)
            return;
        let i0 = 0;
        let iPrev;
        let iNext;
        const foundIdx = Delaunay.findLocMinIdx(path, len, i0);
        if (!foundIdx.found)
            return;
        i0 = foundIdx.idx;
        iPrev = Delaunay.prev(i0, len);
        while (path[iPrev].x === path[i0].x && path[iPrev].y === path[i0].y)
            iPrev = Delaunay.prev(iPrev, len);
        iNext = Delaunay.next(i0, len);
        let i = i0;
        while (Core_InternalClipper.crossProductSign(path[iPrev], path[i], path[iNext]) === 0) {
            const result = Delaunay.findLocMinIdx(path, len, i);
            if (!result.found)
                return; // entirely collinear path
            i = result.idx;
            iPrev = Delaunay.prev(i, len);
            while (path[iPrev].x === path[i].x && path[iPrev].y === path[i].y)
                iPrev = Delaunay.prev(iPrev, len);
            iNext = Delaunay.next(i, len);
        }
        const vert_cnt = this.allVertices.length;
        const v0 = new Vertex2(path[i]);
        this.allVertices.push(v0);
        if (Delaunay.leftTurning(path[iPrev], path[i], path[iNext]))
            v0.innerLM = true;
        let vPrev = v0;
        i = iNext;
        for (;;) {
            // vPrev is a locMin here
            this.locMinStack.push(vPrev);
            // ? update lowermostVertex ...
            if (this.lowermostVertex === null ||
                vPrev.pt.y > this.lowermostVertex.pt.y ||
                (vPrev.pt.y === this.lowermostVertex.pt.y &&
                    vPrev.pt.x < this.lowermostVertex.pt.x))
                this.lowermostVertex = vPrev;
            iNext = Delaunay.next(i, len);
            if (Core_InternalClipper.crossProductSign(vPrev.pt, path[i], path[iNext]) === 0) {
                i = iNext;
                continue;
            }
            // ascend up next bound to LocMax
            while (path[i].y <= vPrev.pt.y) {
                const v = new Vertex2(path[i]);
                this.allVertices.push(v);
                this.createEdge(vPrev, v, Triangulation_EdgeKind.ascend);
                vPrev = v;
                i = iNext;
                iNext = Delaunay.next(i, len);
                while (Core_InternalClipper.crossProductSign(vPrev.pt, path[i], path[iNext]) === 0) {
                    i = iNext;
                    iNext = Delaunay.next(i, len);
                }
            }
            // Now at a locMax, so descend to next locMin
            const vPrevPrev = vPrev;
            while (i !== i0 && path[i].y >= vPrev.pt.y) {
                const v = new Vertex2(path[i]);
                this.allVertices.push(v);
                this.createEdge(v, vPrev, Triangulation_EdgeKind.descend);
                vPrev = v;
                i = iNext;
                iNext = Delaunay.next(i, len);
                while (Core_InternalClipper.crossProductSign(vPrev.pt, path[i], path[iNext]) === 0) {
                    i = iNext;
                    iNext = Delaunay.next(i, len);
                }
            }
            // now at the next locMin
            if (i === i0)
                break;
            if (Delaunay.leftTurning(vPrevPrev.pt, vPrev.pt, path[i]))
                vPrev.innerLM = true;
        }
        this.createEdge(v0, vPrev, Triangulation_EdgeKind.descend);
        // finally, ignore this path if is not a polygon or too small
        const pathLen = this.allVertices.length - vert_cnt;
        const idx = vert_cnt;
        if (pathLen < 3 || (pathLen === 3 &&
            ((Delaunay.distSqr(this.allVertices[idx].pt, this.allVertices[idx + 1].pt) <= 1) ||
                (Delaunay.distSqr(this.allVertices[idx + 1].pt, this.allVertices[idx + 2].pt) <= 1) ||
                (Delaunay.distSqr(this.allVertices[idx + 2].pt, this.allVertices[idx].pt) <= 1)))) {
            for (let j = vert_cnt; j < this.allVertices.length; ++j)
                this.allVertices[j].edges = []; // flag to ignore
        }
    }
    addPaths(paths) {
        let totalVertexCount = 0;
        for (const path of paths)
            totalVertexCount += path.length;
        if (totalVertexCount === 0)
            return false;
        for (const path of paths)
            this.addPath(path);
        return this.allVertices.length > 2;
    }
    cleanUp() {
        this.allVertices.length = 0;
        this.allEdges.length = 0;
        this.allTriangles.length = 0;
        this.pendingDelaunayStack.length = 0;
        this.horzEdgeStack.length = 0;
        this.locMinStack.length = 0;
        this.firstActive = null;
        this.lowermostVertex = null;
    }
    fixupEdgeIntersects() {
        // precondition - edgeList must be sorted - ascending on edge.vL.pt.x
        for (let i1 = 0; i1 < this.allEdges.length; ++i1) {
            const e1 = this.allEdges[i1];
            for (let i2 = i1 + 1; i2 < this.allEdges.length; ++i2) {
                const e2 = this.allEdges[i2];
                if (e2.vL.pt.x >= e1.vR.pt.x)
                    break;
                if (e2.vT.pt.y < e1.vB.pt.y && e2.vB.pt.y > e1.vT.pt.y &&
                    Delaunay.segsIntersect(e2.vL.pt, e2.vR.pt, e1.vL.pt, e1.vR.pt) === Triangulation_IntersectKind.intersect) {
                    if (!this.removeIntersection(e2, e1))
                        return false;
                }
            }
        }
        return true;
    }
    mergeDupOrCollinearVertices() {
        if (this.allVertices.length < 2)
            return;
        let v1Index = 0;
        for (let v2Index = 1; v2Index < this.allVertices.length; ++v2Index) {
            const v1 = this.allVertices[v1Index];
            const v2 = this.allVertices[v2Index];
            if (!(v1.pt.x === v2.pt.x && v1.pt.y === v2.pt.y)) {
                v1Index = v2Index;
                continue;
            }
            // merge v1 & v2
            if (!v1.innerLM || !v2.innerLM)
                v1.innerLM = false;
            for (const e of v2.edges) {
                if (e.vB === v2)
                    e.vB = v1;
                else
                    e.vT = v1;
                if (e.vL === v2)
                    e.vL = v1;
                else
                    e.vR = v1;
            }
            v1.edges.push(...v2.edges);
            v2.edges = [];
            // excluding horizontals, if pv.edges contains two edges
            // that are collinear and share the same bottom coords
            // but have different lengths, split the longer edge at
            // the top of the shorter edge ...
            for (let iE = 0; iE < v1.edges.length; ++iE) {
                const e1 = v1.edges[iE];
                if (Delaunay.isHorizontal(e1) || e1.vB !== v1)
                    continue;
                for (let iE2 = iE + 1; iE2 < v1.edges.length; ++iE2) {
                    const e2 = v1.edges[iE2];
                    if (e2.vB !== v1 || e1.vT.pt.y === e2.vT.pt.y ||
                        Core_InternalClipper.crossProductSign(e1.vT.pt, v1.pt, e2.vT.pt) !== 0)
                        continue;
                    // parallel edges from v1 up
                    if (e1.vT.pt.y < e2.vT.pt.y)
                        this.splitEdge(e1, e2);
                    else
                        this.splitEdge(e2, e1);
                    break; // only two can be collinear
                }
            }
        }
    }
    splitEdge(longE, shortE) {
        const oldT = longE.vT;
        const newT = shortE.vT;
        Delaunay.removeEdgeFromVertex(oldT, longE);
        longE.vT = newT;
        if (longE.vL === oldT)
            longE.vL = newT;
        else
            longE.vR = newT;
        newT.edges.push(longE);
        this.createEdge(newT, oldT, longE.kind);
    }
    removeIntersection(e1, e2) {
        let v = e1.vL;
        let tmpE = e2;
        let d = Delaunay.shortestDistFromSegment(e1.vL.pt, e2.vL.pt, e2.vR.pt);
        let d2 = Delaunay.shortestDistFromSegment(e1.vR.pt, e2.vL.pt, e2.vR.pt);
        if (d2 < d) {
            d = d2;
            v = e1.vR;
        }
        d2 = Delaunay.shortestDistFromSegment(e2.vL.pt, e1.vL.pt, e1.vR.pt);
        if (d2 < d) {
            d = d2;
            tmpE = e1;
            v = e2.vL;
        }
        d2 = Delaunay.shortestDistFromSegment(e2.vR.pt, e1.vL.pt, e1.vR.pt);
        if (d2 < d) {
            d = d2;
            tmpE = e1;
            v = e2.vR;
        }
        if (d > 1.0)
            return false; // not a simple rounding intersection
        const v2 = tmpE.vT;
        Delaunay.removeEdgeFromVertex(v2, tmpE);
        if (tmpE.vL === v2)
            tmpE.vL = v;
        else
            tmpE.vR = v;
        tmpE.vT = v;
        v.edges.push(tmpE);
        v.innerLM = false;
        if (tmpE.vB.innerLM && Delaunay.getLocMinAngle(tmpE.vB) <= 0)
            tmpE.vB.innerLM = false;
        this.createEdge(v, v2, tmpE.kind);
        return true;
    }
    createEdge(v1, v2, k) {
        const res = new Edge();
        this.allEdges.push(res);
        if (v1.pt.y === v2.pt.y) {
            res.vB = v1;
            res.vT = v2;
        }
        else if (v1.pt.y < v2.pt.y) {
            res.vB = v2;
            res.vT = v1;
        }
        else {
            res.vB = v1;
            res.vT = v2;
        }
        if (v1.pt.x <= v2.pt.x) {
            res.vL = v1;
            res.vR = v2;
        }
        else {
            res.vL = v2;
            res.vR = v1;
        }
        res.kind = k;
        v1.edges.push(res);
        v2.edges.push(res);
        if (k === Triangulation_EdgeKind.loose) {
            this.pendingDelaunayStack.push(res);
            this.addEdgeToActives(res);
        }
        return res;
    }
    createTriangle(e1, e2, e3) {
        const tri = new Triangle(e1, e2, e3);
        this.allTriangles.push(tri);
        for (let i = 0; i < 3; ++i) {
            const e = tri.edges[i];
            if (e.triA !== null) {
                e.triB = tri;
                this.removeEdgeFromActives(e);
            }
            else {
                e.triA = tri;
                if (!Delaunay.isLooseEdge(e))
                    this.removeEdgeFromActives(e);
            }
        }
        return tri;
    }
    forceLegal(edge) {
        if (edge.triA === null || edge.triB === null)
            return;
        let vertA = null;
        let vertB = null;
        const edgesA = [null, null, null];
        const edgesB = [null, null, null];
        for (let i = 0; i < 3; ++i) {
            if (edge.triA.edges[i] === edge)
                continue;
            const e = edge.triA.edges[i];
            const containsResult = Delaunay.edgeContains(e, edge.vL);
            if (containsResult === Triangulation_EdgeContainsResult.left) {
                edgesA[1] = e;
                vertA = e.vR;
            }
            else if (containsResult === Triangulation_EdgeContainsResult.right) {
                edgesA[1] = e;
                vertA = e.vL;
            }
            else {
                edgesB[1] = e;
            }
        }
        for (let i = 0; i < 3; ++i) {
            if (edge.triB.edges[i] === edge)
                continue;
            const e = edge.triB.edges[i];
            const containsResult = Delaunay.edgeContains(e, edge.vL);
            if (containsResult === Triangulation_EdgeContainsResult.left) {
                edgesA[2] = e;
                vertB = e.vR;
            }
            else if (containsResult === Triangulation_EdgeContainsResult.right) {
                edgesA[2] = e;
                vertB = e.vL;
            }
            else {
                edgesB[2] = e;
            }
        }
        if (vertA === null || vertB === null)
            return;
        if (Core_InternalClipper.crossProductSign(vertA.pt, edge.vL.pt, edge.vR.pt) === 0)
            return;
        const ictResult = Delaunay.inCircleTest(vertA.pt, edge.vL.pt, edge.vR.pt, vertB.pt);
        if (ictResult === 0 ||
            (Delaunay.rightTurning(vertA.pt, edge.vL.pt, edge.vR.pt) === (ictResult < 0)))
            return;
        edge.vL = vertA;
        edge.vR = vertB;
        edge.triA.edges[0] = edge;
        for (let i = 1; i < 3; ++i) {
            const eAi = edgesA[i];
            edge.triA.edges[i] = eAi;
            if (Delaunay.isLooseEdge(eAi))
                this.pendingDelaunayStack.push(eAi);
            if (eAi.triA === edge.triA || eAi.triB === edge.triA)
                continue;
            if (eAi.triA === edge.triB)
                eAi.triA = edge.triA;
            else if (eAi.triB === edge.triB)
                eAi.triB = edge.triA;
            else
                throw new Error('Triangulation internal error');
        }
        edge.triB.edges[0] = edge;
        for (let i = 1; i < 3; ++i) {
            const eBi = edgesB[i];
            edge.triB.edges[i] = eBi;
            if (Delaunay.isLooseEdge(eBi))
                this.pendingDelaunayStack.push(eBi);
            if (eBi.triA === edge.triB || eBi.triB === edge.triB)
                continue;
            if (eBi.triA === edge.triA)
                eBi.triA = edge.triB;
            else if (eBi.triB === edge.triA)
                eBi.triB = edge.triB;
            else
                throw new Error('Triangulation internal error');
        }
    }
    createInnerLocMinLooseEdge(vAbove) {
        if (this.firstActive === null)
            return null;
        const xAbove = vAbove.pt.x;
        const yAbove = vAbove.pt.y;
        let e = this.firstActive;
        let eBelow = null;
        let bestD = -1.0;
        while (e !== null) {
            if (e.vL.pt.x <= xAbove && e.vR.pt.x >= xAbove &&
                e.vB.pt.y >= yAbove && e.vB !== vAbove && e.vT !== vAbove &&
                !Delaunay.leftTurning(e.vL.pt, vAbove.pt, e.vR.pt)) {
                const d = Delaunay.shortestDistFromSegment(vAbove.pt, e.vL.pt, e.vR.pt);
                if (eBelow === null || d < bestD) {
                    eBelow = e;
                    bestD = d;
                }
            }
            e = e.nextE;
        }
        if (eBelow === null)
            return null;
        let vBest = (eBelow.vT.pt.y <= yAbove) ? eBelow.vB : eBelow.vT;
        let xBest = vBest.pt.x;
        let yBest = vBest.pt.y;
        e = this.firstActive;
        if (xBest < xAbove) {
            while (e !== null) {
                if (e.vR.pt.x > xBest && e.vL.pt.x < xAbove &&
                    e.vB.pt.y > yAbove && e.vT.pt.y < yBest &&
                    Delaunay.segsIntersect(e.vB.pt, e.vT.pt, vBest.pt, vAbove.pt) === Triangulation_IntersectKind.intersect) {
                    vBest = (e.vT.pt.y > yAbove) ? e.vT : e.vB;
                    xBest = vBest.pt.x;
                    yBest = vBest.pt.y;
                }
                e = e.nextE;
            }
        }
        else {
            while (e !== null) {
                if (e.vR.pt.x < xBest && e.vL.pt.x > xAbove &&
                    e.vB.pt.y > yAbove && e.vT.pt.y < yBest &&
                    Delaunay.segsIntersect(e.vB.pt, e.vT.pt, vBest.pt, vAbove.pt) === Triangulation_IntersectKind.intersect) {
                    vBest = (e.vT.pt.y > yAbove) ? e.vT : e.vB;
                    xBest = vBest.pt.x;
                    yBest = vBest.pt.y;
                }
                e = e.nextE;
            }
        }
        return this.createEdge(vBest, vAbove, Triangulation_EdgeKind.loose);
    }
    horizontalBetween(v1, v2) {
        const y = v1.pt.y;
        let l;
        let r;
        if (v1.pt.x > v2.pt.x) {
            l = v2.pt.x;
            r = v1.pt.x;
        }
        else {
            l = v1.pt.x;
            r = v2.pt.x;
        }
        let res = this.firstActive;
        while (res !== null) {
            if (res.vL.pt.y === y && res.vR.pt.y === y &&
                res.vL.pt.x >= l && res.vR.pt.x <= r &&
                (res.vL.pt.x !== l || res.vL.pt.x !== r))
                break;
            res = res.nextE;
        }
        return res;
    }
    doTriangulateLeft(edge, pivot, minY) {
        let vAlt = null;
        let eAlt = null;
        const v = (edge.vB === pivot) ? edge.vT : edge.vB;
        for (const e of pivot.edges) {
            if (e === edge || !e.isActive)
                continue;
            const vX = (e.vT === pivot) ? e.vB : e.vT;
            if (vX === v)
                continue;
            const cps = Core_InternalClipper.crossProductSign(v.pt, pivot.pt, vX.pt);
            if (cps === 0) {
                if ((v.pt.x > pivot.pt.x) === (pivot.pt.x > vX.pt.x))
                    continue;
            }
            else if (cps > 0 || (vAlt !== null && !Delaunay.leftTurning(vX.pt, pivot.pt, vAlt.pt)))
                continue;
            vAlt = vX;
            eAlt = e;
        }
        if (vAlt === null || vAlt.pt.y < minY || eAlt === null)
            return;
        if (vAlt.pt.y < pivot.pt.y) {
            if (Delaunay.isLeftEdge(eAlt))
                return;
        }
        else if (vAlt.pt.y > pivot.pt.y) {
            if (Delaunay.isRightEdge(eAlt))
                return;
        }
        let eX = Delaunay.findLinkingEdge(vAlt, v, (vAlt.pt.y < v.pt.y));
        if (eX === null) {
            if (vAlt.pt.y === v.pt.y && v.pt.y === minY &&
                this.horizontalBetween(vAlt, v) !== null)
                return;
            eX = this.createEdge(vAlt, v, Triangulation_EdgeKind.loose);
        }
        this.createTriangle(edge, eAlt, eX);
        if (!Delaunay.edgeCompleted(eX))
            this.doTriangulateLeft(eX, vAlt, minY);
    }
    doTriangulateRight(edge, pivot, minY) {
        let vAlt = null;
        let eAlt = null;
        const v = (edge.vB === pivot) ? edge.vT : edge.vB;
        for (const e of pivot.edges) {
            if (e === edge || !e.isActive)
                continue;
            const vX = (e.vT === pivot) ? e.vB : e.vT;
            if (vX === v)
                continue;
            const cps = Core_InternalClipper.crossProductSign(v.pt, pivot.pt, vX.pt);
            if (cps === 0) {
                if ((v.pt.x > pivot.pt.x) === (pivot.pt.x > vX.pt.x))
                    continue;
            }
            else if (cps < 0 || (vAlt !== null && !Delaunay.rightTurning(vX.pt, pivot.pt, vAlt.pt)))
                continue;
            vAlt = vX;
            eAlt = e;
        }
        if (vAlt === null || vAlt.pt.y < minY || eAlt === null)
            return;
        if (vAlt.pt.y < pivot.pt.y) {
            if (Delaunay.isRightEdge(eAlt))
                return;
        }
        else if (vAlt.pt.y > pivot.pt.y) {
            if (Delaunay.isLeftEdge(eAlt))
                return;
        }
        let eX = Delaunay.findLinkingEdge(vAlt, v, (vAlt.pt.y > v.pt.y));
        if (eX === null) {
            if (vAlt.pt.y === v.pt.y && v.pt.y === minY &&
                this.horizontalBetween(vAlt, v) !== null)
                return;
            eX = this.createEdge(vAlt, v, Triangulation_EdgeKind.loose);
        }
        this.createTriangle(edge, eX, eAlt);
        if (!Delaunay.edgeCompleted(eX))
            this.doTriangulateRight(eX, vAlt, minY);
    }
    addEdgeToActives(edge) {
        if (edge.isActive)
            return;
        edge.prevE = null;
        edge.nextE = this.firstActive;
        edge.isActive = true;
        if (this.firstActive !== null)
            this.firstActive.prevE = edge;
        this.firstActive = edge;
    }
    removeEdgeFromActives(edge) {
        Delaunay.removeEdgeFromVertex(edge.vB, edge);
        Delaunay.removeEdgeFromVertex(edge.vT, edge);
        const prev = edge.prevE;
        const next = edge.nextE;
        if (next !== null)
            next.prevE = prev;
        if (prev !== null)
            prev.nextE = next;
        edge.isActive = false;
        if (this.firstActive === edge)
            this.firstActive = next;
    }
    execute(paths) {
        const sol = [];
        if (!this.addPaths(paths)) {
            return { result: Triangulation_TriangulateResult.noPolygons, solution: sol };
        }
        // if necessary fix path orientation because the algorithm 
        // expects clockwise outer paths and counter-clockwise inner paths
        if (this.lowermostVertex.innerLM) {
            // the orientation of added paths must be wrong, so
            // 1. reverse innerLM flags ...
            while (this.locMinStack.length > 0) {
                const lm = this.locMinStack.pop();
                lm.innerLM = !lm.innerLM;
            }
            // 2. swap edge kinds
            for (const e of this.allEdges) {
                if (e.kind === Triangulation_EdgeKind.ascend)
                    e.kind = Triangulation_EdgeKind.descend;
                else if (e.kind === Triangulation_EdgeKind.descend)
                    e.kind = Triangulation_EdgeKind.ascend;
            }
        }
        else {
            // path orientation is fine so ...
            this.locMinStack.length = 0;
        }
        this.allEdges.sort((a, b) => {
            if (a.vL.pt.x < b.vL.pt.x)
                return -1;
            if (a.vL.pt.x > b.vL.pt.x)
                return 1;
            return 0;
        });
        if (!this.fixupEdgeIntersects()) {
            this.cleanUp();
            return { result: Triangulation_TriangulateResult.pathsIntersect, solution: sol };
        }
        this.allVertices.sort((a, b) => {
            if (a.pt.y === b.pt.y) {
                if (a.pt.x < b.pt.x)
                    return -1;
                if (a.pt.x > b.pt.x)
                    return 1;
                return 0;
            }
            if (b.pt.y < a.pt.y)
                return -1;
            return 1;
        });
        this.mergeDupOrCollinearVertices();
        let currY = this.allVertices[0].pt.y;
        for (const v of this.allVertices) {
            if (v.edges.length === 0)
                continue;
            if (v.pt.y !== currY) {
                while (this.locMinStack.length > 0) {
                    const lm = this.locMinStack.pop();
                    const e = this.createInnerLocMinLooseEdge(lm);
                    if (e === null) {
                        this.cleanUp();
                        return { result: Triangulation_TriangulateResult.fail, solution: sol };
                    }
                    if (Delaunay.isHorizontal(e)) {
                        if (e.vL === e.vB)
                            this.doTriangulateLeft(e, e.vB, currY);
                        else
                            this.doTriangulateRight(e, e.vB, currY);
                    }
                    else {
                        this.doTriangulateLeft(e, e.vB, currY);
                        if (!Delaunay.edgeCompleted(e))
                            this.doTriangulateRight(e, e.vB, currY);
                    }
                    this.addEdgeToActives(lm.edges[0]);
                    this.addEdgeToActives(lm.edges[1]);
                }
                while (this.horzEdgeStack.length > 0) {
                    const e = this.horzEdgeStack.pop();
                    if (Delaunay.edgeCompleted(e))
                        continue;
                    if (e.vB === e.vL) {
                        if (Delaunay.isLeftEdge(e))
                            this.doTriangulateLeft(e, e.vB, currY);
                    }
                    else {
                        if (Delaunay.isRightEdge(e))
                            this.doTriangulateRight(e, e.vB, currY);
                    }
                }
                currY = v.pt.y;
            }
            for (let i = v.edges.length - 1; i >= 0; --i) {
                if (i >= v.edges.length)
                    continue;
                const e = v.edges[i];
                if (Delaunay.edgeCompleted(e) || Delaunay.isLooseEdge(e))
                    continue;
                if (v === e.vB) {
                    if (Delaunay.isHorizontal(e))
                        this.horzEdgeStack.push(e);
                    if (!v.innerLM)
                        this.addEdgeToActives(e);
                }
                else {
                    if (Delaunay.isHorizontal(e))
                        this.horzEdgeStack.push(e);
                    else if (Delaunay.isLeftEdge(e))
                        this.doTriangulateLeft(e, e.vB, v.pt.y);
                    else
                        this.doTriangulateRight(e, e.vB, v.pt.y);
                }
            }
            if (v.innerLM)
                this.locMinStack.push(v);
        }
        while (this.horzEdgeStack.length > 0) {
            const e = this.horzEdgeStack.pop();
            if (!Delaunay.edgeCompleted(e) && e.vB === e.vL)
                this.doTriangulateLeft(e, e.vB, currY);
        }
        if (this.useDelaunay) {
            while (this.pendingDelaunayStack.length > 0) {
                const e = this.pendingDelaunayStack.pop();
                this.forceLegal(e);
            }
        }
        for (const tri of this.allTriangles) {
            const p = Delaunay.pathFromTriangle(tri);
            const cps = Core_InternalClipper.crossProductSign(p[0], p[1], p[2]);
            if (cps === 0)
                continue;
            if (cps < 0)
                p.reverse();
            sol.push(p);
        }
        this.cleanUp();
        return { result: Triangulation_TriangulateResult.success, solution: sol };
    }
    // ---------------------------------------------------------------------
    // Static / helper functions
    // ---------------------------------------------------------------------
    static isLooseEdge(e) {
        return e.kind === Triangulation_EdgeKind.loose;
    }
    static isLeftEdge(e) {
        return e.kind === Triangulation_EdgeKind.ascend;
    }
    static isRightEdge(e) {
        return e.kind === Triangulation_EdgeKind.descend;
    }
    static isHorizontal(e) {
        return e.vB.pt.y === e.vT.pt.y;
    }
    static leftTurning(p1, p2, p3) {
        return Core_InternalClipper.crossProductSign(p1, p2, p3) < 0;
    }
    static rightTurning(p1, p2, p3) {
        return Core_InternalClipper.crossProductSign(p1, p2, p3) > 0;
    }
    static edgeCompleted(edge) {
        if (edge.triA === null)
            return false;
        if (edge.triB !== null)
            return true;
        return edge.kind !== Triangulation_EdgeKind.loose;
    }
    static edgeContains(edge, v) {
        if (edge.vL === v)
            return Triangulation_EdgeContainsResult.left;
        if (edge.vR === v)
            return Triangulation_EdgeContainsResult.right;
        return Triangulation_EdgeContainsResult.neither;
    }
    static getAngle(a, b, c) {
        const abx = Number(b.x - a.x);
        const aby = Number(b.y - a.y);
        const bcx = Number(b.x - c.x);
        const bcy = Number(b.y - c.y);
        const dp = abx * bcx + aby * bcy;
        const cp = abx * bcy - aby * bcx;
        return Math.atan2(cp, dp);
    }
    static getLocMinAngle(v) {
        let asc;
        let des;
        if (v.edges[0].kind === Triangulation_EdgeKind.ascend) {
            asc = 0;
            des = 1;
        }
        else {
            des = 0;
            asc = 1;
        }
        return Delaunay.getAngle(v.edges[des].vT.pt, v.pt, v.edges[asc].vT.pt);
    }
    static removeEdgeFromVertex(vert, edge) {
        const idx = vert.edges.indexOf(edge);
        if (idx < 0)
            throw new Error('Edge not found in vertex');
        vert.edges.splice(idx, 1);
    }
    static findLocMinIdx(path, len, idx) {
        if (len < 3)
            return { found: false, idx };
        const i0 = idx;
        let n = (idx + 1) % len;
        while (path[n].y <= path[idx].y) {
            idx = n;
            n = (n + 1) % len;
            if (idx === i0)
                return { found: false, idx };
        }
        while (path[n].y >= path[idx].y) {
            idx = n;
            n = (n + 1) % len;
        }
        return { found: true, idx };
    }
    static prev(idx, len) {
        if (idx === 0)
            return len - 1;
        return idx - 1;
    }
    static next(idx, len) {
        return (idx + 1) % len;
    }
    static findLinkingEdge(vert1, vert2, preferAscending) {
        let res = null;
        for (const e of vert1.edges) {
            if (e.vL === vert2 || e.vR === vert2) {
                if (e.kind === Triangulation_EdgeKind.loose ||
                    ((e.kind === Triangulation_EdgeKind.ascend) === preferAscending))
                    return e;
                res = e;
            }
        }
        return res;
    }
    static pathFromTriangle(tri) {
        const res = [
            tri.edges[0].vL.pt,
            tri.edges[0].vR.pt
        ];
        const e = tri.edges[1];
        if ((e.vL.pt.x === res[0].x && e.vL.pt.y === res[0].y) ||
            (e.vL.pt.x === res[1].x && e.vL.pt.y === res[1].y))
            res.push(e.vR.pt);
        else
            res.push(e.vL.pt);
        return res;
    }
    static inCircleTest(ptA, ptB, ptC, ptD) {
        const m00 = Number(ptA.x - ptD.x);
        const m01 = Number(ptA.y - ptD.y);
        const m02 = m00 * m00 + m01 * m01;
        const m10 = Number(ptB.x - ptD.x);
        const m11 = Number(ptB.y - ptD.y);
        const m12 = m10 * m10 + m11 * m11;
        const m20 = Number(ptC.x - ptD.x);
        const m21 = Number(ptC.y - ptD.y);
        const m22 = m20 * m20 + m21 * m21;
        return m00 * (m11 * m22 - m21 * m12) -
            m10 * (m01 * m22 - m21 * m02) +
            m20 * (m01 * m12 - m11 * m02);
    }
    static shortestDistFromSegment(pt, segPt1, segPt2) {
        const dx = Number(segPt2.x - segPt1.x);
        const dy = Number(segPt2.y - segPt1.y);
        const ax = Number(pt.x - segPt1.x);
        const ay = Number(pt.y - segPt1.y);
        const qNum = ax * dx + ay * dy;
        const denom = dx * dx + dy * dy;
        if (qNum < 0)
            return Delaunay.distanceSqr(pt, segPt1);
        if (qNum > denom)
            return Delaunay.distanceSqr(pt, segPt2);
        return (ax * dy - dx * ay) * (ax * dy - dx * ay) / denom;
    }
    static segsIntersect(s1a, s1b, s2a, s2b) {
        const dy1 = Number(s1b.y - s1a.y);
        const dx1 = Number(s1b.x - s1a.x);
        const dy2 = Number(s2b.y - s2a.y);
        const dx2 = Number(s2b.x - s2a.x);
        const cp = dy1 * dx2 - dy2 * dx1;
        if (cp === 0)
            return Triangulation_IntersectKind.collinear;
        let t = (Number(s1a.x - s2a.x) * dy2 -
            Number(s1a.y - s2a.y) * dx2);
        if (t === 0)
            return Triangulation_IntersectKind.none;
        if (t > 0) {
            if (cp < 0 || t >= cp)
                return Triangulation_IntersectKind.none;
        }
        else {
            if (cp > 0 || t <= cp)
                return Triangulation_IntersectKind.none;
        }
        t = (Number(s1a.x - s2a.x) * dy1 -
            Number(s1a.y - s2a.y) * dx1);
        if (t === 0)
            return Triangulation_IntersectKind.none;
        if (t > 0) {
            if (cp > 0 && t < cp)
                return Triangulation_IntersectKind.intersect;
        }
        else {
            if (cp < 0 && t > cp)
                return Triangulation_IntersectKind.intersect;
        }
        return Triangulation_IntersectKind.none;
    }
    static distSqr(pt1, pt2) {
        const dx = Number(pt1.x - pt2.x);
        const dy = Number(pt1.y - pt2.y);
        return dx * dx + dy * dy;
    }
    static distanceSqr(a, b) {
        const dx = Number(a.x - b.x);
        const dy = Number(a.y - b.y);
        return dx * dx + dy * dy;
    }
}
//# sourceMappingURL=Triangulation.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/Clipper.js
/*******************************************************************************
* Author    :  Angus Johnson                                                   *
* Date      :  5 March 2025                                                    *
* Website   :  https://www.angusj.com                                          *
* Copyright :  Angus Johnson 2010-2025                                         *
* Purpose   :  This module contains simple functions that will likely cover    *
*              most polygon boolean and offsetting needs, while also avoiding  *
*              the inherent complexities of the other modules.                 *
* License   :  https://www.boost.org/LICENSE_1_0.txt                           *
*******************************************************************************/






var Clipper_Clipper;
(function (Clipper) {
    // Constants
    Clipper.invalidRect64 = InvalidRect64;
    Clipper.invalidRectD = InvalidRectD;
    // Boolean operations
    function intersect(subject, clip, fillRule) {
        return booleanOp(Core_ClipType.Intersection, subject, clip, fillRule);
    }
    Clipper.intersect = intersect;
    function intersectD(subject, clip, fillRule, precision = 2) {
        return booleanOpD(Core_ClipType.Intersection, subject, clip, fillRule, precision);
    }
    Clipper.intersectD = intersectD;
    function union(subject, clipOrFillRule, fillRule) {
        if (typeof clipOrFillRule === 'number') {
            // First overload: union(subject, fillRule)
            return booleanOp(Core_ClipType.Union, subject, null, clipOrFillRule);
        }
        else {
            // Second overload: union(subject, clip, fillRule)
            return booleanOp(Core_ClipType.Union, subject, clipOrFillRule, fillRule);
        }
    }
    Clipper.union = union;
    function unionD(subject, clipOrFillRule, fillRuleOrPrecision, precision) {
        if (typeof clipOrFillRule === 'number') {
            // First overload: unionD(subject, fillRule)
            return booleanOpD(Core_ClipType.Union, subject, null, clipOrFillRule);
        }
        else {
            // Second overload: unionD(subject, clip, fillRule, precision)
            return booleanOpD(Core_ClipType.Union, subject, clipOrFillRule, fillRuleOrPrecision, precision || 2);
        }
    }
    Clipper.unionD = unionD;
    function difference(subject, clip, fillRule) {
        return booleanOp(Core_ClipType.Difference, subject, clip, fillRule);
    }
    Clipper.difference = difference;
    function differenceD(subject, clip, fillRule, precision = 2) {
        return booleanOpD(Core_ClipType.Difference, subject, clip, fillRule, precision);
    }
    Clipper.differenceD = differenceD;
    function xor(subject, clip, fillRule) {
        return booleanOp(Core_ClipType.Xor, subject, clip, fillRule);
    }
    Clipper.xor = xor;
    function xorD(subject, clip, fillRule, precision = 2) {
        return booleanOpD(Core_ClipType.Xor, subject, clip, fillRule, precision);
    }
    Clipper.xorD = xorD;
    function booleanOp(clipType, subject, clip, fillRule) {
        const solution = [];
        if (subject === null)
            return solution;
        const c = new Clipper64();
        c.addPaths(subject, Core_PathType.Subject);
        if (clip !== null) {
            c.addPaths(clip, Core_PathType.Clip);
        }
        c.execute(clipType, fillRule, solution);
        return solution;
    }
    Clipper.booleanOp = booleanOp;
    function booleanOpWithPolyTree(clipType, subject, clip, polytree, fillRule) {
        if (subject === null)
            return;
        const c = new Clipper64();
        c.addPaths(subject, Core_PathType.Subject);
        if (clip !== null) {
            c.addPaths(clip, Core_PathType.Clip);
        }
        c.execute(clipType, fillRule, polytree);
    }
    Clipper.booleanOpWithPolyTree = booleanOpWithPolyTree;
    function booleanOpD(clipType, subject, clip, fillRule, precision = 2) {
        const solution = [];
        const c = new ClipperD(precision);
        c.addSubjectPaths(subject);
        if (clip !== null) {
            c.addClipPaths(clip);
        }
        c.execute(clipType, fillRule, solution);
        return solution;
    }
    Clipper.booleanOpD = booleanOpD;
    function booleanOpDWithPolyTree(clipType, subject, clip, polytree, fillRule, precision = 2) {
        if (subject === null)
            return;
        const c = new ClipperD(precision);
        c.addSubjectPaths(subject);
        if (clip !== null) {
            c.addClipPaths(clip);
        }
        c.execute(clipType, fillRule, polytree);
    }
    Clipper.booleanOpDWithPolyTree = booleanOpDWithPolyTree;
    function inflatePaths(paths, delta, joinType, endType, miterLimit = 2.0, arcTolerance = 0.0) {
        const co = new ClipperOffset(miterLimit, arcTolerance);
        co.addPaths(paths, joinType, endType);
        const solution = [];
        co.execute(delta, solution);
        return solution;
    }
    Clipper.inflatePaths = inflatePaths;
    function inflatePathsD(paths, delta, joinType, endType, miterLimit = 2.0, precision = 2, arcTolerance = 0.0) {
        Core_InternalClipper.checkPrecision(precision);
        const scale = Math.pow(10, precision);
        const tmp = scalePaths64(paths, scale);
        const co = new ClipperOffset(miterLimit, scale * arcTolerance);
        co.addPaths(tmp, joinType, endType);
        const solution = [];
        co.execute(delta * scale, solution); // reuse solution to receive (scaled) solution
        return scalePathsD(solution, 1 / scale);
    }
    Clipper.inflatePathsD = inflatePathsD;
    function rectClip(rect, pathsOrPath, precision) {
        if ('left' in rect && typeof rect.left === 'number' && Number.isInteger(rect.left)) {
            // Rect64 case
            const rect64 = rect;
            if (Core_Rect64Utils.isEmpty(rect64))
                return [];
            if (Array.isArray(pathsOrPath[0])) {
                // Paths64
                const paths = pathsOrPath;
                if (paths.length === 0)
                    return [];
                const rc = new RectClip64(rect64);
                return rc.execute(paths);
            }
            else {
                // Path64
                const path = pathsOrPath;
                if (path.length === 0)
                    return [];
                const tmp = [path];
                return rectClip(rect64, tmp);
            }
        }
        else {
            // RectD case
            const rectD = rect;
            const prec = precision || 2;
            Core_InternalClipper.checkPrecision(prec);
            if (Core_RectDUtils.isEmpty(rectD))
                return [];
            const scale = Math.pow(10, prec);
            const r = scaleRect(rectD, scale);
            if (Array.isArray(pathsOrPath[0])) {
                // PathsD
                const paths = pathsOrPath;
                if (paths.length === 0)
                    return [];
                const tmpPath = scalePaths64(paths, scale);
                const rc = new RectClip64(r);
                const result = rc.execute(tmpPath);
                return scalePathsD(result, 1 / scale);
            }
            else {
                // PathD
                const path = pathsOrPath;
                if (path.length === 0)
                    return [];
                const tmp = [path];
                return rectClip(rectD, tmp, prec);
            }
        }
    }
    Clipper.rectClip = rectClip;
    function rectClipLines(rect, pathsOrPath, precision) {
        if ('left' in rect && typeof rect.left === 'number' && Number.isInteger(rect.left)) {
            // Rect64 case
            const rect64 = rect;
            if (Core_Rect64Utils.isEmpty(rect64))
                return [];
            if (Array.isArray(pathsOrPath[0])) {
                // Paths64
                const paths = pathsOrPath;
                if (paths.length === 0)
                    return [];
                const rc = new RectClipLines64(rect64);
                return rc.execute(paths);
            }
            else {
                // Path64
                const path = pathsOrPath;
                if (path.length === 0)
                    return [];
                const tmp = [path];
                return rectClipLines(rect64, tmp);
            }
        }
        else {
            // RectD case
            const rectD = rect;
            const prec = precision || 2;
            Core_InternalClipper.checkPrecision(prec);
            if (Core_RectDUtils.isEmpty(rectD))
                return [];
            const scale = Math.pow(10, prec);
            const r = scaleRect(rectD, scale);
            if (Array.isArray(pathsOrPath[0])) {
                // PathsD
                const paths = pathsOrPath;
                if (paths.length === 0)
                    return [];
                const tmpPath = scalePaths64(paths, scale);
                const rc = new RectClipLines64(r);
                const result = rc.execute(tmpPath);
                return scalePathsD(result, 1 / scale);
            }
            else {
                // PathD
                const path = pathsOrPath;
                if (path.length === 0)
                    return [];
                const tmp = [path];
                return rectClipLines(rectD, tmp, prec);
            }
        }
    }
    Clipper.rectClipLines = rectClipLines;
    function minkowskiSum(pattern, path, isClosed) {
        return Minkowski_Minkowski.sum(pattern, path, isClosed);
    }
    Clipper.minkowskiSum = minkowskiSum;
    function minkowskiSumD(pattern, path, isClosed) {
        return Minkowski_Minkowski.sumD(pattern, path, isClosed);
    }
    Clipper.minkowskiSumD = minkowskiSumD;
    function minkowskiDiff(pattern, path, isClosed) {
        return Minkowski_Minkowski.diff(pattern, path, isClosed);
    }
    Clipper.minkowskiDiff = minkowskiDiff;
    function minkowskiDiffD(pattern, path, isClosed) {
        return Minkowski_Minkowski.diffD(pattern, path, isClosed);
    }
    Clipper.minkowskiDiffD = minkowskiDiffD;
    function area(path) {
        // https://en.wikipedia.org/wiki/Shoelace_formula
        let a = 0.0;
        const cnt = path.length;
        if (cnt < 3)
            return 0.0;
        let prevPt = path[cnt - 1];
        for (const pt of path) {
            a += (prevPt.y + pt.y) * (prevPt.x - pt.x);
            prevPt = pt;
        }
        return a * 0.5;
    }
    Clipper.area = area;
    function areaPaths(paths) {
        let a = 0.0;
        for (const path of paths) {
            a += area(path);
        }
        return a;
    }
    Clipper.areaPaths = areaPaths;
    function areaD(path) {
        let a = 0.0;
        const cnt = path.length;
        if (cnt < 3)
            return 0.0;
        let prevPt = path[cnt - 1];
        for (const pt of path) {
            a += (prevPt.y + pt.y) * (prevPt.x - pt.x);
            prevPt = pt;
        }
        return a * 0.5;
    }
    Clipper.areaD = areaD;
    function areaPathsD(paths) {
        let a = 0.0;
        for (const path of paths) {
            a += areaD(path);
        }
        return a;
    }
    Clipper.areaPathsD = areaPathsD;
    function isPositive(poly) {
        return area(poly) >= 0;
    }
    Clipper.isPositive = isPositive;
    function isPositiveD(poly) {
        return areaD(poly) >= 0;
    }
    Clipper.isPositiveD = isPositiveD;
    function path64ToString(path) {
        let result = "";
        for (const pt of path) {
            result += Core_Point64Utils.toString(pt);
        }
        return result + '\n';
    }
    Clipper.path64ToString = path64ToString;
    function paths64ToString(paths) {
        let result = "";
        for (const path of paths) {
            result += path64ToString(path);
        }
        return result;
    }
    Clipper.paths64ToString = paths64ToString;
    function pathDToString(path, precision = 2) {
        let result = "";
        for (const pt of path) {
            result += Core_PointDUtils.toString(pt, precision);
        }
        return result + '\n';
    }
    Clipper.pathDToString = pathDToString;
    function pathsDToString(paths, precision = 2) {
        let result = "";
        for (const path of paths) {
            result += pathDToString(path, precision);
        }
        return result;
    }
    Clipper.pathsDToString = pathsDToString;
    function offsetPath(path, dx, dy) {
        const result = [];
        for (const pt of path) {
            result.push({ x: pt.x + dx, y: pt.y + dy });
        }
        return result;
    }
    Clipper.offsetPath = offsetPath;
    function scalePoint64(pt, scale) {
        return {
            x: Math.round(pt.x * scale),
            y: Math.round(pt.y * scale)
        };
    }
    Clipper.scalePoint64 = scalePoint64;
    function scalePointD(pt, scale) {
        return {
            x: pt.x * scale,
            y: pt.y * scale
        };
    }
    Clipper.scalePointD = scalePointD;
    function scaleRect(rec, scale) {
        return {
            left: Math.round(rec.left * scale),
            top: Math.round(rec.top * scale),
            right: Math.round(rec.right * scale),
            bottom: Math.round(rec.bottom * scale)
        };
    }
    Clipper.scaleRect = scaleRect;
    function scalePath(path, scale) {
        if (Core_InternalClipper.isAlmostZero(scale - 1))
            return path;
        const result = [];
        for (const pt of path) {
            result.push({
                x: Math.round(pt.x * scale),
                y: Math.round(pt.y * scale)
            });
        }
        return result;
    }
    Clipper.scalePath = scalePath;
    function scalePaths(paths, scale) {
        if (Core_InternalClipper.isAlmostZero(scale - 1))
            return paths;
        const result = [];
        for (const path of paths) {
            result.push(scalePath(path, scale));
        }
        return result;
    }
    Clipper.scalePaths = scalePaths;
    function scalePathD(path, scale) {
        if (Core_InternalClipper.isAlmostZero(scale - 1))
            return path;
        const result = [];
        for (const pt of path) {
            result.push(Core_PointDUtils.scale(pt, scale));
        }
        return result;
    }
    Clipper.scalePathD = scalePathD;
    function scalePathsD(paths, scale) {
        if (Core_InternalClipper.isAlmostZero(scale - 1))
            return paths;
        const result = [];
        for (const path of paths) {
            result.push(scalePathD(path, scale));
        }
        return result;
    }
    Clipper.scalePathsD = scalePathsD;
    // Unlike ScalePath, both ScalePath64 & ScalePathD also involve type conversion
    function scalePath64(path, scale) {
        const result = [];
        for (const pt of path) {
            result.push({
                x: Math.round(pt.x * scale),
                y: Math.round(pt.y * scale)
            });
        }
        return result;
    }
    Clipper.scalePath64 = scalePath64;
    function scalePaths64(paths, scale) {
        const result = [];
        for (const path of paths) {
            result.push(scalePath64(path, scale));
        }
        return result;
    }
    Clipper.scalePaths64 = scalePaths64;
    function scalePathDFromInt(path, scale) {
        const result = [];
        for (const pt of path) {
            result.push({
                x: pt.x * scale,
                y: pt.y * scale
            });
        }
        return result;
    }
    Clipper.scalePathDFromInt = scalePathDFromInt;
    function scalePathsDFromInt(paths, scale) {
        const result = [];
        for (const path of paths) {
            result.push(scalePathDFromInt(path, scale));
        }
        return result;
    }
    Clipper.scalePathsDFromInt = scalePathsDFromInt;
    // The static functions Path64 and PathD convert path types without scaling
    function path64FromD(path) {
        const result = [];
        for (const pt of path) {
            result.push(Core_Point64Utils.fromPointD(pt));
        }
        return result;
    }
    Clipper.path64FromD = path64FromD;
    function paths64FromD(paths) {
        const result = [];
        for (const path of paths) {
            result.push(path64FromD(path));
        }
        return result;
    }
    Clipper.paths64FromD = paths64FromD;
    function pathsD(paths) {
        const result = [];
        for (const path of paths) {
            result.push(pathD(path));
        }
        return result;
    }
    Clipper.pathsD = pathsD;
    function pathD(path) {
        const result = [];
        for (const pt of path) {
            result.push(Core_PointDUtils.fromPoint64(pt));
        }
        return result;
    }
    Clipper.pathD = pathD;
    function translatePath(path, dx, dy) {
        const result = [];
        for (const pt of path) {
            result.push({ x: pt.x + dx, y: pt.y + dy });
        }
        return result;
    }
    Clipper.translatePath = translatePath;
    function translatePaths(paths, dx, dy) {
        const result = [];
        for (const path of paths) {
            result.push(offsetPath(path, dx, dy));
        }
        return result;
    }
    Clipper.translatePaths = translatePaths;
    function translatePathD(path, dx, dy) {
        const result = [];
        for (const pt of path) {
            result.push({ x: pt.x + dx, y: pt.y + dy });
        }
        return result;
    }
    Clipper.translatePathD = translatePathD;
    function translatePathsD(paths, dx, dy) {
        const result = [];
        for (const path of paths) {
            result.push(translatePathD(path, dx, dy));
        }
        return result;
    }
    Clipper.translatePathsD = translatePathsD;
    function reversePath(path) {
        return [...path].reverse();
    }
    Clipper.reversePath = reversePath;
    function reversePathD(path) {
        return [...path].reverse();
    }
    Clipper.reversePathD = reversePathD;
    function reversePaths(paths) {
        const result = [];
        for (const path of paths) {
            result.push(reversePath(path));
        }
        return result;
    }
    Clipper.reversePaths = reversePaths;
    function reversePathsD(paths) {
        const result = [];
        for (const path of paths) {
            result.push(reversePathD(path));
        }
        return result;
    }
    Clipper.reversePathsD = reversePathsD;
    function getBounds(path) {
        return Core_InternalClipper.getBounds(path);
    }
    Clipper.getBounds = getBounds;
    function getBoundsPaths(paths) {
        const result = Core_Rect64Utils.createInvalid();
        for (const path of paths) {
            for (const pt of path) {
                if (pt.x < result.left)
                    result.left = pt.x;
                if (pt.x > result.right)
                    result.right = pt.x;
                if (pt.y < result.top)
                    result.top = pt.y;
                if (pt.y > result.bottom)
                    result.bottom = pt.y;
            }
        }
        return result.left === Number.MAX_SAFE_INTEGER ? { left: 0, top: 0, right: 0, bottom: 0 } : result;
    }
    Clipper.getBoundsPaths = getBoundsPaths;
    function getBoundsD(path) {
        const result = Core_RectDUtils.createInvalid();
        for (const pt of path) {
            if (pt.x < result.left)
                result.left = pt.x;
            if (pt.x > result.right)
                result.right = pt.x;
            if (pt.y < result.top)
                result.top = pt.y;
            if (pt.y > result.bottom)
                result.bottom = pt.y;
        }
        return Math.abs(result.left - Number.MAX_VALUE) < Core_InternalClipper.floatingPointTolerance ?
            { left: 0, top: 0, right: 0, bottom: 0 } : result;
    }
    Clipper.getBoundsD = getBoundsD;
    function getBoundsPathsD(paths) {
        const result = Core_RectDUtils.createInvalid();
        for (const path of paths) {
            for (const pt of path) {
                if (pt.x < result.left)
                    result.left = pt.x;
                if (pt.x > result.right)
                    result.right = pt.x;
                if (pt.y < result.top)
                    result.top = pt.y;
                if (pt.y > result.bottom)
                    result.bottom = pt.y;
            }
        }
        return Math.abs(result.left - Number.MAX_VALUE) < Core_InternalClipper.floatingPointTolerance ?
            { left: 0, top: 0, right: 0, bottom: 0 } : result;
    }
    Clipper.getBoundsPathsD = getBoundsPathsD;
    function makePath(arr) {
        const len = Math.floor(arr.length / 2);
        const p = [];
        for (let i = 0; i < len; i++) {
            p.push({ x: arr[i * 2], y: arr[i * 2 + 1], z: 0 });
        }
        return p;
    }
    Clipper.makePath = makePath;
    function makePathD(arr) {
        const len = Math.floor(arr.length / 2);
        const p = [];
        for (let i = 0; i < len; i++) {
            p.push({ x: arr[i * 2], y: arr[i * 2 + 1], z: 0 });
        }
        return p;
    }
    Clipper.makePathD = makePathD;
    function sqr(val) {
        return val * val;
    }
    Clipper.sqr = sqr;
    function distanceSqr(pt1, pt2) {
        return sqr(pt1.x - pt2.x) + sqr(pt1.y - pt2.y);
    }
    Clipper.distanceSqr = distanceSqr;
    function midPoint(pt1, pt2) {
        return { x: Math.round((pt1.x + pt2.x) / 2), y: Math.round((pt1.y + pt2.y) / 2) };
    }
    Clipper.midPoint = midPoint;
    function midPointD(pt1, pt2) {
        return { x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 };
    }
    Clipper.midPointD = midPointD;
    function inflateRect(rec, dx, dy) {
        rec.left -= dx;
        rec.right += dx;
        rec.top -= dy;
        rec.bottom += dy;
    }
    Clipper.inflateRect = inflateRect;
    function inflateRectD(rec, dx, dy) {
        rec.left -= dx;
        rec.right += dx;
        rec.top -= dy;
        rec.bottom += dy;
    }
    Clipper.inflateRectD = inflateRectD;
    function pointsNearEqual(pt1, pt2, distanceSqrd) {
        return sqr(pt1.x - pt2.x) + sqr(pt1.y - pt2.y) < distanceSqrd;
    }
    Clipper.pointsNearEqual = pointsNearEqual;
    function stripNearDuplicates(path, minEdgeLenSqrd, isClosedPath) {
        const cnt = path.length;
        const result = [];
        if (cnt === 0)
            return result;
        let lastPt = path[0];
        result.push(lastPt);
        for (let i = 1; i < cnt; i++) {
            if (!pointsNearEqual(lastPt, path[i], minEdgeLenSqrd)) {
                lastPt = path[i];
                result.push(lastPt);
            }
        }
        if (isClosedPath && pointsNearEqual(lastPt, result[0], minEdgeLenSqrd)) {
            result.pop();
        }
        return result;
    }
    Clipper.stripNearDuplicates = stripNearDuplicates;
    function stripDuplicates(path, isClosedPath) {
        const cnt = path.length;
        const result = [];
        if (cnt === 0)
            return result;
        let lastPt = path[0];
        result.push(lastPt);
        for (let i = 1; i < cnt; i++) {
            if (!Core_Point64Utils.equals(lastPt, path[i])) {
                lastPt = path[i];
                result.push(lastPt);
            }
        }
        if (isClosedPath && Core_Point64Utils.equals(lastPt, result[0])) {
            result.pop();
        }
        return result;
    }
    Clipper.stripDuplicates = stripDuplicates;
    function addPolyNodeToPaths(polyPath, paths) {
        if (polyPath.poly && polyPath.poly.length > 0) {
            paths.push(polyPath.poly);
        }
        for (let i = 0; i < polyPath.count; i++) {
            addPolyNodeToPaths(polyPath.child(i), paths);
        }
    }
    function polyTreeToPaths64(polyTree) {
        const result = [];
        for (let i = 0; i < polyTree.count; i++) {
            addPolyNodeToPaths(polyTree.child(i), result);
        }
        return result;
    }
    Clipper.polyTreeToPaths64 = polyTreeToPaths64;
    function addPolyNodeToPathsD(polyPath, paths) {
        if (polyPath.poly && polyPath.poly.length > 0) {
            paths.push(polyPath.poly);
        }
        for (let i = 0; i < polyPath.count; i++) {
            addPolyNodeToPathsD(polyPath.child(i), paths);
        }
    }
    Clipper.addPolyNodeToPathsD = addPolyNodeToPathsD;
    function polyTreeToPathsD(polyTree) {
        const result = [];
        for (let i = 0; i < polyTree.count; i++) {
            addPolyNodeToPathsD(polyTree.child(i), result);
        }
        return result;
    }
    Clipper.polyTreeToPathsD = polyTreeToPathsD;
    function perpendicDistFromLineSqrd(pt, line1, line2) {
        const a = pt.x - line1.x;
        const b = pt.y - line1.y;
        const c = line2.x - line1.x;
        const d = line2.y - line1.y;
        if (c === 0 && d === 0)
            return 0;
        return sqr(a * d - c * b) / (c * c + d * d);
    }
    Clipper.perpendicDistFromLineSqrd = perpendicDistFromLineSqrd;
    function perpendicDistFromLineSqrd64(pt, line1, line2) {
        const a = pt.x - line1.x;
        const b = pt.y - line1.y;
        const c = line2.x - line1.x;
        const d = line2.y - line1.y;
        if (c === 0 && d === 0)
            return 0;
        return sqr(a * d - c * b) / (c * c + d * d);
    }
    Clipper.perpendicDistFromLineSqrd64 = perpendicDistFromLineSqrd64;
    function rdp(path, begin, end, epsSqrd, flags) {
        while (true) {
            let idx = 0;
            let maxD = 0;
            while (end > begin && Core_Point64Utils.equals(path[begin], path[end]))
                flags[end--] = false;
            for (let i = begin + 1; i < end; ++i) {
                // PerpendicDistFromLineSqrd - avoids expensive Sqrt()
                const d = perpendicDistFromLineSqrd64(path[i], path[begin], path[end]);
                if (d <= maxD)
                    continue;
                maxD = d;
                idx = i;
            }
            if (maxD <= epsSqrd)
                return;
            flags[idx] = true;
            if (idx > begin + 1)
                rdp(path, begin, idx, epsSqrd, flags);
            if (idx < end - 1) {
                begin = idx;
                continue;
            }
            break;
        }
    }
    function ramerDouglasPeucker(path, epsilon) {
        const len = path.length;
        if (len < 5)
            return path;
        const flags = new Array(len).fill(false);
        flags[0] = true;
        flags[len - 1] = true;
        rdp(path, 0, len - 1, sqr(epsilon), flags);
        const result = [];
        for (let i = 0; i < len; ++i) {
            if (flags[i])
                result.push(path[i]);
        }
        return result;
    }
    Clipper.ramerDouglasPeucker = ramerDouglasPeucker;
    function ramerDouglasPeuckerPaths(paths, epsilon) {
        const result = [];
        for (const path of paths) {
            result.push(ramerDouglasPeucker(path, epsilon));
        }
        return result;
    }
    Clipper.ramerDouglasPeuckerPaths = ramerDouglasPeuckerPaths;
    function rdpD(path, begin, end, epsSqrd, flags) {
        while (true) {
            let idx = 0;
            let maxD = 0;
            while (end > begin && Core_PointDUtils.equals(path[begin], path[end]))
                flags[end--] = false;
            for (let i = begin + 1; i < end; ++i) {
                // PerpendicDistFromLineSqrd - avoids expensive Sqrt()
                const d = perpendicDistFromLineSqrd(path[i], path[begin], path[end]);
                if (d <= maxD)
                    continue;
                maxD = d;
                idx = i;
            }
            if (maxD <= epsSqrd)
                return;
            flags[idx] = true;
            if (idx > begin + 1)
                rdpD(path, begin, idx, epsSqrd, flags);
            if (idx < end - 1) {
                begin = idx;
                continue;
            }
            break;
        }
    }
    function ramerDouglasPeuckerD(path, epsilon) {
        const len = path.length;
        if (len < 5)
            return path;
        const flags = new Array(len).fill(false);
        flags[0] = true;
        flags[len - 1] = true;
        rdpD(path, 0, len - 1, sqr(epsilon), flags);
        const result = [];
        for (let i = 0; i < len; ++i) {
            if (flags[i])
                result.push(path[i]);
        }
        return result;
    }
    Clipper.ramerDouglasPeuckerD = ramerDouglasPeuckerD;
    function ramerDouglasPeuckerPathsD(paths, epsilon) {
        const result = [];
        for (const path of paths) {
            result.push(ramerDouglasPeuckerD(path, epsilon));
        }
        return result;
    }
    Clipper.ramerDouglasPeuckerPathsD = ramerDouglasPeuckerPathsD;
    function getNext(current, high, flags) {
        ++current;
        while (current <= high && flags[current])
            ++current;
        if (current <= high)
            return current;
        current = 0;
        while (flags[current])
            ++current;
        return current;
    }
    function getPrior(current, high, flags) {
        if (current === 0)
            current = high;
        else
            --current;
        while (current > 0 && flags[current])
            --current;
        if (!flags[current])
            return current;
        current = high;
        while (flags[current])
            --current;
        return current;
    }
    function simplifyPath(path, epsilon, isClosedPath = true) {
        const len = path.length;
        const high = len - 1;
        const epsSqr = sqr(epsilon);
        if (len < 4)
            return path;
        const flags = new Array(len).fill(false);
        const dsq = new Array(len).fill(0);
        let curr = 0;
        if (isClosedPath) {
            dsq[0] = perpendicDistFromLineSqrd64(path[0], path[high], path[1]);
            dsq[high] = perpendicDistFromLineSqrd64(path[high], path[0], path[high - 1]);
        }
        else {
            dsq[0] = Number.MAX_VALUE;
            dsq[high] = Number.MAX_VALUE;
        }
        for (let i = 1; i < high; ++i) {
            dsq[i] = perpendicDistFromLineSqrd64(path[i], path[i - 1], path[i + 1]);
        }
        while (true) {
            if (dsq[curr] > epsSqr) {
                const start = curr;
                do {
                    curr = getNext(curr, high, flags);
                } while (curr !== start && dsq[curr] > epsSqr);
                if (curr === start)
                    break;
            }
            const prev = getPrior(curr, high, flags);
            const next = getNext(curr, high, flags);
            if (next === prev)
                break;
            let prior2;
            if (dsq[next] < dsq[curr]) {
                prior2 = prev;
                const newPrev = curr;
                curr = next;
                const newNext = getNext(next, high, flags);
                flags[curr] = true;
                curr = newNext;
                const nextNext = getNext(newNext, high, flags);
                if (isClosedPath || ((curr !== high) && (curr !== 0))) {
                    dsq[curr] = perpendicDistFromLineSqrd64(path[curr], path[newPrev], path[nextNext]);
                }
                if (isClosedPath || ((newPrev !== 0) && (newPrev !== high))) {
                    dsq[newPrev] = perpendicDistFromLineSqrd64(path[newPrev], path[prior2], path[curr]);
                }
            }
            else {
                prior2 = getPrior(prev, high, flags);
                flags[curr] = true;
                curr = next;
                const nextNext = getNext(next, high, flags);
                if (isClosedPath || ((curr !== high) && (curr !== 0))) {
                    dsq[curr] = perpendicDistFromLineSqrd64(path[curr], path[prev], path[nextNext]);
                }
                if (isClosedPath || ((prev !== 0) && (prev !== high))) {
                    dsq[prev] = perpendicDistFromLineSqrd64(path[prev], path[prior2], path[curr]);
                }
            }
        }
        const result = [];
        for (let i = 0; i < len; i++) {
            if (!flags[i])
                result.push(path[i]);
        }
        return result;
    }
    Clipper.simplifyPath = simplifyPath;
    function simplifyPaths(paths, epsilon, isClosedPaths = true) {
        const result = [];
        for (const path of paths) {
            result.push(simplifyPath(path, epsilon, isClosedPaths));
        }
        return result;
    }
    Clipper.simplifyPaths = simplifyPaths;
    function simplifyPathD(path, epsilon, isClosedPath = true) {
        const len = path.length;
        const high = len - 1;
        const epsSqr = sqr(epsilon);
        if (len < 4)
            return path;
        const flags = new Array(len).fill(false);
        const dsq = new Array(len).fill(0);
        let curr = 0;
        if (isClosedPath) {
            dsq[0] = perpendicDistFromLineSqrd(path[0], path[high], path[1]);
            dsq[high] = perpendicDistFromLineSqrd(path[high], path[0], path[high - 1]);
        }
        else {
            dsq[0] = Number.MAX_VALUE;
            dsq[high] = Number.MAX_VALUE;
        }
        for (let i = 1; i < high; ++i) {
            dsq[i] = perpendicDistFromLineSqrd(path[i], path[i - 1], path[i + 1]);
        }
        while (true) {
            if (dsq[curr] > epsSqr) {
                const start = curr;
                do {
                    curr = getNext(curr, high, flags);
                } while (curr !== start && dsq[curr] > epsSqr);
                if (curr === start)
                    break;
            }
            const prev = getPrior(curr, high, flags);
            const next = getNext(curr, high, flags);
            if (next === prev)
                break;
            let prior2;
            if (dsq[next] < dsq[curr]) {
                prior2 = prev;
                const newPrev = curr;
                curr = next;
                const newNext = getNext(next, high, flags);
                flags[curr] = true;
                curr = newNext;
                const nextNext = getNext(newNext, high, flags);
                if (isClosedPath || ((curr !== high) && (curr !== 0))) {
                    dsq[curr] = perpendicDistFromLineSqrd(path[curr], path[newPrev], path[nextNext]);
                }
                if (isClosedPath || ((newPrev !== 0) && (newPrev !== high))) {
                    dsq[newPrev] = perpendicDistFromLineSqrd(path[newPrev], path[prior2], path[curr]);
                }
            }
            else {
                prior2 = getPrior(prev, high, flags);
                flags[curr] = true;
                curr = next;
                const nextNext = getNext(next, high, flags);
                if (isClosedPath || ((curr !== high) && (curr !== 0))) {
                    dsq[curr] = perpendicDistFromLineSqrd(path[curr], path[prev], path[nextNext]);
                }
                if (isClosedPath || ((prev !== 0) && (prev !== high))) {
                    dsq[prev] = perpendicDistFromLineSqrd(path[prev], path[prior2], path[curr]);
                }
            }
        }
        const result = [];
        for (let i = 0; i < len; i++) {
            if (!flags[i])
                result.push(path[i]);
        }
        return result;
    }
    Clipper.simplifyPathD = simplifyPathD;
    function simplifyPathsD(paths, epsilon, isClosedPath = true) {
        const result = [];
        for (const path of paths) {
            result.push(simplifyPathD(path, epsilon, isClosedPath));
        }
        return result;
    }
    Clipper.simplifyPathsD = simplifyPathsD;
    function trimCollinear(path, isOpen = false) {
        let len = path.length;
        let i = 0;
        if (!isOpen) {
            while (i < len - 1 && Core_InternalClipper.isCollinear(path[len - 1], path[i], path[i + 1]))
                i++;
            while (i < len - 1 && Core_InternalClipper.isCollinear(path[len - 2], path[len - 1], path[i]))
                len--;
        }
        if (len - i < 3) {
            if (!isOpen || len < 2 || Core_Point64Utils.equals(path[0], path[1])) {
                return [];
            }
            return path;
        }
        const result = [];
        let last = path[i];
        result.push(last);
        for (i++; i < len - 1; i++) {
            if (Core_InternalClipper.isCollinear(last, path[i], path[i + 1]))
                continue;
            last = path[i];
            result.push(last);
        }
        if (isOpen) {
            result.push(path[len - 1]);
        }
        else if (!Core_InternalClipper.isCollinear(last, path[len - 1], result[0])) {
            result.push(path[len - 1]);
        }
        else {
            while (result.length > 2 && Core_InternalClipper.isCollinear(result[result.length - 1], result[result.length - 2], result[0])) {
                result.pop();
            }
            if (result.length < 3) {
                result.length = 0;
            }
        }
        return result;
    }
    Clipper.trimCollinear = trimCollinear;
    function trimCollinearD(path, precision, isOpen = false) {
        Core_InternalClipper.checkPrecision(precision);
        const scale = Math.pow(10, precision);
        let p = scalePath64(path, scale);
        p = trimCollinear(p, isOpen);
        return scalePathDFromInt(p, 1 / scale);
    }
    Clipper.trimCollinearD = trimCollinearD;
    function pointInPolygon(pt, polygon) {
        return Core_InternalClipper.pointInPolygon(pt, polygon);
    }
    Clipper.pointInPolygon = pointInPolygon;
    function pointInPolygonD(pt, polygon, precision = 2) {
        Core_InternalClipper.checkPrecision(precision);
        const scale = Math.pow(10, precision);
        const p = Core_Point64Utils.fromPointD(Core_PointDUtils.scale(pt, scale));
        const pathScaled = scalePath64(polygon, scale);
        return Core_InternalClipper.pointInPolygon(p, pathScaled);
    }
    Clipper.pointInPolygonD = pointInPolygonD;
    function ellipse(center, radiusX, radiusY = 0, steps = 0) {
        if (radiusX <= 0)
            return [];
        if (radiusY <= 0)
            radiusY = radiusX;
        if (steps <= 2) {
            steps = Math.ceil(Math.PI * Math.sqrt((radiusX + radiusY) / 2));
        }
        const si = Math.sin(2 * Math.PI / steps);
        const co = Math.cos(2 * Math.PI / steps);
        let dx = co;
        let dy = si;
        const result = [{ x: Math.round(center.x + radiusX), y: center.y }];
        for (let i = 1; i < steps; ++i) {
            result.push({
                x: Math.round(center.x + radiusX * dx),
                y: Math.round(center.y + radiusY * dy)
            });
            const x = dx * co - dy * si;
            dy = dy * co + dx * si;
            dx = x;
        }
        return result;
    }
    Clipper.ellipse = ellipse;
    function ellipseD(center, radiusX, radiusY = 0, steps = 0) {
        if (radiusX <= 0)
            return [];
        if (radiusY <= 0)
            radiusY = radiusX;
        if (steps <= 2) {
            steps = Math.ceil(Math.PI * Math.sqrt((radiusX + radiusY) / 2));
        }
        const si = Math.sin(2 * Math.PI / steps);
        const co = Math.cos(2 * Math.PI / steps);
        let dx = co;
        let dy = si;
        const result = [{ x: center.x + radiusX, y: center.y }];
        for (let i = 1; i < steps; ++i) {
            result.push({
                x: center.x + radiusX * dx,
                y: center.y + radiusY * dy
            });
            const x = dx * co - dy * si;
            dy = dy * co + dx * si;
            dx = x;
        }
        return result;
    }
    Clipper.ellipseD = ellipseD;
    // Triangulation
    function triangulate(pp, useDelaunay = true) {
        const d = new Delaunay(useDelaunay);
        return d.execute(pp);
    }
    Clipper.triangulate = triangulate;
    function triangulateD(pp, decPlaces, useDelaunay = true) {
        let scale;
        if (decPlaces <= 0)
            scale = 1.0;
        else if (decPlaces > 8)
            scale = Math.pow(10.0, 8.0);
        else
            scale = Math.pow(10.0, decPlaces);
        const pp64 = scalePaths64(pp, scale);
        const d = new Delaunay(useDelaunay);
        const { result, solution: sol64 } = d.execute(pp64);
        let solution;
        if (result === Triangulation_TriangulateResult.success) {
            solution = scalePathsD(sol64, 1.0 / scale);
        }
        else {
            solution = [];
        }
        return { result, solution };
    }
    Clipper.triangulateD = triangulateD;
})(Clipper_Clipper || (Clipper_Clipper = {}));
//# sourceMappingURL=Clipper.js.map
;// CONCATENATED MODULE: ../../../node_modules/clipper2-ts/dist/index.js
/*******************************************************************************
* Author    :  Angus Johnson
* Date      :  2025
* Website   :  https://www.angusj.com
* Copyright :  Angus Johnson 2010-2025
* License   :  https://www.boost.org/LICENSE_1_0.txt
*******************************************************************************/
// Export core types and interfaces

// Export engine classes

// Export offset functionality

// Export rect clipping

// Export Minkowski operations

// Export triangulation functionality

// Export main Clipper namespace with convenience functions

// Re-export main functions for convenience

const { intersect: dist_intersect, intersectD: dist_intersectD, union: dist_union, unionD: dist_unionD, difference: dist_difference, differenceD: dist_differenceD, xor: dist_xor, xorD: dist_xorD, booleanOp: dist_booleanOp, booleanOpWithPolyTree: dist_booleanOpWithPolyTree, booleanOpD: dist_booleanOpD, booleanOpDWithPolyTree: dist_booleanOpDWithPolyTree, inflatePaths: dist_inflatePaths, inflatePathsD: dist_inflatePathsD, rectClip: dist_rectClip, rectClipLines: dist_rectClipLines, minkowskiSum: dist_minkowskiSum, minkowskiSumD: dist_minkowskiSumD, minkowskiDiff: dist_minkowskiDiff, minkowskiDiffD: dist_minkowskiDiffD, area: dist_area, areaPaths: dist_areaPaths, areaD: dist_areaD, areaPathsD: dist_areaPathsD, isPositive: dist_isPositive, isPositiveD: dist_isPositiveD, getBounds: dist_getBounds, getBoundsPaths: dist_getBoundsPaths, getBoundsD: dist_getBoundsD, getBoundsPathsD: dist_getBoundsPathsD, makePath: dist_makePath, makePathD: dist_makePathD, scalePath64: dist_scalePath64, scalePaths64: dist_scalePaths64, scalePathD: dist_scalePathD, scalePathsD: dist_scalePathsD, translatePath: dist_translatePath, translatePaths: dist_translatePaths, translatePathD: dist_translatePathD, translatePathsD: dist_translatePathsD, reversePath: dist_reversePath, reversePathD: dist_reversePathD, reversePaths: dist_reversePaths, reversePathsD: dist_reversePathsD, stripDuplicates: dist_stripDuplicates, trimCollinear: dist_trimCollinear, trimCollinearD: dist_trimCollinearD, pointInPolygon: dist_pointInPolygon, pointInPolygonD: dist_pointInPolygonD, ellipse: dist_ellipse, ellipseD: dist_ellipseD, simplifyPath: dist_simplifyPath, simplifyPaths: dist_simplifyPaths, simplifyPathD: dist_simplifyPathD, simplifyPathsD: dist_simplifyPathsD, ramerDouglasPeucker: dist_ramerDouglasPeucker, ramerDouglasPeuckerPaths: dist_ramerDouglasPeuckerPaths, ramerDouglasPeuckerD: dist_ramerDouglasPeuckerD, ramerDouglasPeuckerPathsD: dist_ramerDouglasPeuckerPathsD, triangulate: dist_triangulate, triangulateD: dist_triangulateD } = Clipper_Clipper;
//# sourceMappingURL=index.js.map

},

}]);