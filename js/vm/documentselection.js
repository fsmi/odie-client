import ko from "knockout";
import pager from "pagerjs";

import config from "../config";
import user from "./user";
import Cart from "./cart";
import DocumentList from "./documentlist";
import TypeaheadList from "./typeaheadlist";
import RangeSelect from "./rangeselect";

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    this.documentlist = new DocumentList();
    this.lecturelist = new TypeaheadList('lectures');
    this.examinantlist = new TypeaheadList('examinants');
    this.rangeSelect = new RangeSelect(this.cart);
    this.searchByExaminant = false;

    ko.track(this);

    ko.getObservable(this.documentlist, 'lecture').subscribe(name =>
        pager.navigate('documentselection' + (name ? '/' + encodeURIComponent(name) : ''))
    );
    ko.getObservable(this, 'searchByExaminant').subscribe(value => this.documentlist.setSearchByExaminant(value));
  }

  get config() { return config; }
  get user() { return user; }

  get typeaheadDataset() {
    return {
      source: (query, callback) => (this.searchByExaminant ? this.examinantlist : this.lecturelist).typeaheadDataset.source(query, callback),
      displayKey: "name",
      templates: {
        suggestion: l => `<a href="#">${l.name}</a>`
      }
    };
  }
}

export default new DocumentSelection();
