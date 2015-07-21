import $ from "jquery";
import ko from "knockout";
import "bootstrap-tagsinput/src/bootstrap-tagsinput";

ko.bindingHandlers.tagsinput = {
  init(element, valueAccessor) {
    let e = $(element);
    let o = ko.unwrap(valueAccessor());

    e.tagsinput(o);
    for (let item of o.items())
      e.tagsinput('add', item);

    e.on('itemAdded itemRemoved', () => o.items(e.tagsinput('items')));
  },
};
