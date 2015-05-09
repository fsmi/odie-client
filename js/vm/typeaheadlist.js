import ko from "knockout";

import config from "../config";

export default class TypeaheadList {
  constructor(name) {
    this.searchString = '';
    this.datalist = [];
    ko.track(this);

    this.load(name);
  }

  load(name) {
    config.getJSON('/data/' + name)
      .done(data => this.datalist = data);
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

  get typeaheadDataset() {
    return {
      source: (query, callback) => {
        let regex = this.getSearchRegex(query);
        callback(this.datalist.filter(l => regex.test(l.name)));
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
