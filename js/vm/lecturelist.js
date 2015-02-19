class LectureList extends Array {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.searchString = '';
    ko.track(this);

    this.load();
  }

  load() {
    $.getJSON(this.baseUrl + '/data/lectures', data =>
        data.forEach(d => this.push(d))
    );
  }

  getSearchRegex(searchString) {
    if (/^([A-Z][a-z]*){2,}$/.test(searchString)) {
      // PascalCase search for search strings with more than one capital char
      return new RegExp(searchString.split(/(?=[A-Z])/).join('[^A-Z]*'));
    } else {
      // standard case-insensitive search
      return new RegExp(searchString, 'i');
    }
  };

  filtered() {
    if (this.searchString === '') {
      return this;
    }
    let regex = this.getSearchRegex(this.searchString);

    return this.filter(l => regex.test(l.name));
  }

  typeaheadFilter(query, callback) {
    let regex = this.getSearchRegex(query);

    callback(this.filter(l => regex.test(l.name)));
  }

  clearSearch() {
    this.searchString = '';
  }
}
