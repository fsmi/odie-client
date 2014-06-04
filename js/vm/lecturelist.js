var LectureList = function(baseUrl) {
  this.baseUrl = baseUrl
  this.searchString = ''
  ko.track(this)

  this.load()
};

LectureList.prototype = Object.create(Array.prototype);

LectureList.prototype.load = function() {
  var self = this;
  $.getJSON(this.baseUrl + '/data/lectures', function(data) {
    for (var i=0; i<data.length; i++) {
      self.push(data[i])
    }
  })
};

LectureList.prototype.filtered = function() {
  if (this.searchString === '') {
    return this
  }
  var filtered = []
  var regex = new RegExp('.*' + this.searchString + '.*', 'i')
  for (var i=0; i<this.length; i++) {
    var lecture = this[i]
    if (regex.test(lecture.name)) {
      filtered.push(lecture)
    }
  }
  return filtered
}

LectureList.prototype.clearSearch = function() {
  this.searchString = ''
}
