/*!
 * test/_umd.js
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var MiniStore = require('mini-store/mini-store');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('umd - mini-store.js', function () {

  it('Should create a new instance.', function () {
    var store = new MiniStore();
    assert.isInstanceOf(store, MiniStore);
  });

});


});