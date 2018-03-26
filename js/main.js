/*global require window*/

import "babel-polyfill/browser";
import $ from "jquery";
import "jquery.cookie";
import ko from "knockout";
import "knockout-es5/src/knockout-es5";
import pager from "pagerjs";

import "bootstrap/js/dropdown";
import "bootstrap/js/transition";
import "bootstrap/js/collapse";
import "bootstrap/js/alert";
import "bootstrap/js/modal";
import "bootstrap/js/tooltip";
import "bootstrap/js/popover";

import "./ko/formatter";
import "./ko/bootstrap-tagsinput";
import "./ko/bootstrap-datepicker";
import "./ko/typeahead";

import App from "./app";
import store from "./store";

$(window.document).ready(() => {
  let app = new App();
  window.app = app; // for debugging

  // node module, calls will be inlined by browserify
  let fs = require('fs');
  
  // use singleton view-models where access from other view-models is needed
  ko.components.register('documentselection', {
    viewModel: {instance: require('./vm/documentselection')},
    template: fs.readFileSync('views/documentselection.html', 'utf8'),
  });
  ko.components.register('documentlist', {
    viewModel: require('./vm/documentlist'),
    template: fs.readFileSync('views/documentlist.html', 'utf8'),
  });
  ko.components.register('documentselection-cart', {
    template: fs.readFileSync('views/documentselection-cart.html', 'utf8'),
  });
  ko.components.register('print', {
     template: fs.readFileSync('views/print.html', 'utf8'),
  });
  ko.components.register('preselection', {
    viewModel: require('./vm/preselection'),
    template: fs.readFileSync('views/preselection.html', 'utf8'),
  });
  ko.components.register('depositreturn', {
    viewModel: require('./vm/depositreturn'),
    template: fs.readFileSync('views/depositreturn.html', 'utf8'),
  });
  ko.components.register('correction', {
    viewModel: require('./vm/correction'),
    template: fs.readFileSync('views/correction.html', 'utf8'),
  });
  ko.components.register('log', {
    viewModel: {instance: require('./vm/log').default},
    template: fs.readFileSync('views/log.html', 'utf8'),
  });
  ko.components.register('load-more', {
    template: fs.readFileSync('views/load-more.html', 'utf8'),
  });
  ko.components.register('sortable-column', {
    viewModel: require('./vm/sortable-column'),
    template: fs.readFileSync('views/sortable-column.html', 'utf8'),
  });
  ko.components.register('documentsubmission', {
    viewModel: require('./vm/documentsubmission'),
    template: fs.readFileSync('views/documentsubmission.html', 'utf8'),
  });

  store.ensureLoaded(() => {
    pager.extendWithPage(app);
    ko.applyBindings(app);
    pager.start();
  });
});
