class DocumentList extends Array {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.lecture = '';
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = '';
    ko.track(this);
    ko.getObservable(this, 'lecture').subscribe(newName => this.load(newName));
  }

  load(name) {
    this.lecture = name;
    let urlName = encodeURIComponent(name);
    $.getJSON(this.baseUrl + '/data/lectures/' + urlName + '/documents', data => {
      this.splice(0, this.length);
      data.forEach(d => this.push(new Document(d)));
    });
  }

  filtered() {
    let examinantsRegex = new RegExp(this.examinantsFilter, 'i');
    let lectureRegex = new RegExp(this.lectureFilter, 'i');
    return this.filter(d =>
      (this.typeFilter === '' || this.typeFilter === d.examType) &&
      (this.examinantsFilter === '' || examinantsRegex.test(d.examinants.join(' '))) &&
      (this.lectureFilter === '' || lectureRegex.test(d.lectures.join(' ')))
    );
  }
}
