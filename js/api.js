/*global window*/

import $ from "jquery";
import ko from "knockout";

class Api {
  constructor() {
    this.errors = [];
    ko.track(this);

    this._baseAjaxSettings = {
      dataType: 'json',
      error: (xhr) => {
        this.errors.push(`${xhr.responseText} [${xhr.status}]`);
      },
    };
  }

  ajax(settings) {
    let s = Object.assign({headers: {'X-CSRFToken': this.token}}, this._baseAjaxSettings, settings);
    s.url = this.baseUrl + s.url;
    return $.ajax(s);
  }

  getJSON(url, settings) {
    return this.ajax(Object.assign(settings || {}, {url}));
  }

  query(url, query) {
    return this.getJSON(url, {data: {q: JSON.stringify(query)}});
  }

  delete(url) {
    return this.ajax(Object.assign({
      url,
      type: 'DELETE',
    }));
  }

  post(url, data, settings) {
    return this.ajax(Object.assign(settings || {}, {
      url,
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
    }));
  }
};

let api = new Api();

if (window.location.hostname === 'www.fsmi.uni-karlsruhe.de') {
  api.serverOrigin = window.location.origin;
  api.baseUrl = api.serverOrigin + '/odie/api/';
} else {
  Object.assign(api._baseAjaxSettings, {
    crossDomain: true,
    xhrFields: {
      withCredentials: true,
    },
  });
  let live = true;
  if (live) {
    api.serverOrigin = 'https://www-test-stable.fsmi.uni-karlsruhe.de';
    api.baseUrl = api.serverOrigin + '/odie/api/';
  } else {
    api.serverOrigin = 'http://localhost:5000';
    api.baseUrl = api.serverOrigin + '/api/';
  }
}

export default api;
