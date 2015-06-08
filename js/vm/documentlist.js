import ko from "knockout";

import config from "../config";
import user from "./user";
import RangeSelect from "./rangeselect";

export default class DocumentList {
  constructor(documents, cart) {
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = '';
    this.documents = documents;
    this.cart = cart;
    this.rangeSelect = new RangeSelect();

    ko.track(this);

    ko.defineProperty(this, 'filtered', () => {
      let examinantsRegex = new RegExp(this.examinantsFilter, 'i');
      let lectureRegex = new RegExp(this.lectureFilter, 'i');
      return this.documents.filter(d =>
        (this.typeFilter === '' || this.typeFilter === d.documentType) &&
        (this.examinantsFilter === '' || examinantsRegex.test(d.examinants.map(e => e.name).join(' '))) &&
        (this.lectureFilter === '' || lectureRegex.test(d.lectures.map(l => l.name).join(' ')))
      );
    });
  }

  toggleTypeFilter(type) {
    if (!this.typeFilter || type !== this.typeFilter)
      this.typeFilter = type;
    else
      this.typeFilter = '';
  }

  countType(type) {
    return this.filtered.filter(doc => doc.documentType === type).length;
  }

  commitRange() {
    this.rangeSelect.commit().forEach(i => this.cart.add(this.filtered[i]));
  }

  get user() { return user; }
}
