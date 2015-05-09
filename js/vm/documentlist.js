import ko from "knockout";

import config from "../config";
import Document from "./document";

export default class DocumentList {
  constructor() {
    this.lecture = '';
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = 'written';
    this.writtenCount = 0;
    this.oralCount = 0;
    this.documents = [];
    ko.track(this);
    ko.getObservable(this, 'lecture').subscribe(newName => this.load(newName));
    ko.defineProperty(this, 'encodedLecture', {
      get: encodeURIComponent,
      set: decodeURIComponent
    });
  }

  load(name) {
    this.lecture = name;
    if (name)
      config.getJSON('/data/lectures/' + encodeURIComponent(name) + '/documents')
        .done(data => {
          this.documents = data.map(d => new Document(d));
          this.writtenCount = this.countType('written', this.documents);
          this.oralCount = this.countType('oral', this.documents);
          if (this.typeFilter === 'written' && this.writtenCount === 0)
            this.typeFilter = 'oral';
        });
    else
      this.documents = [];
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

  countType(type, list) {
    return (list || this.filtered()).filter(doc => doc.examType === type).length;
  }
}
