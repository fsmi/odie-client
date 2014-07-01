var Lecture = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  this.name = ''
  this.lecturesFilter = ''
  this.examinantsFilter = ''
  this.typeFilter = ''
  ko.track(this)
  ko.getObservable(this, 'name').subscribe(function(newName) {
    self.load(newName)
  })
}

Lecture.prototype = Object.create(Array.prototype);

Lecture.prototype.load = function(name) {
  var self = this;
  this.name = name
  var urlName = encodeURIComponent(name);
  $.getJSON(this.baseUrl + '/data/lectures/' + urlName + '/documents', function(data) {
    self.splice(0, self.length)
    for (var i=0; i<data.length; i++) {
      self.push(data[i])
    }
  })
}

Lecture.prototype.filtered = function() {
  var docs = []
  var examinantsRegex = new RegExp(this.examinantsFilter, 'i')
  var lecturesRegex = new RegExp(this.lecturesFilter, 'i')
  for (var i=0; i<this.length; i++) {
    if (this.typeFilter !== '' && this.typeFilter !== this[i].examType) {
      continue
    }
    if (this.examinantsFilter !== '' && !examinantsRegex.test(this[i].examinants.join(' '))) {
      continue
    }
    if (this.lecturesFilter !== '' && !lecturesRegex.test(this[i].lectures.join(' '))) {
      continue
    }
    docs.push(this[i])
  }
  return docs
}
