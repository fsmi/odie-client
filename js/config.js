import $ from "jquery";

let config = {
  // in cents
  depositPrice: 500,
  pricePerPage: 3,

  previewPrefix: $.cookie('previewPrefix') || '/home/mi/info_Dokumente/',
  configurePreview() {
    $.cookie('previewPrefix', this.previewPrefix, {expires: 10000});
    this.isPreviewConfigured = true;
  },
  get isPreviewConfigured() {
    return $.cookie('previewPrefix') !== undefined;
  },

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
  config.baseUrl = window.location.origin + '/odie';
} else {
  Object.assign(config._baseAjaxSettings, {
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  });
  let live = true;
  config.baseUrl = live ? 'https://www-test.fsmi.uni-karlsruhe.de/odie' : 'http://localhost:8000';
}

export default config;
