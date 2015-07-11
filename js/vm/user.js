/*global localStorage*/

import $ from "jquery";
import ko from "knockout";

import api from "../api";
import store from "../store";

class User {
  constructor() {
    this.username = '';
    this.first_name = '';
    this.last_name = '';
    this.isAuthenticated = undefined;
    this.office = localStorage.getItem('office') || 'FSI';

    ko.track(this);

    ko.getObservable(this, 'office').subscribe(() => {
      localStorage.setItem('office', this.office);
    });

    // try to login with cookie instead of credentials
    api.getJSON('login', {
      error() { this.isAuthenticated = false; },
    }).done(resp => {
      Object.assign(this, resp.data);
      this.isAuthenticated = true;
    });
  }

  get officeConfig() {
    return store.config.OFFICES[this.office];
  }

  changeOffice(office) {
    if (office !== this.office) {
      this.office = office;
      $('body').addClass('batman');
    }
  }

  login(password, rememberMe, error, success) {
    api.post('login', {username: this.username, password: password, remember_me: rememberMe}, {
      error(xhr) { error(xhr.status + ': ' + xhr.responseText); },
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
