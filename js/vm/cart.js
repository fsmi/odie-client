var Cart = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this.userID = '';
  ko.track(this)

  ko.getObservable(this, 'userID').subscribe(function() {
    self.load()
  })
}

Cart.prototype = Object.create(Array.prototype)

Cart.prototype.add = function(doc) {
  var self = this
  if (this.userID === '') {
    alert("Please enter a user name first!")
    return
  }
  $.ajax({
    url: this.baseUrl + '/data/cart/' + this.userID,
    type: 'POST',
    data: JSON.stringify(doc),
    contentType: 'application/json',
    success: function() {
      self.load()
    }
  })
}

Cart.prototype.drop = function(doc) {
  var self = this
  var index = self.indexOf(doc)
  if (index < 0) {
    return
  }
  if (this.userID === '') {
    return
  }
  $.ajax({
    url: this.baseUrl + '/data/cart/' + this.userID + '/' + index,
    type: 'DELETE',
    success: function() {
      self.load()
    },
    error: function() {
      self.splice(0, self.length)
    }
  })
}

Cart.prototype.load = function() {
  var self = this
  if (this.userID === '') {
    return
  }
  $.ajax({
    url: this.baseUrl + '/data/cart/' + this.userID,
    type: 'GET',
    dataType: 'json',
    success: function(cart) {
      self.splice(0, self.length)
      for (var i=0; i<cart.length; i++) {
        self.push(cart[i])
      }
    },
    error: function() {
      self.splice(0, self.length)
    }
  })
}
