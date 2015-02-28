/* Models a single print job and supplies the data bindings for
 * the print.html template. */

class Printer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class PrintJob {
  constructor(cart, coverText, depositCount) {
    this.cart = cart;
    this._depositCount = depositCount;
    this._coverText = coverText;
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
  }

  printPrice() {
    return (this.cart.priceEstimate(0) / 100).toFixed(2);
  }

  totalPrice() {
    return (this.cart.priceEstimate(this.depositCount) / 100).toFixed(2);
  }

  submit() {
    this.status = 'waiting';
    let ids = this.cart.documents.map(doc => doc.id);
    let job = {
      coverText: this._coverText,
      documents: ids,
      depositCount: parseFloat(this.depositCount),
      printer: this.selectedPrinter.id
    };
    config.post('/data/print', job)
      .done(() => this.status = 'success')
      .fail((_, __, error) => {
        this.status = 'error';
      });
  }
}
