/*!
 * mini-store.js
 * 
 * Copyright (c) 2014
 */


define([
  './utils',
  'stringspace/stringspace'
], function (_, Stringspace) {


/* -----------------------------------------------------------------------------
 * scope
 * ---------------------------------------------------------------------------*/

var stringspace = new Stringspace(':');


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
 *
 * @returns {object} - store instance.
 */
var MiniStore = function (defaults) {
  this.data = {};
  this.addProperties(defaults);

  this.original = _.jsonClone(this.data);
};

/**
 * Add properties to store data object. Will overwrite
 * if value currently exists for key. Works as a deep
 * merge.
 *
 * @example
 * store.add({
 *   'nested:key': { key: 'newvalue' }
 * }, true);
 *
 * @example
 * store.add('nested:key', 'value');
 *   'nested:'key': { key: 'newvalue' }
 * });
 *
 * @public
 *
 * @param {object} properties - Will add each key as a property to store.
 * @param {key} key - Name of key to add in store.
 * @param {*} value - Used when key name passed. Sets value of key in store.
 * @param {boolean} flat - If merge should be flat rather than deep (deep
 *   by default).
 *
 * @returns {object} - store instance.
 */
MiniStore.prototype.add = function (key, value, flat) {
  // Mixin with current data
  if (_.isObject(key)) {
    // Key actually is an object of key value pairs
    // and value is the flat flag (by default mix is deep).
    this.addProperties(key, value);

  // Is a key and value
  } else {
    this.addProperty(key, value, flat);
  }

  // chaining yo!
  return this;
};

/**
 * Loop over object keys and set on obj.
 *
 * @example
 * store.addProperties({
 *   'nested:key': 'value',
 *   'notnested': 'value'
 * });
 *
 * @public
 *
 * @param {object} obj - Properties to add to store.
 * @param {boolean} flat - If merge should be flat rather than deep (deep
 *   by default).
 *
 * @returns {object} - store instance.
 */
MiniStore.prototype.addProperties = function (obj, flat) {
  for (var key in obj) {
    this.addProperty(key, obj[key], flat);
  }

  // chaining yo!
  return this;
};

/**
 * Proxy stringspace.set().
 *
 * @example
 * store.addProperty('nested:key', 'value');
 *
 * @public
 *
 * @param {string} key - Formatted string representing a key in the store.
 * @param {*} val - Value of the specified key.
 * @param {boolean} flat - If merge should be flat rather than deep (deep by
 *  default).
 *
 * @returns {object} - store instance.
 */
MiniStore.prototype.addProperty = function (key, value, flat) {
  stringspace.set(this.data, key, value, !flat);

  // chaining yo!
  return this;
};

/**
 * Remove values from store data object. If the key passed represents an
 * object in the data object, all data within the object will be removed.
 *
 * @example
 * store.remove('nested');
 *
 * @public
 *
 * @param {string} key - Namespaced key to delete value of.
 *
 * @returns {object} - store instance.
 */
MiniStore.prototype.remove = function (key) {
  this.removeProperty(key);

  // chaining yo!
  return this;
};

/**
 * Proxy stringspace.remove().
 *
 * @example
 * store.removeProperty('nested');
 *
 * @public
 *
 * @param {string} key - String representing the key to remove.
 *
 * @returns {object} - store instance.
 */
MiniStore.prototype.removeProperty = function (key) {
  stringspace.remove(this.data, key);

  // chaining yo!
  return this;
};

/**
 * Get value from store.
 *
 * @example
 * store.get('key');
 *
 * @public
 *
 * @param {string} name - String representation of key to return from store.
 * If no key is passed, the entire data object will be returned.
 *
 * @returns {*} - queried value.
 */
MiniStore.prototype.get = function (name) {
  return name
    ? this.getProperty(name)
    : this.data;
};

/**
 * Proxy stringspace.get().
 *
 * @example
 * store.getProperty('nested:key');
 *
 * @public
 *
 * @param {string} key - Name representing key to retrieve.
 *
 * @returns {*} - queried value.
 */
MiniStore.prototype.getProperty = function (key) {
  return stringspace.get(this.data, key);
};

/**
 * Reset data to original data specified at the time of
 * instantiation.
 *
 * @example
 * store.reset();
 *
 * @public
 *
 * @returns {*} - queried value.
 */
MiniStore.prototype.reset = function () {
  this.data = _.jsonClone(this.original);

  // chaining yo!
  return this;
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

return MiniStore;


});