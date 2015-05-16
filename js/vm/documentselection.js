import ko from "knockout";
import pager from "pagerjs";

import config from "../config";
import user from "./user";
import Cart from "./cart";
import DocumentList from "./documentlist";
import RangeSelect from "./rangeselect";

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    this.documentlist = new DocumentList();
    config.getJSON('/data/lectures').done(data => this.lectureTypeaheadList = data);
    config.getJSON('/data/examinants').done(data => this.examinantTypeaheadList = data);
    this.rangeSelect = new RangeSelect(this.cart);
    this.searchBy = 'lecture';

    ko.track(this);

    ko.getObservable(this.documentlist, 'selectedName').subscribe(name =>
        pager.navigate('documentselection' + (name ? '/' + encodeURIComponent(name) : ''))
    );
    ko.getObservable(this, 'searchBy').subscribe(value => this.documentlist.searchBy = value);
  }

  get config() { return config; }
  get user() { return user; }

  get typeaheadDataset() {
    return {
      source: (query, callback) => {
        let regex = this.getSearchRegex(query);
        callback((this.searchBy == 'lecture' ? this.lectureTypeaheadList : this.examinantTypeaheadList).filter(l => regex.test(l.name)));
      },
      displayKey: "name",
      templates: {
        suggestion: l => `<a href="#">${l.name}</a>`
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
