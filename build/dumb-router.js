'use strict';

require('core-js');

var PathMatcher = require('./path_matcher');

var Router = function Router() {
  var router = {};
  var routes = [];

  router.register = function (pathDescriptor, handler, subroutes) {
    routes.push(Router.Route(pathDescriptor, handler, subroutes));
  };

  router.execute = function (path) {
    var matchingRoute = routeFor(path);
    if (matchingRoute) {
      matchingRoute.execute(path);
    }
  };

  router.path = function () {
    for (var _len = arguments.length, pathParts = Array(_len), _key = 0; _key < _len; _key++) {
      pathParts[_key] = arguments[_key];
    }

    pathParts.unshift('');
    var path = pathParts.join('/');
    if (routeFor(path) === undefined) {
      throw new Error('No route for "' + path + '"');
    }
    return path;
  };

  return router;

  function routeFor(path) {
    return routes.find(function (route) {
      return route.matches(path);
    });
  }
};

Router.Route = function (pathDescriptor, handler, setupSubroutes) {
  var self = {};
  var pathMatcher = PathMatcher(pathDescriptor);

  var subRouter;
  if (setupSubroutes) {
    subRouter = Router();
    setupSubroutes(subRouter);
  }

  self.matches = function (path) {
    if (isScopingRoute()) {
      return pathMatcher.matches(path) && pathMatcher.remainder(path).length > 0;
    } else {
      return pathMatcher.matches(path);
    }
  };

  self.execute = function (path) {
    if (self.matches(path)) {
      if (!isScopingRoute()) {
        handler(path, pathMatcher.params(path));
      }
      if (subRouter) {
        subRouter.execute(pathMatcher.remainder(path));
      }
    }
  };

  return self;

  function isScopingRoute() {
    return handler === null || handler === undefined;
  }
};

module.exports = Router;