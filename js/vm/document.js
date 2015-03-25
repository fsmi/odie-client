import ko from "knockout";

import formatter from "../ko/formatter";

export default class Document {
  constructor(data) {
    Object.assign(this, data);
    this.date = new Date(this.date);
    this.path = (this.examType == 'oral' ? 'protokolle' : 'klausuren') + '/scanned/' + Math.floor(this.id/2) + '.pdf';

    ko.track(this);
  }

  displayExamType() {
    return this.examType === "written" ? "Schriftlich" : "Mündlich";
  }

  get extendedAttributes() {
    return this.displayExamType() + ', ' + formatter.formatDate(this.date) + ', ' + this.comment;
  }
}
