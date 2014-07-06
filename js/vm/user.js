var User = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.username = '';
  this.firstName = '';
  this.lastName = '';
  this.password = '';
  this.rememberMe = true;
  this.errorThrown = '';
  this.isAuthenticated = false;
  this.onAuthUpdate = function() {
    $.getJSON(this.baseUrl + '/data/user', function(data) {
      self.username = data.user;
      self.firstName = data.firstName;
      self.lastName = data.lastName;
      self.isAuthenticated = true;
    })
    .fail(function() {
      // We're obviously not logged in
      $.removeCookie('sessionid');
      self.isAuthenticated = false;
    });
  };
  this.onAuthUpdate();

  ko.track(this);

  // when firefox fills in login details, it doesn't trigger the right JS events
  // We can't use whatever firefox entered in there, so we're forced to clear it
  ko.getObservable(this, 'username').valueHasMutated();
  ko.getObservable(this, 'password').valueHasMutated();
}

User.prototype = Object.create(Object.prototype);

User.prototype.login = function(success) {
  var self = this;
  $.ajax({
    url: this.baseUrl + '/data/login',
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({user: this.username, password: this.password, rememberMe: this.rememberMe}),
    error: function(xhr, _, errorThrown) {
      self.errorThrown = xhr.status + ': ' + xhr.responseText;
      self.onAuthUpdate();
    },
    success: function() {
      self.password = '';
      self.errorThrown = '';
      if (!$.cookie('sessionid')) {
        $.cookie('sessionid', true);
      }
      self.onAuthUpdate();
      success();
    }
  });
  this.password = '';
  this.errorThrown = '';
}

User.prototype.logout = function(success) {
  var self = this;
  $.ajax({
    url: this.baseUrl + '/data/logout',
    type: 'POST',
    error: function(xhr, _, _) {
      console.log("Couldn't log out.");
    },
    success: function() {
      self.onAuthUpdate();
      success();
    }
  });
}
