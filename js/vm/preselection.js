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
    documentselection.cart = cart.clone();
    documentselection.cart.flushToSessionStorage();
    pager.navigate('#documentselection');
  }
}
