/*!
 * test/_umd.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'mini-store/mini-store'
], function (assert, sinon, MiniStore) {


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