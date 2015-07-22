import ko from "knockout";
import pager from "pagerjs";

import BarcodeScanner from "./barcode";
import Cart from "./cart";
import DocumentList from "./documentlist";
import store from "../store";
import user from "./user";
import PrintJob from "./printjob";

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    this.searchBy = 'lectures';
    this.selected = null;
    this.printjob = new PrintJob(this.cart);
    this.barcode = new BarcodeScanner(this.cart);

    ko.track(this);

    ko.getObservable(this, 'searchBy').subscribe(() => {
      this.selected = null;
    });

    ko.defineProperty(this, 'selectedId', {
      get: () => this.selected !== null ? this.selected.id : null,
      set(id) { this.selected = id && store[`${this.searchBy}ById`].get(parseInt(id)); },
    });

    ko.getObservable(this, 'selected').subscribe(selected => {
      pager.navigate(selected ? `documentselection/${this.searchBy}/${selected.id}` : '');
    });
  }

  get selectedEndpoint() { return this.selected && `${this.searchBy}/${this.selected.id}/documents`; }

  get documentlist() { return new DocumentList(this.documents, this.cart); }

  get typeaheadDataset() {
    return {
      source: (query, callback) => {
        let regex = this.getSearchRegex(query);
        callback(store[this.searchBy].filter(e => (e.validated || user.isAuthenticated) && regex.test(e.name)));
      },
      displayKey: "name",
      templates: {
        suggestion: l => `<a href="#" onclick="return false;">${l.name}</a>`,
      },
    };
  }

  getSearchRegex(searchString) {
    if (/^([A-Z][a-z]*){2,}$/.test(searchString)) {
      // PascalCase search for search strings with more than one capital char
      return new RegExp(searchString.split(/(?=[A-Z])/).join('[^A-Z]*'));
    } else {
      // standard case-insensitive search
      return new RegExp(searchString, 'i');
    }
  }

  clearCart() {
    this.cart.reset();
    this.printjob.clearDeposit();
  }

  get config() { return store.config; }
  get user() { return user; }
}

export default new DocumentSelection();
