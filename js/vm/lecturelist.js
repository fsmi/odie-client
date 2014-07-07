var LectureList = function(baseUrl) {
  this.baseUrl = baseUrl;
  this.searchString = '';
  ko.track(this);

  this.load();
};

LectureList.prototype = Object.create(Array.prototype);

LectureList.prototype.load = function() {
  var self = this;
  $.getJSON(this.baseUrl + '/data/lectures', function(data) {
    for (var i=0; i<data.length; i++) {
      self.push(data[i]);
    }
  })
};

LectureList.prototype.getSearchRegex = function(searchString) {
  if (/^([A-Z][a-z]*){2,}$/.test(searchString)) {
    // PascalCase search for search strings with more than one capital char
    return new RegExp(searchString.split(/(?=[A-Z])/).join('[^A-Z]*'));
  } else {
    // standard case-insensitive search
    return new RegExp(searchString, 'i');
  }
};

LectureList.prototype.filtered = function() {
  if (this.searchString === '') {
    return this;
  }
  var filtered = [];
  var regex = this.getSearchRegex(this.searchString);

  for (var i=0; i<this.length; i++) {
    var lecture = this[i];
    if (regex.test(lecture.name)) {
      filtered.push(lecture);
    }
  }
  return filtered;
}

LectureList.prototype.typeaheadFilter = function(query, callback) {
  var filtered = [];
  var regex = this.getSearchRegex(query);

  for (var i=0; i<this.length; i++) {
    var lecture = this[i];
    if (regex.test(lecture.name)) {
      filtered.push(lecture);
    }
  }
  callback(filtered);
}

LectureList.prototype.clearSearch = function() {
  this.searchString = '';
}
