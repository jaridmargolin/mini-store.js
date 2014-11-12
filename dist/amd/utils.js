/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */


define([
  'utl/isObject',
  'assist/jsonClone',
  'stringspace/stringspace'
], function (isObject, jsonClone, Stringspace) {


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


});