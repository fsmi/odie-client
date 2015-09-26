import $ from "jquery";
import ko from "knockout";

import "bootstrap-datepicker/js/bootstrap-datepicker";
import "bootstrap-datepicker/js/locales/bootstrap-datepicker.de";

ko.bindingHandlers.datepicker = {
  init(element, valueAccessor) {
    let e = $(element);
    let o = ko.unwrap(valueAccessor());
    e.datepicker(o);
  },
};
