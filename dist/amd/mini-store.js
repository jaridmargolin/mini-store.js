/*!
 * mini-store.js
 */


define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var child = require('child/child');
var Stringspace = require('stringspace/stringspace');
var EventEmitter = require('event-emitter/event-emitter');
var capitalize = require('assist/capitalize');
var isUndefined = require('utl/isUndefined');
var isObject = require('utl/isObject');
var isEmpty = require('utl/isEmpty');
var extend = require('utl/extend');


/* -----------------------------------------------------------------------------
 * scope
 * ---------------------------------------------------------------------------*/

var stringspace = new Stringspace(':');


/* -----------------------------------------------------------------------------
 * MiniStore
 * ---------------------------------------------------------------------------*/

return child(EventEmitter, {

  /**
   * @global
   * @public
   * @constructor
   *
   * @name MiniStore
   * @desc Lightweight class to store and manage data.
   *
   * @example
   * var store = new MiniStore({
   *   nested: { key: 'value' }
   * });
   *
   * @param {object|array} defaults - Base properties to set on object at
   *   instantiation.
   * @returns {object} - store instance.
   */
  constructor: function () {
    EventEmitter.prototype.constructor.apply(this, arguments);

    this.attributes = {};

    // optionally set initial state of store
    if (arguments[0]) {
      this.set.apply(this, arguments);
    }
  },

  /**
   * @public
   * @memberof MiniStore
   *
   * @desc Add properties to on attributes object. Will overwrite if value
   *   currently exists for key. Works as a deep merge.
   *
   * @example
   * store.set({
   *   'nested:key': { key: 'newvalue' }
   * }, true);
   *
   * @example
   * store.set('nested:key', 'value');
   *   'nested:'key': { key: 'newvalue' }
   * });
   *
   * @param {object} properties - Will set each key as a property to store.
   * @param {key} key - Name of key to set in store.
   * @param {*} value - Used when key name passed. Sets value of key in store.
   * @param {object} options
   * @param {boolean} options.flat - If merge should be flat rather than deep
   *   (deep by default).
   * @param {boolean} options.silent - If we should silence the change event
   *   that fires if a property is altered.
   * @returns {object} - store instance.
   */
  set: function (key, value, options) {
    var isObj = isObject(key);

    if (isObj) {
      options = value;
      value = null;
    }

    // Don't blow up if options is not defined
    options = options || {};

    // these will populated the this.changed object
    if (isObj) {
      this._setProperties(key, options);
    } else {
      this._setProperty(key, value, options);
    }

    // emit events on change
    if (!options.silent && !isEmpty(this.changed)) {
      for (var propName in this.changed) {
        this.triggerMethod('change:' + propName, this, this.changed[propName], options);
      }

      this.triggerMethod('change', this, options);
    }

    // chaning yo!
    return this;
  },

  /*
   * @private
   * @memberof MiniStore
   *
   * @desc Loop over object keys and set on obj.
   *
   * @example
   * store._setProperties({
   *   'nested:key': 'value',
   *   'notnested': 'value'
   * });
   *
   * @param {object} obj - Properties to set to store.
   * @param {object} options
   * @param {boolean} options.flat - If merge should be flat rather than deep
   *   (deep by default).
   * @param {boolean} options.silent - If we should silence the change event
   *   that fires if a property is altered.
   * @returns {object} - store instance.
   */
  _setProperties: function (obj, options) {
    var changed = {};

    for (var key in obj) {
      this._setProperty(key, obj[key], options);
      extend(changed, this.changed);
    }

    // changed should be equivalent to each property changed
    this.changed = changed;
  },

  /*
   * @private
   * @memberof MiniStore
   *
   * @desc Set property on attributes.
   *
   * @example
   * store._setProperty('nested:key', 'value');
   *
   * @param {string} key - Formatted string representing a key in the store.
   * @param {*} val - Value of the specified key.
   * @param {object} options
   * @param {boolean} options.flat - If merge should be flat rather than deep
   *   (deep by default).
   * @param {boolean} options.silent - If we should silence the change event
   *   that fires if a property is altered.
   * @returns {object} - store instance.
   */
  _setProperty: function (key, value, options) {
    this.changed = {};

    // For now we will just fire change events for properties one level deep.
    // Long term it may be possible to listen for nested changes and fire
    // corresponding events using walker.js. Right now the barrier to implement
    // is the deepMerge inside of stringspace. We don't get notified of the
    // individual properties that change during the merge. We would need a
    // custom deep merge that either fires a callback (event) for each changed
    // property or returns a list of changed properties. In such scenario, it
    // might make sense for stringspace to implement an EventEmitter.
    var result = stringspace._get(this.attributes, key, true);
    var propName = key.split(':')[0];

    // utilize get lookup to avoid 2x recursion
    if (result.val !== value) {
      stringspace.set(result.parent, result.key, value, !options.flat);
      this.changed[propName] = this.attributes[propName];
    }
  },

  /**
   * @public
   * @memberof MiniStore
   *
   * @desc Remove values from attributes object. If the key passed represents an
   *   object in the attributes object, all data within the object will be
   *   removed.
   *
   * @example
   * store.unset('nested');
   *
   * @param {string} key - Namespaced key to delete value of.
   * @returns {object} - store instance.
   */
  unset: function (key, options) {
    // Don't blow up if options is not defined
    options = options || {};

    this._unsetProperty(key);

    if (!options.silent && !isEmpty(this.changed)) {
      this.triggerMethod('change', this, options);
    }

    // chaining yo!
    return this;
  },

  /*
   * @private
   * @memberof MiniStore
   *
   * @desc Proxy stringspace.remove().
   *
   * @example
   * store._unsetProperty('nested');
   *
   * @param {string} key - String representing the key to remove.
   * @returns {object} - store instance.
   */
  _unsetProperty: function (key) {
    this.changed = {};

    var parts = key.split(':');
    var propName = parts[0];
    var result = stringspace._get(this.attributes, key, true);

    if (isUndefined(result.val)) {
      return;
    }

    stringspace.remove(result.parent, result.key);

    // We removed a nested property. This will fire a regular change event for
    // the top level property.
    if (parts[1]) {
      this.changed[propName] = this.attributes[propName];

    // We removed the top level property and should mimic backbone behavior
    // for firing change event with key equal to 0 and the value being the
    // propName.
    } else {
      this.changed[0] = key;
    }
  },

  /**
   * @public
   * @memberof MiniStore
   *
   * @desc Get value from store.
   *
   * @example
   * var val = store.get('key');
   *
   * @param {string} name - String representation of key to return from store.
   *   If no key is passed, the entire attributes object will be returned.
   * @returns {*} - queried value.
   */
  get: function (name) {
    return name
      ? this._getProperty(name)
      : this.attributes;
  },

  /*
   * @private
   * @memberof MiniStore
   *
   * @desc Proxy stringspace.get().
   *
   * @example
   * store._getProperty('nested:key');
   *
   * @param {string} key - Name representing key to retrieve.
   * @returns {*} - queried value.
   */
  _getProperty: function (key) {
    return stringspace.get(this.attributes, key);
  },

  /**
   * @public
   * @memberof MiniStore
   *
   * @desc Trigger an event and/or a corresponding method name. If method exists
   *   it will be invoked first.
   *
   * @example
   * api.triggerMethod('some:event');
   * // will attempt to call onSomeEvent
   *
   * @param {string} eventName - Name of event to trigger.
   */
  triggerMethod: function (eventName) {
    var method = this[this.triggerMethodName(eventName)];
    if (method) {
      method.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    this.trigger.apply(this, arguments);
  },

  /**
   * @public
   * @memberof MiniStore
   *
   * @desc Returns the name of the method to be triggered in `triggerMethod`
   *
   * @example
   * api.triggerMethodName('some:event');
   * // returns onSomeEvent
   *
   * @param {string} eventName - Name of event to transform.
   * @returns {string} Name of method to call.
   */
  triggerMethodName: function (eventName) {
    var parts = eventName.split(':');
    for (var i = 0, l = parts.length; i < l; i++) {
      parts[i] = capitalize(parts[i]);
    }

    return 'on' + parts.join('');
  }

});


});