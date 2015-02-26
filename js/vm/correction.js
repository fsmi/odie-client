// Handles accounting corrections - erroneously printed pages, etc.
class Correction {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.erroneousPages = 0;
    this.erroneousCents = 0;
    // Registering deposit without printing is done by submitting a print job with
    // non-zero depositCount, but not documents. We're using PrintJob as is with
    // an empty Cart for this.
    this._printJob = new PrintJob(this.baseUrl, new Cart(baseUrl));
    ko.track(this);

    ko.defineProperty(this, 'erroneousEuros', {
      get: () => this.erroneousCents / 100,
      set: value => this.erroneousCents = value * 100
    });
  }

  _logErroneous(centsPrice) {
    $.ajax({
      url: this.baseUrl + '/data/log_erroneous_copies',
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({cents: centsPrice}),
      error: (_, __, error) => {
        console.log(error);
      }
    })
  }

  logErroneousCents() {
    this._logErroneous(this.erroneousCents);
    this.erroneousCents = 0;
  }

  logErroneouslyPrintedPages() {
    this._logErroneous(this.erroneousPages * pricePerPage);
    this.erroneousPages = 0;
  }

  makeDeposit() {
    this._printJob.submit();
    this._printJob.depositCount = 0;
    this._printJob.coverText = '';
  }
}
