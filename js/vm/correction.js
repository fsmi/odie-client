import ko from "knockout";

import api from "../api";
import Cart from "./cart";
import log from "./log";
import PrintJob from "./printjob";
import store from "../store";
import user from "./user";

// Handles accounting corrections - erroneously printed pages, etc.
export default class Correction {
  constructor() {
    this.erroneousCents = 0;
    this.donationCents = 0;
    // Registering deposit without printing is done by submitting a print job with
    // non-zero depositCount, but no documents. We're using PrintJob as is with
    // an empty Cart for this.
    this._printJob = new PrintJob(new Cart());
    ko.track(this);

    ko.defineProperty(this, 'erroneousEuros', {
      get: () => (this.erroneousCents / 100).toFixed(2),
      set: value => this.erroneousCents = parseFloat(value) * 100,
    });

    ko.defineProperty(this, 'donationEuros', {
        get: () => (this.donationCents / 100).toFixed(2),
        set: value => this.donationCents = parseFloat(value) * 100,
    });
  }

  _logErroneous(centsPrice) {
    api.post('log_erroneous_sale', {amount: centsPrice, cash_box: user.officeConfig.cash_boxes[0]})
      .done(() => log.addItem('Abrechnungskorrektur', -centsPrice));
  }

  logErroneousCents() {
    this._logErroneous(this.erroneousCents);
    this.erroneousCents = 0;
  }

  makeDeposit() {
    this._printJob.submit(() => {
      this._printJob = new PrintJob(new Cart());
    });
  }

  makeDonation() {
      api.post('donation', {amount: this.donationCents, cash_box: user.officeConfig.cash_boxes[0]}).done(() => {
          log.addItem('Spende', this.donationCents);
          this.donationCents = 0;
      });
  }

  get config() { return store.config; }
}
