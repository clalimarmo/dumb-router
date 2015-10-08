'use strict';

var DescriptorPart = require('./descriptor_part');

var PathMatcher = function PathMatcher(pathDescriptor) {
  var pathMatcher = {};
  var pathDescriptorParts = pathDescriptor.split('/').map(DescriptorPart);

  pathMatcher.matches = function (path) {
    return pathDescriptorParts.every(function (descriptorPart) {
      return descriptorPart.matches(path);
    });
  };

  pathMatcher.params = function (path) {
    var params = {};
    pathDescriptorParts.forEach(function (descriptorPart, i) {
      if (descriptorPart.isDynamic()) {
        params[descriptorPart.paramName()] = descriptorPart.getPathValue(path);
      }
    });
    return params;
  };

  pathMatcher.remainder = function (path) {
    var pathParts = path.split('/');
    pathParts.splice(0, pathDescriptorParts.length);
    pathParts.unshift('');
    return pathParts.join('/');
  };

  return pathMatcher;
};

module.exports = PathMatcher;