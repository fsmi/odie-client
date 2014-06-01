var LectureList = function(baseUrl) {
  this.baseUrl = baseUrl
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
