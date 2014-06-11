var Cart = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this.name = ''
  ko.track(this)
}

Cart.prototype = Object.create(Array.prototype)

Cart.prototype.doesntContain = function(doc) {
  var found = false
  for (var i=0; i<this.length; ++i) {
    found = (this[i].id === doc.id ? true : found)
  }
  return !found
}

Cart.prototype.add = function(doc) {
  if (this.doesntContain(doc)) {
    this.push(doc)
  }
}

Cart.prototype.drop = function(doc) {
  var index = this.indexOf(doc)
  if (index < 0) {
    return
  }
  this.splice(index, 1)
}

Cart.prototype.save = function() {
  var self = this
  if (this.length === 0) {
    alert('Please add some documents to the cart first.')
    return
  }
  if (this.name === '') {
    alert('Please enter a user name first.')
    return
  }
  var docIDs = []
  for (var i=0; i<self.length; i++) {
    docIDs.push(self[i].id)
  }
  $.ajax({
    url: this.baseUrl + '/data/carts/' + this.name,
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(docIDs),
    success: function() {
      self.splice(0, self.length)
    }
  })
}

Cart.prototype.includesOral = function() {
  for (var i = 0; i < this.length; ++i) {
    if (this[i].examType === "oral") {
      return true
    }
  }
}

Cart.prototype.priceEstimate = function() {
  var price = 0
  for (var i = 0; i < this.length; ++i) {
    price += this[i].pages * pricePerPage
  }
  if (this.includesOral()) {
    price += depositPrice
  }

  // round to next-highest ten-cent unit
  return Math.ceil(price / 10) * 10
}

