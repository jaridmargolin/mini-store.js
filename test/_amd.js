/*!
 * test/_amd.js
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

describe('amd - mini-store.js', function () {

  it('Should create a new instance.', function () {
    var store = new MiniStore();
    assert.isInstanceOf(store, MiniStore);
  });

});


});