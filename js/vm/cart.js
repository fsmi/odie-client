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

Cart.prototype.addAll = function(docs) {
  for (var i = 0; i < docs.length; ++i) {
    this.add(docs[i])
  }
}

Cart.prototype.drop = function(doc) {
  var index = this.indexOf(doc)
  if (index < 0) {
    return
  }
  this.splice(index, 1)
}

Cart.prototype.dropAll = function() {
  while (this.length > 0) {
    this.splice(0, this.length);
  }
}

Cart.prototype.lectures = function() {
  lecs = []
  for (var i = 0; i < this.length; ++i) {
    for (var j = 0; j < this[i].lectures.length; ++j) {
      if (lecs.indexOf(this[i].lectures[j]) === -1) {
        lecs.push(this[i].lectures[j])
      }
    }
  }
  return lecs
}


Cart.prototype.save = function() {
  var self = this
  if (this.length === 0) {
    alert("Bitte wähle zuerst ein paar Protokolle oder Klausuren aus.")
    return
  }
  if (this.name === '') {
    alert("Bitte gib' zuerst deinen Namen (oder ein Pseudonym) an.")
    return
  }
  var docIDs = []
  for (var i=0; i<self.length; i++) {
    docIDs.push(self[i].id)
  }
  $.ajax({
    url: this.baseUrl + '/data/carts/' + encodeURIComponent(this.name),
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
  return false
}

Cart.prototype.priceEstimate = function(depositCount) {
  var price = 0
  for (var i = 0; i < this.length; ++i) {
    price += this[i].pages * pricePerPage
  }
  if (depositCount === undefined) {
    if (this.includesOral()) {
      price += depositPrice
    }
  }
  else {
    price += depositCount * depositPrice
  }

  // round to next-highest ten-cent unit
  return Math.ceil(price / 10) * 10
}

Cart.prototype.displayDate = function() {
  var months = ['Jan ',
                'Feb ',
                'Mär ',
                'Apr ',
                'Mai ',
                'Jun ',
                'Jul ',
                'Aug ',
                'Sep ',
                'Okt ',
                'Nov ',
                'Dez ']
  var d = new Date(this.date)
  return d.getDate() + '. ' + months[d.getMonth()] + d.getFullYear()
}

