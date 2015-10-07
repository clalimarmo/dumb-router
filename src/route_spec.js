require('babelify/polyfill');

const Route = require('./').Route;

describe('router route:', () => {
  const descriptor = '/users/:userId';

  it('executes handler if route matches', () => {
    var matched = 'matched?';
    const handler = (path, params) => {
      matched = true;
      handler.calledWith = params;
    };
    const route = Route('/users/:userId', handler);
    route.execute('/users/55');
    expect(matched).to.be.true;
    expect(handler.calledWith.userId).to.eq('55');
  });

  it('does nothing if route does not match', () => {
    var handlerCalled = 'handler called?';
    const handler = (path, params) => {
      handlerCalled = true;
    };
    const route = Route('/users/:userId', handler);
    route.execute('/users//');
    expect(handlerCalled).to.not.be.true;
  });

  context('no-op route (e.g. scope route):', () => {
    var route;

    beforeEach(() => {
      route = Route('/api', null);
    });

    it('accepts null handlers', () => {
      expect(() => {
        route.execute('/api');
      }).to.not.throw(Error);
    });

    it('accepts undefined handlers', () => {
      expect(() => {
        route.execute('/api');
      }).to.not.throw(Error);
    });

    it('only matches if there is a path remainder', () => {
      expect(route.matches('/api')).to.be.false;
      expect(route.matches('/api/something')).to.be.true;
    });
  });
});
