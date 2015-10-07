const DescriptorPart = require('./descriptor_part');

const PathMatcher = function(pathDescriptor) {
  const pathMatcher = {}
  const pathDescriptorParts = pathDescriptor.split('/').map(DescriptorPart);

  pathMatcher.matches = function(path) {
    return pathDescriptorParts.every((descriptorPart) => {
      return descriptorPart.matches(path);
    });
  };

  pathMatcher.params = function(path) {
    var params = {};
    pathDescriptorParts.forEach((descriptorPart, i) => {
      if (descriptorPart.isDynamic()) {
        params[descriptorPart.paramName()] = descriptorPart.getPathValue(path);
      }
    });
    return params;
  };

  pathMatcher.remainder = function(path) {
    var pathParts = path.split('/');
    pathParts.splice(0, pathDescriptorParts.length);
    pathParts.unshift('');
    return pathParts.join('/');
  };

  return pathMatcher;
};

module.exports = PathMatcher;
