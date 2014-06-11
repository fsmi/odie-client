var PrintJob = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this.depositCount = null
  this.carts = []
  this.filter = ''
  this.selected = undefined

  this.filteredCarts = function() {
    if (self.filter === '') {
      return self.carts
    }
    var filtered = []
    regex = new RegExp(self.filter)
    for (var i = 0; i < self.carts.length; ++i) {
      if (regex.test(self.carts[i].name)) {
        filtered.push(self.carts[i])
      }
    }
    return filtered
  }

  ko.track(this)

  this.loadCarts()
}

PrintJob.prototype = Object.create(Object.prototype)

PrintJob.prototype.lectures = function(cart) {
  lecs = []
  for (var i = 0; i < cart.documents.length; ++i) {
    for (var j = 0; j < cart.documents[i].lectures.length; ++j) {
      if (lecs.indexOf(cart.documents[i].lectures[j]) === -1) {
        lecs.push(cart.documents[i].lectures[j])
      }
    }
  }
  return lecs
}

PrintJob.prototype.loadCarts = function() {
  var self = this
  $.getJSON(this.baseUrl + '/data/carts', function(data) {
    // success
    this.carts = data
  })
  .fail(function(xhr, _, errorThrown) {
    console.log("Couldn't get carts -- are you logged in?")
  })
}

PrintJob.prototype.select = function(cart) {
  this.selected = cart
}

PrintJob.prototype.submit = function() {
  var cart = this.selected
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
