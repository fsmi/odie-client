import $ from "jquery";
import ko from "knockout";

import documentselection from "./vm/documentselection";
import user from "./vm/user";
import config from "./config";

export default class App {
  constructor() {
    this.visible = 'documentselection';

    ko.track(this);
  }

  show(name) {
    this.visible = name;
  }

  openLecture(lecture) {
    this.documentlist.load(lecture.name);
    this.visible = 'documentselection';
  }

  // causes actual login and moves away to selection view
  login() {
    user.login(() => this.show('documentselection'));
  }

  // causes actual logout and moves away to selection view
  logout() {
    user.logout(() => this.show('documentselection'));
  }

  get user() { return user; }
  get cartSize() { return documentselection.cart.documents.length; }
}
