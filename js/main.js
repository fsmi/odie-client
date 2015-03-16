import "./browser-polyfill";
import $ from "jquery";
window.jQuery = $; // for bad non-CommonJS deps. bah.
import "jquery.cookie";
import ko from "knockout";
import "./knockout-es5";

import "./lib";
import "./ko/bootstrap";
import "./ko/typeahead";

import App from "./app";

$(document).ready(() => {
  let app = new App();
  window.app = app; // for debugging

  // use singleton view-models where access from other view-models is needed

  ko.components.register('documentselection', {
    viewModel: { instance: require('./vm/documentselection') },
    template: require('./views/documentselection.html')
  });
  ko.components.register('cart', {
    template: require('./views/cart.html')
  });
  ko.components.register('previewconfig', {
    viewModel: { instance: require('./config') },
    template: require('./views/previewconfig.html')
  });
  ko.components.register('print', {
    viewModel: require('./vm/printjob'),
    template: require('./views/print.html')
  });
  ko.components.register('printmodal', {
    template: require('./views/printmodal.html')
  });
  ko.components.register('preselection', {
    viewModel: require('./vm/preselection'),
    template: require('./views/preselection.html')
  });
  ko.components.register('depositreturn', {
    viewModel: require('./vm/depositreturn'),
    template: require('./views/depositreturn.html')
  });
  ko.components.register('correction', {
    viewModel: require('./vm/correction'),
    template: require('./views/correction.html')
  });
  ko.components.register('login', {
    viewModel: { instance: require('./vm/user') },
    template: require('./views/login.html')
  });

  ko.applyBindings(app);
});
