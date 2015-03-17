import ko from "knockout";
import $ from "jquery";
import "../typeahead.jquery.js";

ko.bindingHandlers.typeahead = {
  init(element, valueAccessor) {
    var e = $(element);
    var o = ko.unwrap(valueAccessor());
    e.typeahead(o.options, o.dataset);
  }
}
