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
 * test/child.js
 * 
 * Copyright (c) 2014
 */
var childChild, utlIsObject, utlIsArray, utlCompanionDeepMerge, stringspaceUtils, stringspaceStringspace, eventEmitterEventEmitter, assistCapitalize, utlIsUndefined, utlIsEmpty, utlExtend, miniStore;
childChild = function (Parent, protos) {
  // Our new baby :D
  var Child;
  // Child can set constructor by passing in with
  // protos.
  if (protos.hasOwnProperty('constructor')) {
    Child = protos.constructor;
  } else {
    Child = function () {
      return Parent.apply(this, arguments);
    };
  }
  // Mixin static props directly set on parent
  for (var i in Parent) {
    Child[i] = Parent[i];
  }
  // Function used to set up correct
  // prototype chain
  var Surrogate = function () {
    this.constructor = Child;
  };
  // + Surrogate
  //   - constructor (defined above in Child)
  //   - prototype (Parent)
  Surrogate.prototype = Parent.prototype;
  // + Child
  //   + prototype (Surrogate)
  //     - prototype(Parent)
  Child.prototype = new Surrogate();
  // Mixin protos
  for (var j in protos) {
    Child.prototype[j] = protos[j];
  }
  // Return class yo!
  return Child;
};
/*!
 * isObject.js
 * 
 * Copyright (c) 2014
 */
utlIsObject = function (value) {
  return value === Object(value);
};
/*!
 * isArray.js
 * 
 * Copyright (c) 2014
 */
utlIsArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};
/*!
 * deepMerge.js
 * 
 * Copyright (c) 2014
 */
