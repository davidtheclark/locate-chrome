var test = require('tape');
var sinon = require('sinon');
var darwin = require('../lib/darwin');

var mockPaths = ['foo', 'bar', 'baz'];

function mockLocaterFoo(p, finisher, next) {
  if (p === 'foo') finisher(p);
  else next();
}

function mockLocaterBar(p, finisher, next) {
  if (p === 'bar') finisher(p);
  else next();
}

function mockLocaterBaz(p, finisher, next) {
  if (p === 'baz') finisher(p);
  else next();
}

function mockLocaterFails(p, finisher, next) {
  next();
}

function mockSearcherYea(finisher) {
  finisher('yea');
}

function mockSearcherNay(finisher, next) {
  next();
}

test('only attempts until finisher is called', function(t) {
  var locaterFooSpy = sinon.spy(mockLocaterFoo);
  var locaterBarSpy = sinon.spy(mockLocaterBar);
  var locaterBazSpy = sinon.spy(mockLocaterBaz);
  var locaterFailsSpy = sinon.spy(mockLocaterFails);
  var searcherYeaSpy = sinon.spy(mockSearcherYea);
  var searcherNaySpy = sinon.spy(mockSearcherNay);

  t.plan(14);

  darwin(locaterFooSpy, finisherFoo, mockPaths, searcherYeaSpy);

  function finisherFoo(p) {
    t.equal(p, 'foo');
    t.ok(locaterFooSpy.calledOnce, 'calls locater once if first path works');
    t.notOk(searcherYeaSpy.called, 'search was not called if a path worked');
  }

  darwin(locaterBarSpy, finisherBar, mockPaths, searcherYeaSpy);

  function finisherBar(p) {
    t.equal(p, 'bar');
    t.ok(locaterBarSpy.calledTwice, 'calls locater twice if second path works');
    t.notOk(searcherYeaSpy.called, 'search was not called if a path worked');
  }

  darwin(locaterBazSpy, finisherBaz, mockPaths, searcherYeaSpy);

  function finisherBaz(p) {
    t.equal(p, 'baz');
    t.ok(locaterBazSpy.calledThrice, 'calls locater thrice if third path works');
    t.notOk(searcherYeaSpy.called, 'search was not called if a path worked');
  }

  darwin(locaterFailsSpy, finisherSearch, mockPaths, searcherYeaSpy);

  function finisherSearch(p) {
    t.equal(p, 'yea');
    t.ok(locaterFailsSpy.calledThrice, 'attempts all paths');
    t.ok(searcherYeaSpy.calledOnce, 'search was called if all paths failed');
  }

  darwin(locaterFailsSpy, finisherFailedSearch, mockPaths, searcherNaySpy);

  function finisherFailedSearch(p) {
    t.equal(p, null, 'when even search fails we get null');
    t.ok(searcherNaySpy.calledOnce, 'search was called if all paths failed');
  }

});
