import $ from "jquery";
import ko from "knockout";
import pager from "pagerjs";

import documentselection from "./vm/documentselection";
import user from "./vm/user";
import config from "./config";

export default class App {
  constructor() {
    ko.defineProperty(this, 'activePageName', () => {
        let activePage = pager.page.currentChildPage()();
        return activePage ? activePage.getId() : null;
    });
  }

  openLecture(lecture) {
    this.documentlist.load(lecture.name);
    pager.navigate('#documentselection');
  }

  ensureAuthenticated(page, route, callback) {
    if (user.isAuthenticated)
      callback();
    else
      pager.navigate(pager.page.path({ path: 'login', params: { successRoute: route.join('/') } }));
  }

  // causes actual logout and moves away to selection view
  logout() {
    user.logout(() => pager.navigate('#'));
  }

  get user() { return user; }
  get cartSize() { return documentselection.cart.documents.length; }
}
