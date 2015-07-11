import ko from "knockout";
import sortBy from "lodash/collection/sortBy";

import api from "../api";
import formatter from "../ko/formatter";
import store from "../store";

export default class Document {
  constructor(data) {
    Object.assign(this, data);

    // replace stub (id-only) objects
    this.lectures = sortBy(data.lectures.map(l => store.lecturesById.get(l.id)), 'name');
    this.examinants = sortBy(data.examinants.map(e => store.examinantsById.get(e.id)), 'name');

    this.date = new Date(data.date);

    // retain some consistency
    this.numberOfPages = this.number_of_pages;
    this.documentType = this.document_type;

    ko.track(this, ['validated']);
  }

  get extendedAttributes() {
    return formatter.formatDate(this.date) + ', ' + this.comment;
  }

  get examinantsText() {
    return this.examinants.map(e => e.name).join(', ');
  }

  get previewURL() { return `${api.baseUrl}view/${this.id}`; }
}
