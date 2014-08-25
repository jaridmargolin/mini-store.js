/*!
 * mini-store.js
 * 
 * Copyright (c) 2014
 */


var _ = require('./utils');


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

  // Is a key and value
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


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = MiniStore;


