var Cart = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this.userID = '';
  this.online = []
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
  if (this.userID === '') {
    alert('Please enter a user name first.')
    return
  }
  var docIDs = []
  for (var i=0; i<self.length; i++) {
    docIDs.push(self[i].id)
  }
  $.ajax({
    url: this.baseUrl + '/data/carts/' + this.userID,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(docIDs),
    success: function() {
      for (var i=0; i<self.length; i++) {
        self.online.push(self[i])
      }
      self.splice(0, self.length)
    }
  })
}

