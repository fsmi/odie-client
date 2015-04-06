import ko from "knockout";

import formatter from "../ko/formatter";

export default class Document {
  constructor(data) {
    Object.assign(this, data);
    this.date = new Date(this.date);
    this.path = (this.examType == 'oral' ? 'protokolle' : 'klausuren') + '/scanned/' + Math.floor(this.id/2) + '.pdf';

    ko.track(this);
  }

  get extendedAttributes() {
    return formatter.formatDate(this.date) + ', ' + this.comment;
  }
}
