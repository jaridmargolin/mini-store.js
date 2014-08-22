/*!
 * test/mini-store.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'mini-store'
], function (assert, sinon, MiniStore) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('mini-store.js', function () {

  beforeEach(function () {
    this.store = new MiniStore({ 'nested:key': 'value' });
  });


  /* ---------------------------------------------------------------------------
   * constructor
   * -------------------------------------------------------------------------*/

  describe('constructor', function () {

    it('Should add original to instance.', function () {
      assert.deepEqual(this.store.original, {
        'nested': { 'key': 'value' }
      });
    });

    it('Should add data to instance as clone of original.', function () {
      assert.notEqual(this.store.data, this.store.original);
      assert.deepEqual(this.store.data, this.store.original);
    });

  });


  /* ---------------------------------------------------------------------------
   * add
   * -------------------------------------------------------------------------*/

  describe('add', function () {

    it('Should add key value.', function () {
      this.store.add('nested:prop', 'value');

      assert.deepEqual(this.store.data, {
        'nested': { 'key': 'value', 'prop': 'value' }
      });
    });

    it('Should add obj.', function () {
      this.store.add({
        'nested:prop': 'value',
        'attr': 'value'
      });

      assert.deepEqual(this.store.data, {
        'nested': { 'key': 'value', 'prop': 'value' },
        'attr': 'value'
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * remove
   * -------------------------------------------------------------------------*/

  describe('remove', function () {

    it('Should remove key.', function () {
      this.store.remove('nested');

      assert.deepEqual(this.store.data, {});
    });

  });


  /* ---------------------------------------------------------------------------
   * reset
   * -------------------------------------------------------------------------*/

  describe('reset', function () {

    it('Should reset to original.', function () {
      this.store.remove('nested');
      this.store.reset();

      assert.deepEqual(this.store.data, this.store.original);
    });

  });

});


});