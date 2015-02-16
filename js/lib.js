Array.prototype.flatMap = function(f) {
  return this.map(f).reduce((acc, elem) => acc.concat(elem), []);
};
