import ko from "knockout";

import api from "../api";
import Cart from "./cart";
import log from "./log";
import PrintJob from "./printjob";
import store from "../store";

// Handles accounting corrections - erroneously printed pages, etc.
export default class Correction {
  constructor() {
    this.cashBox = 'Sprechstundenkasse Informatik';
    this.erroneousPages = 0;
    this.erroneousCents = 0;
    this.donationCents = 0;
    // Registering deposit without printing is done by submitting a print job with
    // non-zero depositCount, but no documents. We're using PrintJob as is with
    // an empty Cart for this.
    this._printJob = new PrintJob(new Cart());
    ko.track(this);

    ko.defineProperty(this, 'erroneousEuros', {
      get: () => this.erroneousCents / 100,
      set: value => this.erroneousCents = value * 100
    });

    ko.defineProperty(this, 'donationEuros', {
        get: () => this.donationCents / 100,
        set: value => this.donationCents = value * 100
    });
  }

  _logErroneous(centsPrice) {
    api.post('log_erroneous_sale', { amount: centsPrice, cash_box: this.cashBox })
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

  makeDonation() {
      api.post('donation', {amount: this.donationCents, cash_box: this.cashBox }).done(() => {
          log.addItem('Spende', this.donationCents);
          this.donationCents = 0;
      });
  }

  get config() { return store.config; }
}
