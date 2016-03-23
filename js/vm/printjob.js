import ko from "knockout";
import $ from "jquery";

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
    this.printedPercent = null;
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

  submit(onSuccess) {
    this.status = 'waiting';
    this.printedPercent = 0;
    let job = {
      cover_text: this.cart.name,
      cash_box: user.officeConfig.cash_boxes[0],
      document_ids: this.cart.documents.map(doc => doc.id),
      deposit_count: parseInt(this.depositCount),
      price: this.totalPrice,
      printer: this.selectedPrinter,
    };

    // We use event streams to prevent connection timeouts on long-running
    // print requests and to show some progress indication.
    // Unfortunately, EventSource doesn't allow us to put the request data
    // in the body, so we use a cookie instead (~4k bytes limit).
    // Web Sockets may be a more appropriate solution, but are non-trivial
    // to set up on the production server and especially local debug servers.
    $.cookie('print_data', JSON.stringify(job), {path: '/'});
    let stream = new EventSource(api.baseUrl + 'print', api._baseAjaxSettings.xhrFields);
    stream.onerror = () => {
      this.status = 'error';
      api.errors.push('Verbindung zum Server verloren');
      stream.close();
      $.cookie('print_data', '', {path: '/'});
    };
    let printed = 0;
    stream.addEventListener('progress', (msg) => {
      printed++;
      // #events = #docs + 1 (accounting)
      this.printedPercent = (printed*100.0/(job.document_ids.length+1)).toFixed(0);
    });
    stream.addEventListener('stream-error', (msg) => {
      this.status = 'error';
      api.errors.push(msg.data);
      stream.close();
      $.cookie('print_data', '', {path: '/'});
    });
    stream.addEventListener('complete', () => {
      this.status = 'success';
      log.addItem(this.cart.name, this.totalPrice);
      stream.close();
      $.cookie('print_data', '', {path: '/'});
      if (onSuccess) {
        onSuccess();
      }
    });
  }

  get buttonGradient() {
    // primary and disabled button colors stolen from Bootstrap
    return `linear-gradient(to right, #337ab7 ${this.printedPercent}%, #79a7ce ${this.printedPercent}%)`;
  }

  get config() { return store.config; }
}
