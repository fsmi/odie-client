import pager from "pagerjs";

import api from "../api";
import documentselection from "./documentselection";
import Cart from "./cart";
import Collection, { SubstringFilter } from "../collection";

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
    pager.navigate('#documentselection');
  }

  deleteCart(cart) {
    api.ajax({
      url: 'carts/' + cart.id,
      type: 'DELETE',
    }).done(() => {
      let i = this.carts.indexOf(cart);
      if (i > -1) {
        // remove from cart listing
        this.carts.splice(i, 1);
      }
    });
  }
}
