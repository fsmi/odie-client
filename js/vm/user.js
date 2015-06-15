import ko from "knockout";
import $ from "jquery";

import config from "../config";

class User {
  constructor() {
    this.username = '';
    this.first_name = '';
    this.last_name = '';
    this.isAuthenticated = undefined;

    ko.track(this);

    // try to login with cookie instead of credentials
    config.getJSON('/api/login', {
      error() { this.isAuthenticated = false; }
    }).done(resp => {
      Object.assign(this, resp.data);
      this.isAuthenticated = true;
    });
  }

  login(password, rememberMe, error, success) {
    config.post('/api/login', {username: this.username, password: password, remember_me: rememberMe}, {
      error(xhr) { error(xhr.status + ': ' + xhr.responseText); }
    }).done(resp => {
      Object.assign(this, resp.data);
      this.isAuthenticated = true;
      success();
    });
  }

  logout(success) {
    config.post('/api/logout', {})
      .done(() => {
        this.isAuthenticated = false;
        success();
      });
  }
}

export default new User();
