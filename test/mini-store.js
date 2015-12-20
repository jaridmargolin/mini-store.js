/*!
 * test/mini-store.js
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var sinon = require('sinon');
var MiniStore = require('mini-store');


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

    it('Should add passed attributes to instance.', function () {
      assert.deepEqual(this.store.attributes, {
        'nested': { 'key': 'value' }
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * set
   * -------------------------------------------------------------------------*/

  describe('set', function () {

    it('Should set key value.', function () {
      this.store.set('nested:prop', 'value');

      assert.deepEqual(this.store.attributes, {
        'nested': { 'key': 'value', 'prop': 'value' }
      });
    });

    it('Should set obj deep.', function () {
      this.store.set({
        'nested': { 'prop': 'value' },
        'attr': 'value'
      });

      assert.deepEqual(this.store.attributes, {
        'nested': { 'key': 'value', 'prop': 'value' },
        'attr': 'value'
      });
    });

    it('Should set obj flat.', function () {
      this.store.set({
        'nested': { 'prop': 'value' },
        'attr': 'value'
      }, { flat: true });

      assert.deepEqual(this.store.attributes, {
        'nested': { 'prop': 'value' },
        'attr': 'value'
      });
    });

    it('Should not trigger change events if property is set to same value.', function () {
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();

      this.store.on('change', handler1, this);
      this.store.on('change:nested', handler2, this);
      this.store.set('nested:key', 'value');
      assert.isTrue(handler1.notCalled);
      assert.isTrue(handler2.notCalled);
    });

    it('Should trigger change events on property value alteration.', function () {
      var opts = {};
      var expected = {
        'nested': { 'key': 'newvalue' }
      };

      var handler1 = sinon.spy(function (store, options) {
        assert.equal(store, this.store);
        assert.deepEqual(options, opts);
        assert.deepEqual(this.store.changed, expected);
      });

      var handler2 = sinon.spy(function (store, value, options) {
        assert.equal(store, this.store);
        assert.deepEqual(value, expected['nested']);
        assert.deepEqual(options, opts);
        assert.deepEqual(this.store.changed, expected);
      });

      this.store.on('change', handler1, this);
      this.store.on('change:nested', handler2, this);
      this.store.set('nested:key', 'newvalue', opts);
      assert.isTrue(handler1.calledOnce);
      assert.isTrue(handler2.calledOnce);
    });


    it('Should trigger property change event before operation change event.', function () {
      var handler1 = function () { assert.isTrue(handler2.calledOnce); };
      var handler2 = sinon.spy();

      this.store.on('change', handler1, this);
      this.store.on('change:nested', handler2, this);
      this.store.set('nested:key', 'value');
    });

    it('Should not trigger change events if silent option passed.', function () {
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();

      this.store.on('change', handler1, this);
      this.store.on('change:nested', handler2, this);
      this.store.set('nested:key', 'value', { silent: true });
      assert.isTrue(handler1.notCalled);
      assert.isTrue(handler2.notCalled);
    });

  });


  /* ---------------------------------------------------------------------------
   * unset
   * -------------------------------------------------------------------------*/

  describe('unset', function () {

    it('Should remove key.', function () {
      this.store.unset('nested');

      assert.deepEqual(this.store.attributes, {});
    });

    it('Should not trigger change event if property does not exist.', function () {
      var handler = sinon.spy();

      this.store.on('change', handler, this);
      this.store.unset('nested:fake:again');
      assert.isTrue(handler.notCalled);
    });

    it('Should trigger change event if key is removed.', function () {
      var opts = {};
      var expected = { 'nested': {} };

      var handler = sinon.spy(function (store, options) {
        assert.equal(store, this.store);
        assert.deepEqual(options, opts);
        assert.deepEqual(this.store.changed, expected);
      });

      this.store.on('change', handler, this);
      this.store.unset('nested:key', opts);
      assert.isTrue(handler.calledOnce);
    });

    it('Should not trigger change event if silent option passed.', function () {
      var handler = sinon.spy();

      this.store.on('change', handler, this);
      this.store.unset('nested:key', { silent: true });
      assert.isTrue(handler.notCalled);
    });

  });


  /* ---------------------------------------------------------------------------
   * get
   * -------------------------------------------------------------------------*/

  describe('get', function () {

    it('Should return key value', function () {
      assert.equal(this.store.get('nested:key'), 'value');
    });

    it('Should return data object', function () {
      assert.equal(this.store.get(), this.store.attributes);
    });

  });


  /* ---------------------------------------------------------------------------
   * triggerMethodName
   * -------------------------------------------------------------------------*/

  describe('triggerMethodName', function () {

    it('Should return transformed string', function () {
      assert.equal(this.store.triggerMethodName('event'), 'onEvent');
      assert.equal(this.store.triggerMethodName('event:namespace'), 'onEventNamespace');
    });

  });


  /* ---------------------------------------------------------------------------
   * triggerMethod
   * -------------------------------------------------------------------------*/

  describe('triggerMethod', function () {

    it('Should trigger event', function (done) {
      this.store.on('test', done);
      this.store.triggerMethod('test');
    });

    it('Should optionally call method if exists.', function (done) {
      this.store.onTest = function (param) {
        assert.equal(param, 'param');
        done();
      };

      this.store.triggerMethod('none', 'param');
      this.store.triggerMethod('test', 'param');
    });

  });

});


});