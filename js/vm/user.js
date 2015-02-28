class User {
  constructor() {
    this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.password = '';
    this.rememberMe = true;
    this.errorThrown = '';
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

  login(success) {
    // Hack to force KO to fetch input values. This should fix firefox' filled-in
    // credentials not actually being sent.
    $('#login-form').find('input').change();

    config.post('/data/login', {user: this.username, password: this.password, rememberMe: this.rememberMe}, {
      error: (xhr, _, errorThrown) => {
        this.errorThrown = xhr.status + ': ' + xhr.responseText;
        this.onAuthUpdate();
      }
    }).done(() => {
      this.password = '';
      this.errorThrown = '';
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
