import ko from "knockout";
import pager from "pagerjs";

import config from "../config";
import user from "./user";
import Cart from "./cart";
import Document from "./document";
import DocumentList from "./documentlist";
import RangeSelect from "./rangeselect";

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    config.getJSON('/data/lectures').done(data => this.lectureTypeaheadList = data);
    config.getJSON('/data/examinants').done(data => this.examinantTypeaheadList = data);
    this.rangeSelect = new RangeSelect(this.cart);
    this.searchBy = 'lecture';
    this.selectedName = '';

    ko.track(this);

    ko.getObservable(this, 'searchBy').subscribe(() => this.selectedName = '');
    ko.getObservable(this, 'selectedName').subscribe(name =>
        pager.navigate(`documentselection/${this.searchBy}/${encodeURIComponent(name)}`)
    );
    ko.defineProperty(this, 'documentlist', () => {
      let list = new DocumentList();
      if (this.selectedName)
        config.getJSON(`/data/${this.searchBy}s/${encodeURIComponent(this.selectedName)}/documents`)
          .done(data => list.documents = data.map(d => new Document(d)));
      return list;
    });
  }

  get config() { return config; }
  get user() { return user; }

  get typeaheadDataset() {
    return {
      source: (query, callback) => {
        let regex = this.getSearchRegex(query);
        let list = this.searchBy == 'lecture' ? this.lectureTypeaheadList : this.examinantTypeaheadList;
        callback(list.filter(l => regex.test(l.name)));
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
