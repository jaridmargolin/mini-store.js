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
 * stringspace.js
 * 
 * Copyright (c) 2014
 */
var stringspaceUtils, stringspaceStringspace, utils, miniStore;
stringspaceUtils = function () {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  var _ = {};
  /**
   * Determine if a given value is an Object.
   *
   * @example
   * var isObj = isObject(obj);
   *
   * @public
   *
   * @param {*} value - Value to test.
   */
  _.isObject = function (value) {
    return typeof value === 'object';
  };
  /**
   * Determine if a given value is an Array.
   *
   * @example
   * var isArr = isArray(array);
   *
   * @public
   *
   * @param {*} value - Value to test.
   */
  _.isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };
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
  _.deep = function (dest, obj) {
    for (var k in obj) {
      var destVal = dest[k] || {};
      var objVal = obj[k];
      var isObj = _.isObject(objVal);
      var isArr = _.isArray(objVal);
      if (isObj || isArr) {
        if (isObj && !_.isObject(destVal)) {
          dest[k] = {};
        }
        if (isArr && !_.isArray(destVal)) {
          dest[k] = [];
        }
        dest[k] = _.deep(destVal, objVal);
      } else {
        dest[k] = objVal;
      }
    }
    return dest;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return _;
}();
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
    var val;
    this._loop(obj, key, {
      last: function (obj, parts, i) {
        val = obj[parts[i]];
      },
      missing: function (obj, parts, i) {
        return false;
      }
    });
    return val;
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
  Stringspace.prototype.set = function (obj, key, val, deep) {
    this._loop(obj, key, {
      last: function (obj, parts, i) {
        var curVal = obj[parts[i]];
        return typeof curVal !== 'object' || !deep ? obj[parts[i]] = val : obj[parts[i]] = _.deep(curVal, val);
      },
      missing: function (obj, parts, i) {
        obj[parts[i]] = {};
      }
    });
    return val;
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
   * @param {string} key - String representing the key to remove.
   */
  Stringspace.prototype.remove = function (obj, key) {
    var lastSpacer = key.lastIndexOf(':');
    var itemKey = key;
    var parent = obj;
    if (lastSpacer > 0) {
      parent = this.get(obj, key.slice(0, lastSpacer));
      itemKey = key.slice(lastSpacer + 1);
    }
    delete parent[itemKey];
  };
  /**
   * Helper method to recursively loop through object.
   *
   * @private
   *
   * @param {object} obj - The object to act on.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   * @param {object} opts - Object containing methods on how to handle
   *   various situations encountered during loop.
   */
  Stringspace.prototype._loop = function (obj, key, opts) {
    var parts = key.split(this.seperator);
    for (var i = 0, len = parts.length; i < len; i++) {
      // If last stringspace - set value
      if (len === i + 1) {
        opts.last(obj, parts, i);
        return;
      }
      // If no stringspace - create & set obj to current
      if (!obj[parts[i]]) {
        if (opts.missing(obj, parts, i) === false) {
          return undefined;
        }
      }
      obj = obj[parts[i]];
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
utils = function (Stringspace) {
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var stringspace = new Stringspace(':');
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  return {
    /**
     * Clone object containing variables only. Will not work with
     * functions or undefined values.
     *
     * @example
     * cloned = clone(obj);
     *
     * @public
     *
     * @param {object} obj - Object to clone.
     */
    clone: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },
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
    extend: function (dest, obj) {
      for (var key in obj) {
        stringspace.set(dest, key, obj[key], true);
      }
      return dest;
    },
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
    get: function (obj, key) {
      return stringspace.get(obj, key);
    },
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
    set: function (obj, key, value, deep) {
      return stringspace.set(obj, key, value, deep);
    },
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
    remove: function (obj, key) {
      return stringspace.remove(obj, key);
    }
  };
}(stringspaceStringspace);
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
    this.original = _.extend({}, defaults);
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
  MiniStore.prototype.add = function (key, value) {
    // If a key and value
    if (value) {
      _.set(this.data, key, value);
    } else {
      _.extend(this.data, key);
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
    this.data = _.clone(this.original);
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return MiniStore;
}(utils);

return miniStore;


}));