utlCompanionDeepMerge = function (isArray, isObject) {
  /* -----------------------------------------------------------------------------
   * deepMerge
   * ---------------------------------------------------------------------------*/
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
  var deepMerge = function (dest, obj) {
    for (var k in obj) {
      var destVal = dest[k] || {};
      var objVal = obj[k];
      var isObj = isObject(objVal);
      var isArr = isArray(objVal);
      if (isObj || isArr) {
        if (isObj && !isObject(destVal)) {
          dest[k] = {};
        }
        if (isArr && !isArray(destVal)) {
          dest[k] = [];
        }
        dest[k] = deepMerge(destVal, objVal);
      } else {
        dest[k] = objVal;
      }
    }
    return dest;
  };
  /* -----------------------------------------------------------------------------
   * deepMerge
   * ---------------------------------------------------------------------------*/
  return deepMerge;
}(utlIsArray, utlIsObject);
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
stringspaceUtils = function (isObject, deepMerge) {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  return {
    isObject: isObject,
    deepMerge: deepMerge
  };
}(utlIsObject, utlCompanionDeepMerge);
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
    return this._get(obj, key).val;
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
  Stringspace.prototype.set = function (obj, keyStr, val, deep) {
    var result = this._get(obj, keyStr, true);
    var curVal = result.val;
    var parent = result.parent;
    var key = result.key;
    var shouldMerge = _.isObject(curVal) && deep;
    parent[key] = shouldMerge ? _.deepMerge(curVal, val) : val;
    return parent[key];
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
   * @param {string} keyStr - String representing the key to remove.
   */
  Stringspace.prototype.remove = function (obj, keyStr) {
    var result = this._get(obj, keyStr);
    var parent = result.parent;
    var key = result.key;
    delete parent[key];
  };
  /**
   * Helper method to recursively loop through object.
   *
   * @private
   *
   * @param {object} obj - The object to act on.
   * @param {string} keyStr - Formatted string representing a key in
   *   the object.
   * @param {object} create - Flag for if we should create an empty object
   *   when an undefined property is found.
   */
  Stringspace.prototype._get = function (obj, keyStr, create) {
    var parts = keyStr.split(this.seperator);
    for (var i = 0, len = parts.length; i < len; i++) {
      var key = parts[i];
      var val = obj[key];
      var isLast = len === i + 1;
      var isUndf = !val && !create;
      if (isLast || isUndf) {
        return {
          key: key,
          val: val,
          parent: obj
        };
      }
      obj = obj[key] = val || {};
    }
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return Stringspace;
}(stringspaceUtils);
/*!
 * event-emitter.js
 * 
 * Copyright (c) 2014
 */
eventEmitterEventEmitter = function () {
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var root = this;
  /* -----------------------------------------------------------------------------
   * EventEmitter
   * ---------------------------------------------------------------------------*/
  /**
   * Lightweight EventEmitter Class.
   *
   * @example
   * var emitter = new EventEmitter(settings);
   *
   * @public
   * @constructor
   */
  var EventEmitter = function () {
    this.events = {};
  };
  /**
   * Add event listener and handler to emitter isntance.
   *
   * @example
   * emitter.on('event', this.doSomething, this);
   *
   * @public
   *
   * @param {string} name - Name of event to listen for.
   * @param {function} handler - Function to call when event is triggered.
   * @param {object} context - Context in which to execute handler. 
   *
   * @returns emitter instance (allows chaining).
   */
  EventEmitter.prototype.on = function (name, handler, context) {
    (this.events[name] = this.events[name] || []).unshift({
      fn: handler,
      context: context || root
    });
    return this;
  };
  /**
   * Remove event lister from instance. If no arguments are passed,
   * all events will be remove from the instance. If only name is
   * passed, all handlers will be remove from the specified event.
   * If name and handler are passed, only the handler will be
   * removed from the specified event.
   *
   * @example
   * emitter.off('event');
   * // removes all handlers from `event`
   *
   * @public
   *
   * @param {string} name - Name of event to remove listener from.
   * @param {function} handler - Function handler to remove from event.
   *
   * @returns emitter instance (allows chaining).
   */
  EventEmitter.prototype.off = function (name, handler) {
    var subscribers = this.events[name] || [];
    var l = subscribers.length;
    // Remove all events
    if (!name) {
      this.events = {};
    } else if (!handler) {
      delete this.events[name];
    } else {
      while (l--) {
        if (subscribers[l].fn === handler) {
          subscribers.splice(l, 1);
        }
      }
    }
    return this;
  };
  /**
   * Calls handler for all event subscribers.
   *
   * @example
   * emitter.trigger('event');
   * // removes all handlers from `event`
   *
   * @public
   *
   * @param {string} name - Name of event to remove listener from.
   *
   * @returns emitter instance (allows chaining).
   */
  EventEmitter.prototype.trigger = function (name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var subscribers = this.events[name] || [];
    var l = subscribers.length;
    // fixes bug where handler could be called twice when handler
    // is responsible for moving event handlers. Now all handlers will
    // execute, regardless if they are removed during another handler.
    var copy = [];
    for (var i = 0; i < l; i++) {
      copy.push(subscribers[i]);
    }
    while (l--) {
      copy[l].fn.apply(copy[l].context, args);
    }
    return this;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return EventEmitter;
}();
/*!
 * capitalize.js
 */
assistCapitalize = function (str) {
  return str[0].toUpperCase() + str.slice(1);
};
/*!
 * isUndefined.js
 * 
 * Copyright (c) 2014
 */
utlIsUndefined = function (variable) {
  return typeof variable === 'undefined';
};
/*!
 * isEmpty.js
 * 
 * Copyright (c) 2014
 */
utlIsEmpty = function (isArray) {
  /* -----------------------------------------------------------------------------
   * isEmpty
   * ---------------------------------------------------------------------------*/
  /**
   * Determine if an object or array is empty.
   *
   * @example
   * var empty = isEmpty({});
   * // true
   *
   * @public
   *
   * @param {object} obj - obj to run isEmpty test on
   * @reutns {boolean} - true if object is empty. false if not.
   */
  return function (obj) {
    // Array
    if (isArray(obj)) {
      return obj.length === 0;
    }
    // Object
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
}(utlIsArray);
/*!
 * extend.js
 *
 * Copyright (c) 2014
 */
utlExtend = function (dest) {
  for (var i = 1; i < arguments.length; i++) {
    for (var k in arguments[i]) {
      dest[k] = arguments[i][k];
    }
  }
  return dest;
};
/*!
 * mini-store.js
 */
miniStore = function (require) {
  /* -----------------------------------------------------------------------------
   * dependencies
   * ---------------------------------------------------------------------------*/
  var child = childChild;
  var Stringspace = stringspaceStringspace;
  var EventEmitter = eventEmitterEventEmitter;
  var capitalize = assistCapitalize;
  var isUndefined = utlIsUndefined;
  var isObject = utlIsObject;
  var isEmpty = utlIsEmpty;
  var extend = utlExtend;
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
      return name ? this._getProperty(name) : this.attributes;
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
}({});

return miniStore;


}));