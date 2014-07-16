var DocumentList = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.lecture = '';
  this.lectureFilter = '';
  this.examinantsFilter = '';
  this.typeFilter = '';
  ko.track(this);
  ko.getObservable(this, 'lecture').subscribe(function(newName) {
    self.load(newName);
  })
}

DocumentList.prototype = Object.create(Array.prototype);

DocumentList.prototype.load = function(name) {
  var self = this;
  this.lecture = name;
  var urlName = encodeURIComponent(name);
  $.getJSON(this.baseUrl + '/data/lectures/' + urlName + '/documents', function(data) {
    self.splice(0, self.length);
    for (var i=0; i<data.length; i++) {
      self.push(new Document(data[i]));
    }
  })
}

DocumentList.prototype.filtered = function() {
  var docs = [];
  var examinantsRegex = new RegExp(this.examinantsFilter, 'i');
  var lectureRegex = new RegExp(this.lectureFilter, 'i');
  for (var i=0; i<this.length; i++) {
    if (this.typeFilter !== '' && this.typeFilter !== this[i].examType) {
      continue;
    }
    if (this.examinantsFilter !== '' && !examinantsRegex.test(this[i].examinants.join(' '))) {
      continue;
    }
    if (this.lectureFilter !== '' && !lectureRegex.test(this[i].lectures.join(' '))) {
      continue;
    }
    docs.push(this[i]);
  }
  return docs;
}
