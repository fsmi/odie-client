/*global document*/

import $ from "jquery";
import ko from "knockout";
import "bootstrap/js/modal";

ko.modal = (template, viewModel) => {
  ko.applyBindingsToNode(document.getElementById('modal'), {
    component: {
      name: template,
      params: viewModel,
    },
  });
  $('#modal').modal('show');
};
