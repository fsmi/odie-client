import ko from "knockout";
import flatten from "lodash/array/flatten";
import pager from "pagerjs";

import BarcodeScanner from "./barcode";
import Cart from "./cart";
import makeSource from "../typeaheadsource";
import PrintJob from "./printjob";
import store from "../store";
import user from "./user";

function wrap(obj, type, name) {
  // typeahead needs a top-level name key
  return {type, obj, name: name || obj.name};
}

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    store.ensureLoaded(() => this.cart.loadFromSessionStorage());
    this.printjob = new PrintJob(this.cart);
    this.barcode = new BarcodeScanner(this.cart);
    this.selected = [];

    ko.track(this);

    ko.getObservable(this, 'selected').subscribe(function(changes) {
      $('[data-toggle="popover"]').popover();
    });

    ko.defineProperty(this, 'serializedSelected', {
      get: () => this.selected.map(x => x.type[0] + x.obj.id).join('&'),
      set: (val) => {
        this.selected = (val ? val.split('&') : []).map(x => {
          let type = x[0] === 'l' ? 'lecture' : 'examinant';
          return wrap(store[`${type}sById`].get(parseInt(x.substring(1))), type);
        });
      },
    });

    ko.getObservable(this, 'serializedSelected').subscribe(() => {
      pager.navigate(`documentselection/${this.serializedSelected}`);
    });
  }

  get requestParams() {
    return this.selected.length && {
      filters: JSON.stringify({
        includes_lectures: this.selected.filter(x => x.type === "lecture").map(x => x.obj.id),
        includes_examinants: this.selected.filter(x => x.type === "examinant").map(x => x.obj.id),
      }),
    };
  }

  get typeaheadDatasets() {
    let make = (name, items) => {
      return {
        source: makeSource(items.filter(x => x.obj.validated || user.isAuthenticated), 'name'),
        displayKey: "name",
        limit: 20,
        templates: {
          header:
            `<h4 class="tt-header">${name}</h4><div class="divider"></div>`,
          suggestion: x => `<a href="#" onclick="return false;">${x.name}${x.name === x.obj.name ? "" : ` <span class="full-name">${x.obj.name}</span>`}</a>`,
        },
      };
    };

    return [
      make("Vorlesungen", flatten(store.lectures.map(l =>
              [l.name].concat(l.aliases).map(n => wrap(l, 'lecture', n))
      ))),
      make("Prüfer", store.examinants.map(e => wrap(e, 'examinant'))),
    ];
  }

  get selectedLectures() { return this.selected.filter(x => x.type === 'lecture').map(x => x.obj); }

  clearCart() {
    this.cart.reset();
    this.printjob.clearDeposit();
  }

  get config() { return store.config; }
  get user() { return user; }
}

export default new DocumentSelection();
