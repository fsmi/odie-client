class User {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
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
    $.getJSON(this.baseUrl + '/data/user', data => {
      this.username = data.user;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.isAuthenticated = true;
    })
    .fail(() => {
      // We're obviously not logged in
      $.removeCookie('sessionid');
      this.isAuthenticated = false;
    });
  }

  login(success) {
    // Hack to force KO to fetch input values. This should fix firefox' filled-in
    // credentials not actually being sent.
    $('#login-form').find('input').change();

    $.ajax({
      url: this.baseUrl + '/data/login',
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({user: this.username, password: this.password, rememberMe: this.rememberMe}),
      error: (xhr, _, errorThrown) => {
        this.errorThrown = xhr.status + ': ' + xhr.responseText;
        this.onAuthUpdate();
      },
      success: () => {
        this.password = '';
        this.errorThrown = '';
        if (!$.cookie('sessionid')) {
          $.cookie('sessionid', true);
        }
        this.onAuthUpdate();
        success();
      }
    });
    this.password = '';
    this.errorThrown = '';
  }

  logout(success) {
    $.ajax({
      url: this.baseUrl + '/data/logout',
      type: 'POST',
      success: () => {
        this.onAuthUpdate();
        success();
      },
      error: () => console.log("Couldn't log out."),
    });
  }
}
