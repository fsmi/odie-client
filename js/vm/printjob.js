/* Models a single print job and supplies the data bindings for
 * the print.html template. */

var PrintJob = function(baseUrl, cart, coverText, depositCount) {
  var self = this;
  this.baseUrl = baseUrl;
  this.cart = cart;
  this._depositCount = depositCount;
  this._coverText = coverText;
  this.status = undefined;
  /* undefined | 'success' | 'error' | 'waiting' */

  ko.track(this);

  // this needs to be in the constructor, as there doesn't seem to be
  // another way to make a computed observable with proper access to 'this'
  // It also needs to be below ko.track(this), as knockout otherwise won't
  // pick up on the property's dependencies.
  //
  // desired behavior: deposit count is automatically calculated from cart
  // contents, but still overrideable
  ko.defineProperty(this, 'depositCount', {
    get: function() {
      if (this._depositCount != null) {
        return this._depositCount;
      }
      return this.cart.includesOral() ? 1 : 0;
    },
    set: function(num) {
      if (num === '') {
        // the user probably erased the field in the UI after it was
        // automatically set; do the right thing for them.
        this._depositCount = 0;
      }
      else {
        this._depositCount = num;
      }
    }
  });

  ko.defineProperty(this, 'coverText', {
    get: function() {
      if (this._coverText !== null) {
        return this._coverText;
      }
      return this.cart.name || '';
    },
    set: function(coverText) { this._coverText = coverText; }
  });
}

PrintJob.prototype = Object.create(Object.prototype);

PrintJob.prototype.printPrice = function() {
  return (this.cart.priceEstimate(0) / 100).toFixed(2);
}

PrintJob.prototype.totalPrice = function() {
  return (this.cart.priceEstimate(this.depositCount) / 100).toFixed(2);
}

PrintJob.prototype.submit = function() {
  var self = this;
  self.status = 'waiting';
  var ids = [];
  for (var i = 0; i < this.cart.length; ++i) {
    ids.push(this.cart[i].id);
  }
  var job = {
    coverText: this._coverText,
    documents: ids,
    depositCount: parseFloat(this.depositCount)
  };
  $.ajax({
    url: this.baseUrl + '/data/print',
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(job),
    success: function() {
      self.status = 'success';
    },
    error: function(_, _, error) {
      console.log(error);
      self.status = 'error';
    }
  });
}
