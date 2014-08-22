/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */


define([
  'stringspace/stringspace'
], function (Stringspace) {


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
   * 
   *
   * @example
   * 
   *
   * @public
   *
   * @param
   */
  extend: function (dest, obj) {
    for (var key in obj) {
      stringspace.set(dest, key, obj[key], true);
    }

    return dest;
  },


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
  get: function (obj, key) {
    return stringspace.get(obj, key);
  },


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
  set: function (obj, key, value) {
    return stringspace.set(obj, key, value);
  },


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
  remove: function (obj, key) {
    return stringspace.remove(obj, key);
  }

};


});