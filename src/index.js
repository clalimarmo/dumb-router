const PathMatcher = require('./path_matcher');

const Router = function() {
  const router = {};
  const routes = [];

  router.register = function(pathDescriptor, handler, subroutes) {
    routes.push(Router.Route(pathDescriptor, handler, subroutes));
  };

  router.execute = function(path) {
    const matchingRoute = routeFor(path);
    if (matchingRoute) {
      matchingRoute.execute(path);
    }
  };

  router.path = function(...pathParts) {
    pathParts.unshift('');
    const path = pathParts.join('/');
    if (routeFor(path) === undefined) {
      throw new Error(`No route for "${path}"`);
    }
    return path;
  };

  return router;

  function routeFor(path) {
    return routes.find((route) => { return route.matches(path); });
  }
};

Router.Route = function(pathDescriptor, handler, setupSubroutes) {
  const self = {};
  const pathMatcher = PathMatcher(pathDescriptor);

  var subRouter;
  if (setupSubroutes) {
    subRouter = Router();
    setupSubroutes(subRouter);
  }

  self.matches = function(path) {
    if (isScopingRoute()) {
      return pathMatcher.matches(path) && pathMatcher.remainder(path).length > 0;
    } else {
      return pathMatcher.matches(path);
    }
  };

  self.execute = function(path) {
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
