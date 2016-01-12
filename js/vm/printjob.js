import ko from "knockout";

import api from "../api";
import log from "./log";
import store from "../store";
import user from "./user";

/* Models a single print job and supplies the data bindings for
 * the print.html template. */

export default class PrintJob {
  constructor(cart) {
    this.cart = cart;
    this._depositCount = null;
    this.status = undefined; /* undefined | 'success' | 'error' | 'waiting' */
    this.errorText = '';
    this.selectedPrinter = undefined;
    // select a default printer as soon as they're loaded
    store.ensureLoaded(() => {
        this.selectedPrinter = this.availablePrinters[0];
    });

    ko.track(this);

    // desired behavior: deposit count is automatically calculated from cart
    // contents, but still overrideable
    ko.defineProperty(this, 'depositCount', {
      get: () => {
        if (this._depositCount !== null) {
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
      },
    });

    // reset print state if settings for the current cart change
    ko.getObservable(this.cart, 'documents').subscribe(() => this.reset());
    ko.getObservable(this.cart, 'name').subscribe(() => this.reset());
    ko.getObservable(this, 'selectedPrinter').subscribe(() => this.reset());
  }

  get availablePrinters() {
    return user.officeConfig.printers;
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

  clearDeposit() {
    // reset to automatic behaviour
    this._depositCount = null;
  }

  submit() {
    this.status = 'waiting';
    let job = {
      cover_text: this.cart.name,
      cash_box: user.officeConfig.cash_boxes[0],
      document_ids: this.cart.documents.map(doc => doc.id),
      deposit_count: parseInt(this.depositCount),
      price: this.totalPrice,
      printer: this.selectedPrinter,
    };
    api.post('print', job, {
      error: (xhr) => {
        this.status = 'error';
        // 507 means printing failed, 508 means printing succeeded, but accounting is borked.
        if (xhr.status === 507 || xhr.status === 508)
          this.errorText = JSON.parse(xhr.responseText).errors;
        if (xhr.status === 508)
          this.errorText += ' (Bitte benutze die Abrechnungskorrektur um den gesamten Verkauf nachträglich einzutragen)';
      },
    }).done(() => {
      this.status = 'success';
      this.errorText = '';
      log.addItem(this.cart.name, this.totalPrice);
    });
  }

  get config() { return store.config; }
}
