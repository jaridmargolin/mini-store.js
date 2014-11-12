(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['MiniStore'] = factory();
  }
}(this, function () {

/*!
 * isObject.js
 * 
 * Copyright (c) 2014
 */
var utlIsObject, assistJsonClone, utlIsArray, utlCompanionDeepMerge, stringspaceUtils, stringspaceStringspace, utils, miniStore;
utlIsObject = function (value) {
  return value === Object(value);
};
/*!
 * jsonClone.js
 * 
 * Copyright (c) 2014
 */
assistJsonClone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
/*!
 * isArray.js
 * 
 * Copyright (c) 2014
 */
utlIsArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};
/*!
 * deepMerge.js
 * 
 * Copyright (c) 2014
 */
utlCompanionDeepMerge = function (isArray, isObject) {
  /* -----------------------------------------------------------------------------
   * deepMerge
   * ---------------------------------------------------------------------------*/
  /**
   * Deep merge 2 objects.
   *
   * @example
   * var dest = deep(dest, objToMerge);
   *
   * @public
   *
   * @param {object} dest - Object to merge properties into.
   * @param {object} obj - Object to merge properties from.
   */
  var deepMerge = function (dest, obj) {
    for (var k in obj) {
      var destVal = dest[k] || {};
      var objVal = obj[k];
      var isObj = isObject(objVal);
      var isArr = isArray(objVal);
      if (isObj || isArr) {
        if (isObj && !isObject(destVal)) {
          dest[k] = {};
        }
        if (isArr && !isArray(destVal)) {
          dest[k] = [];
        }
        dest[k] = deepMerge(destVal, objVal);
      } else {
        dest[k] = objVal;
      }
    }
    return dest;
  };
  /* -----------------------------------------------------------------------------
   * deepMerge
   * ---------------------------------------------------------------------------*/
  return deepMerge;
}(utlIsArray, utlIsObject);
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
stringspaceUtils = function (isObject, deepMerge) {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  return {
    isObject: isObject,
    deepMerge: deepMerge
  };
}(utlIsObject, utlCompanionDeepMerge);
/*!
 * stringspace.js
 * 
 * Copyright (c) 2014
 */
stringspaceStringspace = function (_) {
  /* -----------------------------------------------------------------------------
   * Stringspace
   * ---------------------------------------------------------------------------*/
  /**
   * Utility for getting and setting stringspace properties that may
   * or may not already exist.
   *
   * @example
   * var stringspace = new Stringspace();
   *
   * @constructor
   * @public
   *
   * @param {string} seperator - Key seperator.
   */
  var Stringspace = function (seperator) {
    this.seperator = seperator || '.';
  };
  /**
   * Get an object prop by string stringspace.
   *
   * @example
   * stringspace.get(obj, 'nested:key');
   *
   * @public
   *
   * @param {object} obj - The object to retrieve data from.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   */
  Stringspace.prototype.get = function (obj, key) {
    return this._get(obj, key).val;
  };
  /**
   * Set an object prop by string stringspace.
   *
   * @example
   * stringspace.set(obj, 'nested:key', 'value');
   *
   * @public
   *
   * @param {object} obj - The object to add data to.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   * @param {*} val - Value of the specified key.
   * @param {boolean} deep - Indicated if conflicts should be reserved
   *   with a deep merge or an overwrite.
   */
  Stringspace.prototype.set = function (obj, keyStr, val, deep) {
    var result = this._get(obj, keyStr, true);
    var curVal = result.val;
    var parent = result.parent;
    var key = result.key;
    var shouldMerge = _.isObject(curVal) && deep;
    parent[key] = shouldMerge ? _.deepMerge(curVal, val) : val;
    return parent[key];
  };
  /**
   * Remove value from obj
   *
   * @example
   * strspc.remove('nested');
   *
   * @public
   *
   * @param {object} obj - The object to remove value from.
   * @param {string} keyStr - String representing the key to remove.
   */
  Stringspace.prototype.remove = function (obj, keyStr) {
    var result = this._get(obj, keyStr);
    var parent = result.parent;
    var key = result.key;
    delete parent[key];
  };
  /**
   * Helper method to recursively loop through object.
   *
   * @private
   *
   * @param {object} obj - The object to act on.
   * @param {string} keyStr - Formatted string representing a key in
   *   the object.
   * @param {object} create - Flag for if we should create an empty object
   *   when an undefined property is found.
   */
  Stringspace.prototype._get = function (obj, keyStr, create) {
    var parts = keyStr.split(this.seperator);
    for (var i = 0, len = parts.length; i < len; i++) {
      var key = parts[i];
      var val = obj[key];
      var isLast = len === i + 1;
      var isUndf = !val && !create;
      if (isLast || isUndf) {
        return {
          key: key,
          val: val,
          parent: obj
        };
      }
      obj = obj[key] = val || {};
    }
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return Stringspace;
}(stringspaceUtils);
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
utils = function (isObject, jsonClone, Stringspace) {
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var stringspace = new Stringspace(':');
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  var _ = {
    isObject: isObject,
    jsonClone: jsonClone
  };
  /**
   * Loop over object keys and set on obj.
   *
   * @example
   * extend(dest, {
   *   'nested:key': 'value',
   *   'notnested': 'value'
   * });
   *
   * @public
   *
   * @param {object} dest - Object to add properties to.
   * @param {object} obj - Properties to add to dest object.
   */
  _.mix = function (dest, obj, flat) {
    for (var key in obj) {
      stringspace.set(dest, key, obj[key], !flat);
    }
    return dest;
  };
  /**
   * Proxy stringspace.get().
   *
   * @example
   * var value = get(obj, 'nested:key');
   *
   * @public
   *
   * @param {object} dest - Object to retrieve properties from.
   * @param {string} key - Name representing key to retrieve.
   */
  _.get = function (obj, key) {
    return stringspace.get(obj, key);
  };
  /**
   * Proxy stringspace.set().
   *
   * @example
   * set(obj, 'nested:key', 'value');
   *
   * @public
   *
   * @param {object} obj - The object to add data to.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   * @param {*} val - Value of the specified key.
   * @param {boolean} deep - Indicated if conflicts should be reserved
   *   with a deep merge or an overwrite.
   * 
   */
  _.set = function (obj, key, value, deep) {
    return stringspace.set(obj, key, value, deep);
  };
  /**
   * Proxy stringspace.remove().
   *
   * @example
   * remove('nested');
   *
   * @public
   *
   * @param {object} obj - The object to remove value from.
   * @param {string} key - String representing the key to remove.
   */
  _.remove = function (obj, key) {
    return stringspace.remove(obj, key);
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return _;
}(utlIsObject, assistJsonClone, stringspaceStringspace);
/*!
 * mini-store.js
 * 
 * Copyright (c) 2014
 */
miniStore = function (_) {
  /* -----------------------------------------------------------------------------
   * MiniStore
   * ---------------------------------------------------------------------------*/
  /**
   * Lightweight class to store and manage data.
   *
   * @example
   * var store = new MiniStore({
   *   nested: { key: 'value' }
   * });
   *
   * @public
   * @constructor
   *
   * @param {object|array} defaults - Base properties. Will remain even
   *   after calling reset. If an array of namespace keys is passed it
   *   will be converted to an object.
   */
  var MiniStore = function (defaults) {
    this.original = _.mix({}, defaults);
    // initialize by calling reset
    this.reset();
  };
  /**
   * Add properties to store data object. Will overwrite
   * if value currently exists for key. Works as a deep
   * merge.
   *
   * @example
   * store.add([
   *   { 'nested:'key': { key: 'newvalue' }
   * ]);
   *
   * @public
   *
   * @param {object|array} object - Object to merge with current data.
   * If an array of namespace keys is passed it will be converted
   * to an object.
   */
  MiniStore.prototype.add = function (key, value, flat) {
    // Mixin with current data
    if (_.isObject(key)) {
      // Key actually is an object of key value pairs
      // and value is the flat flag (by default mix is deep).
      _.mix(this.data, key, value);
    } else {
      _.set(this.data, key, value);
    }
    // Allow chaining
    return this;
  };
  /**
   * Remove values from store data object. If the key passed
   *   represents an object in the data object, all data within
   *   the object will be removed.
   *
   * @example
   * store.remove('nested');
   *
   * @public
   *
   * @param {string} key - Namespaced key to delete value of.
   */
  MiniStore.prototype.remove = function (key) {
    _.remove(this.data, key);
  };
  /**
   * Reset data to original data specified at the time of
   * instantiation.
   *
   * @example
   * store.reset();
   *
   * @public
   */
  MiniStore.prototype.reset = function () {
    this.data = _.jsonClone(this.original);
  };
  /**
   * Get value from store.
   *
   * @example
   * store.get('key');
   *
   * @public
   * 
   * @param {string} name - String representation of key to return
   * from store. If no key is passed, the entire data object will
   * be returned.
   * @returns {*} - queried value.
   */
  MiniStore.prototype.get = function (name) {
    return name ? _.get(this.data, name) : this.data;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return MiniStore;
}(utils);

return miniStore;


}));