import $ from "jquery";
import ko from "knockout";
import pager from "pagerjs";

import api from "./api";
import documentselection from "./vm/documentselection";
import store from "./store";
import user from "./vm/user";

export default class App {
  constructor() {
    ko.defineProperty(this, 'activeRoute', () => {
        let activePage = pager.activePage$();
        return activePage ? activePage.getFullRoute()().join('/') : null;
    });
    $('body').bind('animationend', () => {
      $('body').removeClass('batman');
    });
  }

  ensureAuthenticated(page, route, callback) {
    if (user.isAuthenticated)
      callback();
    else if (user.isAuthenticated === undefined) {
      // initial authentication request still running
      let sub = ko.getObservable(user, 'isAuthenticated').subscribe(() => {
        sub.dispose();
        this.ensureAuthenticated(page, route, callback);
      });
    } else
      pager.navigate(pager.page.path({path: 'login', params: {successRoute: route.join('/')}}));
  }

  // causes actual logout and moves away to selection view
  logout() {
    user.logout(() => pager.navigate('#'));
  }

  get api() { return api; }
  get store() { return store; }
  get user() { return user; }
  get cartSize() { return documentselection.cart.documents.length; }
}
