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
  constructor: function () {
    EventEmitter.prototype.constructor.apply(this, arguments);

    this.attributes = {};

    // optionally set initial state of store
    if (arguments[0]) {
      this.set.apply(this, arguments);
    }
  },

  /**
   * Add properties to on attributes object. Will overwrite if value currently
   * exists for key. Works as a deep merge.
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
   * @public
   *
   * @param {object} properties - Will set each key as a property to store.
   * @param {key} key - Name of key to set in store.
   * @param {*} value - Used when key name passed. Sets value of key in store.
   * @param {object} options
   * @param {boolean} options.flat - If merge should be flat rather than deep
   *   (deep by default).
   * @param {boolean} options.silent - If we should silence the change event
   *   that fires if a property is altered.
   *
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
      this.trigger('change', this, options);

      for (var propName in this.changed) {
        this.trigger('change:' + propName, this, this.changed[propName], options);
      }
    }

    // chaning yo!
    return this;
  },

  /**
   * Loop over object keys and set on obj.
   *
   * @example
   * store._setProperties({
   *   'nested:key': 'value',
   *   'notnested': 'value'
   * });
   *
   * @private
   *
   * @param {object} obj - Properties to set to store.
   * @param {object} options
   * @param {boolean} options.flat - If merge should be flat rather than deep
   *   (deep by default).
   * @param {boolean} options.silent - If we should silence the change event
   *   that fires if a property is altered.
   *
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

  /**
   * Set property on attributes.
   *
   * @example
   * store._setProperty('nested:key', 'value');
   *
   * @private
   *
   * @param {string} key - Formatted string representing a key in the store.
   * @param {*} val - Value of the specified key.
   * @param {object} options
   * @param {boolean} options.flat - If merge should be flat rather than deep
   *   (deep by default).
   * @param {boolean} options.silent - If we should silence the change event
   *   that fires if a property is altered.
   *
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
   * Remove values from attributes object. If the key passed represents an
   * object in the attributes object, all data within the object will be
   * removed.
   *
   * @example
   * store.unset('nested');
   *
   * @public
   *
   * @param {string} key - Namespaced key to delete value of.
   *
   * @returns {object} - store instance.
   */
  unset: function (key, options) {
    // Don't blow up if options is not defined
    options = options || {};

    this._unsetProperty(key);

    if (!options.silent && !isEmpty(this.changed)) {
      this.trigger('change', this, options);
    }

    // chaining yo!
    return this;
  },

  /**
   * Proxy stringspace.remove().
   *
   * @example
   * store._unsetProperty('nested');
   *
   * @public
   *
   * @param {string} key - String representing the key to remove.
   *
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
   * Get value from store.
   *
   * @example
   * store.get('key');
   *
   * @public
   *
   * @param {string} name - String representation of key to return from store.
   * If no key is passed, the entire attributes object will be returned.
   *
   * @returns {*} - queried value.
   */
  get: function (name) {
    return name
      ? this._getProperty(name)
      : this.attributes;
  },

  /**
   * Proxy stringspace.get().
   *
   * @example
   * store._getProperty('nested:key');
   *
   * @private
   *
   * @param {string} key - Name representing key to retrieve.
   *
   * @returns {*} - queried value.
   */
  _getProperty: function (key) {
    return stringspace.get(this.attributes, key);
  },

  /**
   * Trigger a method an optionally attempt to call method on class.
   *
   * @example
   * api.triggerMethod('some:event');
   * // will call onSomeEvent method if exists.
   *
   * @public
   *
   * @param {string} eventName - Name of event to trigger.
   */
  triggerMethod: function (eventName) {
    var parts = eventName.split(':');
    for (var i = 0, l = parts.length; i < l; i++) {
      parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
    }

    var method = this['on' + parts.join('')];
    if (method) {
      method.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    this.trigger.apply(this, arguments);
  }

});


});