var User = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.username = '';
  this.password = '';
  this.errorThrown = '';
  this.onAuthUpdate = function() {
    // as long as the frontend and backend are served from different domains,
    // this doesn't work, as we can't access the backend's cookie.
    // An alternative would be to introduce a REST endpoint to check for
    // authentication status.
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
    data: JSON.stringify({user: this.username, password: this.password}),
    error: function(_, _, errorThrown) {
      self.errorThrown = errorThrown;
      self.onAuthUpdate();
    },
    success: function() {
      self.password = '';
      self.onAuthUpdate();
      success();
    }
  });
  this.password = '';
  this.errorThrown = '';
}

