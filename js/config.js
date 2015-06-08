import $ from "jquery";

let config = {
  // in cents
  depositPrice: 500,
  pricePerPage: 3,

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
  config.baseUrl = window.location.origin + '/odie-next';
} else {
  Object.assign(config._baseAjaxSettings, {
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  });
  let live = false;
  config.baseUrl = live ? 'https://www-test.fsmi.uni-karlsruhe.de/odie-next' : 'http://localhost:5000';
}

export default config;
