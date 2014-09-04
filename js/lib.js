Array.prototype.flatMap = function(f) {
  return this.map(f).reduce(function(acc, elem) { return acc.concat(elem); }, []);
};
