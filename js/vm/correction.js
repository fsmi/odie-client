import ko from "knockout";

import config from "../config";
import Cart from "./cart";
import PrintJob from "./printjob";

// Handles accounting corrections - erroneously printed pages, etc.
export default class Correction {
  constructor() {
    this.erroneousPages = 0;
    this.erroneousCents = 0;
    // Registering deposit without printing is done by submitting a print job with
    // non-zero depositCount, but no documents. We're using PrintJob as is with
    // an empty Cart for this.
    this._printJob = new PrintJob(new Cart());
    ko.track(this);

    ko.defineProperty(this, 'erroneousEuros', {
      get: () => this.erroneousCents / 100,
      set: value => this.erroneousCents = value * 100
    });
  }

  _logErroneous(centsPrice) {
    config.post('/data/log_erroneous_copies', { cents: centsPrice });
  }

  logErroneousCents() {
    this._logErroneous(this.erroneousCents);
    this.erroneousCents = 0;
  }

  logErroneouslyPrintedPages() {
    this._logErroneous(this.erroneousPages * config.pricePerPage);
    this.erroneousPages = 0;
  }

  makeDeposit() {
    this._printJob.submit();
    this._printJob = new PrintJob(new Cart());
  }
}
