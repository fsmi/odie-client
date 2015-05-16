import ko from "knockout";

import config from "../config";

export default class DocumentList {
  constructor() {
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = '';
    this.documents = [];
    ko.track(this);
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
