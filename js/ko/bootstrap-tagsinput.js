import $ from "jquery";
import ko from "knockout";
import every from "lodash/every";
import zip from "lodash/zip";
import "../bootstrap-tagsinput";

ko.bindingHandlers.tagsinput = {
  init(element, valueAccessor) {
    function pull() {
      for (let item of o.items())
        e.tagsinput('add', item);
    }
    function sameItems(xs, ys) {
      return xs.length === ys.length && every(zip(xs, ys).map(([x, y]) => x.obj === y.obj));
    }

    let e = $(element);
    let o = ko.unwrap(valueAccessor());
    o.items.subscribe(() => {
      if (!sameItems(e.tagsinput('items'), o.items())) {
        e.tagsinput('removeAll');
        pull();
      }
    });

    e.tagsinput(o);
    pull();
    e.on('itemAdded itemRemoved', () => o.items(e.tagsinput('items')));
    // Clear typeahead after creating a tag to avoid issues when deselecting the input
    let typeaheadInput = e.siblings('div').find('.tt-input');
    e.on('itemAdded', () => { typeaheadInput.typeahead('val', ''); });
  },
};
