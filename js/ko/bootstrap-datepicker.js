import $ from "jquery";
import ko from "knockout";

import "bootstrap-datepicker/js/bootstrap-datepicker";

ko.bindingHandlers.datepicker = {
  init(element, valueAccessor) {
    let e = $(element);
    let o = ko.unwrap(valueAccessor());
    e.datepicker(o);
  },
};
