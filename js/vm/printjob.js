var PrintJob = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this.depositCount = null;
  ko.track(this)
}

PrintJob.prototype = Object.create(Array.prototype)

PrintJob.prototype.submit = function(cart) {
  var self = this
  if (this.depositCount == null) {
    // deposit count hasn't been overridden, we'll deduce from the cart
    this.depositCount = cart.includesOral() ? 1 : 0
  }
  var job = {
    coverText: cart.name,
    documents: cart.documents,
    depositCount: this.depositCount
  };
  $.ajax({
    url: this.baseUrl + '/data/print',
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(job),
    success: function() {
      // reset for next print job
      self.depositCount = null
      console.log('Printing...');
    },
    error: function() {
      console.log('PC LOAD LETTER');
    }
  });
}
