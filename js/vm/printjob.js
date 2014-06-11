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

PrintJob.prototype.loadCarts = function() {
  var self = this
  $.getJSON(this.baseUrl + '/data/carts', function(data) {
    // success
    self.carts = []
    for (var i = 0; i < data.length; ++i) {
      var c = new Cart(this.baseUrl)
      c.id = data[i].id
      c.date = data[i].date
      for (var d = 0; d < data[i].documents.length; ++d) {
        c.push(data[i].documents[d])
      }
      c.name = data[i].name
      self.carts.push(c)
    }
  })
  .fail(function(xhr, _, errorThrown) {
    console.log("Couldn't get carts -- are you logged in?")
  })
}

PrintJob.prototype.select = function(cart) {
  this.selected = cart
}

PrintJob.prototype.printPrice = function() {
  return this.selected !== undefined ? (this.selected.priceEstimate(0) / 100).toFixed(2) : '0.00'
}

PrintJob.prototype.totalPrice = function() {
  return this.selected !== undefined 
    ? (this.selected.priceEstimate(this.depositCount) / 100).toFixed(2)
    : '0.00'
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
      self.selected = undefined
      console.log('Printing...');
    },
    error: function() {
      console.log('PC LOAD LETTER');
    }
  });
}
