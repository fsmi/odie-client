import ko from "knockout";
import $ from "jquery";

import api from "../api";

class User {
  constructor() {
    this.username = '';
    this.first_name = '';
    this.last_name = '';
    this.isAuthenticated = undefined;

    ko.track(this);

    // try to login with cookie instead of credentials
    api.getJSON('login', {
      error() { this.isAuthenticated = false; }
    }).done(resp => {
      Object.assign(this, resp.data);
      this.isAuthenticated = true;
    });
  }

  login(password, rememberMe, error, success) {
    api.post('login', {username: this.username, password: password, remember_me: rememberMe}, {
      error(xhr) { error(xhr.status + ': ' + xhr.responseText); }
    }).done(resp => {
      Object.assign(this, resp.data);
      this.isAuthenticated = true;
      success();
    });
  }

  logout(success) {
    api.post('logout', {})
      .done(() => {
        this.isAuthenticated = false;
        success();
      });
  }
}

export default new User();
