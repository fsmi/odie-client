// Handles accounting corrections - erroneously printed pages, etc.
var Correction = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.erroneousPages = 0;
  this.erroneousCents = 0;
  // Registering deposit without printing is done by submitting a print job with
  // non-zero depositCount, but not documents. We're using PrintJob as is with
  // an empty Cart for this.
  this._printJob = new PrintJob(this.baseUrl, new Cart(baseUrl));
  ko.track(this);

  ko.defineProperty(self, 'erroneousEuros', {
    get: function() {
      return self.erroneousCents / 100;
    },
    set: function(value) {
      this.erroneousCents = value * 100;
    }
  });
}

Correction.prototype = Object.create(Object.prototype);

Correction.prototype._logErroneous = function(centsPrice) {
  $.ajax({
    url: this.baseUrl + '/data/log_erroneous_copies',
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({cents: centsPrice}),
    error: function(_, _, error) {
      console.log(error);
    }
  })
}

Correction.prototype.logErroneousCents = function() {
  this._logErroneous(this.erroneousCents);
  this.erroneousCents = 0;
}

Correction.prototype.logErroneouslyPrintedPages = function() {
  this._logErroneous(this.erroneousPages * pricePerPage);
  this.erroneousPages = 0;
}

Correction.prototype.makeDeposit = function() {
  this._printJob.submit();
  this._printJob.depositCount = 0;
  this._printJob.coverText = '';
}
