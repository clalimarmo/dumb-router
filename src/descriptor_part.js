const DescriptorPart = function(partString, position) {
  const self = {};

  self.matches = function(path) {
    if (self.isDynamic()) {
      const pathValue = self.getPathValue(path);
      return pathValue !== undefined && pathValue.length > 0;
    } else {
      return self.getPathValue(path) === partString;
    }
  };

  self.isDynamic = function() {
    return partString.startsWith(':');
  };

  self.paramName = function() {
    if (self.isDynamic()) {
      return partString.split(':')[1];
    }
  };

  self.getPathValue = function(path) {
    return path.split('/')[position];
  };

  return self;
};

module.exports = DescriptorPart;
