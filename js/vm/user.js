import ko from "knockout";
import $ from "jquery";

import config from "../config";

class User {
  constructor() {
    this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.isAuthenticated = false;

    this.onAuthUpdate();

    ko.track(this);
  }

  onAuthUpdate() {
    config.getJSON('/data/user', {
      error: () => {
        // We're obviously not logged in
        $.removeCookie('sessionid');
        this.isAuthenticated = false;
      }
    }).done(data => {
      this.username = data.user;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.isAuthenticated = true;
    });
  }

  login(password, rememberMe, error, success) {
    config.post('/data/login', {user: this.username, password: password, rememberMe: rememberMe}, {
      error: (xhr, _, errorThrown) => error(xhr.status + ': ' + xhr.responseText)
    }).done(() => {
      if (!$.cookie('sessionid')) {
        $.cookie('sessionid', true);
      }
      this.onAuthUpdate();
      success();
    });
  }

  logout(success) {
    config.post('/data/logout', {})
      .done(() => {
        this.onAuthUpdate();
        success();
      });
  }
}

export default new User();
