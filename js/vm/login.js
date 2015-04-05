import ko from "knockout";
import pager from "pagerjs";
import $ from "jquery";

import user from "./user";

export default class Login {
  constructor(params) {
    this.password = '';
    this.rememberMe = true;
    this.errorThrown = '';
    this.successRoute = params.successRoute;

    ko.track(this);
  }

  login() {
    // Hack to force KO to fetch input values. This should fix firefox' filled-in
    // credentials not actually being sent.
    $('#login-form').find('input').change();

    user.login(this.password, this.rememberMe,
        msg => this.errorThrown = msg,
        () => pager.navigate(this.successRoute)
    );
  }

  get user() { return user; }
}
