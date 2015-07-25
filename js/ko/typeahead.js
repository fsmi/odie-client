import ko from "knockout";
import $ from "jquery";
import "typeahead.js/dist/typeahead.jquery";

ko.bindingHandlers.typeahead = {
  init(element, valueAccessor) {
    let e = $(element);
    let o = ko.unwrap(valueAccessor());

    e.typeahead(o.options, o.dataset);

    let onSelect = (e, val) => o.selected(val[o.selectedProperty]);
    e.bind('typeahead:autocompleted', onSelect);
    e.bind('typeahead:selected', onSelect);
  },
};
