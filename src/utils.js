/*!
 * utils.js
 */


define([
  'utl/isUndefined',
  'utl/isObject',
  'utl/isEmpty',
  'utl/extend'
], function (isUndefined, isObject, isEmpty, extend) {


/* -----------------------------------------------------------------------------
 * utils
 * ---------------------------------------------------------------------------*/

return {
  isUndefined: isUndefined,
  isObject: isObject,
  isEmpty: isEmpty,
  extend: extend
};


});