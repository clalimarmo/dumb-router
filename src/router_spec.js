require('babelify/polyfill');

const Router = require('./dumb-router');

describe('Router', () => {
  var router;
  var mocks;

  beforeEach(() => {
    router = Router();
  });

  it('only executes a matching path', () => {
    var executedPath = 'executed path';
    function setExecutedPath(path) {
      return 'executed: ' + path;
    }

    router.register('/tomes', setExecutedPath);
    router.register('/grimoires', setExecutedPath);

    expect(router.execute('/tomes')[0]).to.eq('executed: /tomes');
  });

  it('executes a path handler with dynamic portions as params', () => {
    var pathMatched = 'path matched?';
    var idParam = 'dynamic id param';
    function pathHandler(path, params) {
      pathMatched = true;
      idParam = params.id;
    }

    router.register('/tomes/:id', pathHandler);
    router.execute('/tomes/some-arbitrary-4lph4num3ric-value/');
    expect(pathMatched).to.be.true;
    expect(idParam).to.eq('some-arbitrary-4lph4num3ric-value');
  });

  context('nested routes', () => {
    var outerRouteMatched;
    var innerRouteMatched;

    var outerRouteParams;
    var innerRouteParams;

    beforeEach(() => {
      outerRouteMatched = 'outer route matched?';
      innerRouteMatched = 'inner route matched?';

      outerRouteParams = 'outer route params';
      innerRouteParams = 'inner route params';

      function outerRouteHandler(path, params) {
        outerRouteMatched = true;
        outerRouteParams = params;
        return 'outer';
      }

      function innerRouteHandler(path, params) {
        innerRouteMatched = true;
        innerRouteParams = params;
        return 'inner';
      }

      router.register('/grimoires/:id', outerRouteHandler, (router) => {
        router.register('/comments/:commentType', innerRouteHandler);
      });
    });

    it('matches outer and inner routes', () => {
      const returnValues = router.execute('/grimoires/5/comments/arcane');

      expect(returnValues[0]).to.eq('outer');
      expect(returnValues[1]).to.eq('inner');

      expect(outerRouteMatched).to.be.true;
      expect(innerRouteMatched).to.be.true;
      expect(outerRouteParams.id).to.eq('5');
      expect(innerRouteParams.commentType).to.eq('arcane');
    });

    it('can match the outer route and not the inner route', () => {
      router.execute('/grimoires/5');

      expect(outerRouteMatched).to.be.true;
      expect(outerRouteParams.id).to.eq('5');

      expect(innerRouteMatched).to.not.be.true;
    });

    it('allows null handlers, for route scoping', () => {
      function catHandler(path, params) {
        catHandler.executed = true;
      }

      router.register('/categories', null, (router) => {
        router.register('/cats', catHandler);
      });
      router.execute('/categories/cats');
      expect(catHandler.executed).to.be.true;
    });
  });

  context('path building', () => {
    var mockHandler;

    beforeEach(() => {
      mockHandler = () => {};
      router.register('/', mockHandler);
      router.register('/legends/:legendId', mockHandler, (router) => {
        router.register('/comments', mockHandler);
        router.register('/comments/new', mockHandler);
      });
    });

    it('provides paths by parts', () => {
      expect(router.path('legends', 5)).to.eq('/legends/5');
      expect(router.path('legends', 5, 'comments')).to.eq('/legends/5/comments');
      expect(router.path('legends', 5, 'comments', 'new')).to.eq('/legends/5/comments/new');
    });

    it('raises errors for paths that do not exist', () => {
      expect(() => {
        router.path('legends');
      }).to.throw(Error, 'No route for "/legends"');
    });

    it('raises errors for paths that do not exist', () => {
      router = Router();
      router.register('/', mockHandler);
      expect(() => {
        router.path('battlescar');
      }).to.throw(Error, 'No route for "/battlescar"');
    });

    it('considers no-op (scope) routes to not exist', () => {
      router.register('/categories', null, (router) => {
        router.register('/cats', mockHandler);
        router.register('/dogs', mockHandler);
      });
      expect(() => {
        router.path('categories');
      }).to.throw(Error, 'No route for "/categories"');

      expect(() => {
        router.path('categories', 'cats');
        router.path('categories', 'dogs');
      }).to.not.throw(Error);
    });
  });
});
