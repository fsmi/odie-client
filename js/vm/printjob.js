import ko from "knockout";

import config from "../config";
import log from "./log";

class Printer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

/* Models a single print job and supplies the data bindings for
 * the print.html template. */

export default class PrintJob {
  constructor(cart) {
    this.cart = cart;
    this._depositCount = undefined;
    this._coverText = '';
    this.status = undefined; /* undefined | 'success' | 'error' | 'waiting' */
    this.availablePrinters = [
      new Printer('external', 'Info-Drucker'),
      new Printer('emergency', 'Emergency-ATIS-Drucker')
    ];
    this.selectedPrinter = this.availablePrinters[0];

    ko.track(this);

    // desired behavior: deposit count is automatically calculated from cart
    // contents, but still overrideable
    ko.defineProperty(this, 'depositCount', {
      get: () => {
        if (this._depositCount != null) {
          return this._depositCount;
        }
        return this.cart.includesOral ? 1 : 0;
      },
      set: (num) => {
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
      get: () => this._coverText || this.cart.name,
      set: coverText => this._coverText = coverText
    });

    // reset print state if settings for the current cart change
    ko.getObservable(this.cart, 'documents').subscribe(() => this.reset());
    ko.getObservable(this, 'coverText').subscribe(() => this.reset());
    ko.getObservable(this, 'selectedPrinter').subscribe(() => this.reset());
  }

  get printPrice() {
    return this.cart.priceEstimate(0);
  }

  get totalPrice() {
    return this.cart.priceEstimate(this.depositCount);
  }

  reset() {
    this.status = undefined;
  }

  submit() {
    this.status = 'waiting';
    let ids = this.cart.documents.map(doc => doc.id);
    let job = {
      coverText: this.coverText,
      documents: ids,
      depositCount: parseFloat(this.depositCount),
      printer: this.selectedPrinter.id
    };
    config.post('/data/print', job)
      .done(() => {
        this.status = 'success';
        log.addItem(this._coverText, this.totalPrice);
      })
      .fail((_, __, error) => {
        this.status = 'error';
      });
  }

  get config() { return config; }
}
