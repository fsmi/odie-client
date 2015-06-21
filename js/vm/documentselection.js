import ko from "knockout";
import pager from "pagerjs";

import api from "../api";
import Cart from "./cart";
import Document from "./document";
import DocumentList from "./documentlist";
import store from "../store";

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    this.searchBy = 'lectures';
    this.selected = null;
    this.selectedDocuments = [];

    ko.track(this);

    this.typeaheadLists = {};

    ko.getObservable(this, 'searchBy').subscribe(() => {
      this.selected = null;
      pager.navigate('');
    });
    ko.defineProperty(this, 'selectedId', {
      get() { return this.selected !== null ? this.selected.id : null; },
      set(id) { this.selected = id && store[`${this.searchBy}ById`].get(parseInt(id)); }
    });
    ko.getObservable(this, 'selected').subscribe(selected => {
      if (selected !== null) {
        api.getJSON(`${this.searchBy}/${selected.id}/documents`)
          .done(resp => this.selectedDocuments = resp.data.map(d => new Document(d, this.lectures, this.examinants)));
        pager.navigate(`documentselection/${this.searchBy}/${selected.id}`);
      } else {
        this.selectedDocuments = [];
        pager.navigate('');
      }
    });
  }

  get documentlist() { return new DocumentList(this.selectedDocuments, this.cart); }

  get typeaheadDataset() {
    return {
      source: (query, callback) => {
        let regex = this.getSearchRegex(query);
        callback(store[this.searchBy].filter(l => regex.test(l.name)));
      },
      displayKey: "name",
      templates: {
        suggestion: l => `<a href="#" onclick="return false;">${l.name}</a>`
      }
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
}

export default new DocumentSelection();
