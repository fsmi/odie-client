class LectureList {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.searchString = '';
    this.lectures = [];
    ko.track(this);

    this.load();
  }

  load() {
    $.getJSON(this.baseUrl + '/data/lectures', data => this.lectures = data);
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

    return this.lectures.filter(l => regex.test(l.name));
  }

  get typeaheadDataset() {
    return {
      source: (query, callback) => {
        let regex = this.getSearchRegex(query);
        callback(this.lectures.filter(l => regex.test(l.name)));
      },
      displayKey: "name",
      templates: {
        suggestion: l => `<a href="#">${l.name}</a>`
      }
    };
  }

  clearSearch() {
    this.searchString = '';
  }
}
