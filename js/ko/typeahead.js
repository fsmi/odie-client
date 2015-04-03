import ko from "knockout";
import $ from "jquery";
import "../typeahead.jquery.js";

ko.bindingHandlers.typeahead = {
  init(element, valueAccessor) {
    let e = $(element);
    let o = ko.unwrap(valueAccessor());
    e.typeahead(o.options, o.dataset);
  }
}
