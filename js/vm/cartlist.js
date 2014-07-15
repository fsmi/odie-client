var CartList = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.carts = [];
  this.filter = '';
  this.defaultLimit = 15;
  this.limit = this.defaultLimit;

  this.filteredCarts = function() {
    var filtered = [];
    if (self.filter === '') {
      filtered = self.carts;
    }
    else {
      regex = new RegExp(self.filter);
      for (var i = 0; i < self.carts.length; ++i) {
        if (regex.test(self.carts[i].name)) {
          filtered.push(self.carts[i]);
        }
      }
    }
    // sort by creation time in descending order
    filtered.sort(
      function(a, b) {
        if (a.date !== b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        // make sure there's some deterministic order even for simultaneously
        // created carts
        return a.name < b.name ? -1 : -1;
      }
    );
    if (self.limit !== -1) {
      return filtered.slice(0, self.limit - 1);
    }
    return filtered;
  }

  ko.track(this);

  this.loadCarts();
}

CartList.prototype = Object.create(Object.prototype);

CartList.prototype.showAllCarts = function() {
  this.limit = -1;
}

CartList.prototype.loadCarts = function() {
  var self = this;
  $.getJSON(this.baseUrl + '/data/carts', function(data) {
    // success
    self.carts = [];
    for (var i = 0; i < data.length; ++i) {
      var c = new Cart(self.baseUrl);
      c.id = data[i].id;
      c.date = data[i].creationTime;
      for (var d = 0; d < data[i].documents.length; ++d) {
        c.push(new Document(data[i].documents[d]));
      }
      c.name = data[i].name;
      self.carts.push(c);
    }
  })
  .fail(function(_, _, errorThrown) {
    console.log("Couldn't get carts -- are you logged in?");
  });
  this.limit = this.defaultLimit;
}

CartList.prototype.deleteCart = function(cart) {
  var self = this;
  $.ajax({
    url: this.baseUrl + '/data/carts/' + cart.id,
    type: 'DELETE',
    success: function() {
      var i = self.carts.indexOf(cart);
      if (i > -1) {
        // remove from cart listing
        self.carts.splice(i, 1);
      }
    }
  });
}
