/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */


var Stringspace = require('stringspace/stringspace');


/* -----------------------------------------------------------------------------
 * scope
 * ---------------------------------------------------------------------------*/

var stringspace = new Stringspace(':');


/* -----------------------------------------------------------------------------
 * utils
 * ---------------------------------------------------------------------------*/

module.exports = {

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


