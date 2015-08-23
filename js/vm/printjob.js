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
    this._depositCount = undefined;
    this.status = undefined; /* undefined | 'success' | 'error' | 'waiting' */
    this.print_for_folder = false;
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
    this._depositCount = 0;
  }

  submit() {
    this.status = 'waiting';
    let job = {
      cover_text: this.cart.name,
      document_ids: this.cart.documents.map(doc => doc.id),
      printer: this.selectedPrinter,
    };
    let endpoint = 'print_for_folder';
    if (!this.print_for_folder) {
      endpoint = 'print';
      Object.assign(job, {
        cash_box: user.officeConfig.cash_boxes[0],
        deposit_count: parseInt(this.depositCount),
      });
    }
    api.post(endpoint, job, {
      error: () => { this.status = 'error'; },
    }).done(() => {
      this.status = 'success';
      log.addItem(this.cart.name, this.totalPrice);
    });
  }

  get config() { return store.config; }
}
