/*global window*/

import $ from "jquery";

let api = {
  _baseAjaxSettings: {},

  ajax(settings) {
    let s = Object.assign({headers: {'X-CSRFToken': this.token}}, this._baseAjaxSettings, settings);
    s.url = this.baseUrl + s.url;
    return $.ajax(s);
  },

  getJSON(url, settings) {
    return this.ajax(Object.assign(settings || {}, {url}));
  },

  query(url, query) {
    return this.getJSON(url, {data: {q: JSON.stringify(query)}});
  },

  post(url, data, settings) {
    return this.ajax(Object.assign(settings || {}, {
      url,
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
    }));
  },
};

if (window.location.hostname === 'www.fsmi.uni-karlsruhe.de') {
  api.serverOrigin = window.location.origin;
  api.baseUrl = api.serverOrigin + '/odie-next/api/';
} else {
  Object.assign(api._baseAjaxSettings, {
    crossDomain: true,
    xhrFields: {
      withCredentials: true,
    },
  });
  let live = false;
  if (live) {
    api.serverOrigin = 'https://www-test-stable.fsmi.uni-karlsruhe.de';
    api.baseUrl = api.serverOrigin + '/odie-next/api/';
  } else {
    api.serverOrigin = 'http://localhost:5000';
    api.baseUrl = api.serverOrigin + '/api/';
  }
}

export default api;
