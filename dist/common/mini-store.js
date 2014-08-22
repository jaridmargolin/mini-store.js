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

  // Mixin with current data
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
 * 
 *
 * @example
 * 
 *
 * @public
 *
 * @param
 */
MiniStore.prototype.reset = function () {
  this.data = _.clone(this.original);
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = MiniStore;


