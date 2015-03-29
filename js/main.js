import "babel-core/browser-polyfill";
import $ from "jquery";
import "jquery.cookie";
import ko from "knockout";
import "knockout-es5/src/knockout-es5";

import "./lib";
import "./ko/bootstrap";
import "./ko/typeahead";

import App from "./app";

$(document).ready(() => {
  let app = new App();
  window.app = app; // for debugging

  // node module, calls will be inlined by browserify
  let fs = require('fs');

  // use singleton view-models where access from other view-models is needed
  ko.components.register('documentselection', {
    viewModel: { instance: require('./vm/documentselection') },
    template: fs.readFileSync('views/documentselection.html', 'utf8')
  });
  ko.components.register('cart', {
    template: fs.readFileSync('views/cart.html', 'utf8')
  });
  ko.components.register('previewconfig', {
    viewModel: { instance: require('./config') },
    template: fs.readFileSync('views/previewconfig.html', 'utf8')
  });
  ko.components.register('print', {
    viewModel: require('./vm/printjob'),
    template: fs.readFileSync('views/print.html', 'utf8')
  });
  ko.components.register('printmodal', {
    template: fs.readFileSync('views/printmodal.html', 'utf8')
  });
  ko.components.register('preselection', {
    viewModel: require('./vm/preselection'),
    template: fs.readFileSync('views/preselection.html', 'utf8')
  });
  ko.components.register('depositreturn', {
    viewModel: require('./vm/depositreturn'),
    template: fs.readFileSync('views/depositreturn.html', 'utf8')
  });
  ko.components.register('correction', {
    viewModel: require('./vm/correction'),
    template: fs.readFileSync('views/correction.html', 'utf8')
  });
  ko.components.register('login', {
    viewModel: { instance: require('./vm/user') },
    template: fs.readFileSync('views/login.html', 'utf8')
  });

  ko.applyBindings(app);
});
