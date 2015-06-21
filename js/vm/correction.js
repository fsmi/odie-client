import ko from "knockout";

import api from "../api";
import Cart from "./cart";
import log from "./log";
import PrintJob from "./printjob";
import store from "../store";

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
    api.post('log_erroneous_copies', { cents: centsPrice })
      .done(() => log.addItem('Abrechnungskorrektur', -centsPrice));
  }

  logErroneousCents() {
    this._logErroneous(this.erroneousCents);
    this.erroneousCents = 0;
  }

  logErroneouslyPrintedPages() {
    this._logErroneous(this.erroneousPages * store.config.PRICE_PER_PAGE);
    this.erroneousPages = 0;
  }

  makeDeposit() {
    this._printJob.submit();
    this._printJob = new PrintJob(new Cart());
  }
}
