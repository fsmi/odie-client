var User = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.username = '';
  this.password = '';
  this.rememberMe = true;
  this.errorThrown = '';
  this.onAuthUpdate = function() {
    // This cookie is set when the login API call returns 200.
    // As we may be running on a different domain, we ensure this cookie is used
    // by setting it ourselves.
    self.isAuthenticated = ($.cookie('sessionid') !== undefined);
  };
  this.onAuthUpdate();

  ko.track(this);
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

