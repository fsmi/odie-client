import ko from "knockout";

import config from "../config";
import Document from "./document";

export default class DocumentList {
  constructor() {
    this.selectedName = '';
    this._searchBy = 'lecture';
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = '';
    this.documents = [];
    ko.track(this);
    ko.getObservable(this, 'selectedName').subscribe(newName => this.load(newName));
    ko.defineProperty(this, 'encodedLecture', {
      get: encodeURIComponent,
      set: decodeURIComponent
    });
  }

  load(name) {
    this.selectedName = name;

    if (name)
      config.getJSON('/data/' + this._searchBy + 's/' + encodeURIComponent(name) + '/documents')
        .done(data => this.documents = data.map(d => new Document(d)));
    else
      this.documents = [];
  }

  set searchBy(value) {
    if (value == 'lecture' || value == 'examinant') {
      this._searchBy = value;
      this.load(this.selectedName);
    }
  }

  filtered() {
    let examinantsRegex = new RegExp(this.examinantsFilter, 'i');
    let lectureRegex = new RegExp(this.lectureFilter, 'i');
    return this.documents.filter(d =>
      (this.typeFilter === '' || this.typeFilter === d.examType) &&
      (this.examinantsFilter === '' || examinantsRegex.test(d.examinants.join(' '))) &&
      (this.lectureFilter === '' || lectureRegex.test(d.lectures.join(' ')))
    );
  }

  toggleTypeFilter(type) {
    if (!this.typeFilter || type !== this.typeFilter)
      this.typeFilter = type;
    else
      this.typeFilter = '';
  }

  countType(type) {
    return this.filtered().filter(doc => doc.examType === type).length;
  }
}
