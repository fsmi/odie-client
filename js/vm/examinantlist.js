var ExaminantList = function(baseUrl) {
  this.baseUrl = baseUrl;
  this.searchString = '';
  ko.track(this);

  this.load();
};

ExaminantList.prototype = Object.create(Array.prototype);

ExaminantList.prototype.load = function() {
  var self = this;
  $.getJSON(this.baseUrl + '/data/examinants', function(data) {
    for (var i=0; i<data.length; i++) {
      self.push(data[i]);
    }
  })
};

ExaminantList.prototype.getSearchRegex = function(searchString) {
  if (/^([A-Z][a-z]*){2,}$/.test(searchString)) {
    // PascalCase search for search strings with more than one capital char
    return new RegExp(searchString.split(/(?=[A-Z])/).join('[^A-Z]*'));
  } else {
    // standard case-insensitive search
    return new RegExp(searchString, 'i');
  }
};

ExaminantList.prototype.filtered = function() {
  if (this.searchString === '') {
    return this;
  }
  var filtered = [];
  var regex = this.getSearchRegex(this.searchString);

  for (var i=0; i<this.length; i++) {
    var examinant = this[i];
    if (regex.test(examinant.examinant)) {
      filtered.push(examinant);
    }
  }
  return filtered;
}

ExaminantList.prototype.typeaheadFilter = function(query, callback) {
  var filtered = [];
  var regex = this.getSearchRegex(query);

  for (var i=0; i<this.length; i++) {
    var examinant = this[i];
    if (regex.test(examinant.examinant)) {
      filtered.push(examinant);
    }
  }
  callback(filtered);
}

ExaminantList.prototype.clearSearch = function() {
  this.searchString = '';
}
