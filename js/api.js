import $ from "jquery";

let api = {
  _baseAjaxSettings: {
    error: (_, __, error) => {
      alert("Unexpected Ajax error:\n\n" + error);
    }
  },

  ajax(settings) {
    let s = Object.assign({}, this._baseAjaxSettings, settings);
    s.url = this.baseUrl + s.url;
    return $.ajax(s);
  },

  getJSON(url, settings) {
    return this.ajax(Object.assign(settings || {}, { url }));
  },

  query(url, query) {
    return this.getJSON(url, { data: { q: query } });
  },

  post(url, data, settings) {
    return this.ajax(Object.assign(settings || {}, {
      url,
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data)
    }));
  }
};

if (window.location.hostname === 'www.fsmi.uni-karlsruhe.de') {
  api.baseUrl = window.location.origin + '/odie-next/api/';
} else {
  Object.assign(api._baseAjaxSettings, {
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  });
  let live = false;
  api.baseUrl = live ? 'https://www-test.fsmi.uni-karlsruhe.de/odie-next/api/' : 'http://localhost:5000/api/';
}

export default api;
