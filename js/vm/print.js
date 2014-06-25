var Print = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this._depositCount = null
  this.carts = []
  this.filter = ''
  this.defaultLimit = 30
  this.limit = this.defaultLimit
  this.selected = undefined
  this._coverText = null

  this.filteredCarts = function() {
    var filtered = []
    if (self.filter === '') {
      filtered = self.carts
    }
    else {
      regex = new RegExp(self.filter)
      for (var i = 0; i < self.carts.length; ++i) {
        if (regex.test(self.carts[i].name)) {
          filtered.push(self.carts[i])
        }
      }
    }
    if (self.limit !== -1) {
      return filtered.slice(0,self.limit - 1)
    }
    return filtered
  }

  ko.track(this)

  // this needs to be in the constructor, as there doesn't seem to be
  // another way to make a computed observable with proper access to 'this'
  // It also needs to be below ko.track(this), as knockout otherwise won't
  // pick up on the computed's dependencies.
  ko.defineProperty(this, 'depositCount', {
    get: function() {
      if (this._depositCount != null) {
        return this._depositCount
      }
      if (this.selected !== undefined) {
        return this.selected.includesOral() ? 1 : 0
      }
      return 0
    },
    set: function(num) { this._depositCount = num; }
  });

  ko.defineProperty(this, 'coverText', {
    get: function() {
      if (this._coverText !== null) {
        return this._coverText;
      }
      return this.selected !== undefined ? this.selected.name : '';
    },
    set: function(coverText) { this._coverText = coverText; }
  });

  this.loadCarts()
}

Print.prototype = Object.create(Object.prototype)

Print.prototype.showAllCarts = function() {
  this.limit = -1
}

Print.prototype.loadCarts = function() {
  var self = this
  $.getJSON(this.baseUrl + '/data/carts', function(data) {
    // success
    self.carts = []
    for (var i = 0; i < data.length; ++i) {
      var c = new Cart(self.baseUrl)
      c.id = data[i].id
      c.date = data[i].creationTime
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
  this.limit = this.defaultLimit;
}

Print.prototype.select = function(cart) {
  this.selected = cart;
  this.depositCount = null;
  this.coverText = null;
}

Print.prototype.printPrice = function() {
  return this.selected !== undefined ? (this.selected.priceEstimate(0) / 100).toFixed(2) : '0.00'
}

Print.prototype.totalPrice = function() {
  return this.selected !== undefined
    ? (this.selected.priceEstimate(this.depositCount) / 100).toFixed(2)
    : '0.00'
}

Print.prototype.submit = function() {
  var self = this
  var cart = self.selected
  var ids = []
  for (var i = 0; i < cart.length; ++i) {
    ids.push(cart[i].id)
  }
  var job = {
    coverText: this.coverText,
    documents: ids,
    depositCount: parseFloat(this.depositCount)
  };
  $.ajax({
    url: this.baseUrl + '/data/print',
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(job),
    success: function() {
      // reset for next print job
      self.depositCount = null
      self.coverText = null
      self.selected = undefined
      console.log('Printing...');
    },
    error: function() {
      console.log('PC LOAD LETTER');
    }
  });
}
