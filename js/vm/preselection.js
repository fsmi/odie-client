/*global window*/

import partition from "lodash/partition";
import pager from "pagerjs";

import documentselection from "./documentselection";
import Cart from "./cart";
import Collection, {SubstringFilter} from "../collection";

export default class Preselection {
  constructor() {
    this.filter = new SubstringFilter({column: 'name'});
    this.coll = new Collection({
      endpoint: 'orders',
      filters: [this.filter],
      sortBy: {column: 'creation_time', asc: false},
      deserialize: data => new Cart(data),
    });
  }

  openCart(cart) {
    documentselection.cart.reset();
    documentselection.cart.name = cart.name;

    // filter out 'null' values
    let [documents, deleted] = partition(cart.documents);
    if (deleted.length) {
      window.alert(`${deleted.length} ausgewählte Dokumente sind in der Zwischenzeit gelöscht worden!`);
    }
    documentselection.cart.documents = documents;

    documentselection.cart.flushToSessionStorage();
    pager.navigate('#documentselection');
  }
}
