import ko from "knockout";
import sortBy from "lodash/sortBy";

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
    this.semester = this.calculateSemester();
    this.validation_time = data.validation_time ? new Date(data.validation_time) : null;

    // retain some consistency
    this.numberOfPages = this.number_of_pages;
    this.documentType = this.document_type;
    this.validationTime = this.validation_time;

    ko.track(this, ['validated']);
  }

  get extendedAttributes() {
    return formatter.formatDate(this.date) + ', ' + this.comment;
  }

  get examinantsText() {
    return this.examinants.map(e => e.name).join(', ');
  }

  get semesterText() {
    return this.semester;
  }

  calculateSemester() {
    const year = this.date.getFullYear();

    // exams are allowed to take place up to 6 weeks after the end of the semester
    const beginSummer = new Date(year, 4, 16);  // 16th may
    const beginWinter = new Date(year, 10, 16); // 16th november

    if (this.date.getTime() < beginSummer.getTime())
      return 'WS ' + Document.shortYear(year - 1) + '/' + Document.shortYear(year);
    else if (this.date.getTime() > beginSummer.getTime() && this.date.getTime() < beginWinter.getTime())
      return 'SS ' + Document.shortYear(year);
    else
      return 'WS ' + Document.shortYear(year) + '/' + Document.shortYear(year + 1);
  }

  static shortYear(year) {
    return year.toString().substr(-2);
  }

  get previewURL() { return `${api.baseUrl}view/${this.id}`; }
  get PDFjsURL() { return `pdfjs/web/viewer.html?file=${encodeURIComponent(this.previewURL)}`; }
  get editURL() { return `${api.baseUrl}../admin/document/edit/?id=${this.id}`; }
  get store() { return store; }
}
