// So far, this feels like it'll be a lot of copy-pasted code and html from print.js/print.html.
// There's probably some nice general abstraction I'm missing here. TODO: abstract!

var DepositReturn = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.filter = '';
  // TODO this doesn't lend itself to a simple data-binding
  this.status = undefined;
  /* undefined | 'success' | 'error' | 'waiting' */
  this.depositList = [];
  ko.track(this);

  this.loadList();
}

DepositReturn.prototype = Object.create(Object.prototype);

DepositReturn.prototype.filteredList = function() {
  // TODO
  console.log('filtered')
  return this.depositList;
}

DepositReturn.prototype.loadList = function() {
  //TODO
  var self = this;
  self.depositList = [1,2,3,4,4,5,56,6];
}

DepositReturn.prototype.markAsReturned = function(item) {
  // TODO
  console.log(item)
}
