class DocumentList {
  constructor() {
    this.lecture = '';
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = '';
    this.documents = [];
    ko.track(this);
    ko.getObservable(this, 'lecture').subscribe(newName => this.load(newName));
  }

  load(name) {
    this.lecture = name;
    config.getJSON('/data/lectures/' + encodeURIComponent(name) + '/documents')
      .done(data => this.documents = data.map(d => new Document(d)));
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
}
